import Navbar from "@/components/Navbar";
import SkipToContent from "@/components/SkipToContent";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, 
  MessageCircle, 
  Clock, 
  HelpCircle,
  Send,
  CheckCircle,
  Heart,
  Sparkles,
  Shield
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSupportTickets } from "@/hooks/useSupportTickets";
import { useAuth } from "@/hooks/useAuth";
import EmptyState from "@/components/EmptyState";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Support = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const { submitTicket, sending } = useSupportTickets();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("אנא מלאו את כל השדות הנדרשים");
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("אנא הזינו כתובת אימייל תקינה");
      return;
    }
    
    const { success, error } = await submitTicket({ name, email, subject, message });
    
    if (success) {
      setSent(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      toast.success("ההודעה נשלחה בהצלחה! נחזור אליכם בהקדם");
    } else {
      toast.error("אירעה שגיאה בשליחת ההודעה. אנא נסו שוב.");
      console.error("Support ticket error:", error);
    }
  };

  // Contact methods with enhanced visuals
  const contactMethods = [
    {
      icon: Mail,
      title: "אימייל",
      description: "שלחו לנו מייל ונחזור אליכם תוך 24 שעות",
      action: <a href="mailto:support@spark.co.il" className="text-primary hover:underline font-medium">support@spark.co.il</a>,
      gradient: "from-primary to-primary/80"
    },
    {
      icon: MessageCircle,
      title: "צ'אט חי",
      description: "דברו איתנו בזמן אמת",
      action: <span className="text-primary font-medium flex items-center gap-1"><Sparkles className="w-3 h-3" /> בקרוב!</span>,
      gradient: "from-secondary to-secondary/80"
    },
    {
      icon: Clock,
      title: "שעות פעילות",
      description: "ראשון - חמישי: 9:00 - 18:00\nשישי: 9:00 - 13:00",
      gradient: "from-accent to-accent/80"
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <SkipToContent />
      <SEOHead 
        title="מרכז תמיכה"
        description="צרו קשר עם צוות התמיכה שלנו. אנחנו כאן לכל שאלה או בקשה."
      />
      <Navbar />
      
      <main id="main-content" className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header - Enhanced */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-secondary/20 text-primary px-5 py-2.5 rounded-full mb-4 shadow-sm">
              <HelpCircle className="w-5 h-5" aria-hidden="true" />
              <span className="font-medium">מרכז תמיכה</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              איך נוכל <span className="text-gradient">לעזור</span>?
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              צוות התמיכה שלנו זמין לכל שאלה או בקשה. אנחנו כאן בשבילכם!
            </p>
            
            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <Shield className="w-4 h-4 text-success" />
                <span>מאובטח</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span>מענה תוך 24 שעות</span>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Methods - Enhanced */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1 space-y-4"
            >
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className="bg-card rounded-3xl p-6 shadow-card hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${method.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <method.icon className="w-6 h-6 text-primary-foreground" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">
                    {method.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-2 whitespace-pre-line">
                    {method.description}
                  </p>
                  {method.action}
                </motion.div>
              ))}

              {/* FAQ Quick Link */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-6 border border-primary/20"
              >
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  שאלות נפוצות 💡
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  אולי התשובה כבר מחכה לכם בשאלות הנפוצות?
                </p>
                <Link to="/#faq">
                  <Button variant="outline" className="w-full">
                    לשאלות נפוצות
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Contact Form - Enhanced */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-card rounded-3xl p-8 shadow-card">
                {!user ? (
                  <div className="py-10">
                    <EmptyState
                      icon={<Heart className="w-10 h-10" />}
                      title="כדי לפנות לתמיכה צריך להתחבר"
                      description="אנחנו שומרים על הפרטיות שלך — פניות תמיכה זמינות למשתמשים מחוברים בלבד."
                      actionLabel="התחברות"
                      actionLink="/login"
                      secondaryActionLabel="הרשמה"
                      secondaryActionLink="/register"
                    />

                    <div className="text-center mt-6 text-sm text-muted-foreground">
                      או שלחו אימייל ישירות ל-
                      <a href="mailto:support@spark.co.il" className="text-primary hover:underline"> support@spark.co.il</a>
                    </div>
                  </div>
                ) : (
                  sent ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-12 h-12 text-success" />
                    </div>
                    <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                      ההודעה נשלחה! 🎉
                    </h2>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                      תודה שפניתם אלינו. נחזור אליכם בהקדם האפשרי, לרוב תוך 24 שעות.
                    </p>
                    <Button onClick={() => setSent(false)} variant="outline" className="gap-2">
                      <Send className="w-4 h-4" />
                      שליחת הודעה נוספת
                    </Button>
                  </motion.div>
                  ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                        <Send className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h2 className="font-display text-xl font-bold text-foreground">
                          צור קשר
                        </h2>
                        <p className="text-sm text-muted-foreground">מלאו את הטופס ונחזור אליכם</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2" htmlFor="name">
                          שם מלא <span className="text-destructive">*</span>
                        </label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="השם שלך"
                          required
                          autoComplete="name"
                          className="h-12"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2" htmlFor="email">
                          אימייל <span className="text-destructive">*</span>
                        </label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          required
                          autoComplete="email"
                          className="h-12"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2" htmlFor="subject">
                        נושא
                      </label>
                      <Input
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="במה נוכל לעזור?"
                        className="h-12"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2" htmlFor="message">
                        הודעה <span className="text-destructive">*</span>
                      </label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="פרטו את הבקשה או השאלה שלכם..."
                        rows={6}
                        required
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        {message.length}/500 תווים
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      variant="hero" 
                      size="lg" 
                      className="w-full gap-2 h-14 text-lg"
                      disabled={sending}
                    >
                      {sending ? (
                        <>
                          <span className="animate-spin">⏳</span>
                          שולח...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          שלחו הודעה
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                      <Shield className="w-3 h-3" />
                      ההודעה שלכם מוגנת ומאובטחת
                    </p>
                  </form>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Support;
