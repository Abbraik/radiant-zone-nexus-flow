-- Drop the conflicting policy first, then remove user_id from shared_nodes
DROP POLICY IF EXISTS "Users can manage their own shared nodes" ON public.shared_nodes;
ALTER TABLE public.shared_nodes DROP COLUMN IF EXISTS user_id CASCADE;

-- Update RLS policies for shared_nodes to work without user_id
DROP POLICY IF EXISTS "Authenticated users can manage shared nodes" ON public.shared_nodes;
CREATE POLICY "Authenticated users can manage shared nodes" ON public.shared_nodes
  FOR ALL USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);