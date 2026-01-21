-- Fix: Allow public access to visible profiles for browsing
-- Drop the restrictive policy
DROP POLICY IF EXISTS "Authenticated users can view visible profiles" ON public.profiles;

-- Create new policy that allows public viewing of visible profiles
CREATE POLICY "Anyone can view visible profiles"
ON public.profiles
FOR SELECT
USING (
  is_admin() 
  OR (user_id = auth.uid()) 
  OR (is_visible = true AND is_blocked = false)
);