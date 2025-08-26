-- Create new tables for Anticipatory Runtime (avoiding existing table names)

-- 1. Create risk channels (new table)
CREATE TABLE IF NOT EXISTS risk_channels (
  channel_key text PRIMARY KEY,
  title text NOT NULL,
  description text,
  default_window text DEFAULT '14d',
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Create playbooks table (new)
CREATE TABLE IF NOT EXISTS playbooks (
  playbook_key text PRIMARY KEY,
  capacity text NOT NULL,
  title text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Create trigger templates (new table for versioned DSL)
CREATE TABLE IF NOT EXISTS trigger_templates (
  template_key text NOT NULL,
  version integer NOT NULL,
  channel_key text NOT NULL,
  title text NOT NULL,
  dsl text NOT NULL,
  defaults jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (template_key, version),
  FOREIGN KEY (channel_key) REFERENCES risk_channels(channel_key)
);

-- 4. Create prepositions table (new) - references playbooks 
CREATE TABLE IF NOT EXISTS prepositions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger_id uuid, -- Will reference existing antic_trigger_rules(id)
  scenario_id uuid, -- Will reference existing antic_scenarios(id) 
  playbook_key text NOT NULL REFERENCES playbooks(playbook_key),
  owner text NOT NULL,
  window_label text NOT NULL,
  status text CHECK (status IN ('planned', 'staged', 'expired')) DEFAULT 'planned',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign keys to existing tables where possible
DO $$ 
BEGIN
  -- Link prepositions to existing trigger rules
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'prepositions_trigger_id_fkey'
  ) THEN
    ALTER TABLE prepositions ADD CONSTRAINT prepositions_trigger_id_fkey 
    FOREIGN KEY (trigger_id) REFERENCES antic_trigger_rules(id);
  END IF;
  
  -- Link prepositions to existing scenarios  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'prepositions_scenario_id_fkey'
  ) THEN
    ALTER TABLE prepositions ADD CONSTRAINT prepositions_scenario_id_fkey 
    FOREIGN KEY (scenario_id) REFERENCES antic_scenarios(id);
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_risk_channels_enabled ON risk_channels(enabled);
CREATE INDEX IF NOT EXISTS idx_trigger_templates_channel_version ON trigger_templates(channel_key, version);
CREATE INDEX IF NOT EXISTS idx_prepositions_trigger ON prepositions(trigger_id);
CREATE INDEX IF NOT EXISTS idx_prepositions_scenario ON prepositions(scenario_id);
CREATE INDEX IF NOT EXISTS idx_prepositions_status ON prepositions(status);

-- Create timestamp update functions and triggers
CREATE OR REPLACE FUNCTION update_risk_channels_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_playbooks_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_prepositions_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers (drop first to avoid conflicts)
DROP TRIGGER IF EXISTS update_risk_channels_updated_at_trigger ON risk_channels;
CREATE TRIGGER update_risk_channels_updated_at_trigger
  BEFORE UPDATE ON risk_channels
  FOR EACH ROW EXECUTE FUNCTION update_risk_channels_updated_at();

DROP TRIGGER IF EXISTS update_playbooks_updated_at_trigger ON playbooks;
CREATE TRIGGER update_playbooks_updated_at_trigger
  BEFORE UPDATE ON playbooks
  FOR EACH ROW EXECUTE FUNCTION update_playbooks_updated_at();

DROP TRIGGER IF EXISTS update_prepositions_updated_at_trigger ON prepositions;
CREATE TRIGGER update_prepositions_updated_at_trigger
  BEFORE UPDATE ON prepositions
  FOR EACH ROW EXECUTE FUNCTION update_prepositions_updated_at();

-- Enable RLS
ALTER TABLE risk_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE trigger_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE playbooks ENABLE ROW LEVEL SECURITY; 
ALTER TABLE prepositions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (drop existing first)
DROP POLICY IF EXISTS "Users can read risk channels" ON risk_channels;
DROP POLICY IF EXISTS "Service can manage risk channels" ON risk_channels;
CREATE POLICY "Users can read risk channels" ON risk_channels FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Service can manage risk channels" ON risk_channels FOR ALL USING (current_setting('role') = 'service_role');

DROP POLICY IF EXISTS "Users can read trigger templates" ON trigger_templates;
DROP POLICY IF EXISTS "Service can manage trigger templates" ON trigger_templates;
CREATE POLICY "Users can read trigger templates" ON trigger_templates FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Service can manage trigger templates" ON trigger_templates FOR ALL USING (current_setting('role') = 'service_role');

DROP POLICY IF EXISTS "Users can read playbooks" ON playbooks;
DROP POLICY IF EXISTS "Service can manage playbooks" ON playbooks;
CREATE POLICY "Users can read playbooks" ON playbooks FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Service can manage playbooks" ON playbooks FOR ALL USING (current_setting('role') = 'service_role');

DROP POLICY IF EXISTS "Users can read prepositions" ON prepositions;
DROP POLICY IF EXISTS "Service can manage prepositions" ON prepositions;
CREATE POLICY "Users can read prepositions" ON prepositions FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Service can manage prepositions" ON prepositions FOR ALL USING (current_setting('role') = 'service_role');