-- PAGS Loop Registry Database Schema (Simplified)

-- Main loops table
CREATE TABLE IF NOT EXISTS loops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  synopsis TEXT,
  loop_type TEXT CHECK(loop_type IN ('reactive','structural','perceptual')),
  motif TEXT CHECK(motif IN ('B','R','N','C','T')),
  layer TEXT CHECK(layer IN ('meta','macro','meso','micro')),
  default_leverage TEXT CHECK(default_leverage IN ('N','P','S')),
  tags TEXT[] DEFAULT '{}',
  status TEXT CHECK(status IN ('draft','review','published','deprecated')) DEFAULT 'draft',
  owner_org UUID,
  created_by UUID,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Loop versions for publishing history
CREATE TABLE IF NOT EXISTS loop_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loop_id UUID REFERENCES loops(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(loop_id, version)
);

-- Nodes within loops (local to each loop)
CREATE TABLE IF NOT EXISTS loop_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loop_id UUID REFERENCES loops(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  kind TEXT CHECK(kind IN ('stock','flow','aux','actor','indicator')),
  indicator_id UUID NULL,
  meta JSONB DEFAULT '{}'::jsonb
);

-- Edges between nodes (CLD connections)
CREATE TABLE IF NOT EXISTS loop_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loop_id UUID REFERENCES loops(id) ON DELETE CASCADE,
  from_node UUID REFERENCES loop_nodes(id) ON DELETE CASCADE,
  to_node UUID REFERENCES loop_nodes(id) ON DELETE CASCADE,
  polarity INTEGER CHECK(polarity IN (-1,1)),
  delay_ms INTEGER DEFAULT 0,
  weight NUMERIC,
  note TEXT,
  UNIQUE(loop_id, from_node, to_node)
);

-- Shared Node Layer (SNL) - global shared nodes
CREATE TABLE IF NOT EXISTS shared_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  domain TEXT CHECK(domain IN ('population','resource','product','social','institution')),
  descriptor TEXT,
  meta JSONB DEFAULT '{}'::jsonb
);

-- Junction table linking loops to shared nodes
CREATE TABLE IF NOT EXISTS loop_shared_nodes (
  loop_id UUID REFERENCES loops(id) ON DELETE CASCADE,
  snl_id UUID REFERENCES shared_nodes(id) ON DELETE CASCADE,
  role TEXT,
  PRIMARY KEY(loop_id, snl_id)
);

-- Indicators for loops
CREATE TABLE IF NOT EXISTS registry_indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loop_id UUID REFERENCES loops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  kind TEXT CHECK(kind IN ('state','flow','rate','composite')),
  unit TEXT,
  source TEXT,
  meta JSONB DEFAULT '{}'::jsonb
);

-- DE Bands for indicators
CREATE TABLE IF NOT EXISTS registry_de_bands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  indicator_id UUID REFERENCES registry_indicators(id) ON DELETE CASCADE,
  lower_bound NUMERIC,
  upper_bound NUMERIC,
  asymmetry NUMERIC DEFAULT 0,
  notes TEXT,
  updated_by UUID,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- SRT Windows for loops
CREATE TABLE IF NOT EXISTS registry_srt_windows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loop_id UUID REFERENCES loops(id) ON DELETE CASCADE,
  window_start DATE,
  window_end DATE,
  reflex_horizon INTERVAL,
  cadence TEXT
);

-- Cascades between loops
CREATE TABLE IF NOT EXISTS loop_cascades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_loop UUID REFERENCES loops(id) ON DELETE CASCADE,
  to_loop UUID REFERENCES loops(id) ON DELETE CASCADE,
  cascade_type TEXT CHECK(cascade_type IN ('upstream','downstream','protective','exposure','coupled')),
  via_snl UUID REFERENCES shared_nodes(id),
  strength NUMERIC,
  note TEXT
);

-- Loop validation checks
CREATE TABLE IF NOT EXISTS loop_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loop_id UUID REFERENCES loops(id) ON DELETE CASCADE,
  kind TEXT,
  level TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE loops ENABLE ROW LEVEL SECURITY;
ALTER TABLE loop_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE loop_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE loop_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE loop_shared_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE registry_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE registry_de_bands ENABLE ROW LEVEL SECURITY;
ALTER TABLE registry_srt_windows ENABLE ROW LEVEL SECURITY;
ALTER TABLE loop_cascades ENABLE ROW LEVEL SECURITY;
ALTER TABLE loop_checks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for loops
DROP POLICY IF EXISTS "Users can manage their own loops" ON loops;
CREATE POLICY "Users can manage their own loops" ON loops
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view published loops" ON loops;
CREATE POLICY "Users can view published loops" ON loops
  FOR SELECT USING (status = 'published');

-- RLS for shared nodes (public read)
DROP POLICY IF EXISTS "Anyone can view shared nodes" ON shared_nodes;
CREATE POLICY "Anyone can view shared nodes" ON shared_nodes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage shared nodes" ON shared_nodes;
CREATE POLICY "Authenticated users can manage shared nodes" ON shared_nodes
  FOR INSERT, UPDATE, DELETE USING (auth.uid() IS NOT NULL);

-- RLS for child tables - access through parent loop
DROP POLICY IF EXISTS "Users can access loop versions" ON loop_versions;
CREATE POLICY "Users can access loop versions" ON loop_versions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM loops 
      WHERE loops.id = loop_versions.loop_id 
      AND (loops.user_id = auth.uid() OR loops.status = 'published')
    )
  );

DROP POLICY IF EXISTS "Users can access loop nodes" ON loop_nodes;
CREATE POLICY "Users can access loop nodes" ON loop_nodes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM loops 
      WHERE loops.id = loop_nodes.loop_id 
      AND (loops.user_id = auth.uid() OR loops.status = 'published')
    )
  );

DROP POLICY IF EXISTS "Users can access loop edges" ON loop_edges;
CREATE POLICY "Users can access loop edges" ON loop_edges
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM loops 
      WHERE loops.id = loop_edges.loop_id 
      AND (loops.user_id = auth.uid() OR loops.status = 'published')
    )
  );

-- Create core indexes
CREATE INDEX IF NOT EXISTS idx_loops_user_status ON loops(user_id, status);
CREATE INDEX IF NOT EXISTS idx_loops_status_layer_type ON loops(status, layer, loop_type);
CREATE INDEX IF NOT EXISTS idx_loop_nodes_loop_id ON loop_nodes(loop_id);
CREATE INDEX IF NOT EXISTS idx_loop_edges_loop_id ON loop_edges(loop_id);

-- Insert sample shared nodes
INSERT INTO shared_nodes (label, domain, descriptor) 
VALUES
  ('Government Agency', 'institution', 'Public sector regulatory body'),
  ('Private Enterprise', 'institution', 'Commercial organization'),
  ('Community Group', 'social', 'Local civic organization'),
  ('Population Demographics', 'population', 'Age and social structure metrics'),
  ('Natural Resources', 'resource', 'Environmental assets'),
  ('Financial Capital', 'resource', 'Investment and funding flows')
ON CONFLICT (id) DO NOTHING;