-- Add UPDATE policy for conversation_participants so users can mute/unmute
CREATE POLICY "Users can update own participant settings"
ON public.conversation_participants
FOR UPDATE
USING (profile_id = get_my_profile_id())
WITH CHECK (profile_id = get_my_profile_id());

-- Add realtime to conversation_participants for live mute sync
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_participants;