-- PAGS Loop Registry Database Schema
-- Core Loop Registry Tables

-- Main loops table
CREATE TABLE loops (
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
CREATE TABLE loop_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loop_id UUID REFERENCES loops(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(loop_id, version)
);

-- Nodes within loops (local to each loop)
CREATE TABLE loop_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loop_id UUID REFERENCES loops(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  kind TEXT CHECK(kind IN ('stock','flow','aux','actor','indicator')),
  indicator_id UUID NULL,
  meta JSONB DEFAULT '{}'::jsonb
);

-- Edges between nodes (CLD connections)
CREATE TABLE loop_edges (
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
CREATE TABLE shared_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  domain TEXT CHECK(domain IN ('population','resource','product','social','institution')),
  descriptor TEXT,
  meta JSONB DEFAULT '{}'::jsonb
);

-- Junction table linking loops to shared nodes
CREATE TABLE loop_shared_nodes (
  loop_id UUID REFERENCES loops(id) ON DELETE CASCADE,
  snl_id UUID REFERENCES shared_nodes(id) ON DELETE CASCADE,
  role TEXT, -- e.g., 'actor','system','bottleneck','beneficiary'
  PRIMARY KEY(loop_id, snl_id)
);

-- Indicators for loops
CREATE TABLE registry_indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loop_id UUID REFERENCES loops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  kind TEXT CHECK(kind IN ('state','flow','rate','composite')),
  unit TEXT,
  source TEXT,
  meta JSONB DEFAULT '{}'::jsonb
);

-- DE Bands for indicators
CREATE TABLE registry_de_bands (
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
CREATE TABLE registry_srt_windows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loop_id UUID REFERENCES loops(id) ON DELETE CASCADE,
  window_start DATE,
  window_end DATE,
  reflex_horizon INTERVAL,
  cadence TEXT
);

-- Cascades between loops
CREATE TABLE loop_cascades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_loop UUID REFERENCES loops(id) ON DELETE CASCADE,
  to_loop UUID REFERENCES loops(id) ON DELETE CASCADE,
  cascade_type TEXT CHECK(cascade_type IN ('upstream','downstream','protective','exposure','coupled')),
  via_snl UUID REFERENCES shared_nodes(id),
  strength NUMERIC,
  note TEXT,
  UNIQUE(from_loop, to_loop, cascade_type, COALESCE(via_snl, '00000000-0000-0000-0000-000000000000'::uuid))
);

-- Loop validation checks
CREATE TABLE loop_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loop_id UUID REFERENCES loops(id) ON DELETE CASCADE,
  kind TEXT, -- 'structure','coverage','bands','srt','metadata'
  level TEXT, -- 'info','warn','error'
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
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

-- RLS Policies
-- Loops: Users can manage their own, view published
CREATE POLICY "Users can manage their own loops" ON loops
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view published loops" ON loops
  FOR SELECT USING (status = 'published');

-- Loop versions: Access control through parent loop
CREATE POLICY "Users can access loop versions" ON loop_versions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM loops 
      WHERE loops.id = loop_versions.loop_id 
      AND (loops.user_id = auth.uid() OR loops.status = 'published')
    )
  );

-- Loop nodes: Access control through parent loop
CREATE POLICY "Users can access loop nodes" ON loop_nodes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM loops 
      WHERE loops.id = loop_nodes.loop_id 
      AND (loops.user_id = auth.uid() OR loops.status = 'published')
    )
  );

-- Loop edges: Access control through parent loop
CREATE POLICY "Users can access loop edges" ON loop_edges
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM loops 
      WHERE loops.id = loop_edges.loop_id 
      AND (loops.user_id = auth.uid() OR loops.status = 'published')
    )
  );

-- Shared nodes: Public read, authenticated write
CREATE POLICY "Anyone can view shared nodes" ON shared_nodes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage shared nodes" ON shared_nodes
  FOR INSERT, UPDATE, DELETE USING (auth.uid() IS NOT NULL);

-- Loop shared nodes: Access control through parent loop
CREATE POLICY "Users can access loop shared nodes" ON loop_shared_nodes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM loops 
      WHERE loops.id = loop_shared_nodes.loop_id 
      AND (loops.user_id = auth.uid() OR loops.status = 'published')
    )
  );

