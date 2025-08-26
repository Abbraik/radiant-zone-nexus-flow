-- Create the updated get_loop_hydrate functions with proper security
CREATE OR REPLACE FUNCTION public.get_loop_hydrate(p_loop_uuid uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
SET search_path = public
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