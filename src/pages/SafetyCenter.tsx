import Navbar from "@/components/Navbar";
import SkipToContent from "@/components/SkipToContent";
import SEOHead from "@/components/SEOHead";
import ScrollToTop from "@/components/ScrollToTop";
import { Shield, AlertTriangle, Phone, MessageCircle, Eye, Lock, UserX, MapPin, Heart, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const safetyTips = [
  {
    icon: UserX,
    title: "אל תשתפו מידע אישי",
    description: "לעולם אל תשתפו את כתובת המגורים, מקום העבודה, מספר טלפון או פרטים פיננסיים עם מישהו שלא פגשתם אישית.",
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
  {
    icon: MapPin,
    title: "פגישה ראשונה במקום ציבורי",
    description: "תמיד קבעו פגישות ראשונות במקומות ציבוריים ועמוסים. ספרו לחבר או בן משפחה לאן אתם הולכים.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Phone,
    title: "ספרו למישהו",
    description: "שתפו חבר קרוב בפרטי הדייט - מיקום, שם, ותמונה של מי שאתם פוגשים. קבעו 'שיחת בטיחות' אחרי הדייט.",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    icon: Eye,
    title: "שימו לב לדגלים אדומים",
    description: "אם מישהו מפעיל לחץ, מתחמק משיחות וידאו, מבקש כסף, או שהסיפור שלו לא מסתדר - חשבו פעמיים.",
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    icon: Lock,
    title: "שמרו על הסיסמה שלכם",
    description: "השתמשו בסיסמה חזקה וייחודית. לעולם אל תשתפו את פרטי ההתחברות שלכם עם אף אחד.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: AlertTriangle,
    title: "דווחו על התנהגות חשודה",
    description: "אם מישהו מטריד, מאיים או מתנהג בצורה חשודה - דווחו עליו מיד דרך כפתור הדיווח בפרופיל.",
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
];

const SafetyCenter = () => {
  return (
    <div className="min-h-screen bg-muted/20" dir="rtl">
      <SkipToContent />
      <SEOHead
        title="מרכז בטיחות"
        description="טיפים ומידע חשוב לשמירה על הבטיחות שלכם בדייטינג אונליין"
        keywords="בטיחות, דייטינג, טיפים, אונליין"
      />
      <Navbar />

      <main id="main-content" className="container mx-auto px-6 pt-28 pb-24 md:pb-16 max-w-4xl">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">
            מרכז בטיחות
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            הבטיחות שלכם חשובה לנו מעל הכל. קראו את הטיפים הבאים כדי ליהנות מחוויית היכרויות בטוחה ומהנה.
          </p>
        </motion.div>

        {/* Safety Tips Grid */}
        <div className="grid gap-4 md:grid-cols-2 mb-12">
          {safetyTips.map((tip, i) => (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="h-full hover:shadow-elevated transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl ${tip.bg} flex items-center justify-center shrink-0`}>
                      <tip.icon className={`w-5 h-5 ${tip.color}`} />
                    </div>
                    <CardTitle className="text-lg">{tip.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {tip.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Emergency Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-destructive/5 to-destructive/10 border border-destructive/20 rounded-3xl p-8 mb-12"
        >
          <h2 className="font-display text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-destructive" />
            במקרה חירום
          </h2>
          <p className="text-muted-foreground mb-6">
            אם אתם מרגישים בסכנה מיידית, אל תהססו לפנות לגורמים הרשמיים:
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="bg-card rounded-xl p-4 flex items-center gap-3">
              <Phone className="w-5 h-5 text-destructive" />
              <div>
                <p className="font-bold text-foreground">משטרה</p>
                <p className="text-muted-foreground text-lg font-mono">100</p>
              </div>
            </div>
            <div className="bg-card rounded-xl p-4 flex items-center gap-3">
              <Phone className="w-5 h-5 text-destructive" />
              <div>
                <p className="font-bold text-foreground">עזרה ראשונה (מד"א)</p>
                <p className="text-muted-foreground text-lg font-mono">101</p>
              </div>
            </div>
            <div className="bg-card rounded-xl p-4 flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-primary" />
              <div>
                <p className="font-bold text-foreground">ער"ן - עזרה נפשית</p>
                <p className="text-muted-foreground text-lg font-mono">1201</p>
              </div>
            </div>
            <div className="bg-card rounded-xl p-4 flex items-center gap-3">
              <Heart className="w-5 h-5 text-primary" />
              <div>
                <p className="font-bold text-foreground">קו החירום לנשים מוכות</p>
                <p className="text-muted-foreground text-lg font-mono">1-800-353-300</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Our Commitment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card rounded-3xl p-8 shadow-card mb-8"
        >
          <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-success" />
            ההתחייבות שלנו
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <p>✅ צוות מודרציה פעיל שבודק דיווחים על פרופילים</p>
            <p>✅ אפשרות לחסום משתמשים בלחיצת כפתור</p>
            <p>✅ הצפנת נתונים מקצה לקצה</p>
            <p>✅ אימות פרופילים למניעת זיופים</p>
            <p>✅ הסרה מיידית של תוכן פוגעני</p>
          </div>
        </motion.div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            יש לך שאלה או חשש? צוות התמיכה שלנו כאן בשבילך.
          </p>
          <Link to="/support">
            <Button variant="hero" size="lg" className="gap-2">
              <MessageCircle className="w-5 h-5" />
              צור קשר עם התמיכה
            </Button>
          </Link>
        </div>
      </main>

      <ScrollToTop />
    </div>
  );
};

export default SafetyCenter;
