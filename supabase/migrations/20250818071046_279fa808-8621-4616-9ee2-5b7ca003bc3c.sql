-- Remove the foreign key constraint on assigned_to column for demo purposes
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_assigned_to_fkey;