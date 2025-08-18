-- Create Loop Registry schema with comprehensive tables and indexes

-- Create loops table with type and scale constraints (without org_id for now)
CREATE TABLE IF NOT EXISTS public.loops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  loop_type TEXT NOT NULL CHECK (loop_type IN ('reactive', 'structural', 'perceptual')),
  scale TEXT NOT NULL CHECK (scale IN ('micro', 'meso', 'macro')),
  leverage_default TEXT CHECK (leverage_default IN ('N', 'P', 'S')),
  controller JSONB DEFAULT '{}',
  thresholds JSONB DEFAULT '{}',
  notes TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  version INTEGER NOT NULL DEFAULT 1,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create loop_versions table for immutable snapshots
CREATE TABLE IF NOT EXISTS public.loop_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  loop_id UUID NOT NULL,
  version INTEGER NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update shared_nodes table with domain constraint
ALTER TABLE public.shared_nodes 
ADD COLUMN IF NOT EXISTS descriptor TEXT;

-- Create loop_edges table
CREATE TABLE IF NOT EXISTS public.loop_edges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  loop_id UUID NOT NULL,
  from_node UUID NOT NULL,
  to_node UUID NOT NULL,
  polarity INTEGER NOT NULL CHECK (polarity IN (-1, 1)),
  delay_ms INTEGER DEFAULT 0,
  weight NUMERIC DEFAULT 1.0,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create loop_tags table
CREATE TABLE IF NOT EXISTS public.loop_tags (
  loop_id UUID NOT NULL,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (loop_id, tag)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_loops_status_type_scale ON public.loops (status, loop_type, scale);
CREATE INDEX IF NOT EXISTS idx_loop_shared_nodes_node_id ON public.loop_shared_nodes (node_id);
CREATE INDEX IF NOT EXISTS idx_loop_edges_loop_id ON public.loop_edges (loop_id);
CREATE INDEX IF NOT EXISTS idx_loop_versions_loop_id_version ON public.loop_versions (loop_id, version DESC);
CREATE INDEX IF NOT EXISTS idx_loops_user_id ON public.loops (user_id);

-- Enable RLS on all tables
ALTER TABLE public.loops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loop_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loop_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loop_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for loops
CREATE POLICY "Users can manage their own loops" ON public.loops
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view published loops" ON public.loops
  FOR SELECT USING (status = 'published');

-- RLS Policies for loop_versions
CREATE POLICY "Users can manage their loop versions" ON public.loop_versions
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM public.loops WHERE id = loop_versions.loop_id
    )
  );

CREATE POLICY "Users can view published loop versions" ON public.loop_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.loops 
      WHERE id = loop_versions.loop_id AND status = 'published'
    )
  );

-- RLS Policies for loop_edges
CREATE POLICY "Users can manage their loop edges" ON public.loop_edges
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM public.loops WHERE id = loop_edges.loop_id
    )
  );

-- RLS Policies for loop_tags
CREATE POLICY "Users can manage their loop tags" ON public.loop_tags
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM public.loops WHERE id = loop_tags.loop_id
    )
  );

