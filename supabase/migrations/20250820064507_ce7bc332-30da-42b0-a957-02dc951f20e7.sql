-- Targeted migration for Loop Editor - Only add missing pieces

-- Add missing columns to loops table if they don't exist
ALTER TABLE loops 
ADD COLUMN IF NOT EXISTS motif TEXT,
ADD COLUMN IF NOT EXISTS domain TEXT,
ADD COLUMN IF NOT EXISTS layer TEXT;

-- Add position column to loop_nodes for graph editor
ALTER TABLE loop_nodes 
ADD COLUMN IF NOT EXISTS pos JSONB DEFAULT NULL;

-- Create cascades table if not exists
CREATE TABLE IF NOT EXISTS cascades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_loop_id UUID NOT NULL REFERENCES loops(id) ON DELETE CASCADE,
  to_loop_id UUID NOT NULL REFERENCES loops(id) ON DELETE CASCADE,
  relation TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id)
);

-- Enable RLS on cascades if not already enabled
ALTER TABLE cascades ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for cascades
DO $$ BEGIN
  CREATE POLICY "Users can manage their cascades" ON cascades
    FOR ALL USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create indices for performance
CREATE INDEX IF NOT EXISTS idx_loops_loop_code ON loops(loop_code);
CREATE INDEX IF NOT EXISTS idx_loops_metadata_loop_code ON loops((metadata->>'loop_code'));
CREATE INDEX IF NOT EXISTS idx_loops_metadata_gin ON loops USING GIN(metadata);
CREATE INDEX IF NOT EXISTS idx_cascades_from_loop_id ON cascades(from_loop_id);
CREATE INDEX IF NOT EXISTS idx_cascades_to_loop_id ON cascades(to_loop_id);

-- Create or replace view for loop shared nodes with SNL data
CREATE OR REPLACE VIEW v_loop_shared_nodes AS
SELECT 
  lsn.id,
  lsn.loop_id,
  lsn.node_id as snl_id,
  sn.label as snl_label,
  sn.domain,
  sn.descriptor,
  lsn.role
FROM loop_shared_nodes lsn
JOIN shared_nodes sn ON sn.id = lsn.node_id;

-- Create comprehensive hydration function
CREATE OR REPLACE FUNCTION get_loop_hydrate(p_loop_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE 
  v_loop_id uuid; 
  v_result jsonb;
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

  -- Build comprehensive result
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
      (SELECT jsonb_agg(to_jsonb(vlsn.*) ORDER BY vlsn.snl_label) 
       FROM v_loop_shared_nodes vlsn WHERE vlsn.loop_id = l.id), 
      '[]'::jsonb
    ),
    'cascades', COALESCE(
      (SELECT jsonb_agg(to_jsonb(c.*) ORDER BY c.created_at) 
       FROM cascades c WHERE c.from_loop_id = l.id OR c.to_loop_id = l.id), 
      '[]'::jsonb
    )
  )
  INTO v_result
  FROM loops l
  WHERE l.id = v_loop_id;
  
  RETURN v_result;
END $$;