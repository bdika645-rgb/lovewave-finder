-- Create dating_tips table for CMS functionality
CREATE TABLE public.dating_tips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dating_tips ENABLE ROW LEVEL SECURITY;

-- Anyone can read active tips
CREATE POLICY "Anyone can view active tips" 
ON public.dating_tips 
FOR SELECT 
USING (is_active = true OR is_admin());

-- Only admins can manage tips
CREATE POLICY "Admins can manage tips" 
ON public.dating_tips 
FOR ALL 
USING (is_admin());

-- Create trigger for updated_at
CREATE TRIGGER update_dating_tips_updated_at
BEFORE UPDATE ON public.dating_tips
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default tips
INSERT INTO public.dating_tips (title, content, category, order_index, is_active) VALUES
('איך לכתוב ביו מושך', 'הביו שלכם הוא הדבר הראשון שאנשים קוראים. כתבו משהו אותנטי ומעניין שמשקף את האישיות שלכם. הוסיפו קצת הומור!', 'פרופיל', 0, true),
('בחירת תמונות נכונה', 'תמונה ראשית ברורה עם חיוך, תמונות מפעילויות שאתם אוהבים, ותמונה אחת לפחות של כל הגוף. הימנעו מפילטרים מוגזמים.', 'פרופיל', 1, true),
('הודעה ראשונה מנצחת', 'הימנעו מ''היי מה נשמע''. התייחסו למשהו ספציפי מהפרופיל שלהם. שאלו שאלה פתוחה שמזמינה לשיחה.', 'שיחות', 2, true),
('מתי לבקש להיפגש', 'אחרי כמה ימים של שיחה טובה, הציעו להיפגש. יותר מדי זמן בצ''אט עלול להוביל לאכזבה במפגש האמיתי.', 'דייטים', 3, true),
('רעיונות לדייט ראשון', 'בית קפה או בר הם אופציות קלאסיות. פעילות משותפת כמו גלריה או שוק יכולה לשבור את הקרח בקלות.', 'דייטים', 4, true),
('איך להתמודד עם דחייה', 'דחייה היא חלק מהמשחק. אל תיקחו את זה אישית. המשיכו הלאה ותזכרו שיש מישהו בשבילכם.', 'מוטיבציה', 5, true);