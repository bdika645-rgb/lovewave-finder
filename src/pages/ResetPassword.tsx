import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePasswordReset } from "@/hooks/usePasswordReset";
import { toast } from "sonner";
import { Loader2, Lock, ArrowRight, CheckCircle, Heart, Mail, Shield, Eye, EyeOff, Sparkles } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { PasswordStrengthMeter } from "@/components/PasswordStrengthMeter";
import { motion } from "framer-motion";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { sendResetEmail, updatePassword, loading } = usePasswordReset();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Check if we're in the password update flow (redirected from email link)
  const isUpdateFlow = searchParams.has('type') && searchParams.get('type') === 'recovery';

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSendReset = async (e: React.FormEvent) => {
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
      toast.error("שגיאה בשליחת המייל. ודא שהאימייל נכון.");
    } else {
      setEmailSent(true);
      toast.success("מייל איפוס נשלח בהצלחה!");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("הסיסמה חייבת להכיל לפחות 6 תווים");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("הסיסמאות אינן תואמות");
      return;
    }

    const { error } = await updatePassword(password);

    if (error) {
      toast.error("שגיאה בעדכון הסיסמה");
    } else {
      setPasswordUpdated(true);
      toast.success("הסיסמה עודכנה בהצלחה!");
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  // Password updated success screen
  if (passwordUpdated) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-6" dir="rtl">
        <SEOHead title="הסיסמה עודכנה" description="הסיסמה שלכם עודכנה בהצלחה" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-3xl p-8 shadow-elevated max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-success" />
          </motion.div>
          
          <h1 className="font-display text-2xl font-bold text-foreground mb-3">
            הסיסמה עודכנה בהצלחה! 🎉
          </h1>
          <p className="text-muted-foreground mb-6">
            מעבירים אותך לדף ההתחברות...
          </p>
          
          <Link to="/login">
            <Button variant="hero" size="lg" className="gap-2">
              <ArrowRight className="w-5 h-5" />
              עבור להתחברות
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // Update password form (after clicking email link)
  if (isUpdateFlow) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-6" dir="rtl">
        <SEOHead title="סיסמה חדשה" description="הזינו סיסמה חדשה לחשבון שלכם" />
        
        <div className="w-full max-w-md">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Link to="/" className="inline-flex items-center gap-2">
              <Heart className="w-10 h-10 text-primary-foreground fill-current" />
              <span className="font-display text-3xl font-bold text-primary-foreground">Spark</span>
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-3xl p-8 shadow-elevated"
          >
            <div className="text-center mb-6">
              <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7 text-primary-foreground" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                סיסמה חדשה
              </h1>
              <p className="text-muted-foreground">
                הזינו סיסמה חדשה לחשבון שלכם
              </p>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-5">
              <div>
                <Label htmlFor="password" className="text-sm font-medium text-foreground mb-2 block">
                  סיסמה חדשה
                </Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="לפחות 6 תווים"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 pl-10 h-12"
                    autoComplete="new-password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {password && <PasswordStrengthMeter password={password} />}
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground mb-2 block">
                  אימות סיסמה
                </Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="הזינו את הסיסמה שוב"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10 pl-10 h-12"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showConfirmPassword ? "הסתר סיסמה" : "הצג סיסמה"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-sm text-destructive mt-1">הסיסמאות אינן תואמות</p>
                )}
              </div>

              <Button 
                variant="hero" 
                size="lg"
                className="w-full h-12 gap-2"
                disabled={loading || password !== confirmPassword}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    מעדכן...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    עדכן סיסמה
                  </>
                )}
              </Button>
            </form>

            {/* Security note */}
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                <Shield className="w-3 h-3" />
                החיבור שלכם מאובטח ומוצפן
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Email sent success screen
  if (emailSent) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-6" dir="rtl">
        <SEOHead title="בדקו את האימייל" description="שלחנו לכם קישור לאיפוס הסיסמה" />
        
        <div className="w-full max-w-md">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Link to="/" className="inline-flex items-center gap-2">
              <Heart className="w-10 h-10 text-primary-foreground fill-current" />
              <span className="font-display text-3xl font-bold text-primary-foreground">Spark</span>
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-3xl p-8 shadow-elevated text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-success" />
            </motion.div>

            <h1 className="font-display text-2xl font-bold text-foreground mb-3">
              בדקו את האימייל שלכם 📬
            </h1>
            <p className="text-muted-foreground mb-6">
              שלחנו קישור לאיפוס הסיסמה לכתובת:
              <br />
              <span className="font-medium text-foreground">{email}</span>
            </p>

            {/* Tips */}
            <div className="bg-muted/50 rounded-2xl p-4 mb-6 text-sm text-muted-foreground">
              <div className="flex items-start gap-2 mb-2">
                <Sparkles className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span>לא קיבלתם את המייל? בדקו בתיקיית הספאם</span>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span>הקישור יפוג תוך שעה מטעמי אבטחה</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => setEmailSent(false)}
              >
                <Mail className="w-4 h-4" />
                שלחו שוב
              </Button>
              <Link to="/login" className="block">
                <Button variant="hero" className="w-full gap-2">
                  <ArrowRight className="w-4 h-4" />
                  חזרה להתחברות
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Request password reset form
  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-6" dir="rtl">
      <SEOHead 
        title="איפוס סיסמה" 
        description="שחזור סיסמה - הזינו את כתובת האימייל שלכם ונשלח לכם קישור לאיפוס"
      />
      
      <div className="w-full max-w-md">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-2">
            <Heart className="w-10 h-10 text-primary-foreground fill-current" />
            <span className="font-display text-3xl font-bold text-primary-foreground">Spark</span>
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-3xl p-8 shadow-elevated"
        >
          <div className="text-center mb-6">
            <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              שכחתי סיסמה
            </h1>
            <p className="text-muted-foreground">
              הזינו את כתובת האימייל שלכם ונשלח לכם קישור לאיפוס הסיסמה
            </p>
          </div>

          <form onSubmit={handleSendReset} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-foreground mb-2 block">
                אימייל
              </Label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pr-10 h-12"
                  dir="ltr"
                  autoComplete="email"
                  inputMode="email"
                  required
                />
              </div>
            </div>

            <Button 
              variant="hero" 
              size="lg"
              className="w-full h-12 gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  שולח...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  שלחו קישור לאיפוס
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="text-primary font-medium hover:underline inline-flex items-center gap-1 group"
            >
              <ArrowRight className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              חזרה להתחברות
            </Link>
          </div>

          {/* Security note */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" />
              החיבור שלכם מאובטח ומוצפן
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
