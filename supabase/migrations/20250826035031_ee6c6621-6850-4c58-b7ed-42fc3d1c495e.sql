-- Fix Registry Schema & Function
-- 1. First, update shared_nodes table to match spec
ALTER TABLE shared_nodes DROP COLUMN IF EXISTS domain;
ALTER TABLE shared_nodes DROP COLUMN IF EXISTS description;
ALTER TABLE shared_nodes DROP COLUMN IF EXISTS descriptor;
ALTER TABLE shared_nodes ADD COLUMN IF NOT EXISTS snl_id uuid DEFAULT gen_random_uuid();
ALTER TABLE shared_nodes ADD COLUMN IF NOT EXISTS key text;
ALTER TABLE shared_nodes ADD COLUMN IF NOT EXISTS type text;

-- Add constraints
ALTER TABLE shared_nodes ADD CONSTRAINT shared_nodes_key_unique UNIQUE (key);
ALTER TABLE shared_nodes ADD CONSTRAINT shared_nodes_type_check CHECK (type IN ('hub', 'bridge', 'bottleneck'));

-- Update the primary key to be snl_id if needed
UPDATE shared_nodes SET snl_id = id WHERE snl_id IS NULL;
ALTER TABLE shared_nodes ALTER COLUMN snl_id SET NOT NULL;

-- 2. Update loop_shared_nodes table
ALTER TABLE loop_shared_nodes DROP COLUMN IF EXISTS node_id;
ALTER TABLE loop_shared_nodes ADD COLUMN IF NOT EXISTS snl_id uuid;
ALTER TABLE loop_shared_nodes ADD COLUMN IF NOT EXISTS note text;

-- Add foreign key constraint
ALTER TABLE loop_shared_nodes ADD CONSTRAINT fk_loop_shared_nodes_snl_id 
FOREIGN KEY (snl_id) REFERENCES shared_nodes(snl_id);

-- 3. Add missing indexes
CREATE INDEX IF NOT EXISTS idx_loop_nodes_loop_id ON loop_nodes(loop_id);
CREATE INDEX IF NOT EXISTS idx_de_bands_loop_id_indicator ON de_bands(loop_id, indicator);
CREATE INDEX IF NOT EXISTS idx_srt_windows_loop_id ON srt_windows(loop_id);
CREATE INDEX IF NOT EXISTS idx_loop_shared_nodes_loop_id ON loop_shared_nodes(loop_id);
CREATE INDEX IF NOT EXISTS idx_loop_shared_nodes_snl_id ON loop_shared_nodes(snl_id);
CREATE INDEX IF NOT EXISTS idx_cascades_from_loop_id ON cascades(from_loop_id);
CREATE INDEX IF NOT EXISTS idx_cascades_to_loop_id ON cascades(to_loop_id);

-- 4. Fix get_loop_hydrate function to work by ID and handle proper joins
CREATE OR REPLACE FUNCTION public.get_loop_hydrate(p_loop_uuid uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE 
  v_result jsonb;
BEGIN
  -- Build comprehensive result by loop ID
  SELECT jsonb_build_object(
    'loop', to_jsonb(l.*),
    'nodes', COALESCE(
      (SELECT jsonb_agg(to_jsonb(n.*) ORDER BY n.created_at) 
       FROM loop_nodes n WHERE n.loop_id = l.id), 
      '[]'::jsonb
    ),
    'edges', COALESCE(
      (SELECT jsonb_agg(to_jsonb(e.*) ORDER BY e.created_at) 
       FROM loop_edges e WHERE e.loop_id = l.id), 
      '[]'::jsonb
    ),
    'indicators', COALESCE(
      (SELECT jsonb_agg(to_jsonb(i.*) ORDER BY i.created_at) 
       FROM indicators i WHERE i.loop_id = l.id), 
      '[]'::jsonb
    ),
    'de_bands', COALESCE(
      (SELECT jsonb_agg(to_jsonb(db.*) ORDER BY db.created_at) 
       FROM de_bands db WHERE db.loop_id = l.id), 
      '[]'::jsonb
    ),
    'srt_windows', COALESCE(
      (SELECT jsonb_agg(to_jsonb(srt.*) ORDER BY srt.created_at) 
       FROM srt_windows srt WHERE srt.loop_id = l.id), 
      '[]'::jsonb
    ),
    'shared_nodes', COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'id', lsn.id,
          'loop_id', lsn.loop_id,
          'snl_id', lsn.snl_id,
          'role', lsn.role,
          'note', lsn.note,
          'shared_node', to_jsonb(sn.*)
        ) ORDER BY sn.label
      ) 
       FROM loop_shared_nodes lsn 
       JOIN shared_nodes sn ON sn.snl_id = lsn.snl_id 
       WHERE lsn.loop_id = l.id), 
      '[]'::jsonb
    ),
    'cascades', COALESCE(
      (SELECT jsonb_agg(to_jsonb(c.*) ORDER BY c.created_at) 
       FROM cascades c WHERE c.from_loop_id = l.id OR c.to_loop_id = l.id), 
      '[]'::jsonb
    ),
    'versions', COALESCE(
      (SELECT jsonb_agg(to_jsonb(v.*) ORDER BY v.version DESC) 
       FROM loop_versions v WHERE v.loop_id = l.id), 
      '[]'::jsonb
    )
  )
  INTO v_result
  FROM loops l
  WHERE l.id = p_loop_uuid;
  
  IF v_result IS NULL THEN
    RAISE EXCEPTION 'loop_id % not found', p_loop_uuid; 
  END IF;
  
  RETURN v_result;
END $function$;

-- Also create version that works by loop_code for backward compatibility
CREATE OR REPLACE FUNCTION public.get_loop_hydrate(p_loop_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE 
  v_loop_id uuid; 
BEGIN
  -- Find loop by code (try metadata first, then direct column)
  SELECT id INTO v_loop_id 
  FROM loops 
  WHERE metadata->>'loop_code' = p_loop_code 
     OR loop_code = p_loop_code
  LIMIT 1;
  
  IF v_loop_id IS NULL THEN 
    RAISE EXCEPTION 'loop_code % not found', p_loop_code; 
  END IF;

  -- Use the UUID version
  RETURN get_loop_hydrate(v_loop_id);
END $function$;