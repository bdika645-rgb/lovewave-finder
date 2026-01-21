import Navbar from "@/components/Navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <Shield className="w-5 h-5" />
              <span className="font-medium">פרטיות ואבטחה</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              מדיניות פרטיות
            </h1>
            <p className="text-muted-foreground">
              עודכן לאחרונה: ינואר 2025
            </p>
          </div>

          <div className="bg-card rounded-3xl p-8 md:p-12 shadow-card">
            <ScrollArea className="h-auto">
              <div className="prose prose-lg dark:prose-invert max-w-none text-right">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  1. מידע שאנו אוספים
                </h2>
                <p className="text-muted-foreground mb-4">אנו אוספים את המידע הבא:</p>
                <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
                  <li>מידע אישי: שם, גיל, מגדר, עיר מגורים</li>
                  <li>פרטי התקשרות: כתובת אימייל</li>
                  <li>תוכן פרופיל: תמונות, ביוגרפיה, תחומי עניין</li>
                  <li>נתוני שימוש: לייקים, הודעות, פעילות באפליקציה</li>
                </ul>

                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  2. שימוש במידע
                </h2>
                <p className="text-muted-foreground mb-4">אנו משתמשים במידע שלכם כדי:</p>
                <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
                  <li>לספק ולשפר את השירות</li>
                  <li>להתאים לכם התאמות פוטנציאליות</li>
                  <li>לתקשר עמכם בנוגע לחשבון שלכם</li>
                  <li>להבטיח את הבטיחות והאבטחה של הפלטפורמה</li>
                </ul>

                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  3. שיתוף מידע
                </h2>
                <p className="text-muted-foreground mb-6">
                  אנו לא מוכרים או משכירים את המידע האישי שלכם לצדדים שלישיים. 
                  אנו משתפים מידע רק במקרים הבאים:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
                  <li>עם משתמשים אחרים בהתאם להגדרות הפרטיות שלכם</li>
                  <li>כאשר נדרש על פי חוק</li>
                  <li>עם ספקי שירות שעוזרים לנו להפעיל את הפלטפורמה</li>
                </ul>

                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  4. אבטחת מידע
                </h2>
                <p className="text-muted-foreground mb-6">
                  אנו מיישמים אמצעי אבטחה מתקדמים להגנה על המידע שלכם, כולל הצפנה, 
                  אימות דו-שלבי וניטור רציף.
                </p>

                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  5. הזכויות שלכם
                </h2>
                <p className="text-muted-foreground mb-4">יש לכם את הזכות:</p>
                <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
                  <li>לגשת למידע האישי שלכם</li>
                  <li>לתקן מידע שגוי</li>
                  <li>למחוק את החשבון והמידע שלכם</li>
                  <li>להגביל את עיבוד המידע</li>
                  <li>להתנגד לשימוש במידע שלכם</li>
                </ul>

                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  6. עוגיות (Cookies)
                </h2>
                <p className="text-muted-foreground mb-6">
                  אנו משתמשים בעוגיות כדי לשפר את חוויית המשתמש ולנתח את השימוש באתר. 
                  תוכלו לנהל את העדפות העוגיות בהגדרות הדפדפן שלכם.
                </p>

                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  7. שמירת מידע
                </h2>
                <p className="text-muted-foreground mb-6">
                  אנו שומרים את המידע שלכם כל עוד החשבון שלכם פעיל. לאחר מחיקת החשבון, 
                  המידע יימחק תוך 30 יום, למעט מידע שעלינו לשמור על פי חוק.
                </p>

                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  8. יצירת קשר
                </h2>
                <p className="text-muted-foreground">
                  לכל שאלה בנוגע לפרטיות, ניתן לפנות אלינו בכתובת: 
                  <a href="mailto:privacy@spark.co.il" className="text-primary hover:underline mr-1">
                    privacy@spark.co.il
                  </a>
                </p>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
