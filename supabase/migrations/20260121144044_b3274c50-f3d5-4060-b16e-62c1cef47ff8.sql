-- Update RLS policy for profiles to require authentication for viewing
-- First drop the existing permissive SELECT policy
DROP POLICY IF EXISTS "Anyone can view visible profiles" ON public.profiles;

-- Create new policy that requires authentication
CREATE POLICY "Authenticated users can view visible profiles" 
ON public.profiles 
FOR SELECT 
USING (
  is_admin() 
  OR (user_id = auth.uid()) 
  OR (auth.uid() IS NOT NULL AND is_visible = true AND is_blocked = false)
);