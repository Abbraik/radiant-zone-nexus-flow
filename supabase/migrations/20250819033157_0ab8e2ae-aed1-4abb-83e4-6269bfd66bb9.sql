-- Create Workspace 5C isolated data model with capacity-based design

-- Create custom types for 5C
CREATE TYPE public.capacity_5c AS ENUM ('responsive', 'reflexive', 'deliberative', 'anticipatory', 'structural');
CREATE TYPE public.loop_type_5c AS ENUM ('reactive', 'structural', 'perceptual');
CREATE TYPE public.scale_5c AS ENUM ('micro', 'meso', 'macro');
CREATE TYPE public.leverage_5c AS ENUM ('N', 'P', 'S');
CREATE TYPE public.mandate_status_5c AS ENUM ('allowed', 'warning_required', 'blocked');
CREATE TYPE public.claim_status_5c AS ENUM ('draft', 'active', 'paused', 'done', 'blocked');

-- Main tasks table for 5C workspace
CREATE TABLE public.tasks_5c (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    capacity capacity_5c NOT NULL,
    loop_id UUID NOT NULL,
    type loop_type_5c NOT NULL DEFAULT 'reactive',
    scale scale_5c NOT NULL DEFAULT 'micro',
    leverage leverage_5c NOT NULL DEFAULT 'N',
    tri JSONB DEFAULT '{}',
    de_band_id UUID,
    srt_id UUID,
    assigned_to UUID,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'claimed', 'active', 'done', 'blocked')),
    title TEXT NOT NULL,
    description TEXT,
    payload JSONB DEFAULT '{}',
    user_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Claims for 5C workspace
CREATE TABLE public.claims_5c (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.tasks_5c(id) ON DELETE CASCADE,
    loop_id UUID NOT NULL,
    assignee UUID NOT NULL,
    raci JSONB DEFAULT '{}',
    leverage leverage_5c NOT NULL DEFAULT 'N',
    mandate_status mandate_status_5c DEFAULT 'allowed',
    evidence JSONB DEFAULT '{}',
    sprint_id UUID,
    status claim_status_5c DEFAULT 'draft',
    started_at TIMESTAMPTZ,
    finished_at TIMESTAMPTZ,
    paused_at TIMESTAMPTZ,
    pause_reason TEXT,
    last_checkpoint_at TIMESTAMPTZ,
    user_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- TRI events for 5C
CREATE TABLE public.tri_events_5c (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loop_id UUID NOT NULL,
    task_id UUID REFERENCES public.tasks_5c(id),
    t_value NUMERIC NOT NULL DEFAULT 0.5,
    r_value NUMERIC NOT NULL DEFAULT 0.5,
    i_value NUMERIC NOT NULL DEFAULT 0.5,
    tag TEXT DEFAULT 'manual',
    user_id UUID NOT NULL,
    at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Band crossings for 5C
CREATE TABLE public.band_crossings_5c (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loop_id UUID NOT NULL,
    direction TEXT NOT NULL CHECK (direction IN ('up', 'down')),
    value NUMERIC NOT NULL,
    user_id UUID NOT NULL,
    at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- DE bands for 5C
CREATE TABLE public.de_bands_5c (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loop_id UUID NOT NULL,
    indicator TEXT NOT NULL DEFAULT 'primary',
    lower_bound NUMERIC,
    upper_bound NUMERIC,
    asymmetry NUMERIC DEFAULT 0,
    smoothing_alpha NUMERIC DEFAULT 0.3,
    notes TEXT,
    user_id UUID NOT NULL,
    updated_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- SRT windows for 5C
CREATE TABLE public.srt_windows_5c (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loop_id UUID NOT NULL,
    window_start TIMESTAMPTZ NOT NULL,
    window_end TIMESTAMPTZ NOT NULL,
    reflex_horizon INTERVAL DEFAULT '1 hour',
    cadence INTERVAL DEFAULT '1 day',
    user_id UUID NOT NULL,
    updated_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Loop scorecards for 5C
CREATE TABLE public.loop_scorecards_5c (
    loop_id UUID PRIMARY KEY,
    last_tri JSONB DEFAULT '{}',
    de_state TEXT DEFAULT 'stable',
    claim_velocity NUMERIC DEFAULT 0,
    fatigue INTEGER DEFAULT 0,
    breach_days INTEGER DEFAULT 0,
    tri_slope NUMERIC DEFAULT 0,
    heartbeat_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Reflex memory for 5C
CREATE TABLE public.reflex_memory_5c (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loop_id UUID NOT NULL,
    actor UUID NOT NULL,
    kind TEXT NOT NULL,
    before JSONB DEFAULT '{}',
    after JSONB DEFAULT '{}',
    rationale TEXT NOT NULL,
    attachments JSONB DEFAULT '[]',
    user_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Mandate rules for 5C
CREATE TABLE public.mandate_rules_5c (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor TEXT NOT NULL,
    allowed_levers TEXT[] DEFAULT ARRAY['N'],
    restrictions JSONB DEFAULT '{}',
    notes TEXT,
    org_id UUID,
    user_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all 5C tables
ALTER TABLE public.tasks_5c ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims_5c ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tri_events_5c ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.band_crossings_5c ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.de_bands_5c ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.srt_windows_5c ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loop_scorecards_5c ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reflex_memory_5c ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mandate_rules_5c ENABLE ROW LEVEL SECURITY;

-- RLS Policies for 5C tables
CREATE POLICY "Users can manage their own 5C tasks" ON public.tasks_5c
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own 5C claims" ON public.claims_5c
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own 5C TRI events" ON public.tri_events_5c
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own 5C band crossings" ON public.band_crossings_5c
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own 5C DE bands" ON public.de_bands_5c
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own 5C SRT windows" ON public.srt_windows_5c
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own 5C scorecards" ON public.loop_scorecards_5c
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own 5C reflex memory" ON public.reflex_memory_5c
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own 5C mandate rules" ON public.mandate_rules_5c
    FOR ALL USING (auth.uid() = user_id);

-- Create storage buckets for 5C
INSERT INTO storage.buckets (id, name, public) VALUES ('5c-evidence', '5c-evidence', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('5c-attachments', '5c-attachments', false);

-- Storage policies for 5C
CREATE POLICY "Users can manage their own 5C evidence" ON storage.objects
    FOR ALL USING (bucket_id = '5c-evidence' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can manage their own 5C attachments" ON storage.objects
    FOR ALL USING (bucket_id = '5c-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_5c() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tasks_5c_updated_at BEFORE UPDATE ON public.tasks_5c
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_5c();

CREATE TRIGGER update_claims_5c_updated_at BEFORE UPDATE ON public.claims_5c
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_5c();

CREATE TRIGGER update_de_bands_5c_updated_at BEFORE UPDATE ON public.de_bands_5c
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_5c();

CREATE TRIGGER update_srt_windows_5c_updated_at BEFORE UPDATE ON public.srt_windows_5c
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_5c();

CREATE TRIGGER update_loop_scorecards_5c_updated_at BEFORE UPDATE ON public.loop_scorecards_5c
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_5c();

CREATE TRIGGER update_mandate_rules_5c_updated_at BEFORE UPDATE ON public.mandate_rules_5c
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_5c();