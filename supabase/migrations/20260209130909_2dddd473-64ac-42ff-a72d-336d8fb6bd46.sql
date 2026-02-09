
-- Add is_muted column to conversation_participants for persistent mute
ALTER TABLE public.conversation_participants
ADD COLUMN is_muted boolean NOT NULL DEFAULT false;
