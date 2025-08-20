-- Fix shared_nodes table to not require user_id since it's shared data
ALTER TABLE public.shared_nodes DROP COLUMN IF EXISTS user_id;

-- Update RLS policies for shared_nodes to be more permissive
DROP POLICY IF EXISTS "Authenticated users can manage shared nodes" ON public.shared_nodes;
CREATE POLICY "Authenticated users can manage shared nodes" ON public.shared_nodes
  FOR ALL USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);