-- 1. תיקון RLS ל-support_tickets - מאפשר רק מייל תואם למשתמש המחובר
DROP POLICY IF EXISTS "Authenticated users can create support tickets" ON support_tickets;

CREATE POLICY "Users can only create tickets with own email"
ON support_tickets FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  email = (SELECT email FROM auth.users WHERE id = auth.uid())::text
);

-- 2. הוספת RLS policy שמאפשרת צפייה בסטטיסטיקות לכולם (לדף הבית)
DROP POLICY IF EXISTS "Only admins can view statistics" ON site_statistics;

CREATE POLICY "Anyone can view statistics"
ON site_statistics FOR SELECT
USING (true);

-- 3. יצירת טבלת public_settings לנתונים ציבוריים
CREATE TABLE IF NOT EXISTS public.public_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.public_settings ENABLE ROW LEVEL SECURITY;

-- כולם יכולים לקרוא
CREATE POLICY "Anyone can read public settings"
ON public.public_settings FOR SELECT
USING (true);

-- רק מנהלים יכולים לשנות
CREATE POLICY "Admins can manage public settings"
ON public.public_settings FOR ALL
USING (is_admin());

-- הכנסת הגדרות ציבוריות ברירת מחדל
INSERT INTO public.public_settings (key, value) VALUES
  ('site_name', '"Spark"'),
  ('show_demo_stats', 'true'),
  ('min_age', '18'),
  ('max_age', '99')
ON CONFLICT (key) DO NOTHING;