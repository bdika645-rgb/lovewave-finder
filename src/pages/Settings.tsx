import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Bell, Eye, Lock, Shield, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

const Settings = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { profile } = useProfile();
  
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    matchNotifications: true,
    messageNotifications: true,
    showOnlineStatus: true,
    showLastSeen: true,
    showDistance: true,
    profileVisible: true,
  });

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSaving(false);
    toast.success("הגדרות ההתראות נשמרו!");
  };

  const handleSavePrivacy = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSaving(false);
    toast.success("הגדרות הפרטיות נשמרו!");
  };

  const handleDeleteAccount = () => {
    toast.error("לא ניתן למחוק חשבון כרגע. פנה לתמיכה.");
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("התנתקת בהצלחה!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-muted/20" dir="rtl">
      <Navbar />

      <div className="container mx-auto px-6 pt-28 pb-16 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/profile")}
            className="rounded-full"
          >
            <ArrowRight className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">הגדרות</h1>
            <p className="text-muted-foreground">נהל את העדפות החשבון שלך</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                פרטי חשבון
              </CardTitle>
              <CardDescription>מידע בסיסי על החשבון שלך</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground">אימייל</Label>
                <p className="font-medium text-foreground">{user?.email || "לא זמין"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">שם משתמש</Label>
                <p className="font-medium text-foreground">{profile?.name || "לא זמין"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                התראות
              </CardTitle>
              <CardDescription>בחר אילו התראות תרצה לקבל</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>התראות אימייל</Label>
                  <p className="text-sm text-muted-foreground">קבל עדכונים למייל</p>
                </div>
                <Switch 
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>התראות פוש</Label>
                  <p className="text-sm text-muted-foreground">קבל התראות לטלפון</p>
                </div>
                <Switch 
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, pushNotifications: checked})}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>התאמות חדשות</Label>
                  <p className="text-sm text-muted-foreground">התראה כשיש התאמה חדשה</p>
                </div>
                <Switch 
                  checked={settings.matchNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, matchNotifications: checked})}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>הודעות</Label>
                  <p className="text-sm text-muted-foreground">התראה על הודעות חדשות</p>
                </div>
                <Switch 
                  checked={settings.messageNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, messageNotifications: checked})}
                />
              </div>

              <Button 
                variant="hero" 
                className="w-full mt-4"
                onClick={handleSaveNotifications}
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "שמור הגדרות התראות"}
              </Button>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                פרטיות
              </CardTitle>
              <CardDescription>שליטה במה שאחרים רואים</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>הצג סטטוס אונליין</Label>
                  <p className="text-sm text-muted-foreground">אחרים יראו כשאתה מחובר</p>
                </div>
                <Switch 
                  checked={settings.showOnlineStatus}
                  onCheckedChange={(checked) => setSettings({...settings, showOnlineStatus: checked})}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>הצג נצפה לאחרונה</Label>
                  <p className="text-sm text-muted-foreground">הצג מתי היית מחובר לאחרונה</p>
                </div>
                <Switch 
                  checked={settings.showLastSeen}
                  onCheckedChange={(checked) => setSettings({...settings, showLastSeen: checked})}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>הפרופיל שלי גלוי</Label>
                  <p className="text-sm text-muted-foreground">אחרים יכולים לראות את הפרופיל שלך</p>
                </div>
                <Switch 
                  checked={settings.profileVisible}
                  onCheckedChange={(checked) => setSettings({...settings, profileVisible: checked})}
                />
              </div>

              <Button 
                variant="hero" 
                className="w-full mt-4"
                onClick={handleSavePrivacy}
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "שמור הגדרות פרטיות"}
              </Button>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                אבטחה
              </CardTitle>
              <CardDescription>הגדרות אבטחת חשבון</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => toast.info("שלחנו קישור לאיפוס סיסמה למייל שלך")}
              >
                שנה סיסמה
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleLogout}
              >
                התנתק מכל המכשירים
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="w-5 h-5" />
                אזור מסוכן
              </CardTitle>
              <CardDescription>פעולות בלתי הפיכות</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleDeleteAccount}
              >
                מחק את החשבון שלי
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                פעולה זו תמחק את כל הנתונים שלך לצמיתות
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
