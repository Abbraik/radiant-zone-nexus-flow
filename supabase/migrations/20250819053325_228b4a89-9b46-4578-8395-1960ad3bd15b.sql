-- PAGS Loop Registry RPC Functions

-- Function to publish a loop
CREATE OR REPLACE FUNCTION publish_loop(loop_uuid UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  loop_record RECORD;
  new_version INTEGER;
  payload JSONB;
BEGIN
  -- Get loop and verify ownership
  SELECT * INTO loop_record
  FROM loops
  WHERE id = loop_uuid AND user_id = auth.uid();
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Loop not found or access denied');
  END IF;
  
  -- Create version payload
  SELECT jsonb_build_object(
    'loop', row_to_json(loop_record),
    'nodes', COALESCE(nodes_data, '[]'),
    'edges', COALESCE(edges_data, '[]')
  ) INTO payload
  FROM (
    SELECT jsonb_agg(row_to_json(n)) as nodes_data
    FROM loop_nodes n WHERE n.loop_id = loop_uuid
  ) nodes
  CROSS JOIN (
    SELECT jsonb_agg(row_to_json(e)) as edges_data  
    FROM loop_edges e WHERE e.loop_id = loop_uuid
  ) edges;
  
  -- Get next version number
  SELECT COALESCE(MAX(version), 0) + 1 INTO new_version
  FROM loop_versions WHERE loop_id = loop_uuid;
  
  -- Create version record
  INSERT INTO loop_versions (loop_id, version, payload)
  VALUES (loop_uuid, new_version, payload);
  
  -- Update loop status
  UPDATE loops 
  SET status = 'published', updated_at = now()
  WHERE id = loop_uuid;
  
  RETURN jsonb_build_object(
    'success', true,
    'version', new_version,
    'status', 'published'
  );
END;
$$;

-- Function to get loop hydration data
CREATE OR REPLACE FUNCTION get_loop_hydrate(loop_uuid UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
    JOIN loop_shared_nodes lsn ON sn.id = lsn.snl_id
    WHERE lsn.loop_id = loop_uuid
  ) snl;
  
  RETURN result;
END;
$$;

-- Function to search loops
CREATE OR REPLACE FUNCTION search_loops(
  search_query TEXT DEFAULT '',
  filters JSONB DEFAULT '{}'::jsonb,
  limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  synopsis TEXT,
  loop_type TEXT,
  motif TEXT,
  layer TEXT,
  default_leverage TEXT,
  tags TEXT[],
  status TEXT,
  node_count BIGINT,
  edge_count BIGINT,
  updated_at TIMESTAMPTZ
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
    l.synopsis,
    l.loop_type,
    l.motif,
    l.layer,
    l.default_leverage,
    l.tags,
    l.status,
    (SELECT count(*) FROM loop_nodes WHERE loop_id = l.id) as node_count,
    (SELECT count(*) FROM loop_edges WHERE loop_id = l.id) as edge_count,
    l.updated_at
  FROM loops l
  WHERE 
    -- User can see their own or published loops
    (l.user_id = auth.uid() OR l.status = 'published')
    -- Search in name and synopsis
    AND (search_query = '' OR l.name ILIKE '%' || search_query || '%' OR l.synopsis ILIKE '%' || search_query || '%')
    -- Filter by loop_type if specified
    AND (NOT filters ? 'loop_type' OR l.loop_type = ANY(ARRAY(SELECT jsonb_array_elements_text(filters->'loop_type'))))
    -- Filter by motif if specified  
    AND (NOT filters ? 'motif' OR l.motif = ANY(ARRAY(SELECT jsonb_array_elements_text(filters->'motif'))))
    -- Filter by layer if specified
    AND (NOT filters ? 'layer' OR l.layer = ANY(ARRAY(SELECT jsonb_array_elements_text(filters->'layer'))))
    -- Filter by status if specified
    AND (NOT filters ? 'status' OR l.status = ANY(ARRAY(SELECT jsonb_array_elements_text(filters->'status'))))
  ORDER BY l.updated_at DESC
  LIMIT limit_count;
END;
$$;

-- Function to create a new loop
CREATE OR REPLACE FUNCTION create_loop(
  loop_name TEXT,
  loop_synopsis TEXT DEFAULT '',
  loop_type TEXT DEFAULT 'reactive',
  motif TEXT DEFAULT 'B',
  layer TEXT DEFAULT 'micro'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_loop_id UUID;
BEGIN
  INSERT INTO loops (name, synopsis, loop_type, motif, layer, user_id)
  VALUES (loop_name, loop_synopsis, loop_type, motif, layer, auth.uid())
  RETURNING id INTO new_loop_id;
  
  RETURN new_loop_id;
END;
$$;