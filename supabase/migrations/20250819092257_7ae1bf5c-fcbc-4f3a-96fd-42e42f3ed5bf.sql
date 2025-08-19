-- Drop existing public access policy and recreate it properly
DROP POLICY IF EXISTS "Allow public access to all loops" ON public.loops;
DROP POLICY IF EXISTS "Users can view published loops" ON public.loops;

-- Create a comprehensive policy that allows everyone to see published loops
CREATE POLICY "Public can view all published loops" 
ON public.loops 
FOR SELECT 
USING (status = 'published' OR status IS NULL OR auth.uid() = user_id OR user_id IS NULL);