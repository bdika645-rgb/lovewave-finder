import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { ArrowRight, Bell, Eye, Lock, Shield, Trash2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";
import { useUserSettings } from "@/hooks/useUserSettings";
import { usePasswordReset } from "@/hooks/usePasswordReset";
import { useDeleteAccount } from "@/hooks/useDeleteAccount";

const Settings = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { profile } = useCurrentProfile();
  const { settings, loading: settingsLoading, saving, updateSettings } = useUserSettings();
  const { sendResetEmail, loading: resetLoading } = usePasswordReset();
  const { deleteAccount, loading: deleteLoading } = useDeleteAccount();

  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSaveNotifications = async () => {
    const { error } = await updateSettings({
      email_notifications: localSettings.email_notifications,
      push_notifications: localSettings.push_notifications,
      match_notifications: localSettings.match_notifications,
      message_notifications: localSettings.message_notifications,
    });

    if (error) {
      toast.error("שגיאה בשמירת ההגדרות");
    } else {
      toast.success("הגדרות ההתראות נשמרו!");
    }
  };

  const handleSavePrivacy = async () => {
    const { error } = await updateSettings({
      show_online_status: localSettings.show_online_status,
      show_last_seen: localSettings.show_last_seen,
      profile_visible: localSettings.profile_visible,
    });

    if (error) {
      toast.error("שגיאה בשמירת ההגדרות");
    } else {
      toast.success("הגדרות הפרטיות נשמרו!");
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) {
      toast.error("לא נמצא אימייל לחשבון");
      return;
    }

    const { error } = await sendResetEmail(user.email);

    if (error) {
      toast.error("שגיאה בשליחת המייל");
    } else {
      toast.success("שלחנו קישור לאיפוס סיסמה למייל שלך");
    }
  };

  const handleDeleteAccount = async () => {
    const { error } = await deleteAccount();

    if (error) {
      toast.error("שגיאה במחיקת החשבון");
    } else {
      toast.success("החשבון נמחק בהצלחה");
      navigate("/");
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("התנתקת בהצלחה!");
    navigate("/");
  };

  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center" dir="rtl">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
                <Shield className="w-5 h-5 text-primary" aria-hidden="true" />
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
                <Bell className="w-5 h-5 text-primary" aria-hidden="true" />
                התראות
              </CardTitle>
              <CardDescription>בחר אילו התראות תרצה לקבל</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label id="email-notifications-label">התראות אימייל</Label>
                  <p className="text-sm text-muted-foreground" id="email-notifications-desc">קבל עדכונים למייל</p>
                </div>
                <Switch 
                  checked={localSettings.email_notifications}
                  onCheckedChange={(checked) => setLocalSettings({...localSettings, email_notifications: checked})}
                  aria-labelledby="email-notifications-label"
                  aria-describedby="email-notifications-desc"
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label id="push-notifications-label">התראות פוש</Label>
                  <p className="text-sm text-muted-foreground" id="push-notifications-desc">קבל התראות לטלפון</p>
                </div>
                <Switch 
                  checked={localSettings.push_notifications}
                  onCheckedChange={(checked) => setLocalSettings({...localSettings, push_notifications: checked})}
                  aria-labelledby="push-notifications-label"
                  aria-describedby="push-notifications-desc"
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label id="match-notifications-label">התאמות חדשות</Label>
                  <p className="text-sm text-muted-foreground" id="match-notifications-desc">התראה כשיש התאמה חדשה</p>
                </div>
                <Switch 
                  checked={localSettings.match_notifications}
                  onCheckedChange={(checked) => setLocalSettings({...localSettings, match_notifications: checked})}
                  aria-labelledby="match-notifications-label"
                  aria-describedby="match-notifications-desc"
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label id="message-notifications-label">הודעות</Label>
                  <p className="text-sm text-muted-foreground" id="message-notifications-desc">התראה על הודעות חדשות</p>
                </div>
                <Switch 
                  checked={localSettings.message_notifications}
                  onCheckedChange={(checked) => setLocalSettings({...localSettings, message_notifications: checked})}
                  aria-labelledby="message-notifications-label"
                  aria-describedby="message-notifications-desc"
                />
              </div>

              <Button 
                variant="hero" 
                className="w-full mt-4"
                onClick={handleSaveNotifications}
                disabled={saving}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "שמור הגדרות התראות"}
              </Button>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" aria-hidden="true" />
                פרטיות
              </CardTitle>
              <CardDescription>שליטה במה שאחרים רואים</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label id="online-status-label">הצג סטטוס אונליין</Label>
                  <p className="text-sm text-muted-foreground" id="online-status-desc">אחרים יראו כשאתה מחובר</p>
                </div>
                <Switch 
                  checked={localSettings.show_online_status}
                  onCheckedChange={(checked) => setLocalSettings({...localSettings, show_online_status: checked})}
                  aria-labelledby="online-status-label"
                  aria-describedby="online-status-desc"
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label id="last-seen-label">הצג נצפה לאחרונה</Label>
                  <p className="text-sm text-muted-foreground" id="last-seen-desc">הצג מתי היית מחובר לאחרונה</p>
                </div>
                <Switch 
                  checked={localSettings.show_last_seen}
                  onCheckedChange={(checked) => setLocalSettings({...localSettings, show_last_seen: checked})}
                  aria-labelledby="last-seen-label"
                  aria-describedby="last-seen-desc"
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label id="profile-visible-label">הפרופיל שלי גלוי</Label>
                  <p className="text-sm text-muted-foreground" id="profile-visible-desc">אחרים יכולים לראות את הפרופיל שלך</p>
                </div>
                <Switch 
                  checked={localSettings.profile_visible}
                  onCheckedChange={(checked) => setLocalSettings({...localSettings, profile_visible: checked})}
                  aria-labelledby="profile-visible-label"
                  aria-describedby="profile-visible-desc"
                />
              </div>

              <Button 
                variant="hero" 
                className="w-full mt-4"
                onClick={handleSavePrivacy}
                disabled={saving}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "שמור הגדרות פרטיות"}
              </Button>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" aria-hidden="true" />
                אבטחה
              </CardTitle>
              <CardDescription>הגדרות אבטחת חשבון</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleResetPassword}
                disabled={resetLoading}
              >
                {resetLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    שולח...
                  </>
                ) : (
                  "שנה סיסמה"
                )}
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
                <Trash2 className="w-5 h-5" aria-hidden="true" />
                אזור מסוכן
              </CardTitle>
              <CardDescription>פעולות בלתי הפיכות</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    מחק את החשבון שלי
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent dir="rtl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
                    <AlertDialogDescription>
                      פעולה זו תמחק את כל הנתונים שלך לצמיתות, כולל:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>הפרופיל שלך</li>
                        <li>כל התמונות שלך</li>
                        <li>כל ההתאמות וההודעות</li>
                        <li>כל הלייקים והפעילות</li>
                      </ul>
                      <br />
                      לא ניתן לשחזר את הנתונים לאחר מחיקה.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex gap-2">
                    <AlertDialogCancel>ביטול</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin ml-2" />
                          מוחק...
                        </>
                      ) : (
                        "מחק לצמיתות"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
