-- Part A1: Ensure/upgrade schema for Loop Editor

-- Drop existing functions that might conflict
DROP FUNCTION IF EXISTS get_loop_hydrate(uuid);
DROP FUNCTION IF EXISTS get_loop_hydrate(text);

-- Create enums if they don't exist
DO $$ BEGIN
  CREATE TYPE node_kind AS ENUM ('stock', 'flow', 'aux', 'actor', 'indicator');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE indicator_kind AS ENUM ('state', 'rate');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE cascade_relation AS ENUM ('upstream', 'downstream');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Update loops table structure
ALTER TABLE loops 
ADD COLUMN IF NOT EXISTS loop_code TEXT,
ADD COLUMN IF NOT EXISTS motif TEXT,
ADD COLUMN IF NOT EXISTS domain TEXT,
ADD COLUMN IF NOT EXISTS layer TEXT;

-- Update loop_nodes table
ALTER TABLE loop_nodes 
ADD COLUMN IF NOT EXISTS pos JSONB DEFAULT NULL,
ALTER COLUMN kind TYPE TEXT;

-- Create indicators table if not exists
CREATE TABLE IF NOT EXISTS indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loop_id UUID NOT NULL REFERENCES loops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  kind TEXT DEFAULT 'state',
  unit TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id),
  UNIQUE(loop_id, name)
);

-- Update de_bands table to reference indicators
ALTER TABLE de_bands 
ADD COLUMN IF NOT EXISTS indicator_id UUID REFERENCES indicators(id) ON DELETE CASCADE;

-- Create srt_windows table if not exists
CREATE TABLE IF NOT EXISTS srt_windows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loop_id UUID NOT NULL REFERENCES loops(id) ON DELETE CASCADE,
  window_start DATE NOT NULL,
  window_end DATE NOT NULL,
  reflex_horizon INTERVAL NOT NULL,
  cadence TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id)
);

-- Create shared_nodes (SNL) catalog table
CREATE TABLE IF NOT EXISTS shared_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT UNIQUE NOT NULL,
  domain TEXT,
  descriptor TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create loop_shared_nodes junction table
CREATE TABLE IF NOT EXISTS loop_shared_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loop_id UUID NOT NULL REFERENCES loops(id) ON DELETE CASCADE,
  node_id UUID NOT NULL REFERENCES shared_nodes(id) ON DELETE CASCADE,
  role TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(loop_id, node_id)
);

-- Create cascades table
CREATE TABLE IF NOT EXISTS cascades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_loop_id UUID NOT NULL REFERENCES loops(id) ON DELETE CASCADE,
  to_loop_id UUID NOT NULL REFERENCES loops(id) ON DELETE CASCADE,
  relation TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id)
);

-- Create indices for performance
CREATE INDEX IF NOT EXISTS idx_loops_loop_code ON loops(loop_code);
CREATE INDEX IF NOT EXISTS idx_loops_metadata_loop_code ON loops USING GIN ((metadata->>'loop_code'));
CREATE INDEX IF NOT EXISTS idx_loop_nodes_loop_id ON loop_nodes(loop_id);
CREATE INDEX IF NOT EXISTS idx_loop_edges_loop_id ON loop_edges(loop_id);
CREATE INDEX IF NOT EXISTS idx_indicators_loop_id ON indicators(loop_id);
CREATE INDEX IF NOT EXISTS idx_de_bands_loop_id ON de_bands(loop_id);
CREATE INDEX IF NOT EXISTS idx_de_bands_indicator_id ON de_bands(indicator_id);
CREATE INDEX IF NOT EXISTS idx_srt_windows_loop_id ON srt_windows(loop_id);
CREATE INDEX IF NOT EXISTS idx_loop_shared_nodes_loop_id ON loop_shared_nodes(loop_id);
CREATE INDEX IF NOT EXISTS idx_cascades_from_loop_id ON cascades(from_loop_id);
CREATE INDEX IF NOT EXISTS idx_cascades_to_loop_id ON cascades(to_loop_id);

-- Enable RLS on new tables
ALTER TABLE indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE srt_windows ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE loop_shared_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cascades ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own indicators" ON indicators
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own SRT windows" ON srt_windows  
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view shared nodes" ON shared_nodes
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their loop shared nodes" ON loop_shared_nodes
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM loops WHERE id = loop_shared_nodes.loop_id));

CREATE POLICY "Users can manage their cascades" ON cascades
  FOR ALL USING (auth.uid() = user_id);

-- Create view for loop shared nodes with SNL data
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

-- Update timestamps trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
DROP TRIGGER IF EXISTS update_indicators_updated_at ON indicators;
CREATE TRIGGER update_indicators_updated_at
  BEFORE UPDATE ON indicators
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_srt_windows_updated_at ON srt_windows;  
CREATE TRIGGER update_srt_windows_updated_at
  BEFORE UPDATE ON srt_windows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();