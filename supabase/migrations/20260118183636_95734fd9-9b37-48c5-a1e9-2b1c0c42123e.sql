-- Fix conversation_participants INSERT policy bug
-- (the original policy had cp.conversation_id = cp.conversation_id which is always true)
DROP POLICY IF EXISTS "Users can add participants" ON public.conversation_participants;

CREATE POLICY "Users can add participants" 
ON public.conversation_participants 
FOR INSERT 
WITH CHECK (
  profile_id = get_my_profile_id() OR 
  EXISTS (
    SELECT 1 FROM conversation_participants cp
    WHERE cp.conversation_id = conversation_participants.conversation_id 
    AND cp.profile_id = get_my_profile_id()
  )
);

-- Add unique constraint on likes to prevent duplicates
ALTER TABLE public.likes 
ADD CONSTRAINT likes_unique_pair UNIQUE (liker_id, liked_id);

-- Add unique constraint on matches to prevent duplicates
ALTER TABLE public.matches 
ADD CONSTRAINT matches_unique_pair UNIQUE (profile1_id, profile2_id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_likes_liker_id ON public.likes(liker_id);
CREATE INDEX IF NOT EXISTS idx_likes_liked_id ON public.likes(liked_id);
CREATE INDEX IF NOT EXISTS idx_matches_profile1 ON public.matches(profile1_id);
CREATE INDEX IF NOT EXISTS idx_matches_profile2 ON public.matches(profile2_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conv ON public.conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_profile ON public.conversation_participants(profile_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);