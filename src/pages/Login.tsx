import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SEOHead from "@/components/SEOHead";
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
    
    // Validation
    if (!email.trim()) {
      toast.error("נא להזין כתובת אימייל");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("כתובת האימייל אינה תקינה");
      return;
    }
    if (!password.trim()) {
      toast.error("נא להזין סיסמה");
      return;
    }
    if (password.length < 6) {
      toast.error("הסיסמה חייבת להכיל לפחות 6 תווים");
      return;
    }

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
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <Heart className="w-10 h-10 text-primary-foreground fill-current" />
            <span className="font-display text-3xl font-bold text-primary-foreground">Spark</span>
          </Link>
          <p className="text-primary-foreground/80 mt-2">ברוכים השבים!</p>
        </div>

        {/* Login Form */}
        <div className="bg-card rounded-3xl p-8 shadow-elevated">
          <h1 className="font-display text-2xl font-bold text-foreground text-center mb-6">
            התחברות
          </h1>

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
                  autoComplete="email"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                סיסמה
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 pl-10 h-12"
                  autoComplete="current-password"
                  dir="ltr"
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
