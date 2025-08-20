-- Reflexive capacity tables for controller tuning, band weights, and evaluations

-- Controller tunings table
CREATE TABLE IF NOT EXISTS controller_tunings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loop_code TEXT NOT NULL,
  indicator TEXT NOT NULL,
  before JSONB NOT NULL,
  after JSONB NOT NULL,
  rationale TEXT NOT NULL,
  rmse_delta NUMERIC,
  oscillation_delta NUMERIC,
  effective_from TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE controller_tunings ENABLE ROW LEVEL SECURITY;

-- RLS policies for controller_tunings
CREATE POLICY "Users can manage their own controller tunings" 
ON controller_tunings 
FOR ALL 
USING (auth.uid() = user_id);

-- Band weight changes table
CREATE TABLE IF NOT EXISTS band_weight_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loop_code TEXT NOT NULL,
  tier TEXT NOT NULL,
  anchor TEXT NOT NULL,
  before JSONB NOT NULL,
  after JSONB NOT NULL,
  rationale TEXT NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE band_weight_changes ENABLE ROW LEVEL SECURITY;

-- RLS policies for band_weight_changes
CREATE POLICY "Users can manage their own band weight changes" 
ON band_weight_changes 
FOR ALL 
USING (auth.uid() = user_id);

-- Evaluations table
CREATE TABLE IF NOT EXISTS evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loop_code TEXT NOT NULL,
  method TEXT NOT NULL,
  indicators JSONB NOT NULL,
  start_at TIMESTAMPTZ NOT NULL,
  review_at TIMESTAMPTZ NOT NULL,
  notes TEXT,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- RLS policies for evaluations
CREATE POLICY "Users can manage their own evaluations" 
ON evaluations 
FOR ALL 
USING (auth.uid() = user_id);

-- Experiments table
CREATE TABLE IF NOT EXISTS experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loop_code TEXT NOT NULL,
  name TEXT NOT NULL,
  hypothesis TEXT NOT NULL,
  arms JSONB NOT NULL,
  metrics JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;

-- RLS policies for experiments
CREATE POLICY "Users can manage their own experiments" 
ON experiments 
FOR ALL 
USING (auth.uid() = user_id);