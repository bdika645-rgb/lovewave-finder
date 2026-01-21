-- Phase 1: Security Fixes

-- 1. Update site_statistics RLS policy to admin-only for SELECT
DROP POLICY IF EXISTS "Authenticated users can view statistics" ON public.site_statistics;

CREATE POLICY "Only admins can view statistics"
ON public.site_statistics
FOR SELECT
USING (is_admin());

-- 2. Add read_at column for read receipts feature
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS read_at TIMESTAMP WITH TIME ZONE;

-- 3. Create index for faster read status queries
CREATE INDEX IF NOT EXISTS idx_messages_read_at ON public.messages(read_at);

-- 4. Create a function to get random icebreaker
CREATE OR REPLACE FUNCTION public.get_random_icebreaker(category_filter text DEFAULT NULL)
RETURNS TABLE(id uuid, question text, category text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT i.id, i.question, i.category
  FROM public.icebreakers i
  WHERE i.is_active = true
    AND (category_filter IS NULL OR i.category = category_filter)
  ORDER BY random()
  LIMIT 1
$$;

-- 5. Create typing_status table for realtime typing indicators
CREATE TABLE IF NOT EXISTS public.typing_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  profile_id UUID NOT NULL,
  is_typing BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(conversation_id, profile_id)
);

-- Enable RLS on typing_status
ALTER TABLE public.typing_status ENABLE ROW LEVEL SECURITY;

-- RLS policies for typing_status
CREATE POLICY "Participants can view typing status"
ON public.typing_status
FOR SELECT
USING (is_conversation_participant(conversation_id));

CREATE POLICY "Users can update their typing status"
ON public.typing_status
FOR INSERT
WITH CHECK (profile_id = get_my_profile_id() AND is_conversation_participant(conversation_id));

CREATE POLICY "Users can update own typing status"
ON public.typing_status
FOR UPDATE
USING (profile_id = get_my_profile_id());

CREATE POLICY "Users can delete own typing status"
ON public.typing_status
FOR DELETE
USING (profile_id = get_my_profile_id());

-- Enable realtime for typing_status
ALTER PUBLICATION supabase_realtime ADD TABLE public.typing_status;