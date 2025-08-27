-- Simplified Production-Safe Schema Hardening
BEGIN;

------------------------------
-- A. Core ENUMS (guarded creates)
------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'loop_type') THEN
    CREATE TYPE loop_type AS ENUM ('reactive','structural','perceptual','anticipatory');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'scale_type') THEN
    CREATE TYPE scale_type AS ENUM ('micro','meso','macro','supervisory');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'leverage_type') THEN
    CREATE TYPE leverage_type AS ENUM ('N','P','S');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mandate_status') THEN
    CREATE TYPE mandate_status AS ENUM ('allowed','review','blocked');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'claim_status') THEN
    CREATE TYPE claim_status AS ENUM ('draft','active','paused','done','cancelled');
  END IF;
END$$;

------------------------------
-- B. Fix critical ARRAY columns  
------------------------------
DO $$
BEGIN
  -- Fix untyped arrays to concrete types
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='antic_pre_position_orders' AND column_name='suppliers'
      AND data_type='ARRAY' AND udt_name NOT IN ('_text','_uuid','_jsonb')
  ) THEN
    ALTER TABLE public.antic_pre_position_orders
      ALTER COLUMN suppliers TYPE text[] USING suppliers::text[];
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='antic_scenarios' AND column_name='target_loops'
      AND data_type='ARRAY' AND udt_name NOT IN ('_text','_uuid','_jsonb')
  ) THEN
    ALTER TABLE public.antic_scenarios
      ALTER COLUMN target_loops TYPE text[] USING target_loops::text[];
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='antic_watchpoints' AND column_name='loop_codes'
      AND data_type='ARRAY' AND udt_name NOT IN ('_text','_uuid','_jsonb')
  ) THEN
    ALTER TABLE public.antic_watchpoints
      ALTER COLUMN loop_codes TYPE text[] USING loop_codes::text[];
  END IF;

  -- Fix delib arrays
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='delib_options' AND column_name='tags' AND data_type='ARRAY' AND udt_name NOT IN ('_text')) THEN
    ALTER TABLE public.delib_options ALTER COLUMN tags TYPE text[] USING tags::text[];
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='delib_scores' AND column_name='evidence_refs' AND data_type='ARRAY' AND udt_name NOT IN ('_text')) THEN
    ALTER TABLE public.delib_scores ALTER COLUMN evidence_refs TYPE text[] USING evidence_refs::text[];
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='delib_dossiers' AND column_name='selected_option_ids' AND data_type='ARRAY' AND udt_name NOT IN ('_uuid')) THEN
    ALTER TABLE public.delib_dossiers ALTER COLUMN selected_option_ids TYPE uuid[] USING selected_option_ids::uuid[];
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='delib_dossiers' AND column_name='rejected_option_ids' AND data_type='ARRAY' AND udt_name NOT IN ('_uuid')) THEN
    ALTER TABLE public.delib_dossiers ALTER COLUMN rejected_option_ids TYPE uuid[] USING rejected_option_ids::uuid[];
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='delib_frontier' AND column_name='option_ids' AND data_type='ARRAY' AND udt_name NOT IN ('_uuid')) THEN
    ALTER TABLE public.delib_frontier ALTER COLUMN option_ids TYPE uuid[] USING option_ids::uuid[];
  END IF;
END$$;

------------------------------
-- C. Critical constraints & bounds
------------------------------
DO $$
BEGIN
  -- Normalize compass anchors to singular
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'compass_anchor_map_anchor_check'
  ) THEN
    ALTER TABLE public.compass_anchor_map
      DROP CONSTRAINT compass_anchor_map_anchor_check;
  END IF;
  ALTER TABLE public.compass_anchor_map
    ADD CONSTRAINT compass_anchor_map_anchor_check
    CHECK (anchor IN ('population','domain','institution'));

  -- TRI value bounds (critical for data quality)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='tri_events_bounds') THEN
    ALTER TABLE public.tri_events
      ADD CONSTRAINT tri_events_bounds CHECK (
        t_value BETWEEN 0 AND 1 AND r_value BETWEEN 0 AND 1 AND i_value BETWEEN 0 AND 1
      );
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='tri_events_5c') AND
     NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='tri_events_5c_bounds') THEN
    ALTER TABLE public.tri_events_5c
      ADD CONSTRAINT tri_events_5c_bounds CHECK (
        t_value BETWEEN 0 AND 1 AND r_value BETWEEN 0 AND 1 AND i_value BETWEEN 0 AND 1
      );
  END IF;

  -- Unique DE band per loop+indicator
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname='de_bands_loop_indicator_uniq'
  ) THEN
    ALTER TABLE public.de_bands
      ADD CONSTRAINT de_bands_loop_indicator_uniq UNIQUE (loop_id, indicator);
  END IF;

  -- SRT window validation
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname='srt_windows_bounds'
  ) THEN
    ALTER TABLE public.srt_windows
      ADD CONSTRAINT srt_windows_bounds CHECK (window_end > window_start);
  END IF;
END$$;

------------------------------
-- D. Performance indexes
------------------------------
DO $$
BEGIN
  -- Critical indexes for performance
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='normalized_observations') THEN
    CREATE INDEX IF NOT EXISTS normalized_obs_lookup ON public.normalized_observations (loop_id, indicator_key, ts DESC);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='loop_signal_scores') THEN
    CREATE INDEX IF NOT EXISTS loop_signal_scores_time ON public.loop_signal_scores (loop_id, as_of DESC);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='tasks_v2') THEN
    CREATE INDEX IF NOT EXISTS tasks_v2_inbox ON public.tasks_v2 (status, capacity, due_at NULLS LAST);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='compass_snapshots') THEN
    CREATE INDEX IF NOT EXISTS compass_snapshots_loop_idx ON public.compass_snapshots (loop_id, as_of);
  END IF;
END$$;

COMMIT;