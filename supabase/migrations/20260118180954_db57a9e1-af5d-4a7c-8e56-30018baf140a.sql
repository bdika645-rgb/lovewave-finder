
-- Fix RLS policies to be PERMISSIVE (the default)
-- Drop and recreate the policies as permissive

-- Drop existing restrictive policies on profiles
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Recreate as PERMISSIVE
CREATE POLICY "Anyone can view profiles" 
ON public.profiles 
FOR SELECT 
TO public
USING (true);

CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile" 
ON public.profiles 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Fix likes policies
DROP POLICY IF EXISTS "Users can create likes" ON public.likes;
DROP POLICY IF EXISTS "Users can delete own likes" ON public.likes;
DROP POLICY IF EXISTS "Users can view their likes" ON public.likes;

CREATE POLICY "Users can create likes" 
ON public.likes 
FOR INSERT 
TO authenticated
WITH CHECK (liker_id = get_my_profile_id());

CREATE POLICY "Users can delete own likes" 
ON public.likes 
FOR DELETE 
TO authenticated
USING (liker_id = get_my_profile_id());

CREATE POLICY "Users can view their likes" 
ON public.likes 
FOR SELECT 
TO authenticated
USING ((liker_id = get_my_profile_id()) OR (liked_id = get_my_profile_id()));

-- Fix matches policies
DROP POLICY IF EXISTS "Users can view their matches" ON public.matches;

CREATE POLICY "Users can view their matches" 
ON public.matches 
FOR SELECT 
TO authenticated
USING ((profile1_id = get_my_profile_id()) OR (profile2_id = get_my_profile_id()));

-- Add policy to allow system to create matches
CREATE POLICY "System can create matches" 
ON public.matches 
FOR INSERT 
TO authenticated
WITH CHECK (
  (profile1_id = get_my_profile_id() OR profile2_id = get_my_profile_id())
);

-- Create a trigger function to auto-create matches when mutual like happens
CREATE OR REPLACE FUNCTION public.check_for_match()
RETURNS TRIGGER AS $$
DECLARE
  mutual_like_exists BOOLEAN;
  existing_match_exists BOOLEAN;
BEGIN
  -- Check if there's a mutual like
  SELECT EXISTS(
    SELECT 1 FROM public.likes 
    WHERE liker_id = NEW.liked_id 
    AND liked_id = NEW.liker_id
  ) INTO mutual_like_exists;

  -- If mutual like exists, check if match already exists
  IF mutual_like_exists THEN
    SELECT EXISTS(
      SELECT 1 FROM public.matches 
      WHERE (profile1_id = NEW.liker_id AND profile2_id = NEW.liked_id)
         OR (profile1_id = NEW.liked_id AND profile2_id = NEW.liker_id)
    ) INTO existing_match_exists;

    -- Create match if it doesn't exist
    IF NOT existing_match_exists THEN
      INSERT INTO public.matches (profile1_id, profile2_id)
      VALUES (
        LEAST(NEW.liker_id, NEW.liked_id),
        GREATEST(NEW.liker_id, NEW.liked_id)
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_like_check_match ON public.likes;

-- Create trigger for match checking
CREATE TRIGGER on_like_check_match
AFTER INSERT ON public.likes
FOR EACH ROW
EXECUTE FUNCTION public.check_for_match();

-- Add unique constraint on likes to prevent duplicates
ALTER TABLE public.likes 
DROP CONSTRAINT IF EXISTS likes_unique_like;

ALTER TABLE public.likes 
ADD CONSTRAINT likes_unique_like UNIQUE (liker_id, liked_id);
