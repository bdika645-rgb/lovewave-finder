-- Drop existing restrictive policy and create a permissive one
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;

-- Create a permissive policy that allows anyone to view profiles
CREATE POLICY "Anyone can view profiles"
ON public.profiles
FOR SELECT
TO public
USING (true);

-- Also make sure demo profiles without user_id can be viewed
-- The policy above should already cover this since USING (true) allows all