-- Enable replica identity full for messages table to support DELETE realtime events
ALTER TABLE public.messages REPLICA IDENTITY FULL;