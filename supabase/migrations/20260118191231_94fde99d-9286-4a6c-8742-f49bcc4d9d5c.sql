-- Re-create the triggers that are missing from the database

-- First, make sure unique constraints exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'likes_unique_like'
  ) THEN
    ALTER TABLE public.likes ADD CONSTRAINT likes_unique_like UNIQUE (liker_id, liked_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'matches_unique_pair'
  ) THEN
    ALTER TABLE public.matches ADD CONSTRAINT matches_unique_pair UNIQUE (profile1_id, profile2_id);
  END IF;
END $$;

-- Drop and recreate trigger for checking mutual likes and creating matches
DROP TRIGGER IF EXISTS on_like_check_match ON public.likes;
CREATE TRIGGER on_like_check_match
  AFTER INSERT ON public.likes
  FOR EACH ROW
  EXECUTE FUNCTION public.check_for_match();

-- Drop and recreate trigger for auto-creating conversation when match is created
DROP TRIGGER IF EXISTS on_match_create_conversation ON public.matches;
CREATE TRIGGER on_match_create_conversation
  AFTER INSERT ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION public.create_conversation_on_match();

-- Drop and recreate trigger for updating updated_at on profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Drop and recreate trigger for updating updated_at on conversations  
DROP TRIGGER IF EXISTS update_conversations_updated_at ON public.conversations;
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();