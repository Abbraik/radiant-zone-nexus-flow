-- Create anticipatory capacity tables
CREATE TABLE public.scenarios (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id uuid NOT NULL,
  loop_id uuid NOT NULL,
  name text NOT NULL,
  params jsonb NOT NULL DEFAULT '{}',
  pinned boolean DEFAULT false,
  charts jsonb DEFAULT '{}',
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.stress_tests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  loop_id uuid NOT NULL,
  scenario_id uuid,
  name text NOT NULL,
  severity integer DEFAULT 1 CHECK (severity >= 1 AND severity <= 5),
  expected_impact jsonb DEFAULT '{}',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  result jsonb DEFAULT '{}',
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.watchpoints (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  loop_id uuid NOT NULL,
  indicator text NOT NULL,
  direction text NOT NULL CHECK (direction IN ('up', 'down', 'band')),
  threshold_value numeric,
  threshold_band jsonb,
  owner uuid NOT NULL,
  playbook_id uuid,
  armed boolean DEFAULT true,
  last_eval timestamp with time zone,
  last_result jsonb DEFAULT '{}',
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.playbooks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  loop_id uuid NOT NULL,
  title text NOT NULL,
  lever_order text[] DEFAULT ARRAY['N', 'P', 'S'],
  steps jsonb NOT NULL DEFAULT '[]',
  guards jsonb DEFAULT '{}',
  success_criteria jsonb DEFAULT '{}',
  auto_action boolean DEFAULT false,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.signal_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  watchpoint_id uuid NOT NULL,
  loop_id uuid NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('trip', 'clear', 'test')),
  indicator_value numeric NOT NULL,
  threshold_crossed numeric,
  severity text DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  auto_action_taken boolean DEFAULT false,
  playbook_executed jsonb DEFAULT '{}',
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stress_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signal_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own scenarios" ON public.scenarios
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own stress tests" ON public.stress_tests
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own watchpoints" ON public.watchpoints
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own playbooks" ON public.playbooks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own signal events" ON public.signal_events
  FOR ALL USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_scenarios_task_id ON public.scenarios(task_id);
CREATE INDEX idx_scenarios_loop_id ON public.scenarios(loop_id);
CREATE INDEX idx_stress_tests_loop_id ON public.stress_tests(loop_id);
CREATE INDEX idx_stress_tests_status ON public.stress_tests(status);
CREATE INDEX idx_watchpoints_loop_id ON public.watchpoints(loop_id);
CREATE INDEX idx_watchpoints_armed ON public.watchpoints(armed);
CREATE INDEX idx_playbooks_loop_id ON public.playbooks(loop_id);
CREATE INDEX idx_signal_events_watchpoint_id ON public.signal_events(watchpoint_id);
CREATE INDEX idx_signal_events_created_at ON public.signal_events(created_at);

-- Updated_at triggers
CREATE TRIGGER update_scenarios_updated_at
  BEFORE UPDATE ON public.scenarios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stress_tests_updated_at
  BEFORE UPDATE ON public.stress_tests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_watchpoints_updated_at
  BEFORE UPDATE ON public.watchpoints
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_playbooks_updated_at
  BEFORE UPDATE ON public.playbooks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();