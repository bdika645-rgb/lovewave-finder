import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Mail, Lock, User, Eye, EyeOff, MapPin, Loader2, Calendar, Camera, Users, GraduationCap, Ruler, Cigarette, Target } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { israeliCities } from "@/data/members";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "",
    age: "",
    gender: "",
    password: "",
    confirmPassword: "",
    // New fields
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
    if (!formData.age.trim()) {
      toast.error("נא להזין גיל");
      return;
    }
    const age = parseInt(formData.age);
    if (isNaN(age) || age < 18 || age > 120) {
      toast.error("גיל חייב להיות מספר בין 18 ל-120");
      return;
    }
    if (!formData.gender) {
      toast.error("נא לבחור מגדר");
      return;
    }
    if (!avatarFile) {
      toast.error("נא להעלות תמונת פרופיל");
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
          toast.error("ההרשמה הצליחה אך העלאת התמונה נכשלה");
        } else {
          // Get public URL and update profile
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
      const updateData: Record<string, any> = {};
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
            {/* Avatar Upload */}
            <div className="flex flex-col items-center mb-4">
              <label className="text-sm font-medium text-foreground mb-2 block">
                תמונת פרופיל *
              </label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-28 h-28 rounded-full border-2 border-dashed border-primary/50 flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden bg-muted"
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-muted-foreground">
                    <Camera className="w-8 h-8" />
                    <span className="text-xs">הוסף תמונה</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground mt-2">לחץ להעלאת תמונה (עד 5MB)</p>
            </div>

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

            {/* Gender Selection */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                מגדר
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, gender: "male"})}
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
                  עיר
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
                  גיל
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

            {/* Additional Fields Section */}
            <div className="border-t border-border pt-4 mt-4">
              <p className="text-sm font-medium text-foreground mb-3">פרטים נוספים (אופציונלי)</p>
              
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

              <div className="grid grid-cols-2 gap-4 mt-4">
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
