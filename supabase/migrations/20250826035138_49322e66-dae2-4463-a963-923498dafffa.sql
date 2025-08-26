-- Fix Registry Schema & Function - Fix Foreign Key Issue
-- 1. Drop the dependent view first
DROP VIEW IF EXISTS v_loop_shared_nodes CASCADE;

-- 2. Update shared_nodes table to match spec
ALTER TABLE shared_nodes DROP COLUMN IF EXISTS domain CASCADE;
ALTER TABLE shared_nodes DROP COLUMN IF EXISTS description CASCADE;
ALTER TABLE shared_nodes DROP COLUMN IF EXISTS descriptor CASCADE;
ALTER TABLE shared_nodes ADD COLUMN IF NOT EXISTS snl_id uuid DEFAULT gen_random_uuid();
ALTER TABLE shared_nodes ADD COLUMN IF NOT EXISTS key text;
ALTER TABLE shared_nodes ADD COLUMN IF NOT EXISTS type text;

-- Update the snl_id to match existing id values
UPDATE shared_nodes SET snl_id = id WHERE snl_id IS NULL;
ALTER TABLE shared_nodes ALTER COLUMN snl_id SET NOT NULL;

-- Add constraints
ALTER TABLE shared_nodes ADD CONSTRAINT shared_nodes_key_unique UNIQUE (key);
ALTER TABLE shared_nodes ADD CONSTRAINT shared_nodes_snl_id_unique UNIQUE (snl_id);
ALTER TABLE shared_nodes ADD CONSTRAINT shared_nodes_type_check CHECK (type IN ('hub', 'bridge', 'bottleneck'));

-- 3. Update loop_shared_nodes table
ALTER TABLE loop_shared_nodes DROP COLUMN IF EXISTS node_id CASCADE;
ALTER TABLE loop_shared_nodes ADD COLUMN IF NOT EXISTS snl_id uuid;
ALTER TABLE loop_shared_nodes ADD COLUMN IF NOT EXISTS note text;

-- Add foreign key constraint (now that snl_id has unique constraint)
ALTER TABLE loop_shared_nodes ADD CONSTRAINT fk_loop_shared_nodes_snl_id 
FOREIGN KEY (snl_id) REFERENCES shared_nodes(snl_id);

-- 4. Recreate the view with proper columns
CREATE VIEW v_loop_shared_nodes AS
SELECT 
  lsn.id,
  lsn.loop_id,
  lsn.snl_id, 
  lsn.role,
  lsn.note,
  sn.label as snl_label,
  sn.key as snl_key,
  sn.type as snl_type
FROM loop_shared_nodes lsn
JOIN shared_nodes sn ON sn.snl_id = lsn.snl_id;

-- 5. Add missing indexes
CREATE INDEX IF NOT EXISTS idx_loop_nodes_loop_id ON loop_nodes(loop_id);
CREATE INDEX IF NOT EXISTS idx_de_bands_loop_id_indicator ON de_bands(loop_id, indicator);
CREATE INDEX IF NOT EXISTS idx_srt_windows_loop_id ON srt_windows(loop_id);
CREATE INDEX IF NOT EXISTS idx_loop_shared_nodes_loop_id ON loop_shared_nodes(loop_id);
CREATE INDEX IF NOT EXISTS idx_loop_shared_nodes_snl_id ON loop_shared_nodes(snl_id);
CREATE INDEX IF NOT EXISTS idx_cascades_from_loop_id ON cascades(from_loop_id);
CREATE INDEX IF NOT EXISTS idx_cascades_to_loop_id ON cascades(to_loop_id);