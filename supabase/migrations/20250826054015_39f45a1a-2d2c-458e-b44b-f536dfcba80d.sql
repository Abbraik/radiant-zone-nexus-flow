-- Anticipatory Runtime Schema
-- Risk channels define domains of concern
CREATE TABLE risk_channels (
  channel_key text PRIMARY KEY,
  title text NOT NULL,
  description text,
  default_window text DEFAULT '14d',
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Watchpoints are observation points for triggers
CREATE TABLE watchpoints (
  watch_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_key text NOT NULL REFERENCES risk_channels(channel_key),
  loop_id uuid REFERENCES loops(id),
  indicator_key text,
  region text,
  cohort text,
  notes text,
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Trigger templates (versioned DSL definitions)
CREATE TABLE trigger_templates (
  template_key text NOT NULL,
  version integer NOT NULL,
  channel_key text NOT NULL REFERENCES risk_channels(channel_key),
  title text NOT NULL,
  dsl text NOT NULL,
  defaults jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (template_key, version)
);

-- Compiled triggers bound to watchpoints
CREATE TABLE triggers (
  trigger_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  watch_id uuid NOT NULL REFERENCES watchpoints(watch_id),
  template_key text NOT NULL,
  template_version integer NOT NULL,
  dsl text NOT NULL,
  ast jsonb NOT NULL,
  compiled jsonb NOT NULL,
  params jsonb DEFAULT '{}',
  enabled boolean DEFAULT true,
  cooldown_seconds integer DEFAULT 86400,
  hysteresis numeric DEFAULT 0.1,
  valid_from timestamptz DEFAULT now(),
  valid_to timestamptz,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  FOREIGN KEY (template_key, template_version) REFERENCES trigger_templates(template_key, version)
);

-- Trigger firing events
CREATE TABLE trigger_firings (
  firing_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger_id uuid NOT NULL REFERENCES triggers(trigger_id),
  fired_at timestamptz NOT NULL DEFAULT now(),
  window_label text NOT NULL,
  summary jsonb NOT NULL,
  dedupe_fp text UNIQUE NOT NULL,
  task_id uuid,
  created_task jsonb,
  created_at timestamptz DEFAULT now()
);

-- Scenario definitions for stress testing
CREATE TABLE scenarios (
  scenario_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  channel_key text NOT NULL REFERENCES risk_channels(channel_key),
  inputs jsonb NOT NULL DEFAULT '{}',
  horizon text DEFAULT 'P30D',
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Scenario execution runs
CREATE TABLE scenario_runs (
  run_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id uuid NOT NULL REFERENCES scenarios(scenario_id),
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  status text CHECK (status IN ('running', 'ok', 'warn', 'fail')) DEFAULT 'running',
  results jsonb DEFAULT '{}',
  artifacts jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Historical backtests
CREATE TABLE backtests (
  backtest_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  channel_key text NOT NULL REFERENCES risk_channels(channel_key),
  from_ts timestamptz NOT NULL,
  to_ts timestamptz NOT NULL,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Backtest execution runs
CREATE TABLE backtest_runs (
  run_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  backtest_id uuid NOT NULL REFERENCES backtests(backtest_id),
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  status text CHECK (status IN ('running', 'completed', 'failed')) DEFAULT 'running',
  metrics jsonb DEFAULT '{}',
  confusion_matrix jsonb DEFAULT '{}',
  results jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Playbooks (pre-position packs)
CREATE TABLE playbooks (
  playbook_key text PRIMARY KEY,
  capacity text NOT NULL,
  title text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Prepositioned resources
CREATE TABLE prepositions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger_id uuid REFERENCES triggers(trigger_id),
  scenario_id uuid REFERENCES scenarios(scenario_id),
  playbook_key text NOT NULL REFERENCES playbooks(playbook_key),
  owner text NOT NULL,
  window_label text NOT NULL,
  status text CHECK (status IN ('planned', 'staged', 'expired')) DEFAULT 'planned',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_watchpoints_channel_loop ON watchpoints(channel_key, loop_id);
CREATE INDEX idx_triggers_watch_enabled ON triggers(watch_id, enabled);
CREATE INDEX idx_trigger_firings_trigger_fired ON trigger_firings(trigger_id, fired_at);
CREATE INDEX idx_scenario_runs_scenario_started ON scenario_runs(scenario_id, started_at);
CREATE INDEX idx_backtest_runs_backtest_started ON backtest_runs(backtest_id, started_at);

-- Update triggers for timestamps
CREATE TRIGGER update_risk_channels_updated_at
  BEFORE UPDATE ON risk_channels
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE TRIGGER update_watchpoints_updated_at
  BEFORE UPDATE ON watchpoints
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE TRIGGER update_triggers_updated_at
  BEFORE UPDATE ON triggers
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE TRIGGER update_playbooks_updated_at
  BEFORE UPDATE ON playbooks
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE TRIGGER update_prepositions_updated_at
  BEFORE UPDATE ON prepositions
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- RLS Policies
ALTER TABLE risk_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE trigger_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE trigger_firings ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenario_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE backtests ENABLE ROW LEVEL SECURITY;
ALTER TABLE backtest_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE playbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE prepositions ENABLE ROW LEVEL SECURITY;

-- Read policies for authenticated users
CREATE POLICY "Authenticated users can read risk channels" ON risk_channels FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can read watchpoints" ON watchpoints FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can read trigger templates" ON trigger_templates FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can read triggers" ON triggers FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can read trigger firings" ON trigger_firings FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can read scenarios" ON scenarios FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can read scenario runs" ON scenario_runs FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can read backtests" ON backtests FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can read backtest runs" ON backtest_runs FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can read playbooks" ON playbooks FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can read prepositions" ON prepositions FOR SELECT USING (auth.uid() IS NOT NULL);

-- Write policies for service role and owners
CREATE POLICY "Service role can manage all" ON risk_channels FOR ALL USING (current_setting('role') = 'service_role');
CREATE POLICY "Service role can manage all" ON watchpoints FOR ALL USING (current_setting('role') = 'service_role');
CREATE POLICY "Service role can manage all" ON trigger_templates FOR ALL USING (current_setting('role') = 'service_role');
CREATE POLICY "Service role can manage all" ON triggers FOR ALL USING (current_setting('role') = 'service_role');
CREATE POLICY "Service role can insert firings" ON trigger_firings FOR INSERT WITH CHECK (current_setting('role') = 'service_role');
CREATE POLICY "Service role can manage all" ON scenarios FOR ALL USING (current_setting('role') = 'service_role');
CREATE POLICY "Service role can manage all" ON scenario_runs FOR ALL USING (current_setting('role') = 'service_role');
CREATE POLICY "Service role can manage all" ON backtests FOR ALL USING (current_setting('role') = 'service_role');
CREATE POLICY "Service role can manage all" ON backtest_runs FOR ALL USING (current_setting('role') = 'service_role');
CREATE POLICY "Service role can manage all" ON playbooks FOR ALL USING (current_setting('role') = 'service_role');
CREATE POLICY "Service role can manage all" ON prepositions FOR ALL USING (current_setting('role') = 'service_role');

-- Users can manage their own created resources
CREATE POLICY "Users can manage own triggers" ON triggers FOR ALL USING (created_by = auth.uid());
CREATE POLICY "Users can manage own scenarios" ON scenarios FOR ALL USING (created_by = auth.uid());
CREATE POLICY "Users can manage own backtests" ON backtests FOR ALL USING (created_by = auth.uid());