-- Production-Safe Schema Hardening + FE Compatibility (Fixed)
-- Wrap everything in a single transaction
BEGIN;

------------------------------
-- A. ENUMS (guarded creates)
------------------------------
DO $$
BEGIN
  PERFORM 1 FROM pg_type WHERE typname = 'loop_type';
  IF NOT FOUND THEN
    CREATE TYPE loop_type AS ENUM ('reactive','structural','perceptual','anticipatory');
  END IF;
END$$;

DO $$
BEGIN
  PERFORM 1 FROM pg_type WHERE typname = 'scale_type';
  IF NOT FOUND THEN
    CREATE TYPE scale_type AS ENUM ('micro','meso','macro','supervisory');
  END IF;
END$$;

DO $$
BEGIN
  PERFORM 1 FROM pg_type WHERE typname = 'leverage_type';
  IF NOT FOUND THEN
    CREATE TYPE leverage_type AS ENUM ('N','P','S');
  END IF;
END$$;

DO $$
BEGIN
  PERFORM 1 FROM pg_type WHERE typname = 'mandate_status';
  IF NOT FOUND THEN
    CREATE TYPE mandate_status AS ENUM ('allowed','review','blocked');
  END IF;
END$$;

DO $$
BEGIN
  PERFORM 1 FROM pg_type WHERE typname = 'claim_status';
  IF NOT FOUND THEN
    CREATE TYPE claim_status AS ENUM ('draft','active','paused','done','cancelled');
  END IF;
END$$;

-- 5C variants only if they don't already exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname='leverage_5c') THEN
    CREATE TYPE leverage_5c AS ENUM ('N','P','S');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname='mandate_status_5c') THEN
    CREATE TYPE mandate_status_5c AS ENUM ('allowed','review','blocked');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname='claim_status_5c') THEN
    CREATE TYPE claim_status_5c AS ENUM ('draft','active','paused','done','cancelled');
  END IF;
END$$;

------------------------------
-- B. Loops: align types safely
------------------------------
-- If loops.type (text) exists, keep it (compat) and sync it to scale
-- Ensure columns use enums where present but don't drop columns.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_schema='public' AND table_name='loops' AND column_name='loop_type')
  THEN
    -- Only alter if underlying is not already enum
    IF (SELECT data_type FROM information_schema.columns
        WHERE table_schema='public' AND table_name='loops' AND column_name='loop_type') <> 'USER-DEFINED' THEN
      ALTER TABLE public.loops
        ALTER COLUMN loop_type TYPE loop_type USING loop_type::loop_type;
    END IF;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_schema='public' AND table_name='loops' AND column_name='scale')
  THEN
    IF (SELECT data_type FROM information_schema.columns
        WHERE table_schema='public' AND table_name='loops' AND column_name='scale') <> 'USER-DEFINED' THEN
      ALTER TABLE public.loops
        ALTER COLUMN scale TYPE scale_type USING scale::scale_type;
    END IF;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_schema='public' AND table_name='loops' AND column_name='leverage_default')
  THEN
    IF (SELECT data_type FROM information_schema.columns
        WHERE table_schema='public' AND table_name='loops' AND column_name='leverage_default') <> 'USER-DEFINED' THEN
      ALTER TABLE public.loops
        ALTER COLUMN leverage_default TYPE leverage_type USING leverage_default::leverage_type;
    END IF;
  END IF;
END$$;

-- Create a trigger to keep legacy loops.type (text) aligned with scale (enum)
-- (Only if legacy "type" column still exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_schema='public' AND table_name='loops' AND column_name='type') THEN
    -- function
    CREATE OR REPLACE FUNCTION public.sync_loops_type_text()
    RETURNS trigger AS $f$
    BEGIN
      -- Keep legacy "type" = scale::text to avoid UI drift
      NEW.type := COALESCE(NEW.scale::text, NEW.type);
      RETURN NEW;
    END;
    $f$ LANGUAGE plpgsql;

    -- trigger (upsert style: create if missing)
    IF NOT EXISTS (
      SELECT 1 FROM pg_trigger WHERE tgname = 'trg_sync_loops_type_text'
    ) THEN
      CREATE TRIGGER trg_sync_loops_type_text
      BEFORE INSERT OR UPDATE ON public.loops
      FOR EACH ROW EXECUTE FUNCTION public.sync_loops_type_text();
    END IF;
  END IF;
