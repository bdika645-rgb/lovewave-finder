import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Mail, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { usePasswordReset } from "@/hooks/usePasswordReset";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const { sendResetEmail, loading } = usePasswordReset();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("נא להזין כתובת אימייל");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("כתובת האימייל אינה תקינה");
      return;
    }

    const { error } = await sendResetEmail(email);
    
    if (error) {
      toast.error("שגיאה בשליחת מייל איפוס. נסו שוב מאוחר יותר.");
      return;
    }
    
    setEmailSent(true);
    toast.success("מייל איפוס נשלח בהצלחה!");
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-6" dir="rtl">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <Heart className="w-10 h-10 text-primary-foreground fill-current" />
            <span className="font-display text-3xl font-bold text-primary-foreground">Spark</span>
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-3xl p-8 shadow-elevated">
          {emailSent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-3">
                בדקו את האימייל שלכם
              </h1>
              <p className="text-muted-foreground mb-6">
                שלחנו קישור לאיפוס הסיסמה לכתובת:
                <br />
                <span className="font-medium text-foreground">{email}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                לא קיבלתם את המייל? בדקו בתיקיית הספאם או נסו שוב.
              </p>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setEmailSent(false)}
                >
                  שלחו שוב
                </Button>
                <Link to="/login" className="block">
                  <Button variant="hero" className="w-full">
                    <ArrowRight className="w-4 h-4" />
                    חזרה להתחברות
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h1 className="font-display text-2xl font-bold text-foreground text-center mb-2">
                שכחתי סיסמה
              </h1>
              <p className="text-muted-foreground text-center mb-6">
                הזינו את כתובת האימייל שלכם ונשלח לכם קישור לאיפוס הסיסמה
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    אימייל
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pr-10 h-12"
                      dir="ltr"
                    />
                  </div>
                </div>

                <Button variant="hero" size="lg" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      שולח...
                    </>
                  ) : (
                    "שלחו קישור לאיפוס"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
                  <ArrowRight className="w-4 h-4" />
                  חזרה להתחברות
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
