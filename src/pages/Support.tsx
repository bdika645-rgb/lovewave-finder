import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, 
  MessageCircle, 
  Clock, 
  HelpCircle,
  Send,
  CheckCircle
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSupportTickets } from "@/hooks/useSupportTickets";

const Support = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const { submitTicket, sending } = useSupportTickets();

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

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <HelpCircle className="w-5 h-5" />
              <span className="font-medium">מרכז תמיכה</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              איך נוכל <span className="text-gradient">לעזור</span>?
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              צוות התמיכה שלנו זמין לכל שאלה או בקשה. אנחנו כאן בשבילכם!
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Methods */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-card rounded-3xl p-6 shadow-card">
                <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  אימייל
                </h3>
                <p className="text-muted-foreground text-sm mb-2">
                  שלחו לנו מייל ונחזור אליכם תוך 24 שעות
                </p>
                <a href="mailto:support@spark.co.il" className="text-primary hover:underline">
                  support@spark.co.il
                </a>
              </div>

              <div className="bg-card rounded-3xl p-6 shadow-card">
                <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  צ'אט חי
                </h3>
                <p className="text-muted-foreground text-sm mb-2">
                  דברו איתנו בזמן אמת
                </p>
                <span className="text-primary">בקרוב!</span>
              </div>

              <div className="bg-card rounded-3xl p-6 shadow-card">
                <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  שעות פעילות
                </h3>
                <p className="text-muted-foreground text-sm">
                  ראשון - חמישי: 9:00 - 18:00
                  <br />
                  שישי: 9:00 - 13:00
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-3xl p-8 shadow-card">
                {sent ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                    <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                      ההודעה נשלחה!
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      תודה שפניתם אלינו. נחזור אליכם בהקדם האפשרי.
                    </p>
                    <Button onClick={() => setSent(false)} variant="outline">
                      שליחת הודעה נוספת
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                      צור קשר
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          שם מלא *
                        </label>
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="השם שלך"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          אימייל *
                        </label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        נושא
                      </label>
                      <Input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="במה נוכל לעזור?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        הודעה *
                      </label>
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="פרטו את הבקשה או השאלה שלכם..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      variant="hero" 
                      size="lg" 
                      className="w-full gap-2"
                      disabled={sending}
                    >
                      {sending ? (
                        <>שולח...</>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          שלחו הודעה
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
