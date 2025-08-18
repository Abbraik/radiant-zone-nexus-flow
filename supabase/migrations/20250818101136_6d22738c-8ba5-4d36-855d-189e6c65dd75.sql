-- Create tables for Deliberative Capacity bundle

-- Options table for intervention option design
CREATE TABLE public.options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL,
  loop_id UUID NOT NULL,
  name TEXT NOT NULL,
  lever TEXT NOT NULL CHECK (lever IN ('N', 'P', 'S')),
  actor TEXT NOT NULL,
  effect JSONB NOT NULL DEFAULT '{}',
  cost NUMERIC DEFAULT 0,
  effort INTEGER DEFAULT 1,
  time_to_impact INTERVAL DEFAULT '30 days',
  risks JSONB DEFAULT '[]',
  assumptions JSONB DEFAULT '[]',
  dependencies JSONB DEFAULT '[]',
  evidence JSONB DEFAULT '[]',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'reviewed', 'approved', 'rejected')),
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Option sets for grouping and decision making
CREATE TABLE public.option_sets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL,
  name TEXT NOT NULL,
  option_ids UUID[] DEFAULT '{}',
  mcda_snapshot JSONB DEFAULT '{}',
  rationale TEXT,
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Option effects for impact tracking
CREATE TABLE public.option_effects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  option_id UUID NOT NULL REFERENCES public.options(id) ON DELETE CASCADE,
  loop_id UUID NOT NULL,
  edge_refs UUID[] DEFAULT '{}',
  indicator TEXT NOT NULL,
  delta_estimate NUMERIC NOT NULL,
  confidence NUMERIC DEFAULT 0.5 CHECK (confidence >= 0 AND confidence <= 1),
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Decision records for audit trail
CREATE TABLE public.decision_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL,
  option_set_id UUID REFERENCES public.option_sets(id) ON DELETE CASCADE,
  rationale TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  created_by UUID NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.option_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.option_effects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decision_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own options" ON public.options
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own option sets" ON public.option_sets
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own option effects" ON public.option_effects
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own decision records" ON public.decision_records
  FOR ALL USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_options_task_id ON public.options(task_id);
CREATE INDEX idx_options_loop_id ON public.options(loop_id);
CREATE INDEX idx_option_sets_task_id ON public.option_sets(task_id);
CREATE INDEX idx_option_effects_option_id ON public.option_effects(option_id);
CREATE INDEX idx_option_effects_loop_id ON public.option_effects(loop_id);
CREATE INDEX idx_decision_records_task_id ON public.decision_records(task_id);

-- Add updated_at triggers
CREATE TRIGGER update_options_updated_at
  BEFORE UPDATE ON public.options
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_option_sets_updated_at
  BEFORE UPDATE ON public.option_sets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();