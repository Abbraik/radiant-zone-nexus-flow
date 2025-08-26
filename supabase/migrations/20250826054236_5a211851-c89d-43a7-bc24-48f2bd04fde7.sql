-- Create risk channels (new table)
CREATE TABLE IF NOT EXISTS risk_channels (
  channel_key text PRIMARY KEY,
  title text NOT NULL,
  description text,
  default_window text DEFAULT '14d',
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trigger templates (new table for versioned DSL)
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

-- Add foreign key to risk_channels after creating it
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'trigger_templates_channel_key_fkey'
  ) THEN
    ALTER TABLE trigger_templates ADD CONSTRAINT trigger_templates_channel_key_fkey 
    FOREIGN KEY (channel_key) REFERENCES risk_channels(channel_key);
  END IF;
END $$;

-- Create playbooks table (new)
CREATE TABLE IF NOT EXISTS playbooks (
  playbook_key text PRIMARY KEY,
  capacity text NOT NULL,
  title text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create prepositions table (new)
CREATE TABLE IF NOT EXISTS prepositions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger_id uuid,
  scenario_id uuid,
  playbook_key text NOT NULL,
  owner text NOT NULL,
  window_label text NOT NULL,
  status text CHECK (status IN ('planned', 'staged', 'expired')) DEFAULT 'planned',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign keys for prepositions
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'prepositions_playbook_key_fkey'
  ) THEN
    ALTER TABLE prepositions ADD CONSTRAINT prepositions_playbook_key_fkey 
    FOREIGN KEY (playbook_key) REFERENCES playbooks(playbook_key);
  END IF;
END $$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_risk_channels_enabled ON risk_channels(enabled);
CREATE INDEX IF NOT EXISTS idx_trigger_templates_channel ON trigger_templates(channel_key, version);
CREATE INDEX IF NOT EXISTS idx_prepositions_trigger ON prepositions(trigger_id);
CREATE INDEX IF NOT EXISTS idx_prepositions_scenario ON prepositions(scenario_id);

-- Update triggers for timestamps
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

-- RLS Policies
ALTER TABLE risk_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE trigger_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE playbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE prepositions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can read risk channels" ON risk_channels;
DROP POLICY IF EXISTS "Service role can manage risk channels" ON risk_channels;
DROP POLICY IF EXISTS "Authenticated users can read trigger templates" ON trigger_templates;
DROP POLICY IF EXISTS "Service role can manage trigger templates" ON trigger_templates;
DROP POLICY IF EXISTS "Authenticated users can read playbooks" ON playbooks;
DROP POLICY IF EXISTS "Service role can manage playbooks" ON playbooks;
DROP POLICY IF EXISTS "Authenticated users can read prepositions" ON prepositions;
DROP POLICY IF EXISTS "Service role can manage prepositions" ON prepositions;

-- Read policies for authenticated users
CREATE POLICY "Authenticated users can read risk channels" ON risk_channels FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Service role can manage risk channels" ON risk_channels FOR ALL USING (current_setting('role') = 'service_role');

CREATE POLICY "Authenticated users can read trigger templates" ON trigger_templates FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Service role can manage trigger templates" ON trigger_templates FOR ALL USING (current_setting('role') = 'service_role');

CREATE POLICY "Authenticated users can read playbooks" ON playbooks FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Service role can manage playbooks" ON playbooks FOR ALL USING (current_setting('role') = 'service_role');

CREATE POLICY "Authenticated users can read prepositions" ON prepositions FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Service role can manage prepositions" ON prepositions FOR ALL USING (current_setting('role') = 'service_role');