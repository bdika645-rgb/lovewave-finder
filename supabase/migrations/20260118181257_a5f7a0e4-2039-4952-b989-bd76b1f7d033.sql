
-- Enable realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Fix conversation_participants policies to be permissive
DROP POLICY IF EXISTS "Participants can view participants" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can add themselves to conversations" ON public.conversation_participants;

CREATE POLICY "Participants can view participants" 
ON public.conversation_participants 
FOR SELECT 
TO authenticated
USING (is_conversation_participant(conversation_id));

CREATE POLICY "Users can add participants" 
ON public.conversation_participants 
FOR INSERT 
TO authenticated
WITH CHECK (
  -- Can add self or when creating a new conversation
  profile_id = get_my_profile_id() OR 
  EXISTS (
    SELECT 1 FROM conversation_participants cp 
    WHERE cp.conversation_id = conversation_id 
    AND cp.profile_id = get_my_profile_id()
  )
);

-- Fix conversations policies
DROP POLICY IF EXISTS "Authenticated users can create conversations" ON public.conversations;
DROP POLICY IF EXISTS "Participants can view conversations" ON public.conversations;

CREATE POLICY "Authenticated users can create conversations" 
ON public.conversations 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Participants can view conversations" 
ON public.conversations 
FOR SELECT 
TO authenticated
USING (is_conversation_participant(id));

CREATE POLICY "Participants can update conversations" 
ON public.conversations 
FOR UPDATE 
TO authenticated
USING (is_conversation_participant(id));

-- Fix messages policies
DROP POLICY IF EXISTS "Participants can send messages" ON public.messages;
DROP POLICY IF EXISTS "Participants can view messages" ON public.messages;

CREATE POLICY "Participants can view messages" 
ON public.messages 
FOR SELECT 
TO authenticated
USING (is_conversation_participant(conversation_id));

CREATE POLICY "Participants can send messages" 
ON public.messages 
FOR INSERT 
TO authenticated
WITH CHECK (is_conversation_participant(conversation_id) AND sender_id = get_my_profile_id());

CREATE POLICY "Participants can update messages" 
ON public.messages 
FOR UPDATE 
TO authenticated
USING (is_conversation_participant(conversation_id));
