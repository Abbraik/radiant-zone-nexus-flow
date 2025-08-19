-- Add loop_code column to loops table for NCF-PAGS Atlas integration
ALTER TABLE loops ADD COLUMN IF NOT EXISTS loop_code text UNIQUE;

-- Create index for better performance on loop_code lookups
CREATE INDEX IF NOT EXISTS idx_loops_code ON loops(loop_code);

-- Add source_tag column to track loop origins
ALTER TABLE loops ADD COLUMN IF NOT EXISTS source_tag text DEFAULT 'NCF-PAGS-ATLAS';

-- Create shared_nodes table if it doesn't exist (for SNL entries)
CREATE TABLE IF NOT EXISTS shared_nodes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label text NOT NULL,
  domain text NOT NULL CHECK (domain IN ('population', 'resource', 'product', 'social', 'institution')),
  descriptor text,
  meta jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(label, domain)
);

-- Enable RLS on shared_nodes
ALTER TABLE shared_nodes ENABLE ROW LEVEL SECURITY;

-- Create policy for shared_nodes (publicly readable for atlas data)
CREATE POLICY "Shared nodes are publicly readable" ON shared_nodes FOR SELECT USING (true);
CREATE POLICY "Users can manage shared nodes" ON shared_nodes FOR ALL USING (true);

-- Create loop_nodes table if it doesn't exist 
CREATE TABLE IF NOT EXISTS loop_nodes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  loop_id uuid NOT NULL,
  label text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('stock', 'flow', 'aux', 'actor', 'indicator')),
  meta jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on loop_nodes
ALTER TABLE loop_nodes ENABLE ROW LEVEL SECURITY;

-- Create policy for loop_nodes
CREATE POLICY "Users can manage their loop nodes" ON loop_nodes FOR ALL 
USING (auth.uid() IN (SELECT user_id FROM loops WHERE loops.id = loop_nodes.loop_id));

-- Update existing loops to mark them as deprecated if they're not from the atlas
UPDATE loops 
SET status = 'deprecated', source_tag = 'LEGACY'
WHERE loop_code IS NULL AND (source_tag IS NULL OR source_tag != 'NCF-PAGS-ATLAS');