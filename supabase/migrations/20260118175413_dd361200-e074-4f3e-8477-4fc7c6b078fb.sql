-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18 AND age <= 120),
  city TEXT NOT NULL,
  bio TEXT,
  interests TEXT[] DEFAULT '{}',
  avatar_url TEXT,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  looking_for TEXT CHECK (looking_for IN ('male', 'female', 'both')),
  is_online BOOLEAN DEFAULT false,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create photos table
CREATE TABLE public.photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create likes table
CREATE TABLE public.likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  liker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  liked_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(liker_id, liked_id),
  CHECK (liker_id != liked_id)
);

-- Create matches table (mutual likes)
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  profile2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CHECK (profile1_id < profile2_id),
  UNIQUE(profile1_id, profile2_id)
);

-- Create conversations table
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create conversation participants table
CREATE TABLE public.conversation_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(conversation_id, profile_id)
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's profile id
CREATE OR REPLACE FUNCTION public.get_my_profile_id()
RETURNS UUID AS $$
  SELECT id FROM public.profiles WHERE user_id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Helper function to check if user is conversation participant
CREATE OR REPLACE FUNCTION public.is_conversation_participant(conv_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversation_participants 
    WHERE conversation_id = conv_id 
    AND profile_id = public.get_my_profile_id()
  )
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Profiles RLS policies
CREATE POLICY "Anyone can view profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile" ON public.profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Photos RLS policies
CREATE POLICY "Anyone can view photos" ON public.photos
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own photos" ON public.photos
  FOR INSERT WITH CHECK (profile_id = public.get_my_profile_id());

CREATE POLICY "Users can update own photos" ON public.photos
  FOR UPDATE USING (profile_id = public.get_my_profile_id());

CREATE POLICY "Users can delete own photos" ON public.photos
  FOR DELETE USING (profile_id = public.get_my_profile_id());

-- Likes RLS policies
CREATE POLICY "Users can view their likes" ON public.likes
  FOR SELECT USING (liker_id = public.get_my_profile_id() OR liked_id = public.get_my_profile_id());

CREATE POLICY "Users can create likes" ON public.likes
  FOR INSERT WITH CHECK (liker_id = public.get_my_profile_id());

CREATE POLICY "Users can delete own likes" ON public.likes
  FOR DELETE USING (liker_id = public.get_my_profile_id());

-- Matches RLS policies
CREATE POLICY "Users can view their matches" ON public.matches
  FOR SELECT USING (profile1_id = public.get_my_profile_id() OR profile2_id = public.get_my_profile_id());

-- Conversations RLS policies
CREATE POLICY "Participants can view conversations" ON public.conversations
  FOR SELECT USING (public.is_conversation_participant(id));

CREATE POLICY "Authenticated users can create conversations" ON public.conversations
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Conversation participants RLS policies
CREATE POLICY "Participants can view participants" ON public.conversation_participants
  FOR SELECT USING (public.is_conversation_participant(conversation_id));

CREATE POLICY "Users can add themselves to conversations" ON public.conversation_participants
  FOR INSERT WITH CHECK (profile_id = public.get_my_profile_id());

-- Messages RLS policies
CREATE POLICY "Participants can view messages" ON public.messages
  FOR SELECT USING (public.is_conversation_participant(conversation_id));

CREATE POLICY "Participants can send messages" ON public.messages
  FOR INSERT WITH CHECK (
    public.is_conversation_participant(conversation_id) 
    AND sender_id = public.get_my_profile_id()
  );

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create match when mutual like
CREATE OR REPLACE FUNCTION public.create_match_on_mutual_like()
RETURNS TRIGGER AS $$
DECLARE
  mutual_exists BOOLEAN;
  p1 UUID;
  p2 UUID;
BEGIN
  -- Check if the liked person already liked the liker
  SELECT EXISTS (
    SELECT 1 FROM public.likes 
    WHERE liker_id = NEW.liked_id AND liked_id = NEW.liker_id
  ) INTO mutual_exists;
  
  IF mutual_exists THEN
    -- Order profile IDs for consistency
    IF NEW.liker_id < NEW.liked_id THEN
      p1 := NEW.liker_id;
      p2 := NEW.liked_id;
    ELSE
      p1 := NEW.liked_id;
      p2 := NEW.liker_id;
    END IF;
    
    -- Create match if doesn't exist
    INSERT INTO public.matches (profile1_id, profile2_id)
    VALUES (p1, p2)
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_create_match
  AFTER INSERT ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.create_match_on_mutual_like();

-- Function to auto-create conversation on match
CREATE OR REPLACE FUNCTION public.create_conversation_on_match()
RETURNS TRIGGER AS $$
DECLARE
  new_conv_id UUID;
BEGIN
  -- Create new conversation
  INSERT INTO public.conversations DEFAULT VALUES
  RETURNING id INTO new_conv_id;
  
  -- Add both participants
  INSERT INTO public.conversation_participants (conversation_id, profile_id)
  VALUES 
    (new_conv_id, NEW.profile1_id),
    (new_conv_id, NEW.profile2_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_create_conversation
  AFTER INSERT ON public.matches
  FOR EACH ROW EXECUTE FUNCTION public.create_conversation_on_match();

-- Create indexes for performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_photos_profile_id ON public.photos(profile_id);
CREATE INDEX idx_likes_liker_id ON public.likes(liker_id);
CREATE INDEX idx_likes_liked_id ON public.likes(liked_id);
CREATE INDEX idx_matches_profile1 ON public.matches(profile1_id);
CREATE INDEX idx_matches_profile2 ON public.matches(profile2_id);
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_conversation_participants_conversation ON public.conversation_participants(conversation_id);
CREATE INDEX idx_conversation_participants_profile ON public.conversation_participants(profile_id);