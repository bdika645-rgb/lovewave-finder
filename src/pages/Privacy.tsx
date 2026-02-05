import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Heart, ArrowRight, ChevronUp, Lock, Eye, Database, Cookie, Clock, Mail } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const Privacy = () => {
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
    { id: "collection", title: "מידע שאנו אוספים", icon: Database },
    { id: "usage", title: "שימוש במידע", icon: Eye },
    { id: "sharing", title: "שיתוף מידע", icon: Heart },
    { id: "security", title: "אבטחת מידע", icon: Lock },
    { id: "rights", title: "הזכויות שלכם", icon: Shield },
    { id: "cookies", title: "עוגיות (Cookies)", icon: Cookie },
    { id: "retention", title: "שמירת מידע", icon: Clock },
    { id: "contact", title: "יצירת קשר", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <SEOHead 
        title="מדיניות פרטיות"
        description="מדיניות הפרטיות של Spark - כיצד אנו אוספים, משתמשים ומגנים על המידע האישי שלכם"
      />
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
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
                  className="text-sm px-3 py-1.5 bg-background rounded-lg hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <section.icon className="w-3 h-3" />
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
              <section id="collection">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Database className="w-4 h-4 text-primary" />
                  </span>
                  מידע שאנו אוספים
                </h2>
                <p className="text-muted-foreground mb-4">אנו אוספים את המידע הבא:</p>
                <ul className="list-none text-muted-foreground space-y-3">
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <span><strong>מידע אישי:</strong> שם, גיל, מגדר, עיר מגורים</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <span><strong>פרטי התקשרות:</strong> כתובת אימייל</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <span><strong>תוכן פרופיל:</strong> תמונות, ביוגרפיה, תחומי עניין</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <span><strong>נתוני שימוש:</strong> לייקים, הודעות, פעילות באפליקציה</span>
                  </li>
                </ul>
              </section>

              <section id="usage">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Eye className="w-4 h-4 text-primary" />
                  </span>
                  שימוש במידע
                </h2>
                <p className="text-muted-foreground mb-4">אנו משתמשים במידע שלכם כדי:</p>
                <ul className="list-none text-muted-foreground space-y-3">
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <span>לספק ולשפר את השירות</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <span>להתאים לכם התאמות פוטנציאליות</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <span>לתקשר עמכם בנוגע לחשבון שלכם</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <span>להבטיח את הבטיחות והאבטחה של הפלטפורמה</span>
                  </li>
                </ul>
              </section>

              <section id="sharing">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Heart className="w-4 h-4 text-primary" />
                  </span>
                  שיתוף מידע
                </h2>
                <p className="text-muted-foreground mb-4">
                  אנו לא מוכרים או משכירים את המידע האישי שלכם לצדדים שלישיים. 
                  אנו משתפים מידע רק במקרים הבאים:
                </p>
                <ul className="list-none text-muted-foreground space-y-3">
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <span>עם משתמשים אחרים בהתאם להגדרות הפרטיות שלכם</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <span>כאשר נדרש על פי חוק</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <span>עם ספקי שירות שעוזרים לנו להפעיל את הפלטפורמה</span>
                  </li>
                </ul>
              </section>

              <section id="security">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Lock className="w-4 h-4 text-primary" />
                  </span>
                  אבטחת מידע
                </h2>
                <div className="bg-success/10 border border-success/20 rounded-2xl p-4">
                  <p className="text-muted-foreground">
                    🔒 אנו מיישמים אמצעי אבטחה מתקדמים להגנה על המידע שלכם, כולל הצפנה, 
                    אימות דו-שלבי וניטור רציף.
                  </p>
                </div>
              </section>

              <section id="rights">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-primary" />
                  </span>
                  הזכויות שלכם
                </h2>
                <p className="text-muted-foreground mb-4">יש לכם את הזכות:</p>
                <ul className="list-none text-muted-foreground space-y-3">
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <span>לגשת למידע האישי שלכם</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <span>לתקן מידע שגוי</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <span>למחוק את החשבון והמידע שלכם</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <span>להגביל את עיבוד המידע</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <span>להתנגד לשימוש במידע שלכם</span>
                  </li>
                </ul>
              </section>

              <section id="cookies">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Cookie className="w-4 h-4 text-primary" />
                  </span>
                  עוגיות (Cookies)
                </h2>
                <p className="text-muted-foreground">
                  🍪 אנו משתמשים בעוגיות כדי לשפר את חוויית המשתמש ולנתח את השימוש באתר. 
                  תוכלו לנהל את העדפות העוגיות בהגדרות הדפדפן שלכם.
                </p>
              </section>

              <section id="retention">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-primary" />
                  </span>
                  שמירת מידע
                </h2>
                <p className="text-muted-foreground">
                  אנו שומרים את המידע שלכם כל עוד החשבון שלכם פעיל. לאחר מחיקת החשבון, 
                  המידע יימחק תוך 30 יום, למעט מידע שעלינו לשמור על פי חוק.
                </p>
              </section>

              <section id="contact">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-primary" />
                  </span>
                  יצירת קשר
                </h2>
                <p className="text-muted-foreground">
                  לכל שאלה בנוגע לפרטיות, ניתן לפנות אלינו בכתובת: 
                  <a href="mailto:privacy@spark.co.il" className="text-primary hover:underline mr-1">
                    privacy@spark.co.il
                  </a>
                </p>
              </section>
            </div>

            {/* Bottom Navigation */}
            <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link to="/terms" className="group">
                <Button variant="outline" className="gap-2">
                  תנאי שימוש
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
          className="fixed bottom-6 left-6 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-elevated flex items-center justify-center hover:scale-110 transition-transform z-50"
          aria-label="חזרה למעלה"
        >
          <ChevronUp className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  );
};

export default Privacy;