-- Registry indicators: Access control through parent loop
CREATE POLICY "Users can access registry indicators" ON registry_indicators
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM loops 
      WHERE loops.id = registry_indicators.loop_id 
      AND (loops.user_id = auth.uid() OR loops.status = 'published')
    )
  );

-- Registry DE bands: Access control through parent indicator
CREATE POLICY "Users can access registry de bands" ON registry_de_bands
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM registry_indicators ri
      JOIN loops l ON l.id = ri.loop_id
      WHERE ri.id = registry_de_bands.indicator_id 
      AND (l.user_id = auth.uid() OR l.status = 'published')
    )
  );

-- Registry SRT windows: Access control through parent loop
CREATE POLICY "Users can access registry srt windows" ON registry_srt_windows
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM loops 
      WHERE loops.id = registry_srt_windows.loop_id 
      AND (loops.user_id = auth.uid() OR loops.status = 'published')
    )
  );

-- Loop cascades: Access control through related loops
CREATE POLICY "Users can access loop cascades" ON loop_cascades
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM loops l1
      WHERE l1.id = loop_cascades.from_loop 
      AND (l1.user_id = auth.uid() OR l1.status = 'published')
    ) OR EXISTS (
      SELECT 1 FROM loops l2
      WHERE l2.id = loop_cascades.to_loop 
      AND (l2.user_id = auth.uid() OR l2.status = 'published')
    )
  );

-- Loop checks: Access control through parent loop
CREATE POLICY "Users can access loop checks" ON loop_checks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM loops 
      WHERE loops.id = loop_checks.loop_id 
      AND (loops.user_id = auth.uid() OR loops.status = 'published')
    )
  );

-- Indexes for performance
CREATE INDEX idx_loops_status_layer_type ON loops(status, layer, loop_type);
CREATE INDEX idx_loops_tags ON loops USING gin(tags);
CREATE INDEX idx_loop_nodes_loop_id ON loop_nodes(loop_id);
CREATE INDEX idx_loop_edges_loop_id ON loop_edges(loop_id);
CREATE INDEX idx_loop_edges_nodes ON loop_edges(from_node, to_node);
CREATE INDEX idx_loop_shared_nodes_snl_id ON loop_shared_nodes(snl_id);
CREATE INDEX idx_registry_indicators_loop_id ON registry_indicators(loop_id);
CREATE INDEX idx_registry_de_bands_indicator_id ON registry_de_bands(indicator_id);
CREATE INDEX idx_registry_srt_windows_loop_id ON registry_srt_windows(loop_id);
CREATE INDEX idx_loop_cascades_from_to ON loop_cascades(from_loop, to_loop, cascade_type);

-- Materialized view for loop summaries
CREATE MATERIALIZED VIEW mv_loop_summaries AS
SELECT
  l.id,
  l.name,
  l.synopsis,
  l.loop_type, 
  l.motif, 
  l.layer, 
  l.default_leverage,
  (SELECT count(*) FROM loop_nodes n WHERE n.loop_id = l.id) as node_count,
  (SELECT count(*) FROM loop_edges e WHERE e.loop_id = l.id) as edge_count,
  (SELECT count(*) FROM loop_shared_nodes s WHERE s.loop_id = l.id) as snl_count,
  (SELECT count(*) FROM registry_indicators i WHERE i.loop_id = l.id) as indicator_count,
  l.status, 
  l.tags, 
  l.created_by,
  l.user_id,
  l.updated_at
FROM loops l;

CREATE UNIQUE INDEX idx_mv_loop_summaries_id ON mv_loop_summaries(id);

-- Function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_registry_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_loop_summaries;
END;
$$;

-- Update trigger for loops table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_loops_updated_at BEFORE UPDATE ON loops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed some shared nodes
INSERT INTO shared_nodes (label, domain, descriptor) VALUES
  ('Government Agency', 'institution', 'Public sector regulatory body'),
  ('Private Enterprise', 'institution', 'Commercial organization'),
  ('Community Group', 'social', 'Local civic organization'),
  ('Population Demographics', 'population', 'Age and social structure metrics'),
  ('Labor Force', 'population', 'Working population segment'),
  ('Natural Resources', 'resource', 'Environmental assets'),
  ('Infrastructure', 'resource', 'Built environment systems'),
  ('Technology Platform', 'product', 'Digital service or tool'),
  ('Financial Capital', 'resource', 'Investment and funding flows'),
  ('Information Systems', 'product', 'Data and knowledge networks');