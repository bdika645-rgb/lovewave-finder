import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePasswordReset } from "@/hooks/usePasswordReset";
import { toast } from "sonner";
import { Loader2, Lock, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { sendResetEmail, updatePassword, loading } = usePasswordReset();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  // Check if we're in the password update flow (redirected from email link)
  const isUpdateFlow = searchParams.has('type') && searchParams.get('type') === 'recovery';

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("נא להזין כתובת אימייל");
      return;
    }

    const { error } = await sendResetEmail(email);

    if (error) {
      toast.error("שגיאה בשליחת המייל. ודא שהאימייל נכון.");
    } else {
      setEmailSent(true);
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
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  // Password updated success screen
  if (passwordUpdated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center px-6" dir="rtl">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                הסיסמה עודכנה בהצלחה!
              </h2>
              <p className="text-muted-foreground mb-6">
                מעבירים אותך לדף ההתחברות...
              </p>
              <Link to="/login">
                <Button variant="hero">
                  עבור להתחברות
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Update password form (after clicking email link)
  if (isUpdateFlow) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center px-6" dir="rtl">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="font-display text-2xl">סיסמה חדשה</CardTitle>
            <CardDescription>
              הזינו סיסמה חדשה לחשבון שלכם
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">סיסמה חדשה</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="לפחות 6 תווים"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">אימות סיסמה</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="הזינו את הסיסמה שוב"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                variant="hero" 
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    מעדכן...
                  </>
                ) : (
                  "עדכן סיסמה"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Email sent success screen
  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center px-6" dir="rtl">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                בדקו את המייל שלכם
              </h2>
              <p className="text-muted-foreground mb-6">
                שלחנו קישור לאיפוס סיסמה ל-
                <br />
                <span className="font-medium text-foreground">{email}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                לא קיבלתם? בדקו בתיקיית הספאם או נסו שוב
              </p>
              <div className="flex flex-col gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setEmailSent(false)}
                >
                  שלח שוב
                </Button>
                <Link to="/login">
                  <Button variant="ghost" className="w-full">
                    <ArrowRight className="w-4 h-4 ml-2" />
                    חזרה להתחברות
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Request password reset form
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center px-6" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="font-display text-2xl">שכחתי סיסמה</CardTitle>
          <CardDescription>
            הזינו את כתובת האימייל שלכם ונשלח לכם קישור לאיפוס הסיסמה
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">אימייל</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              variant="hero" 
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                  שולח...
                </>
              ) : (
                "שלח קישור לאיפוס"
              )}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="text-sm text-primary hover:underline inline-flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              חזרה להתחברות
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
