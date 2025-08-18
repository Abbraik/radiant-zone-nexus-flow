-- Phase 1: Database Schema Migration for Capacity-Mode Architecture

-- Create enum types for the new capacity system
CREATE TYPE public.capacity_type AS ENUM ('responsive', 'reflexive', 'deliberative', 'anticipatory', 'structural');
CREATE TYPE public.loop_type AS ENUM ('reactive', 'structural', 'perceptual');
CREATE TYPE public.scale_type AS ENUM ('micro', 'meso', 'macro');
CREATE TYPE public.leverage_type AS ENUM ('N', 'P', 'S');
CREATE TYPE public.task_status AS ENUM ('open', 'claimed', 'active', 'done', 'blocked');
CREATE TYPE public.claim_status AS ENUM ('draft', 'pending', 'approved', 'rejected', 'implemented');
CREATE TYPE public.mandate_status AS ENUM ('allowed', 'restricted', 'forbidden');

-- Create loops table
CREATE TABLE public.loops (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    loop_type loop_type NOT NULL DEFAULT 'reactive',
    scale scale_type NOT NULL DEFAULT 'micro',
    leverage_default leverage_type NOT NULL DEFAULT 'N',
    metadata JSONB DEFAULT '{}'::jsonb,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create shared_nodes table
CREATE TABLE public.shared_nodes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    label TEXT NOT NULL,
    domain TEXT,
    description TEXT,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create loop_shared_nodes junction table
CREATE TABLE public.loop_shared_nodes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    loop_id UUID NOT NULL,
    node_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(loop_id, node_id)
);

-- Create de_bands table
CREATE TABLE public.de_bands (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    loop_id UUID NOT NULL,
    indicator TEXT NOT NULL,
    lower_bound NUMERIC,
    upper_bound NUMERIC,
    asymmetry NUMERIC DEFAULT 0,
    notes TEXT,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create srt_windows table
CREATE TABLE public.srt_windows (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    loop_id UUID NOT NULL,
    window_start TIMESTAMP WITH TIME ZONE NOT NULL,
    window_end TIMESTAMP WITH TIME ZONE NOT NULL,
    reflex_horizon INTERVAL DEFAULT '1 hour',
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tri_events table
CREATE TABLE public.tri_events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    loop_id UUID NOT NULL,
    task_id UUID,
    t_value NUMERIC NOT NULL DEFAULT 0,
    r_value NUMERIC NOT NULL DEFAULT 0,
    i_value NUMERIC NOT NULL DEFAULT 0,
    at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create band_crossings table
CREATE TABLE public.band_crossings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    loop_id UUID NOT NULL,
    direction TEXT NOT NULL, -- 'upper', 'lower', 'return'
    value NUMERIC NOT NULL,
    at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create claims table
CREATE TABLE public.claims (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID NOT NULL,
    loop_id UUID NOT NULL,
    assignee UUID NOT NULL,
    raci JSONB DEFAULT '{}'::jsonb,
    leverage leverage_type NOT NULL DEFAULT 'N',
    mandate_status mandate_status DEFAULT 'allowed',
    evidence JSONB DEFAULT '{}'::jsonb,
    sprint_id UUID,
    status claim_status DEFAULT 'draft',
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create interventions table
CREATE TABLE public.interventions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    claim_id UUID NOT NULL,
    label TEXT NOT NULL,
    description TEXT,
    effort INTEGER DEFAULT 1,
    impact INTEGER DEFAULT 1,
    ordering INTEGER DEFAULT 0,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mandate_rules table
CREATE TABLE public.mandate_rules (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    actor TEXT NOT NULL,
    allowed_levers TEXT[] DEFAULT ARRAY[]::TEXT[],
    restrictions JSONB DEFAULT '{}'::jsonb,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create loop_scorecards table
CREATE TABLE public.loop_scorecards (
    loop_id UUID NOT NULL PRIMARY KEY,
    last_tri JSONB DEFAULT '{}'::jsonb,
    de_state TEXT DEFAULT 'stable',
    claim_velocity NUMERIC DEFAULT 0,
    fatigue INTEGER DEFAULT 0,
    user_id UUID NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update existing tasks table with new capacity fields
ALTER TABLE public.tasks 
ADD COLUMN capacity capacity_type,
ADD COLUMN loop_id UUID,
ADD COLUMN type loop_type,
ADD COLUMN scale scale_type,
ADD COLUMN leverage leverage_type,
ADD COLUMN tri JSONB DEFAULT '{}'::jsonb,
ADD COLUMN de_band_id UUID,
ADD COLUMN srt_id UUID;

-- Update task status to use new enum (convert existing values)
ALTER TABLE public.tasks 
ALTER COLUMN status TYPE task_status USING 
  CASE 
    WHEN status = 'todo' THEN 'open'::task_status
    WHEN status = 'in_progress' THEN 'active'::task_status
    WHEN status = 'completed' THEN 'done'::task_status
    ELSE 'open'::task_status
  END;

-- Enable RLS on all new tables
ALTER TABLE public.loops ENABLE ROW LEVEL SECURITY;
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
CREATE POLICY "Users can manage their own loops" ON public.loops FOR ALL USING (auth.uid() = user_id);
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

-- Create RPC functions
CREATE OR REPLACE FUNCTION public.get_task_by_id(task_uuid UUID)
RETURNS SETOF tasks
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT * FROM public.tasks WHERE id = task_uuid AND (auth.uid() = user_id OR auth.uid() = assigned_to);
$$;

CREATE OR REPLACE FUNCTION public.upsert_loop_scorecard(loop_uuid UUID, payload JSONB)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create triggers for updated_at
CREATE TRIGGER update_loops_updated_at BEFORE UPDATE ON public.loops FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_shared_nodes_updated_at BEFORE UPDATE ON public.shared_nodes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_de_bands_updated_at BEFORE UPDATE ON public.de_bands FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_srt_windows_updated_at BEFORE UPDATE ON public.srt_windows FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON public.claims FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_interventions_updated_at BEFORE UPDATE ON public.interventions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mandate_rules_updated_at BEFORE UPDATE ON public.mandate_rules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();