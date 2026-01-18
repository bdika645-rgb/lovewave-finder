-- Drop existing restrictive policies on profiles
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;

-- Create permissive policy for viewing profiles
CREATE POLICY "Anyone can view profiles" 
ON public.profiles 
FOR SELECT 
TO anon, authenticated
USING (true);

-- Also fix photos table
DROP POLICY IF EXISTS "Anyone can view photos" ON public.photos;

CREATE POLICY "Anyone can view photos" 
ON public.photos 
FOR SELECT 
TO anon, authenticated
USING (true);