-- Create trigger for likes only (the conversation trigger already exists)
DROP TRIGGER IF EXISTS on_mutual_like_create_match ON public.likes;

CREATE TRIGGER on_mutual_like_create_match
AFTER INSERT ON public.likes
FOR EACH ROW
EXECUTE FUNCTION public.check_for_match();

-- Add unique constraint to likes if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'likes_unique_pair'
  ) THEN
    ALTER TABLE public.likes ADD CONSTRAINT likes_unique_pair UNIQUE (liker_id, liked_id);
  END IF;
END $$;

-- Add unique constraint to matches if not exists  
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'matches_unique_pair'
  ) THEN
    ALTER TABLE public.matches ADD CONSTRAINT matches_unique_pair UNIQUE (profile1_id, profile2_id);
  END IF;
END $$;