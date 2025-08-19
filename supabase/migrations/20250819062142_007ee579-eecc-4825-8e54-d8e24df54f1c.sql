-- Create missing RPC functions for loop registry seeding

-- Function to upsert shared nodes (SNL)
CREATE OR REPLACE FUNCTION public.upsert_snl(
  label text,
  domain text,
  descriptor text,
  meta jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  snl_id uuid;
BEGIN
  -- Insert or update shared node
  INSERT INTO public.shared_nodes (label, domain, descriptor, meta)
  VALUES (label, domain, descriptor, meta)
  ON CONFLICT (label, domain) 
  DO UPDATE SET 
    descriptor = EXCLUDED.descriptor,
    meta = EXCLUDED.meta,
    updated_at = now()
  RETURNING id INTO snl_id;
  
  RETURN snl_id;
END;
$$;

-- Function to import a loop from JSON payload
CREATE OR REPLACE FUNCTION public.import_loop(
  payload jsonb,
  as_draft boolean DEFAULT true
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  loop_id uuid;
  loop_data jsonb;
  node_data jsonb;
  edge_data jsonb;
  indicator_data jsonb;
  snl_link jsonb;
  snl_id uuid;
BEGIN
  -- Extract loop data
  loop_data := payload->'loop';
  
  -- Create the loop
  INSERT INTO public.loops (
    name,
    loop_type,
    motif,
    layer,
    scale,
    leverage_default,
    status,
    user_id,
    notes,
    metadata
  ) VALUES (
    loop_data->>'name',
    (loop_data->>'loop_type')::loop_type,
    loop_data->>'motif',
    loop_data->>'layer',
    (loop_data->>'layer')::scale_type, -- Use layer as scale for now
    (loop_data->>'default_leverage')::leverage_type,
    CASE WHEN as_draft THEN 'draft' ELSE 'published' END,
    auth.uid(),
    payload->'meta'->>'notes',
    jsonb_build_object('tags', COALESCE(loop_data->'tags', '[]'::jsonb))
  ) RETURNING id INTO loop_id;
  
  -- Create nodes
  FOR node_data IN SELECT * FROM jsonb_array_elements(loop_data->'nodes')
  LOOP
    INSERT INTO public.loop_nodes (
      id,
      loop_id,
      label,
      kind,
      meta
    ) VALUES (
      (node_data->>'id')::uuid,
      loop_id,
      node_data->>'label',
      node_data->>'kind',
      COALESCE(node_data->'meta', '{}'::jsonb)
    );
  END LOOP;
  
  -- Create edges
  FOR edge_data IN SELECT * FROM jsonb_array_elements(loop_data->'edges')
  LOOP
    INSERT INTO public.loop_edges (
      loop_id,
      from_node,
      to_node,
      polarity,
      delay_ms,
      weight,
      note
    ) VALUES (
      loop_id,
      (edge_data->>'from')::uuid,
      (edge_data->>'to')::uuid,
      (edge_data->>'polarity')::integer,
      COALESCE((edge_data->>'delay_ms')::integer, 0),
      COALESCE((edge_data->>'weight')::numeric, 1.0),
      COALESCE(edge_data->>'note', '')
    );
  END LOOP;
  
  -- Create indicators and DE bands
  FOR indicator_data IN SELECT * FROM jsonb_array_elements(loop_data->'indicators')
  LOOP
    -- Insert indicator
    INSERT INTO public.indicators (
      user_id,
      name,
      type,
      unit,
      target_value,
      lower_bound,
      upper_bound
    ) VALUES (
      auth.uid(),
      indicator_data->>'name',
      indicator_data->>'kind',
      indicator_data->>'unit',
      COALESCE((indicator_data->'de_band'->>'upper')::numeric, 100),
      COALESCE((indicator_data->'de_band'->>'lower')::numeric, 0),
      COALESCE((indicator_data->'de_band'->>'upper')::numeric, 100)
    );
    
    -- Insert DE band
    INSERT INTO public.de_bands (
      loop_id,
      indicator,
      lower_bound,
      upper_bound,
      asymmetry,
      user_id
    ) VALUES (
      loop_id,
      indicator_data->>'name',
      COALESCE((indicator_data->'de_band'->>'lower')::numeric, 0),
      COALESCE((indicator_data->'de_band'->>'upper')::numeric, 100),
      COALESCE((indicator_data->'de_band'->>'asymmetry')::numeric, 0),
      auth.uid()
    );
  END LOOP;
  
  -- Create SRT window
  IF loop_data->'srt' IS NOT NULL THEN
    INSERT INTO public.srt_windows (
      loop_id,
      window_start,
      window_end,
      reflex_horizon,
      cadence,
      user_id
    ) VALUES (
      loop_id,
      COALESCE((loop_data->'srt'->>'window_start')::timestamptz, now()),
      COALESCE((loop_data->'srt'->>'window_end')::timestamptz, now() + interval '1 year'),
      COALESCE((loop_data->'srt'->>'reflex_horizon')::interval, '30 days'::interval),
      COALESCE((loop_data->'srt'->>'cadence')::interval, '1 week'::interval),
      auth.uid()
    );
  END IF;
  
  -- Link to shared nodes
  FOR snl_link IN SELECT * FROM jsonb_array_elements(loop_data->'snl_links')
  LOOP
    -- Find or create the shared node
    SELECT id INTO snl_id 
    FROM public.shared_nodes 
    WHERE label = snl_link->>'label' AND domain = snl_link->>'domain';
    
    IF snl_id IS NOT NULL THEN
      -- Link the loop to the shared node
      INSERT INTO public.loop_shared_nodes (loop_id, node_id)
      VALUES (loop_id, snl_id)
      ON CONFLICT DO NOTHING;
    END IF;
  END LOOP;
  
  RETURN loop_id;
END;
$$;

-- Add missing shared_nodes table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.shared_nodes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label text NOT NULL,
  domain text NOT NULL,
  descriptor text,
  meta jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(label, domain)
);

-- Enable RLS on shared_nodes
ALTER TABLE public.shared_nodes ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for shared_nodes
CREATE POLICY "Shared nodes are viewable by everyone" 
ON public.shared_nodes FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage shared nodes" 
ON public.shared_nodes FOR ALL 
USING (auth.uid() IS NOT NULL);