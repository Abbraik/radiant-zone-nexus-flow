-- PAGS Loop Registry - Core Schema

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
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Loop nodes
CREATE TABLE IF NOT EXISTS loop_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loop_id UUID REFERENCES loops(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  kind TEXT CHECK(kind IN ('stock','flow','aux','actor','indicator')),
  meta JSONB DEFAULT '{}'::jsonb
);

-- Loop edges
CREATE TABLE IF NOT EXISTS loop_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loop_id UUID REFERENCES loops(id) ON DELETE CASCADE,
  from_node UUID REFERENCES loop_nodes(id) ON DELETE CASCADE,
  to_node UUID REFERENCES loop_nodes(id) ON DELETE CASCADE,
  polarity INTEGER CHECK(polarity IN (-1,1)),
  delay_ms INTEGER DEFAULT 0,
  weight NUMERIC DEFAULT 1.0,
  note TEXT
);

-- Shared nodes
CREATE TABLE IF NOT EXISTS shared_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  domain TEXT CHECK(domain IN ('population','resource','product','social','institution')),
  descriptor TEXT,
  meta JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE loops ENABLE ROW LEVEL SECURITY;
ALTER TABLE loop_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE loop_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_nodes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own loops" ON loops
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view published loops" ON loops
  FOR SELECT USING (status = 'published');

CREATE POLICY "Users can access loop nodes" ON loop_nodes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM loops 
      WHERE loops.id = loop_nodes.loop_id 
      AND (loops.user_id = auth.uid() OR loops.status = 'published')
    )
  );

CREATE POLICY "Users can access loop edges" ON loop_edges
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM loops 
      WHERE loops.id = loop_edges.loop_id 
      AND (loops.user_id = auth.uid() OR loops.status = 'published')
    )
  );

CREATE POLICY "Anyone can view shared nodes" ON shared_nodes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create shared nodes" ON shared_nodes
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update shared nodes" ON shared_nodes
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete shared nodes" ON shared_nodes
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_loops_user_status ON loops(user_id, status);
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
ON CONFLICT DO NOTHING;