import Navbar from "@/components/Navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <FileText className="w-5 h-5" />
              <span className="font-medium">מסמך משפטי</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              תנאי שימוש
            </h1>
            <p className="text-muted-foreground">
              עודכן לאחרונה: ינואר 2025
            </p>
          </div>

          <div className="bg-card rounded-3xl p-8 md:p-12 shadow-card">
            <ScrollArea className="h-auto">
              <div className="prose prose-lg dark:prose-invert max-w-none text-right">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  1. הסכמה לתנאים
                </h2>
                <p className="text-muted-foreground mb-6">
                  בעצם השימוש באפליקציית Spark, אתם מסכימים לתנאי השימוש המפורטים להלן. 
                  אם אינכם מסכימים לתנאים אלו, אנא הימנעו משימוש בשירות.
                </p>

                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  2. כשירות לשימוש
                </h2>
                <p className="text-muted-foreground mb-6">
                  השירות מיועד למשתמשים בני 18 ומעלה בלבד. בעצם יצירת חשבון, אתם מאשרים 
                  שאתם בני 18 לפחות ובעלי כשרות משפטית להתקשר בהסכם זה.
                </p>

                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  3. התנהלות משתמשים
                </h2>
                <p className="text-muted-foreground mb-4">אתם מתחייבים:</p>
                <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
                  <li>לספק מידע אמיתי ומדויק</li>
                  <li>לא להעלות תוכן פוגעני, מטריד או בלתי חוקי</li>
                  <li>לא להתחזות לאדם אחר</li>
                  <li>לא להשתמש בשירות למטרות מסחריות ללא אישור</li>
                  <li>לכבד את הפרטיות של משתמשים אחרים</li>
                </ul>

                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  4. תוכן משתמשים
                </h2>
                <p className="text-muted-foreground mb-6">
                  אתם אחראים לכל התוכן שאתם מעלים לפלטפורמה. אנו שומרים לעצמנו את הזכות 
                  להסיר תוכן שאינו עומד בהנחיות הקהילה שלנו.
                </p>

                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  5. ביטול וסיום
                </h2>
                <p className="text-muted-foreground mb-6">
                  אתם רשאים למחוק את חשבונכם בכל עת. אנו שומרים לעצמנו את הזכות להשעות 
                  או לסיים חשבונות שמפרים את תנאי השימוש.
                </p>

                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  6. הגבלת אחריות
                </h2>
                <p className="text-muted-foreground mb-6">
                  השירות מסופק "כמות שהוא". איננו אחראים לכל נזק שעלול להיגרם משימוש בשירות 
                  או מאינטראקציות עם משתמשים אחרים.
                </p>

                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  7. שינויים בתנאים
                </h2>
                <p className="text-muted-foreground mb-6">
                  אנו עשויים לעדכן תנאים אלו מעת לעת. שימוש מתמשך בשירות לאחר עדכון 
                  מהווה הסכמה לתנאים המעודכנים.
                </p>

                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  8. יצירת קשר
                </h2>
                <p className="text-muted-foreground">
                  לכל שאלה בנוגע לתנאי השימוש, ניתן לפנות אלינו בכתובת: 
                  <a href="mailto:legal@spark.co.il" className="text-primary hover:underline mr-1">
                    legal@spark.co.il
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

export default Terms;
