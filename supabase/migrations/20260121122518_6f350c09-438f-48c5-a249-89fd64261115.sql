-- יצירת טבלה לסטטיסטיקות צפייה בפרופיל
CREATE TABLE IF NOT EXISTS public.profile_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  viewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  view_date DATE NOT NULL DEFAULT CURRENT_DATE,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- יצירת אינדקס ייחודי
CREATE UNIQUE INDEX IF NOT EXISTS profile_views_unique_daily 
ON public.profile_views (profile_id, viewer_id, view_date);

-- הפעלת RLS על טבלת הצפיות
ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;

-- משתמשים יכולים לראות מי צפה בהם
CREATE POLICY "Users can view their profile views" 
ON public.profile_views 
FOR SELECT 
USING (profile_id = get_my_profile_id());

-- משתמשים יכולים להוסיף צפיות
CREATE POLICY "Users can add profile views" 
ON public.profile_views 
FOR INSERT 
WITH CHECK (viewer_id = get_my_profile_id());

-- יצירת טבלה לשאלות לשבירת קרח (Icebreakers)
CREATE TABLE IF NOT EXISTS public.icebreakers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- הפעלת RLS
ALTER TABLE public.icebreakers ENABLE ROW LEVEL SECURITY;

-- כל המשתמשים המאומתים יכולים לראות את השאלות
CREATE POLICY "Authenticated users can view icebreakers" 
ON public.icebreakers 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND is_active = true);

-- רק מנהלים יכולים לנהל שאלות
CREATE POLICY "Admins can manage icebreakers" 
ON public.icebreakers 
FOR ALL 
USING (is_admin());

-- הוספת שאלות ראשוניות
INSERT INTO public.icebreakers (question, category) VALUES
('מה הדבר הכי מפתיע שקרה לך השבוע?', 'general'),
('אם היית יכול/ה לטוס לכל מקום בעולם עכשיו, לאן היית נוסע/ת?', 'travel'),
('מה השיר שגורם לך להרגיש הכי טוב?', 'entertainment'),
('מה הספר או הסדרה האחרונה שלא הצלחת להפסיק?', 'entertainment'),
('מה הפעילות שאתה/את הכי אוהב/ת לעשות בסוף שבוע?', 'hobbies'),
('אם היית יכול/ה ללמוד מיומנות חדשה מחר, מה זה היה?', 'general'),
('מה המקום האהוב עליך בעיר?', 'local'),
('קפה או תה? ולמה?', 'simple');