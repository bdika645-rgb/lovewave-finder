-- שלב 1: תיקוני אבטחה - עדכון RLS policies

-- תיקון RLS לטבלת site_statistics - הגבלה למשתמשים מחוברים בלבד
DROP POLICY IF EXISTS "Anyone can view statistics" ON public.site_statistics;
CREATE POLICY "Authenticated users can view statistics" 
ON public.site_statistics 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- תיקון RLS לטבלת support_tickets - הסרת WITH CHECK (true) והגבלת הגישה
DROP POLICY IF EXISTS "Anyone can create support tickets" ON public.support_tickets;
CREATE POLICY "Authenticated users can create support tickets" 
ON public.support_tickets 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- הוספת policy לצפייה בטיקטים של עצמך
DROP POLICY IF EXISTS "Users can view their own tickets" ON public.support_tickets;
CREATE POLICY "Users can view their own tickets" 
ON public.support_tickets 
FOR SELECT 
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- עדכון RLS לפרופילים - הגבלת מידע לציבור
DROP POLICY IF EXISTS "Anyone can view visible profiles" ON public.profiles;

-- פרופילים מלאים רק למשתמשים מחוברים
CREATE POLICY "Authenticated users can view visible profiles" 
ON public.profiles 
FOR SELECT 
USING (
  is_admin() OR 
  (user_id = auth.uid()) OR 
  (auth.uid() IS NOT NULL AND is_visible = true AND is_blocked = false)
);