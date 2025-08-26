-- Fix Anticipatory Runtime tables - ensure proper structure

-- First, drop any problematic constraints and tables if they exist
DROP TABLE IF EXISTS prepositions CASCADE;
DROP TABLE IF EXISTS trigger_templates CASCADE;
DROP TABLE IF EXISTS playbooks CASCADE;
DROP TABLE IF EXISTS risk_channels CASCADE;

-- Create risk_channels table
CREATE TABLE risk_channels (
  channel_key text PRIMARY KEY,
  title text NOT NULL,
  description text,
  default_window text DEFAULT '14d',
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create playbooks table
CREATE TABLE playbooks (
  playbook_key text PRIMARY KEY,
  capacity text NOT NULL,
  title text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trigger_templates table
CREATE TABLE trigger_templates (
  template_key text NOT NULL,
  version integer NOT NULL,
  channel_key text NOT NULL,
  title text NOT NULL,
  dsl text NOT NULL,
  defaults jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (template_key, version),
  CONSTRAINT trigger_templates_channel_key_fkey 
    FOREIGN KEY (channel_key) REFERENCES risk_channels(channel_key)
);

-- Create prepositions table
CREATE TABLE prepositions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger_id uuid,
  scenario_id uuid,
  playbook_key text NOT NULL,
  owner text NOT NULL,
  window_label text NOT NULL,
  status text CHECK (status IN ('planned', 'staged', 'expired')) DEFAULT 'planned',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT prepositions_playbook_key_fkey 
    FOREIGN KEY (playbook_key) REFERENCES playbooks(playbook_key)
);

-- Create indexes
CREATE INDEX idx_risk_channels_enabled ON risk_channels(enabled);
CREATE INDEX idx_trigger_templates_channel_version ON trigger_templates(channel_key, version);
CREATE INDEX idx_prepositions_trigger ON prepositions(trigger_id);
CREATE INDEX idx_prepositions_scenario ON prepositions(scenario_id);
CREATE INDEX idx_prepositions_status ON prepositions(status);

-- Create update triggers
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

-- Create triggers
CREATE TRIGGER update_risk_channels_updated_at_trigger
  BEFORE UPDATE ON risk_channels
  FOR EACH ROW EXECUTE FUNCTION update_risk_channels_updated_at();

CREATE TRIGGER update_playbooks_updated_at_trigger
  BEFORE UPDATE ON playbooks
  FOR EACH ROW EXECUTE FUNCTION update_playbooks_updated_at();

CREATE TRIGGER update_prepositions_updated_at_trigger
  BEFORE UPDATE ON prepositions
  FOR EACH ROW EXECUTE FUNCTION update_prepositions_updated_at();

-- Enable RLS
ALTER TABLE risk_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE trigger_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE playbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE prepositions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read risk channels" ON risk_channels 
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Service can manage risk channels" ON risk_channels 
  FOR ALL USING (current_setting('role', true) = 'service_role');

CREATE POLICY "Users can read trigger templates" ON trigger_templates 
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Service can manage trigger templates" ON trigger_templates 
  FOR ALL USING (current_setting('role', true) = 'service_role');

CREATE POLICY "Users can read playbooks" ON playbooks 
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Service can manage playbooks" ON playbooks 
  FOR ALL USING (current_setting('role', true) = 'service_role');

CREATE POLICY "Users can read prepositions" ON prepositions 
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Service can manage prepositions" ON prepositions 
  FOR ALL USING (current_setting('role', true) = 'service_role');