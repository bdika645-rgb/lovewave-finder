import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SEOHead from "@/components/SEOHead";
import FieldError from "@/components/FieldError";
import { useFormValidation } from "@/hooks/useFormValidation";
import { Heart, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, user, loading } = useAuth();
  const { errors, setFieldError, clearFieldError, getFieldProps } = useFormValidation();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      const from = (location.state as any)?.from?.pathname || "/members";
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let isValid = true;
    
    // Validation with inline errors
    if (!email.trim()) {
      setFieldError('email', 'נא להזין כתובת אימייל');
      isValid = false;
    } else if (!validateEmail(email)) {
      setFieldError('email', 'כתובת האימייל אינה תקינה');
      isValid = false;
    } else {
      clearFieldError('email');
    }

    if (!password.trim()) {
      setFieldError('password', 'נא להזין סיסמה');
      isValid = false;
    } else if (password.length < 6) {
      setFieldError('password', 'הסיסמה חייבת להכיל לפחות 6 תווים');
      isValid = false;
    } else {
      clearFieldError('password');
    }

    if (!isValid) return;

    setIsLoading(true);
    
    const { error } = await signIn(email, password);
    
    setIsLoading(false);

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        toast.error("אימייל או סיסמה שגויים");
      } else if (error.message.includes("Email not confirmed")) {
        toast.error("נא לאשר את האימייל לפני ההתחברות");
      } else {
        toast.error(error.message);
      }
      return;
    }
    
    toast.success("התחברת בהצלחה!");
    const from = (location.state as any)?.from?.pathname || "/members";
    navigate(from, { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title="התחברות"
        description="התחברו לחשבון Spark שלכם והתחילו לפגוש אנשים חדשים"
        keywords="התחברות, לוגין, כניסה"
      />
      <div className="min-h-screen gradient-hero flex items-center justify-center p-6" dir="rtl">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2">
            <Heart className="w-10 h-10 text-primary-foreground fill-current" />
            <span className="font-display text-3xl font-bold text-primary-foreground">Spark</span>
          </Link>
          <p className="text-primary-foreground/80 mt-2">ברוכים השבים!</p>
        </div>

        {/* Social Proof Banner */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 mb-4 text-center">
          <p className="text-primary-foreground/90 text-sm">
            <span className="font-bold text-primary-foreground">+8,000</span> זוגות מאושרים כבר מצאו את האהבה 💕
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-card rounded-3xl p-8 shadow-elevated">
          <h1 className="font-display text-2xl font-bold text-foreground text-center mb-2">
            התחברות
          </h1>
          <p className="text-muted-foreground text-center text-sm mb-6">
            הזינו את הפרטים שלכם כדי להמשיך
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="text-sm font-medium text-foreground mb-2 block">
                אימייל
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validateEmail(e.target.value)) clearFieldError('email');
                  }}
                  className={`pr-10 h-12 ${errors.email ? 'border-destructive' : ''}`}
                  autoComplete="email"
                  dir="ltr"
                  {...getFieldProps('email')}
                />
              </div>
              <FieldError id="email-error" message={errors.email?.message} />
            </div>

            <div>
              <label htmlFor="login-password" className="text-sm font-medium text-foreground mb-2 block">
                סיסמה
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (e.target.value.length >= 6) clearFieldError('password');
                  }}
                  className={`pr-10 pl-10 h-12 ${errors.password ? 'border-destructive' : ''}`}
                  autoComplete="current-password"
                  dir="ltr"
                  {...getFieldProps('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-md p-1 focus-ring"
                  aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Eye className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
              </div>
              <FieldError id="password-error" message={errors.password?.message} />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input id="remember-me" type="checkbox" className="rounded border-border" />
                <span className="text-muted-foreground">זכור אותי</span>
              </label>
              <Link 
                to="/forgot-password" 
                className="text-primary hover:underline"
              >
                שכחתי סיסמה
              </Link>
            </div>

            <Button variant="hero" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  מתחבר...
                </>
              ) : (
                "התחבר"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              אין לך חשבון?{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">
                הירשם עכשיו
              </Link>
            </p>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Login;
