-- Clean up duplicate triggers that may cause issues

-- Remove duplicate triggers on likes table
DROP TRIGGER IF EXISTS trigger_create_match ON public.likes;
DROP TRIGGER IF EXISTS trigger_check_for_match ON public.likes;
DROP TRIGGER IF EXISTS on_like_check_match ON public.likes;

-- Keep only one trigger for creating matches
CREATE TRIGGER on_like_check_match
  AFTER INSERT ON public.likes
  FOR EACH ROW
  EXECUTE FUNCTION public.check_for_match();

-- Remove duplicate triggers on matches table
DROP TRIGGER IF EXISTS trigger_create_conversation ON public.matches;
DROP TRIGGER IF EXISTS trigger_create_conversation_on_match ON public.matches;
DROP TRIGGER IF EXISTS on_match_create_conversation ON public.matches;

-- Keep only one trigger for creating conversations
CREATE TRIGGER on_match_create_conversation
  AFTER INSERT ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION public.create_conversation_on_match();

-- Remove duplicate triggers on profiles table
DROP TRIGGER IF EXISTS trigger_update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;

-- Keep only one trigger for updating timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Remove duplicate triggers on conversations table
DROP TRIGGER IF EXISTS trigger_update_conversations_updated_at ON public.conversations;
DROP TRIGGER IF EXISTS update_conversations_updated_at ON public.conversations;

-- Keep only one trigger for updating timestamps
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();