END$$;

-------------------------------------------
-- C. Normalize Compass anchor (singular)
-------------------------------------------
-- Replace plural check with singular; guard if constraint exists
DO $$
BEGIN
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
END$$;

---------------------------------
-- D. Fix untyped ARRAY columns
---------------------------------
-- Only alter if column is an array and udt_name is not a concrete type.
-- Each block checks and casts to a sensible concrete type.
DO $$
BEGIN
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
    WHERE table_schema='public' AND table_name='antic_scenario_results' AND column_name='affected_loops'
      AND data_type='ARRAY' AND udt_name NOT IN ('_text','_uuid','_jsonb')
  ) THEN
    ALTER TABLE public.antic_scenario_results
      ALTER COLUMN affected_loops TYPE text[] USING affected_loops::text[];
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

  -- Similar pattern for delib_* / option_* etc:
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='delib_dossiers' AND column_name='selected_option_ids' AND data_type='ARRAY' AND udt_name NOT IN ('_uuid')) THEN
    ALTER TABLE public.delib_dossiers ALTER COLUMN selected_option_ids TYPE uuid[] USING selected_option_ids::uuid[];
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='delib_dossiers' AND column_name='rejected_option_ids' AND data_type='ARRAY' AND udt_name NOT IN ('_uuid')) THEN
    ALTER TABLE public.delib_dossiers ALTER COLUMN rejected_option_ids TYPE uuid[] USING rejected_option_ids::uuid[];
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='delib_dossiers' AND column_name='handoffs' AND data_type='ARRAY' AND udt_name NOT IN ('_text')) THEN
    ALTER TABLE public.delib_dossiers ALTER COLUMN handoffs TYPE text[] USING handoffs::text[];
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='delib_frontier' AND column_name='option_ids' AND data_type='ARRAY' AND udt_name NOT IN ('_uuid')) THEN
    ALTER TABLE public.delib_frontier ALTER COLUMN option_ids TYPE uuid[] USING option_ids::uuid[];
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='delib_options' AND column_name='tags' AND data_type='ARRAY' AND udt_name NOT IN ('_text')) THEN
    ALTER TABLE public.delib_options ALTER COLUMN tags TYPE text[] USING tags::text[];
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='delib_scores' AND column_name='evidence_refs' AND data_type='ARRAY' AND udt_name NOT IN ('_text')) THEN
    ALTER TABLE public.delib_scores ALTER COLUMN evidence_refs TYPE text[] USING evidence_refs::text[];
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='option_effects' AND column_name='edge_refs' AND data_type='ARRAY' AND udt_name NOT IN ('_uuid')) THEN
    ALTER TABLE public.option_effects ALTER COLUMN edge_refs TYPE uuid[] USING edge_refs::uuid[];
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='option_sets' AND column_name='option_ids' AND data_type='ARRAY' AND udt_name NOT IN ('_uuid')) THEN
    ALTER TABLE public.option_sets ALTER COLUMN option_ids TYPE uuid[] USING option_ids::uuid[];
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='struct_mesh_issues' AND column_name='loop_refs' AND data_type='ARRAY' AND udt_name NOT IN ('_text')) THEN
    ALTER TABLE public.struct_mesh_issues ALTER COLUMN loop_refs TYPE text[] USING loop_refs::text[];
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='harmonization_conflicts' AND column_name='tasks' AND data_type='ARRAY' AND udt_name NOT IN ('_uuid')) THEN
    ALTER TABLE public.harmonization_conflicts ALTER COLUMN tasks TYPE uuid[] USING tasks::uuid[];
  END IF;
