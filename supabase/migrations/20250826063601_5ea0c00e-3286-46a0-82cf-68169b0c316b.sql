-- Create user settings table for language preferences
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  lang_mode TEXT CHECK (lang_mode IN ('general', 'expert')) DEFAULT 'general',
  learning_hub_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_settings
CREATE POLICY "Users can manage their own settings"
  ON public.user_settings
  FOR ALL
  USING (auth.uid() = user_id);

-- Create learning hubs table
CREATE TABLE IF NOT EXISTS public.learning_hubs (
  hub_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  capacity TEXT NOT NULL CHECK (capacity IN ('responsive', 'reflexive', 'deliberative', 'anticipatory', 'structural')),
  version TEXT NOT NULL DEFAULT '1.0',
  mdx_content TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  author TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.learning_hubs ENABLE ROW LEVEL SECURITY;

-- RLS policies for learning_hubs
CREATE POLICY "Anyone can read active learning hubs"
  ON public.learning_hubs
  FOR SELECT
  USING (active = true);

CREATE POLICY "Editors can manage learning hubs"
  ON public.learning_hubs
  FOR ALL
  USING (
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'editor')
    )
  );

-- Create shares table for shareable views
CREATE TABLE IF NOT EXISTS public.shares (
  share_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL CHECK (kind IN ('status_banner', 'decision_note', 'learning_deck', 'readiness_plan', 'public_dossier')),
  entity_id UUID NOT NULL,
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'base64url'),
  redaction_profile TEXT CHECK (redaction_profile IN ('public', 'partner', 'internal')) DEFAULT 'public',
  expires_at TIMESTAMPTZ NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ NULL
);

-- Enable RLS
ALTER TABLE public.shares ENABLE ROW LEVEL SECURITY;

-- RLS policies for shares
CREATE POLICY "Users can manage their own shares"
  ON public.shares
  FOR ALL
  USING (auth.uid() = created_by);

CREATE POLICY "Service role can read shares for public access"
  ON public.shares
  FOR SELECT
  USING (current_setting('role', true) = 'service_role');

-- Create secure view for public share access
CREATE OR REPLACE VIEW public.public_shares AS
SELECT 
  share_id,
  kind,
  entity_id,
  token,
  redaction_profile,
  expires_at,
  created_at,
  CASE 
    WHEN expires_at IS NULL OR expires_at > NOW() THEN
      CASE WHEN revoked_at IS NULL THEN true ELSE false END
    ELSE false
  END as is_valid
FROM public.shares
WHERE revoked_at IS NULL;

-- Add updated_at trigger to user_settings
CREATE OR REPLACE FUNCTION update_user_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_user_settings_updated_at();

-- Seed default user settings for existing users
INSERT INTO public.user_settings (user_id, lang_mode)
SELECT id, 'general' 
FROM auth.users 
ON CONFLICT (user_id) DO NOTHING;