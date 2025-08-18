-- Drop existing policies and recreate Loop Registry schema

-- Drop existing policies if they exist
DO $$
BEGIN
    DROP POLICY IF EXISTS "Users can manage their own loops" ON public.loops;
    DROP POLICY IF EXISTS "Users can view published loops" ON public.loops;
EXCEPTION
    WHEN undefined_table THEN
        NULL; -- Table doesn't exist, ignore
END $$;

-- Create missing tables that don't exist yet
CREATE TABLE IF NOT EXISTS public.loop_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  loop_id UUID NOT NULL,
  version INTEGER NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

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

CREATE TABLE IF NOT EXISTS public.loop_tags (
  loop_id UUID NOT NULL,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (loop_id, tag)
);

-- Add missing columns to existing loops table
DO $$
BEGIN
    ALTER TABLE public.loops ADD COLUMN IF NOT EXISTS loop_type TEXT CHECK (loop_type IN ('reactive', 'structural', 'perceptual'));
    ALTER TABLE public.loops ADD COLUMN IF NOT EXISTS scale TEXT CHECK (scale IN ('micro', 'meso', 'macro'));
    ALTER TABLE public.loops ADD COLUMN IF NOT EXISTS leverage_default TEXT CHECK (leverage_default IN ('N', 'P', 'S'));
    ALTER TABLE public.loops ADD COLUMN IF NOT EXISTS controller JSONB DEFAULT '{}';
    ALTER TABLE public.loops ADD COLUMN IF NOT EXISTS thresholds JSONB DEFAULT '{}';
    ALTER TABLE public.loops ADD COLUMN IF NOT EXISTS notes TEXT;
    ALTER TABLE public.loops ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'draft';
    ALTER TABLE public.loops ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;
EXCEPTION
    WHEN others THEN
        NULL; -- Ignore constraint conflicts
END $$;

-- Add descriptor column to shared_nodes if not exists
ALTER TABLE public.shared_nodes ADD COLUMN IF NOT EXISTS descriptor TEXT;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_loops_status_type_scale ON public.loops (status, loop_type, scale);
CREATE INDEX IF NOT EXISTS idx_loop_edges_loop_id ON public.loop_edges (loop_id);
CREATE INDEX IF NOT EXISTS idx_loop_versions_loop_id_version ON public.loop_versions (loop_id, version DESC);

-- Enable RLS on all tables
ALTER TABLE public.loops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loop_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loop_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loop_tags ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for loops
CREATE POLICY "Users can manage their own loops" ON public.loops
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view published loops" ON public.loops
  FOR SELECT USING (status = 'published');

-- RLS Policies for loop_versions
DROP POLICY IF EXISTS "Users can manage their loop versions" ON public.loop_versions;
CREATE POLICY "Users can manage their loop versions" ON public.loop_versions
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM public.loops WHERE id = loop_versions.loop_id
    )
  );

-- RLS Policies for loop_edges
DROP POLICY IF EXISTS "Users can manage their loop edges" ON public.loop_edges;
CREATE POLICY "Users can manage their loop edges" ON public.loop_edges
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM public.loops WHERE id = loop_edges.loop_id
    )
  );

-- RLS Policies for loop_tags
DROP POLICY IF EXISTS "Users can manage their loop tags" ON public.loop_tags;
CREATE POLICY "Users can manage their loop tags" ON public.loop_tags
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM public.loops WHERE id = loop_tags.loop_id
    )
  );

-- Create RPC functions
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
  SELECT * INTO current_loop
  FROM public.loops
  WHERE id = loop_uuid AND user_id = auth.uid();
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Loop not found');
  END IF;
  
  new_version := COALESCE(current_loop.version, 1) + 1;
  
  INSERT INTO public.loop_versions (loop_id, version, payload)
  VALUES (
    loop_uuid,
    new_version,
    jsonb_build_object(
      'name', current_loop.name,
      'loop_type', current_loop.loop_type,
      'scale', current_loop.scale,
      'controller', current_loop.controller,
      'thresholds', current_loop.thresholds,
      'notes', current_loop.notes,
      'version', new_version
    )
  );
  
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
BEGIN
  SELECT * INTO loop_data FROM public.loops WHERE id = loop_uuid;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Loop not found');
  END IF;
  
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
  FROM public.loop_edges le WHERE le.loop_id = loop_uuid;
  
  RETURN jsonb_build_object(
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
END;
$$;