END$$;

--------------------------------------
-- E. Add key FKs (non-breaking)
--------------------------------------
-- Only add if not already present
DO $$
BEGIN
  -- tasks_v2.loop_id → loops(id)
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tasks_v2' AND column_name='loop_id') AND
     NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name='tasks_v2' AND constraint_name='tasks_v2_loop_id_fkey'
  ) THEN
    ALTER TABLE public.tasks_v2
      ADD CONSTRAINT tasks_v2_loop_id_fkey FOREIGN KEY (loop_id) REFERENCES public.loops(id);
  END IF;

  -- tasks_5c.loop_id → loops(id)
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tasks_5c' AND column_name='loop_id') AND
     NOT EXISTS (SELECT 1 FROM information_schema.constraint_column_usage WHERE table_name='tasks_5c' AND constraint_name='tasks_5c_loop_id_fkey')
  THEN
    ALTER TABLE public.tasks_5c
      ADD CONSTRAINT tasks_5c_loop_id_fkey FOREIGN KEY (loop_id) REFERENCES public.loops(id);
  END IF;

  -- incidents.loop_code → loops(loop_code)
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='incidents' AND column_name='loop_code') AND
     NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name='incidents' AND constraint_name='incidents_loop_code_fkey'
  ) THEN
    ALTER TABLE public.incidents
      ADD CONSTRAINT incidents_loop_code_fkey FOREIGN KEY (loop_code) REFERENCES public.loops(loop_code);
  END IF;

  -- loop_edges.loop_id → loops(id)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name='loop_edges' AND constraint_name='loop_edges_loop_id_fkey'
  ) THEN
    ALTER TABLE public.loop_edges
      ADD CONSTRAINT loop_edges_loop_id_fkey FOREIGN KEY (loop_id) REFERENCES public.loops(id);
  END IF;

  -- loop_nodes.loop_id → loops(id)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name='loop_nodes' AND constraint_name='loop_nodes_loop_id_fkey'
  ) THEN
    ALTER TABLE public.loop_nodes
      ADD CONSTRAINT loop_nodes_loop_id_fkey FOREIGN KEY (loop_id) REFERENCES public.loops(id);
  END IF;

  -- loop_versions.loop_id → loops(id)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name='loop_versions' AND constraint_name='loop_versions_loop_id_fkey'
  ) THEN
    ALTER TABLE public.loop_versions
      ADD CONSTRAINT loop_versions_loop_id_fkey FOREIGN KEY (loop_id) REFERENCES public.loops(id);
  END IF;

  -- SNL references
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='hub_allocations' AND column_name='snl_id')
     AND NOT EXISTS (SELECT 1 FROM information_schema.constraint_column_usage WHERE table_name='hub_allocations' AND constraint_name='hub_allocations_snl_fkey')
  THEN
    ALTER TABLE public.hub_allocations
      ADD CONSTRAINT hub_allocations_snl_fkey FOREIGN KEY (snl_id) REFERENCES public.shared_nodes(snl_id);
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='harmonization_conflicts' AND column_name='snl_id')
     AND NOT EXISTS (SELECT 1 FROM information_schema.constraint_column_usage WHERE table_name='harmonization_conflicts' AND constraint_name='harmonization_conflicts_snl_fkey')
  THEN
    ALTER TABLE public.harmonization_conflicts
      ADD CONSTRAINT harmonization_conflicts_snl_fkey FOREIGN KEY (snl_id) REFERENCES public.shared_nodes(snl_id);
  END IF;
END$$;

--------------------------------------
-- F. Uniqueness & bounds (safe)
--------------------------------------
-- Unique band per loop+indicator
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname='de_bands_loop_indicator_uniq'
  ) THEN
    ALTER TABLE public.de_bands
      ADD CONSTRAINT de_bands_loop_indicator_uniq UNIQUE (loop_id, indicator);
  END IF;
