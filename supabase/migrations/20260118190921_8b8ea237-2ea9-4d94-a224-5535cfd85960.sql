-- Add missing triggers for the database functions

-- First, check if constraint exists and add it if not
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'likes_unique_like'
  ) THEN
    ALTER TABLE public.likes ADD CONSTRAINT likes_unique_like UNIQUE (liker_id, liked_id);
  END IF;
END $$;

-- Add unique constraint on matches to prevent duplicates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'matches_unique_pair'
  ) THEN
    ALTER TABLE public.matches ADD CONSTRAINT matches_unique_pair UNIQUE (profile1_id, profile2_id);
  END IF;
END $$;

-- Create trigger for auto-creating matches on mutual likes
DROP TRIGGER IF EXISTS on_like_check_match ON public.likes;
CREATE TRIGGER on_like_check_match
  AFTER INSERT ON public.likes
  FOR EACH ROW
  EXECUTE FUNCTION public.check_for_match();

-- Create trigger for auto-creating conversation on match
DROP TRIGGER IF EXISTS on_match_create_conversation ON public.matches;
CREATE TRIGGER on_match_create_conversation
  AFTER INSERT ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION public.create_conversation_on_match();

-- Create trigger for updating updated_at on profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updating updated_at on conversations
DROP TRIGGER IF EXISTS update_conversations_updated_at ON public.conversations;
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();