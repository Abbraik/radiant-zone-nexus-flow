-- Add policy to allow public task claiming for demo purposes
CREATE POLICY "Allow public task claiming" ON tasks 
FOR UPDATE 
USING (true) 
WITH CHECK (true);