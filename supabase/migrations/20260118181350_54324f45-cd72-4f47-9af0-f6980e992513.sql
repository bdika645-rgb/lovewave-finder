-- Make user_id nullable for demo profiles (profiles without real users)
ALTER TABLE public.profiles ALTER COLUMN user_id DROP NOT NULL;

-- Add a flag to identify demo profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;