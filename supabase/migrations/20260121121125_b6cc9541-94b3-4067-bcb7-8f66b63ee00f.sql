-- Fix RLS policies that are overly permissive (USING true on INSERT)

-- 1. Fix activity_logs - System insert should check if user is authenticated
DROP POLICY IF EXISTS "System can insert activity logs" ON public.activity_logs;
CREATE POLICY "Authenticated users can insert activity logs" ON public.activity_logs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 2. Fix conversations - Authenticated users insert with proper check
DROP POLICY IF EXISTS "Authenticated users can create conversations" ON public.conversations;
CREATE POLICY "Authenticated users can create conversations" ON public.conversations
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 3. Fix conversation_participants - more specific check
DROP POLICY IF EXISTS "Users can add participants" ON public.conversation_participants;
CREATE POLICY "Users can add participants" ON public.conversation_participants
  FOR INSERT WITH CHECK (
    profile_id = get_my_profile_id() OR 
    EXISTS (
      SELECT 1 FROM conversation_participants cp 
      WHERE cp.conversation_id = conversation_participants.conversation_id 
      AND cp.profile_id = get_my_profile_id()
    )
  );

-- 4. Add admin capabilities for action_history
CREATE POLICY "Admins can view all action history" ON public.action_history
  FOR SELECT USING (is_admin());

-- 5. Add admin capabilities for user_settings
CREATE POLICY "Admins can view all user settings" ON public.user_settings
  FOR SELECT USING (is_admin());