import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Heart, ArrowRight, ChevronUp } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const Terms = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sections = [
    { id: "agreement", title: "הסכמה לתנאים" },
    { id: "eligibility", title: "כשירות לשימוש" },
    { id: "conduct", title: "התנהלות משתמשים" },
    { id: "content", title: "תוכן משתמשים" },
    { id: "termination", title: "ביטול וסיום" },
    { id: "liability", title: "הגבלת אחריות" },
    { id: "changes", title: "שינויים בתנאים" },
    { id: "contact", title: "יצירת קשר" },
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <SEOHead 
        title="תנאי שימוש"
        description="תנאי השימוש של Spark - קראו את התנאים וההגבלות לשימוש באפליקציית ההיכרויות שלנו"
      />
      <Navbar />
      
      <div className="pt-24 pb-24 md:pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
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
          </motion.div>

          {/* Quick Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-muted/50 rounded-2xl p-4 mb-8"
          >
            <p className="text-sm font-medium text-muted-foreground mb-3">ניווט מהיר:</p>
            <div className="flex flex-wrap gap-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-sm px-3 py-1.5 bg-background rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-3xl p-8 md:p-12 shadow-card"
          >
            <div className="prose prose-lg dark:prose-invert max-w-none text-right space-y-8">
              <section id="agreement">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-sm font-bold">1</span>
                  הסכמה לתנאים
                </h2>
                <p className="text-muted-foreground">
                  בעצם השימוש באפליקציית Spark, אתם מסכימים לתנאי השימוש המפורטים להלן. 
                  אם אינכם מסכימים לתנאים אלו, אנא הימנעו משימוש בשירות.
                </p>
              </section>

              <section id="eligibility">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-sm font-bold">2</span>
                  כשירות לשימוש
                </h2>
                <p className="text-muted-foreground">
                  השירות מיועד למשתמשים בני 18 ומעלה בלבד. בעצם יצירת חשבון, אתם מאשרים 
                  שאתם בני 18 לפחות ובעלי כשרות משפטית להתקשר בהסכם זה.
                </p>
              </section>

              <section id="conduct">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-sm font-bold">3</span>
                  התנהלות משתמשים
                </h2>
                <p className="text-muted-foreground mb-4">אתם מתחייבים:</p>
                <ul className="list-none text-muted-foreground space-y-3">
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <span>לספק מידע אמיתי ומדויק</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <span>לא להעלות תוכן פוגעני, מטריד או בלתי חוקי</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <span>לא להתחזות לאדם אחר</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <span>לא להשתמש בשירות למטרות מסחריות ללא אישור</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <span>לכבד את הפרטיות של משתמשים אחרים</span>
                  </li>
                </ul>
              </section>

              <section id="content">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-sm font-bold">4</span>
                  תוכן משתמשים
                </h2>
                <p className="text-muted-foreground">
                  אתם אחראים לכל התוכן שאתם מעלים לפלטפורמה. אנו שומרים לעצמנו את הזכות 
                  להסיר תוכן שאינו עומד בהנחיות הקהילה שלנו.
                </p>
              </section>

              <section id="termination">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-sm font-bold">5</span>
                  ביטול וסיום
                </h2>
                <p className="text-muted-foreground">
                  אתם רשאים למחוק את חשבונכם בכל עת. אנו שומרים לעצמנו את הזכות להשעות 
                  או לסיים חשבונות שמפרים את תנאי השימוש.
                </p>
              </section>

              <section id="liability">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-sm font-bold">6</span>
                  הגבלת אחריות
                </h2>
                <p className="text-muted-foreground">
                  השירות מסופק "כמות שהוא". איננו אחראים לכל נזק שעלול להיגרם משימוש בשירות 
                  או מאינטראקציות עם משתמשים אחרים.
                </p>
              </section>

              <section id="changes">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-sm font-bold">7</span>
                  שינויים בתנאים
                </h2>
                <p className="text-muted-foreground">
                  אנו עשויים לעדכן תנאים אלו מעת לעת. שימוש מתמשך בשירות לאחר עדכון 
                  מהווה הסכמה לתנאים המעודכנים.
                </p>
              </section>

              <section id="contact">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-sm font-bold">8</span>
                  יצירת קשר
                </h2>
                <p className="text-muted-foreground">
                  לכל שאלה בנוגע לתנאי השימוש, ניתן לפנות אלינו בכתובת: 
                  <a href="mailto:legal@spark.co.il" className="text-primary hover:underline mr-1">
                    legal@spark.co.il
                  </a>
                </p>
              </section>
            </div>

            {/* Bottom Navigation */}
            <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link to="/privacy" className="group">
                <Button variant="outline" className="gap-2">
                  מדיניות פרטיות
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                </Button>
              </Link>
              <Link to="/">
                <Button variant="hero" className="gap-2">
                  <Heart className="w-4 h-4" />
                  חזרה לדף הבית
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-20 md:bottom-6 left-6 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-elevated flex items-center justify-center hover:scale-110 transition-transform z-50"
          aria-label="חזרה למעלה"
        >
          <ChevronUp className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  );
};

export default Terms;
