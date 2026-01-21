-- Create support_tickets table for storing support form submissions
CREATE TABLE public.support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES public.profiles(id),
  admin_note TEXT
);

-- Enable RLS
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Anyone can create tickets (public form)
CREATE POLICY "Anyone can create support tickets"
ON public.support_tickets
FOR INSERT
WITH CHECK (true);

-- Admins can view all tickets
CREATE POLICY "Admins can view all tickets"
ON public.support_tickets
FOR SELECT
USING (is_admin());

-- Admins can update tickets
CREATE POLICY "Admins can update tickets"
ON public.support_tickets
FOR UPDATE
USING (is_admin());

-- Admins can delete tickets
CREATE POLICY "Admins can delete tickets"
ON public.support_tickets
FOR DELETE
USING (is_admin());

-- Create site_statistics table for dynamic stats
CREATE TABLE public.site_statistics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stat_key TEXT NOT NULL UNIQUE,
  stat_value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_statistics ENABLE ROW LEVEL SECURITY;

-- Anyone can view statistics
CREATE POLICY "Anyone can view statistics"
ON public.site_statistics
FOR SELECT
USING (true);

-- Admins can manage statistics
CREATE POLICY "Admins can manage statistics"
ON public.site_statistics
FOR ALL
USING (is_admin());

-- Insert default statistics
INSERT INTO public.site_statistics (stat_key, stat_value) VALUES
  ('total_members', '0'),
  ('successful_matches', '0'),
  ('messages_per_day', '0'),
  ('daily_active_users', '0'),
  ('most_active_city', 'תל אביב'),
  ('average_match_time', '3 ימים');

-- Create function to update statistics
CREATE OR REPLACE FUNCTION public.update_site_statistics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update total members count
  UPDATE public.site_statistics 
  SET stat_value = (SELECT COUNT(*)::text FROM public.profiles WHERE is_blocked = false AND is_visible = true),
      updated_at = now()
  WHERE stat_key = 'total_members';
  
  -- Update successful matches count
  UPDATE public.site_statistics 
  SET stat_value = (SELECT COUNT(*)::text FROM public.matches),
      updated_at = now()
  WHERE stat_key = 'successful_matches';
  
  -- Update messages per day (average of last 7 days)
  UPDATE public.site_statistics 
  SET stat_value = (
    SELECT COALESCE(ROUND(COUNT(*)::numeric / 7), 0)::text 
    FROM public.messages 
    WHERE created_at > now() - interval '7 days'
  ),
      updated_at = now()
  WHERE stat_key = 'messages_per_day';
  
  -- Update daily active users (users active in last 24 hours)
  UPDATE public.site_statistics 
  SET stat_value = (
    SELECT COUNT(*)::text 
    FROM public.profiles 
    WHERE last_seen > now() - interval '24 hours'
  ),
      updated_at = now()
  WHERE stat_key = 'daily_active_users';
  
  -- Update most active city
  UPDATE public.site_statistics 
  SET stat_value = (
    SELECT COALESCE(city, 'תל אביב')
    FROM public.profiles 
    WHERE is_blocked = false AND is_visible = true
    GROUP BY city 
    ORDER BY COUNT(*) DESC 
    LIMIT 1
  ),
      updated_at = now()
  WHERE stat_key = 'most_active_city';
END;
$$;

-- Create trigger for updated_at
CREATE TRIGGER update_support_tickets_updated_at
BEFORE UPDATE ON public.support_tickets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();