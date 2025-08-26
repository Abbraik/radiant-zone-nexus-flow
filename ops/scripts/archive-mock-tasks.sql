-- Archive Mock Tasks Script
-- Safe cleanup of mock tasks with rollback capability

-- First, run this as a dry-run to see what will be affected:
-- DRY RUN - Count mock tasks to be archived
SELECT 
  'DRY RUN RESULTS' as operation,
  COUNT(*) as tasks_to_archive,
  string_agg(DISTINCT status, ', ') as current_statuses,
  string_agg(DISTINCT created_by::text, ', ') as created_by_users
FROM tasks 
WHERE (
  payload->>'seed' = 'mock' 
  OR title ILIKE '%mock%' 
  OR payload->>'_mock' = 'true'
  OR description ILIKE '%mock%'
  OR description ILIKE '%demo%'
  OR description ILIKE '%test%'
);

-- Show examples of tasks that will be archived
SELECT 
  task_id,
  title,
  status,
  payload->>'seed' as seed_flag,
  created_at
FROM tasks 
WHERE (
  payload->>'seed' = 'mock' 
  OR title ILIKE '%mock%' 
  OR payload->>'_mock' = 'true'
  OR description ILIKE '%mock%'
  OR description ILIKE '%demo%'
  OR description ILIKE '%test%'
)
ORDER BY created_at DESC
LIMIT 10;

-- EXECUTE ARCHIVE (uncomment when ready):
/*
BEGIN;

-- Archive mock tasks (safe - keeps data but marks as cancelled)
UPDATE tasks 
SET 
  status = 'cancelled', 
  payload = jsonb_set(
    COALESCE(payload, '{}'::jsonb), 
    '{archived_reason}', 
    '"mock_cleanup_' || to_char(now(), 'YYYY-MM-DD') || '"'
  ),
  updated_at = now()
WHERE (
  payload->>'seed' = 'mock' 
  OR title ILIKE '%mock%' 
  OR payload->>'_mock' = 'true'
  OR description ILIKE '%mock%'
  OR description ILIKE '%demo%'
  OR description ILIKE '%test%'
)
AND status != 'cancelled'; -- Don't re-archive

-- Log the archive operation
INSERT INTO audit_log (
  resource_type, 
  action, 
  resource_id, 
  user_id, 
  old_values, 
  new_values
) 
SELECT 
  'task',
  'archive_mock_cleanup',
  task_id,
  auth.uid(),
  jsonb_build_object('status', 'various', 'reason', 'bulk_mock_cleanup'),
  jsonb_build_object('status', 'cancelled', 'archived_at', now())
FROM tasks 
WHERE payload->>'archived_reason' LIKE '%mock_cleanup_%'
  AND updated_at > now() - interval '1 minute';

COMMIT;
*/

-- ROLLBACK SCRIPT (if needed):
/*
-- To restore archived mock tasks (emergency rollback):
UPDATE tasks 
SET 
  status = 'draft',
  payload = payload - 'archived_reason',
  updated_at = now()
WHERE payload->>'archived_reason' LIKE '%mock_cleanup_%'
  AND status = 'cancelled';
*/