import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Mail, Lock, User, Eye, EyeOff, MapPin, Loader2, Calendar, Camera, Users, GraduationCap, Ruler, Cigarette, Target, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { PasswordStrengthMeter } from "@/components/PasswordStrengthMeter";
import SEOHead from "@/components/SEOHead";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { israeliCities } from "@/data/members";
import { motion, AnimatePresence } from "framer-motion";

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "",
    age: "",
    gender: "",
    password: "",
    confirmPassword: "",
    // Optional fields (step 2)
    education: "",
    height: "",
    smoking: "",
    relationshipGoal: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { signUp, user, loading } = useAuth();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("גודל התמונה לא יכול לעלות על 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("נא לבחור קובץ תמונה בלבד");
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate("/members", { replace: true });
    }
  }, [user, loading, navigate]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateStep1 = () => {
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      toast.error("השם חייב להכיל לפחות 2 תווים");
      return false;
    }
    if (!formData.email.trim() || !validateEmail(formData.email)) {
      toast.error("נא להזין כתובת אימייל תקינה");
      return false;
    }
    if (!formData.gender) {
      toast.error("נא לבחור מגדר");
      return false;
    }
    if (!formData.city.trim()) {
      toast.error("נא לבחור עיר");
      return false;
    }
    const age = parseInt(formData.age);
    if (isNaN(age) || age < 18 || age > 120) {
      toast.error("גיל חייב להיות מספר בין 18 ל-120");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("הסיסמה חייבת להכיל לפחות 6 תווים");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("הסיסמאות לא תואמות");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      handleNextStep();
      return;
    }

    setIsLoading(true);
    const age = parseInt(formData.age);
    
    const { error, userId } = await signUp(
      formData.email, 
      formData.password, 
      formData.name, 
      formData.city,
      age,
      formData.gender
    );
    
    if (error) {
      setIsLoading(false);
      if (error.message.includes("User already registered")) {
        toast.error("משתמש עם אימייל זה כבר רשום");
      } else {
        toast.error(error.message);
      }
      return;
    }

    // Upload avatar and update profile with extra fields
    if (userId) {
      // Upload avatar
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${userId}/avatar.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile);
        
        if (uploadError) {
          console.error('Error uploading avatar:', uploadError);
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);
          
          await supabase
            .from('profiles')
            .update({ avatar_url: publicUrl })
            .eq('user_id', userId);
        }
      }

      // Update profile with additional fields
      const updateData: Record<string, string | number> = {};
      if (formData.education) updateData.education = formData.education;
      if (formData.height) updateData.height = parseInt(formData.height);
      if (formData.smoking) updateData.smoking = formData.smoking;
      if (formData.relationshipGoal) updateData.relationship_goal = formData.relationshipGoal;

      if (Object.keys(updateData).length > 0) {
        await supabase
          .from('profiles')
          .update(updateData)
          .eq('user_id', userId);
      }
    }
    
    setIsLoading(false);
    toast.success("נרשמת בהצלחה! ברוכים הבאים ל-Spark 💕");
    navigate("/members");
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
        title="הרשמה"
        description="הצטרפו ל-Spark ומצאו את האהבה האמיתית. הרשמה חינמית!"
        keywords="הרשמה, היכרויות, דייטינג, חשבון חדש"
      />
      <div className="min-h-screen gradient-hero flex items-center justify-center p-6" dir="rtl">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2">
              <Heart className="w-10 h-10 text-primary-foreground fill-current" />
              <span className="font-display text-3xl font-bold text-primary-foreground">Spark</span>
            </Link>
            <p className="text-primary-foreground/80 mt-2">מצאו את האהבה שלכם</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step >= 1 ? "bg-white text-primary" : "bg-white/30 text-white"
              }`}>
                {step > 1 ? <Check className="w-4 h-4" /> : "1"}
              </div>
              <span className="text-sm text-primary-foreground/80 hidden sm:block">פרטים בסיסיים</span>
            </div>
            <div className="w-8 h-0.5 bg-white/30" />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step >= 2 ? "bg-white text-primary" : "bg-white/30 text-white"
              }`}>
                2
              </div>
              <span className="text-sm text-primary-foreground/80 hidden sm:block">פרטים נוספים</span>
            </div>
          </div>

          {/* Register Form */}
          <div className="bg-card rounded-3xl p-8 shadow-elevated">
            <h1 className="font-display text-2xl font-bold text-foreground text-center mb-2">
              {step === 1 ? "הרשמה" : "פרטים נוספים (אופציונלי)"}
            </h1>
            <p className="text-muted-foreground text-center mb-6 text-sm">
              {step === 1 
                ? "מלאו את הפרטים הבסיסיים להתחלה"
                : "השלימו את הפרופיל שלכם לקבלת התאמות טובות יותר"
              }
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center mb-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-24 h-24 rounded-full border-2 border-dashed border-primary/50 flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden bg-muted focus-ring"
                        aria-label="העלה תמונת פרופיל (אופציונלי)"
                      >
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-muted-foreground">
                            <Camera className="w-6 h-6" />
                            <span className="text-xs">תמונה</span>
                          </div>
                        )}
                      </button>
                      <input
                        id="avatar-upload"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <p className="text-xs text-muted-foreground mt-1">(אופציונלי)</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        שם מלא *
                      </label>
                      <div className="relative">
                        <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="השם שלך"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="pr-10 h-12"
                          autoComplete="name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        אימייל *
                      </label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="pr-10 h-12"
                          autoComplete="email"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    {/* Gender Selection */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        מגדר *
                      </label>
                      <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="בחירת מגדר">
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, gender: "male"})}
                          role="radio"
                          aria-checked={formData.gender === "male"}
                          aria-pressed={formData.gender === "male"}
                          className={`h-12 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                            formData.gender === "male" 
                              ? "border-primary bg-primary/10 text-primary" 
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <Users className="w-5 h-5" />
                          גבר
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, gender: "female"})}
                          role="radio"
                          aria-checked={formData.gender === "female"}
                          aria-pressed={formData.gender === "female"}
                          className={`h-12 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                            formData.gender === "female" 
                              ? "border-primary bg-primary/10 text-primary" 
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <Users className="w-5 h-5" />
                          אישה
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          עיר *
                        </label>
                        <Select
                          value={formData.city}
                          onValueChange={(value) => setFormData({...formData, city: value})}
                        >
                          <SelectTrigger className="h-12">
                            <MapPin className="w-5 h-5 text-muted-foreground ml-2" />
                            <SelectValue placeholder="בחר עיר" />
                          </SelectTrigger>
                          <SelectContent>
                            {israeliCities.map(city => (
                              <SelectItem key={city} value={city}>{city}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          גיל *
                        </label>
                        <div className="relative">
                          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            type="number"
                            placeholder="גיל"
                            value={formData.age}
                            onChange={(e) => setFormData({...formData, age: e.target.value})}
                            className="pr-10 h-12"
                            min="18"
                            max="120"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        סיסמה *
                      </label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="לפחות 6 תווים"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          className="pr-10 pl-10 h-12"
                          autoComplete="new-password"
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
                      <PasswordStrengthMeter password={formData.password} />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        אישור סיסמה *
                      </label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="הזן שוב את הסיסמה"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                          className="pr-10 h-12"
                          autoComplete="new-password"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <Button type="submit" variant="hero" size="lg" className="w-full gap-2">
                      המשך
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          השכלה
                        </label>
                        <Select
                          value={formData.education}
                          onValueChange={(value) => setFormData({...formData, education: value})}
                        >
                          <SelectTrigger className="h-12">
                            <GraduationCap className="w-5 h-5 text-muted-foreground ml-2" />
                            <SelectValue placeholder="בחר השכלה" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high_school">תיכונית</SelectItem>
                            <SelectItem value="bachelor">תואר ראשון</SelectItem>
                            <SelectItem value="master">תואר שני</SelectItem>
                            <SelectItem value="phd">דוקטורט</SelectItem>
                            <SelectItem value="other">אחר</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          גובה (ס"מ)
                        </label>
                        <div className="relative">
                          <Ruler className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            type="number"
                            placeholder="גובה"
                            value={formData.height}
                            onChange={(e) => setFormData({...formData, height: e.target.value})}
                            className="pr-10 h-12"
                            min="120"
                            max="250"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          יחס לעישון
                        </label>
                        <Select
                          value={formData.smoking}
                          onValueChange={(value) => setFormData({...formData, smoking: value})}
                        >
                          <SelectTrigger className="h-12">
                            <Cigarette className="w-5 h-5 text-muted-foreground ml-2" />
                            <SelectValue placeholder="בחר" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no">לא מעשן/ת</SelectItem>
                            <SelectItem value="sometimes">לפעמים</SelectItem>
                            <SelectItem value="yes">מעשן/ת</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          מטרת הקשר
                        </label>
                        <Select
                          value={formData.relationshipGoal}
                          onValueChange={(value) => setFormData({...formData, relationshipGoal: value})}
                        >
                          <SelectTrigger className="h-12">
                            <Target className="w-5 h-5 text-muted-foreground ml-2" />
                            <SelectValue placeholder="בחר מטרה" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="serious">קשר רציני</SelectItem>
                            <SelectItem value="casual">הכרויות</SelectItem>
                            <SelectItem value="friendship">חברות</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={() => setStep(1)}
                        className="flex-1 gap-2"
                      >
                        <ArrowRight className="w-4 h-4" />
                        חזרה
                      </Button>
                      <Button
                        type="submit"
                        variant="hero"
                        size="lg"
                        className="flex-1"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            נרשם...
                          </>
                        ) : (
                          "סיום הרשמה"
                        )}
                      </Button>
                    </div>

                    <button
                      type="submit"
                      className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors pt-2"
                      disabled={isLoading}
                      aria-label="דלג על הפרטים הנוספים והמשך לסיום הרשמה"
                    >
                      דלג והשלם אחר כך →
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            <p className="mt-4 text-xs text-muted-foreground text-center">
              בלחיצה על "סיום הרשמה" אתם מסכימים ל
              <Link to="/terms" className="text-primary hover:underline">תנאי השימוש</Link>
              {" "}ול
              <Link to="/privacy" className="text-primary hover:underline">מדיניות הפרטיות</Link>
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
    </>
  );
};

export default Register;
