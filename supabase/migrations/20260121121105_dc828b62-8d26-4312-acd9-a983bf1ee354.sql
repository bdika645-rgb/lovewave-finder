-- 1. Create user_settings table for storing user preferences
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  match_notifications BOOLEAN DEFAULT true,
  message_notifications BOOLEAN DEFAULT true,
  show_online_status BOOLEAN DEFAULT true,
  show_last_seen BOOLEAN DEFAULT true,
  profile_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on user_settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_settings
CREATE POLICY "Users can view own settings" ON public.user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON public.user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON public.user_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- 2. Add new columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS height INTEGER;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS education TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS smoking TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS relationship_goal TEXT;

-- 3. Add is_super column to likes table for Super Likes
ALTER TABLE public.likes ADD COLUMN IF NOT EXISTS is_super BOOLEAN DEFAULT false;

-- 4. Create action_history table for Undo functionality
CREATE TABLE IF NOT EXISTS public.action_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('like', 'super_like', 'pass')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on action_history
ALTER TABLE public.action_history ENABLE ROW LEVEL SECURITY;

-- RLS for action_history
CREATE POLICY "Users can view own action history" ON public.action_history
  FOR SELECT USING (profile_id = get_my_profile_id());

CREATE POLICY "Users can insert own action history" ON public.action_history
  FOR INSERT WITH CHECK (profile_id = get_my_profile_id());

CREATE POLICY "Users can delete own action history" ON public.action_history
  FOR DELETE USING (profile_id = get_my_profile_id());

-- 5. Update updated_at trigger for user_settings
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Add unread_count tracking - will be computed in real-time via query
-- We'll use the existing messages.is_read column for this

-- 7. Improve profiles RLS - filter out blocked and invisible profiles for non-admins
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;

CREATE POLICY "Anyone can view visible profiles" ON public.profiles
  FOR SELECT USING (
    is_admin() OR 
    user_id = auth.uid() OR 
    (is_visible = true AND is_blocked = false)
  );

-- 8. Improve photos RLS to respect profile visibility
DROP POLICY IF EXISTS "Anyone can view photos" ON public.photos;

CREATE POLICY "Anyone can view photos of visible profiles" ON public.photos
  FOR SELECT USING (
    is_admin() OR
    profile_id = get_my_profile_id() OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = photos.profile_id 
      AND profiles.is_visible = true 
      AND profiles.is_blocked = false
    )
  );