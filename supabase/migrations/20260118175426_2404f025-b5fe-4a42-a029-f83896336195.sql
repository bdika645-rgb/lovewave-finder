-- Fix function search_path security warnings
ALTER FUNCTION public.get_my_profile_id() SET search_path = public;
ALTER FUNCTION public.is_conversation_participant(UUID) SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.create_match_on_mutual_like() SET search_path = public;
ALTER FUNCTION public.create_conversation_on_match() SET search_path = public;