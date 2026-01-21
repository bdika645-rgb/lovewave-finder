-- Update RLS policies for better security

-- 1. Drop and recreate the Anyone can view settings policy for app_settings (require auth)
DROP POLICY IF EXISTS "Anyone can view settings" ON public.app_settings;
CREATE POLICY "Authenticated users can view settings" 
ON public.app_settings 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 2. Add UPDATE policy for profile_views
CREATE POLICY "Users can update own profile views" 
ON public.profile_views 
FOR UPDATE 
USING (viewer_id = get_my_profile_id());

-- 3. Add DELETE policy for profile_views  
CREATE POLICY "Users can delete own profile views" 
ON public.profile_views 
FOR DELETE 
USING (viewer_id = get_my_profile_id());