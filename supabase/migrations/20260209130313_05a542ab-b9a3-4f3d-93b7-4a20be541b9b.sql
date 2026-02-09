-- Add reply_to column for message quoting/replying
ALTER TABLE public.messages 
ADD COLUMN reply_to UUID REFERENCES public.messages(id) ON DELETE SET NULL;

-- Add index for performance
CREATE INDEX idx_messages_reply_to ON public.messages(reply_to) WHERE reply_to IS NOT NULL;