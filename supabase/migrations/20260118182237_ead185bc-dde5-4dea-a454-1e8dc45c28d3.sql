-- Create trigger for auto-creating matches on mutual likes
CREATE TRIGGER trigger_check_for_match
AFTER INSERT ON public.likes
FOR EACH ROW
EXECUTE FUNCTION public.check_for_match();

-- Create trigger for auto-creating conversations on new matches
CREATE TRIGGER trigger_create_conversation_on_match
AFTER INSERT ON public.matches
FOR EACH ROW
EXECUTE FUNCTION public.create_conversation_on_match();

-- Create trigger for updating updated_at on profiles
CREATE TRIGGER trigger_update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updating updated_at on conversations
CREATE TRIGGER trigger_update_conversations_updated_at
BEFORE UPDATE ON public.conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add unique constraint on likes to prevent duplicate likes
ALTER TABLE public.likes
ADD CONSTRAINT unique_like UNIQUE (liker_id, liked_id);

-- Add unique constraint on matches to prevent duplicates
ALTER TABLE public.matches
ADD CONSTRAINT unique_match UNIQUE (profile1_id, profile2_id);