-- Fix get_loop_hydrate function - correct column references
CREATE OR REPLACE FUNCTION public.get_loop_hydrate(loop_uuid uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  loop_data RECORD;
  result JSONB;
BEGIN
  -- Get loop basic info
  SELECT * INTO loop_data 
  FROM loops 
  WHERE id = loop_uuid 
  AND (user_id = auth.uid() OR status = 'published');
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Loop not found or access denied');
  END IF;
  
  -- Build comprehensive result
  SELECT jsonb_build_object(
    'loop', row_to_json(loop_data),
    'nodes', COALESCE(nodes_data, '[]'),
    'edges', COALESCE(edges_data, '[]'),
    'shared_nodes', COALESCE(snl_data, '[]')
  ) INTO result
  FROM (
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', n.id,
        'label', n.label,
        'kind', n.kind,
        'meta', n.meta
      )
    ) as nodes_data
    FROM loop_nodes n WHERE n.loop_id = loop_uuid
  ) nodes
  CROSS JOIN (
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', e.id,
        'from_node', e.from_node,
        'to_node', e.to_node,
        'polarity', e.polarity,
        'delay_ms', e.delay_ms,
        'weight', e.weight,
        'note', e.note
      )
    ) as edges_data
    FROM loop_edges e WHERE e.loop_id = loop_uuid
  ) edges
  CROSS JOIN (
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', sn.id,
        'label', sn.label,
        'domain', sn.domain,
        'descriptor', sn.descriptor
      )
    ) as snl_data
    FROM shared_nodes sn
    JOIN loop_shared_nodes lsn ON sn.id = lsn.node_id
    WHERE lsn.loop_id = loop_uuid
  ) snl;
  
  RETURN result;
END;
$function$;

-- Create missing tables if they don't exist
CREATE TABLE IF NOT EXISTS public.shared_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text UNIQUE NOT NULL,
  domain text NOT NULL,
  descriptor text,
  meta jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on shared_nodes
ALTER TABLE public.shared_nodes ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for shared_nodes (public read, authenticated write)
DROP POLICY IF EXISTS "Public can view shared nodes" ON public.shared_nodes;
CREATE POLICY "Public can view shared nodes" ON public.shared_nodes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage shared nodes" ON public.shared_nodes;
CREATE POLICY "Authenticated users can manage shared nodes" ON public.shared_nodes
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Ensure srt_windows table exists with correct structure
CREATE TABLE IF NOT EXISTS public.srt_windows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loop_id uuid NOT NULL,
  window_start timestamptz NOT NULL,
  window_end timestamptz NOT NULL,
  reflex_horizon interval NOT NULL,
  cadence text NOT NULL,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  updated_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on srt_windows
ALTER TABLE public.srt_windows ENABLE ROW LEVEL SECURITY;

-- RLS policy for srt_windows
DROP POLICY IF EXISTS "Users can manage their own SRT windows" ON public.srt_windows;
CREATE POLICY "Users can manage their own SRT windows" ON public.srt_windows
  FOR ALL USING (auth.uid() = user_id);

-- Update triggers
DROP TRIGGER IF EXISTS update_srt_windows_updated_at ON public.srt_windows;
CREATE TRIGGER update_srt_windows_updated_at
  BEFORE UPDATE ON public.srt_windows
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();