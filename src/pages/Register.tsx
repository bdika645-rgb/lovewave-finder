import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Mail, Lock, User, Eye, EyeOff, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error("נא להזין שם מלא");
      return;
    }
    if (formData.name.trim().length < 2) {
      toast.error("השם חייב להכיל לפחות 2 תווים");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("נא להזין כתובת אימייל");
      return;
    }
    if (!validateEmail(formData.email)) {
      toast.error("כתובת האימייל אינה תקינה");
      return;
    }
    if (!formData.city.trim()) {
      toast.error("נא להזין עיר מגורים");
      return;
    }
    if (!formData.password.trim()) {
      toast.error("נא להזין סיסמה");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("הסיסמה חייבת להכיל לפחות 6 תווים");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("הסיסמאות לא תואמות");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    toast.success("נרשמת בהצלחה! ברוכים הבאים ל-Spark 💕");
    navigate("/members");
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
          <p className="text-primary-foreground/80 mt-2">מצאו את האהבה שלכם</p>
        </div>

        {/* Register Form */}
        <div className="bg-card rounded-3xl p-8 shadow-elevated">
          <h1 className="font-display text-2xl font-bold text-foreground text-center mb-6">
            הרשמה
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                שם מלא
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="השם שלך"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="pr-10 h-12"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                אימייל
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="pr-10 h-12"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                עיר
              </label>
              <div className="relative">
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="איפה אתם גרים?"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="pr-10 h-12"
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
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="pr-10 pl-10 h-12"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Eye className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                אישור סיסמה
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="pr-10 h-12"
                  dir="ltr"
                />
              </div>
            </div>

            <Button variant="hero" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  נרשם...
                </>
              ) : (
                "הירשם"
              )}
            </Button>
          </form>

          <p className="mt-4 text-xs text-muted-foreground text-center">
            בלחיצה על "הירשם" אתם מסכימים ל
            <button type="button" onClick={() => toast.info("תנאי השימוש יהיו זמינים בקרוב")} className="text-primary hover:underline">תנאי השימוש</button>
            {" "}ול
            <button type="button" onClick={() => toast.info("מדיניות הפרטיות תהיה זמינה בקרוב")} className="text-primary hover:underline">מדיניות הפרטיות</button>
          </p>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              כבר יש לך חשבון?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                התחבר
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
