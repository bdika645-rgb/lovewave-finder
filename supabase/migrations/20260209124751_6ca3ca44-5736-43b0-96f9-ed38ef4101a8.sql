
-- Create profile_prompts table for Hinge-style profile questions
CREATE TABLE public.profile_prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  prompt_question TEXT NOT NULL,
  prompt_answer TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profile_prompts ENABLE ROW LEVEL SECURITY;

-- Everyone can read prompts (they're displayed on profiles)
CREATE POLICY "Profile prompts are viewable by everyone"
  ON public.profile_prompts FOR SELECT
  USING (true);

-- Users can manage their own prompts
CREATE POLICY "Users can insert their own prompts"
  ON public.profile_prompts FOR INSERT
  WITH CHECK (profile_id = public.get_my_profile_id());

CREATE POLICY "Users can update their own prompts"
  ON public.profile_prompts FOR UPDATE
  USING (profile_id = public.get_my_profile_id());

CREATE POLICY "Users can delete their own prompts"
  ON public.profile_prompts FOR DELETE
  USING (profile_id = public.get_my_profile_id());

-- Index for fast lookups
CREATE INDEX idx_profile_prompts_profile_id ON public.profile_prompts(profile_id);

-- Trigger for updated_at
CREATE TRIGGER update_profile_prompts_updated_at
  BEFORE UPDATE ON public.profile_prompts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