-- Create RPC function to publish a loop
CREATE OR REPLACE FUNCTION public.publish_loop(loop_uuid UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_loop RECORD;
  new_version INTEGER;
BEGIN
  -- Get current loop data
  SELECT * INTO current_loop
  FROM public.loops
  WHERE id = loop_uuid AND user_id = auth.uid();
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Loop not found or access denied');
  END IF;
  
  -- Increment version
  new_version := current_loop.version + 1;
  
  -- Create version snapshot
  INSERT INTO public.loop_versions (loop_id, version, payload)
  VALUES (
    loop_uuid,
    new_version,
    jsonb_build_object(
      'name', current_loop.name,
      'loop_type', current_loop.loop_type,
      'scale', current_loop.scale,
      'leverage_default', current_loop.leverage_default,
      'controller', current_loop.controller,
      'thresholds', current_loop.thresholds,
      'notes', current_loop.notes,
      'version', new_version
    )
  );
  
  -- Update loop status and version
  UPDATE public.loops
  SET 
    status = 'published',
    version = new_version,
    updated_at = now()
  WHERE id = loop_uuid;
  
  RETURN jsonb_build_object(
    'success', true,
    'version', new_version,
    'status', 'published'
  );
END;
$$;

-- Create RPC function to get loop hydration data
CREATE OR REPLACE FUNCTION public.get_loop_hydrate(loop_uuid UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  loop_data RECORD;
  nodes_data JSONB;
  edges_data JSONB;
  result JSONB;
BEGIN
  -- Get loop data
  SELECT * INTO loop_data
  FROM public.loops
  WHERE id = loop_uuid;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Loop not found');
  END IF;
  
  -- Get shared nodes for this loop
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', sn.id,
      'label', sn.label,
      'domain', sn.domain,
      'descriptor', sn.descriptor,
      'role', lsn.role
    )
  ) INTO nodes_data
  FROM public.shared_nodes sn
  JOIN public.loop_shared_nodes lsn ON sn.id = lsn.node_id
  WHERE lsn.loop_id = loop_uuid;
  
  -- Get edges for this loop
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', le.id,
      'from_node', le.from_node,
      'to_node', le.to_node,
      'polarity', le.polarity,
      'delay_ms', le.delay_ms,
      'weight', le.weight,
      'note', le.note
    )
  ) INTO edges_data
  FROM public.loop_edges le
  WHERE le.loop_id = loop_uuid;
  
  -- Build result
  result := jsonb_build_object(
    'id', loop_data.id,
    'name', loop_data.name,
    'loop_type', loop_data.loop_type,
    'scale', loop_data.scale,
    'leverage_default', loop_data.leverage_default,
    'controller', COALESCE(loop_data.controller, '{}'),
    'thresholds', COALESCE(loop_data.thresholds, '{}'),
    'notes', loop_data.notes,
    'status', loop_data.status,
    'version', loop_data.version,
    'nodes', COALESCE(nodes_data, '[]'),
    'edges', COALESCE(edges_data, '[]')
  );
  
  RETURN result;
END;
$$;

-- Create RPC function to search loops
CREATE OR REPLACE FUNCTION public.search_loops(search_query TEXT DEFAULT '', filters JSONB DEFAULT '{}')
RETURNS TABLE (
  id UUID,
  name TEXT,
  loop_type TEXT,
  scale TEXT,
  status TEXT,
  version INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  tags TEXT[],
  node_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id,
    l.name,
    l.loop_type,
    l.scale,
    l.status,
    l.version,
    l.created_at,
    ARRAY(
      SELECT lt.tag 
      FROM public.loop_tags lt 
      WHERE lt.loop_id = l.id
    ) as tags,
    COALESCE(
      (SELECT COUNT(*) 
       FROM public.loop_shared_nodes lsn 
       WHERE lsn.loop_id = l.id), 
      0
    ) as node_count
  FROM public.loops l
  WHERE 
    (search_query = '' OR l.name ILIKE '%' || search_query || '%')
    AND (
      l.status = 'published' 
      OR l.user_id = auth.uid()
    )
    AND (
      filters = '{}'::jsonb
      OR (
        (NOT filters ? 'loop_type' OR l.loop_type = (filters->>'loop_type'))
        AND (NOT filters ? 'scale' OR l.scale = (filters->>'scale'))
        AND (NOT filters ? 'status' OR l.status = (filters->>'status'))
      )
    )
  ORDER BY l.updated_at DESC;
END;
$$;

-- Create RPC function to list loops by node
CREATE OR REPLACE FUNCTION public.list_loops_by_node(node_uuid UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  loop_type TEXT,
  scale TEXT,
  status TEXT,
  role TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id,
    l.name,
    l.loop_type,
    l.scale,
    l.status,
    lsn.role
  FROM public.loops l
  JOIN public.loop_shared_nodes lsn ON l.id = lsn.loop_id
  WHERE 
    lsn.node_id = node_uuid
    AND (
      l.status = 'published' 
      OR l.user_id = auth.uid()
    )
  ORDER BY l.name;
END;
$$;

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_loops_updated_at
  BEFORE UPDATE ON public.loops
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();