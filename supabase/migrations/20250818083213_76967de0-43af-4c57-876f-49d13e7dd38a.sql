-- Fix RLS security issues for new tables

-- Enable RLS on all new tables
ALTER TABLE public.shared_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loop_shared_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.de_bands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.srt_windows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tri_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.band_crossings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mandate_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loop_scorecards ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user-owned data
CREATE POLICY "Users can manage their own shared nodes" ON public.shared_nodes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their loop shared nodes" ON public.loop_shared_nodes FOR ALL USING (auth.uid() IN (SELECT user_id FROM loops WHERE id = loop_id));
CREATE POLICY "Users can manage their own de bands" ON public.de_bands FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own srt windows" ON public.srt_windows FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own tri events" ON public.tri_events FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own band crossings" ON public.band_crossings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own claims" ON public.claims FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own interventions" ON public.interventions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own mandate rules" ON public.mandate_rules FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own loop scorecards" ON public.loop_scorecards FOR ALL USING (auth.uid() = user_id);

-- Create RPC functions with proper security
CREATE OR REPLACE FUNCTION public.get_task_by_id(task_uuid UUID)
RETURNS SETOF tasks
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.tasks WHERE id = task_uuid AND (auth.uid() = user_id OR auth.uid() = assigned_to);
$$;

CREATE OR REPLACE FUNCTION public.upsert_loop_scorecard(loop_uuid UUID, payload JSONB)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.loop_scorecards (loop_id, last_tri, user_id, updated_at)
  VALUES (loop_uuid, payload, auth.uid(), now())
  ON CONFLICT (loop_id) 
  DO UPDATE SET 
    last_tri = payload,
    updated_at = now()
  WHERE loop_scorecards.user_id = auth.uid();
END;
$$;

CREATE OR REPLACE FUNCTION public.evaluate_mandate(actor_name TEXT, leverage_level TEXT)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    CASE 
      WHEN leverage_level = ANY(allowed_levers) THEN 'allowed'::TEXT
      ELSE 'restricted'::TEXT
    END
  FROM public.mandate_rules 
  WHERE actor = actor_name AND user_id = auth.uid()
  LIMIT 1;
$$;

-- Create triggers for updated_at where missing
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_shared_nodes_updated_at') THEN
        CREATE TRIGGER update_shared_nodes_updated_at BEFORE UPDATE ON public.shared_nodes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_de_bands_updated_at') THEN
        CREATE TRIGGER update_de_bands_updated_at BEFORE UPDATE ON public.de_bands FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_srt_windows_updated_at') THEN
        CREATE TRIGGER update_srt_windows_updated_at BEFORE UPDATE ON public.srt_windows FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_claims_updated_at') THEN
        CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON public.claims FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_interventions_updated_at') THEN
        CREATE TRIGGER update_interventions_updated_at BEFORE UPDATE ON public.interventions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_mandate_rules_updated_at') THEN
        CREATE TRIGGER update_mandate_rules_updated_at BEFORE UPDATE ON public.mandate_rules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;