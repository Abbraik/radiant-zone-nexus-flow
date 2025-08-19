-- Add RLS policy to allow all users to view all loops
CREATE POLICY "Allow public access to all loops" 
ON public.loops 
FOR SELECT 
USING (true);