END$$;

-- SRT window must be valid; unique per exact window
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname='srt_windows_bounds'
  ) THEN
    ALTER TABLE public.srt_windows
      ADD CONSTRAINT srt_windows_bounds CHECK (window_end > window_start);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE c.relkind='i' AND c.relname='srt_windows_loop_period_uniq' AND n.nspname='public'
  ) THEN
    CREATE UNIQUE INDEX srt_windows_loop_period_uniq
    ON public.srt_windows (loop_id, window_start, window_end);
  END IF;
END$$;

-- TRI bounds (5C + classic)
DO $$
BEGIN
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
END$$;

-- Guardrail percent limits
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='guardrail_policies') AND
     NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='guardrail_policies_pct') THEN
    ALTER TABLE public.guardrail_policies
      ADD CONSTRAINT guardrail_policies_pct CHECK (
        (coverage_limit_pct IS NULL OR (coverage_limit_pct >= 0 AND coverage_limit_pct <= 100)) AND
        (daily_delta_limit IS NULL OR daily_delta_limit >= 0)
      );
  END IF;
END$$;

--------------------------------------
-- G. Compatibility Views (conditionally)
--------------------------------------
-- Create views only if the underlying tables exist
DO $$
BEGIN
  -- v_loop_shared_nodes (for get_loop_hydrate and SNL joins)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='loop_shared_nodes') 
     AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='shared_nodes') THEN
    EXECUTE 'CREATE OR REPLACE VIEW public.v_loop_shared_nodes AS
    SELECT lsn.id         AS link_id,
           lsn.loop_id,
           sn.snl_id,
           sn.key        AS snl_key,
           sn.label      AS snl_label,
           sn.type       AS snl_type,
           lsn.role,
           lsn.note,
           lsn.created_at
    FROM public.loop_shared_nodes lsn
    JOIN public.shared_nodes sn ON sn.snl_id = lsn.snl_id';
  END IF;

  -- Task inbox view (if tasks_v2 exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='tasks_v2') THEN
    EXECUTE 'CREATE OR REPLACE VIEW public.v_tasks_inbox AS
    SELECT
      t.task_id         AS id,
      t.loop_id,
      t.capacity,
      t.template_key,
      t.status,
      t.priority,
      t.title,
      t.payload,
      t.open_route,
      t.created_by      AS user_id,
      t.created_at,
      t.updated_at,
      t.due_at
    FROM public.tasks_v2 t';
  END IF;

  -- Indicator latest view (if normalized_observations exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='normalized_observations') THEN
    EXECUTE 'CREATE OR REPLACE VIEW public.v_indicator_latest AS
    SELECT DISTINCT ON (loop_id, indicator_key)
      loop_id, indicator_key, ts, value, value_smoothed, band_pos, status, severity
    FROM public.normalized_observations
    ORDER BY loop_id, indicator_key, ts DESC';
  END IF;
END$$;

--------------------------------------
-- H. Performance indexes (conditional)
--------------------------------------
DO $$
BEGIN
  -- Create indexes only if tables exist
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='normalized_observations') THEN
    CREATE INDEX IF NOT EXISTS normalized_obs_lookup ON public.normalized_observations (loop_id, indicator_key, ts DESC);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='loop_signal_scores') THEN
    CREATE INDEX IF NOT EXISTS loop_signal_scores_time ON public.loop_signal_scores (loop_id, as_of DESC);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='tasks_v2') THEN
    CREATE INDEX IF NOT EXISTS tasks_v2_inbox ON public.tasks_v2 (status, capacity, due_at NULLS LAST);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='task_events_v2') THEN
    CREATE INDEX IF NOT EXISTS task_events_v2_task ON public.task_events_v2 (task_id, created_at DESC);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='compass_snapshots') THEN
    CREATE INDEX IF NOT EXISTS compass_snapshots_loop_idx ON public.compass_snapshots (loop_id, as_of);
  END IF;
END$$;

COMMIT;