-- Create core anticipatory runtime tables building on existing schema

-- Risk channels table
CREATE TABLE IF NOT EXISTS risk_channels (
  channel_key text PRIMARY KEY,
  title text NOT NULL,
  description text,
  default_window text DEFAULT '14d',
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Trigger templates for versioned DSL
CREATE TABLE IF NOT EXISTS trigger_templates (
  template_key text NOT NULL,
  version integer NOT NULL,
  channel_key text NOT NULL,
  title text NOT NULL,
  dsl text NOT NULL,
  defaults jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (template_key, version)
);

-- Playbooks for prepositioned resources
CREATE TABLE IF NOT EXISTS playbooks (
  playbook_key text PRIMARY KEY,
  capacity text NOT NULL,
  title text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Wait for tables to be created, then add foreign keys
DO $$ 
BEGIN
  -- Add foreign key from trigger_templates to risk_channels
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'trigger_templates_channel_key_fkey'
  ) THEN
    ALTER TABLE trigger_templates ADD CONSTRAINT trigger_templates_channel_key_fkey 
    FOREIGN KEY (channel_key) REFERENCES risk_channels(channel_key);
  END IF;
END $$;

-- Prepositions table (created after playbooks exists)
CREATE TABLE IF NOT EXISTS prepositions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger_id uuid,
  scenario_id uuid,
  playbook_key text REFERENCES playbooks(playbook_key),
  owner text NOT NULL,
  window_label text NOT NULL,
  status text CHECK (status IN ('planned', 'staged', 'expired')) DEFAULT 'planned',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_risk_channels_enabled ON risk_channels(enabled);
CREATE INDEX IF NOT EXISTS idx_trigger_templates_channel ON trigger_templates(channel_key);
CREATE INDEX IF NOT EXISTS idx_prepositions_trigger ON prepositions(trigger_id);
CREATE INDEX IF NOT EXISTS idx_prepositions_scenario ON prepositions(scenario_id);

-- Enable RLS
ALTER TABLE risk_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE trigger_templates ENABLE ROW LEVEL SECURITY;  
ALTER TABLE playbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE prepositions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read risk channels" ON risk_channels FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can read trigger templates" ON trigger_templates FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can read playbooks" ON playbooks FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can read prepositions" ON prepositions FOR SELECT USING (auth.uid() IS NOT NULL);

-- Service role can manage all
CREATE POLICY "Service role manages risk channels" ON risk_channels FOR ALL USING (current_setting('role') = 'service_role');
CREATE POLICY "Service role manages trigger templates" ON trigger_templates FOR ALL USING (current_setting('role') = 'service_role');
CREATE POLICY "Service role manages playbooks" ON playbooks FOR ALL USING (current_setting('role') = 'service_role');
CREATE POLICY "Service role manages prepositions" ON prepositions FOR ALL USING (current_setting('role') = 'service_role');

-- Add update triggers
CREATE OR REPLACE FUNCTION touch_updated_at_risk_channels() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION touch_updated_at_playbooks() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;  
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION touch_updated_at_prepositions() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_risk_channels_updated_at ON risk_channels;
CREATE TRIGGER update_risk_channels_updated_at
  BEFORE UPDATE ON risk_channels
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at_risk_channels();

DROP TRIGGER IF EXISTS update_playbooks_updated_at ON playbooks;
CREATE TRIGGER update_playbooks_updated_at
  BEFORE UPDATE ON playbooks  
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at_playbooks();

DROP TRIGGER IF EXISTS update_prepositions_updated_at ON prepositions;
CREATE TRIGGER update_prepositions_updated_at
  BEFORE UPDATE ON prepositions
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at_prepositions();