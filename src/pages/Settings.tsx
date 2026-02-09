import Navbar from "@/components/Navbar";
import SkipToContent from "@/components/SkipToContent";
import SEOHead from "@/components/SEOHead";
import FullPageLoader from "@/components/FullPageLoader";
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
import { ArrowRight, Bell, Eye, Lock, Shield, Trash2, Loader2, Check, LogOut, Key, User, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";
import { useUserSettings } from "@/hooks/useUserSettings";
import { usePasswordReset } from "@/hooks/usePasswordReset";
import { useDeleteAccount } from "@/hooks/useDeleteAccount";
import { useConfetti } from "@/hooks/useConfetti";
import { motion, AnimatePresence } from "framer-motion";

const Settings = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { profile } = useCurrentProfile();
  const { settings, loading: settingsLoading, saving, updateSettings } = useUserSettings();
  const { sendResetEmail, loading: resetLoading } = usePasswordReset();
  const { deleteAccount, loading: deleteLoading } = useDeleteAccount();
  const { fireSuccessConfetti } = useConfetti();

  const [localSettings, setLocalSettings] = useState(settings);
  const [notificationsStatus, setNotificationsStatus] = useState<string>("");
  const [privacyStatus, setPrivacyStatus] = useState<string>("");
  const [showNotificationSuccess, setShowNotificationSuccess] = useState(false);
  const [showPrivacySuccess, setShowPrivacySuccess] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSaveNotifications = async () => {
    setNotificationsStatus("");
    setShowNotificationSuccess(false);
    const { error } = await updateSettings({
      email_notifications: localSettings.email_notifications,
      push_notifications: localSettings.push_notifications,
      match_notifications: localSettings.match_notifications,
      message_notifications: localSettings.message_notifications,
    });

    if (error) {
      toast.error("שגיאה בשמירת ההגדרות");
      setNotificationsStatus("שגיאה בשמירה");
    } else {
      toast.success("הגדרות ההתראות נשמרו!");
      setNotificationsStatus("נשמר");
      setShowNotificationSuccess(true);
      fireSuccessConfetti();
      setTimeout(() => setShowNotificationSuccess(false), 3000);
    }
  };

  const handleSavePrivacy = async () => {
    setPrivacyStatus("");
    setShowPrivacySuccess(false);
    const { error } = await updateSettings({
      show_online_status: localSettings.show_online_status,
      show_last_seen: localSettings.show_last_seen,
      profile_visible: localSettings.profile_visible,
    });

    if (error) {
      toast.error("שגיאה בשמירת ההגדרות");
      setPrivacyStatus("שגיאה בשמירה");
    } else {
      toast.success("הגדרות הפרטיות נשמרו!");
      setPrivacyStatus("נשמר");
      setShowPrivacySuccess(true);
      fireSuccessConfetti();
      setTimeout(() => setShowPrivacySuccess(false), 3000);
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
      <FullPageLoader 
        label="טוען הגדרות..." 
        branded 
        className="min-h-screen bg-muted/20 flex items-center justify-center" 
      />
    );
  }

  return (
    <div className="min-h-screen bg-muted/20" dir="rtl">
      <SkipToContent />
      <SEOHead title="הגדרות" description="נהל את הגדרות החשבון, התראות ופרטיות שלך." />
      <Navbar />

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {notificationsStatus || privacyStatus}
      </div>

      <main id="main-content" className="container mx-auto px-6 pt-28 pb-24 md:pb-16 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/profile")}
            className="rounded-full focus-ring"
            aria-label="חזרה לפרופיל"
          >
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Button>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">הגדרות</h1>
            <p className="text-muted-foreground">נהל את העדפות החשבון שלך</p>
          </div>
        </div>

        <motion.div 
          className="space-y-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
        >
          {/* Account Info */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-l from-primary/5 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" aria-hidden="true" />
                  </div>
                  פרטי חשבון
                </CardTitle>
                <CardDescription>מידע בסיסי על החשבון שלך</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                  <div>
                    <Label className="text-muted-foreground text-sm">אימייל</Label>
                    <p className="font-medium text-foreground">{user?.email || "לא זמין"}</p>
                  </div>
                  <Check className="w-5 h-5 text-success" aria-label="מאומת" />
                </div>
                <div className="p-3 bg-muted/50 rounded-xl">
                  <Label className="text-muted-foreground text-sm">שם משתמש</Label>
                  <p className="font-medium text-foreground">{profile?.name || "לא זמין"}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications */}
          <Card className={`overflow-hidden transition-all duration-300 ${showNotificationSuccess ? 'ring-2 ring-success/50' : ''}`} aria-busy={saving ? true : undefined}>
            <CardHeader className="bg-gradient-to-l from-primary/5 to-transparent relative">
              <AnimatePresence>
                {showNotificationSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute left-4 top-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-success animate-bounce" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-primary" aria-hidden="true" />
                </div>
                התראות
              </CardTitle>
              <CardDescription>בחר אילו התראות תרצה לקבל</CardDescription>
              {notificationsStatus && (
                <p className="text-sm font-medium text-success flex items-center gap-1" aria-live="polite">
                  <Check className="w-4 h-4" />
                  {notificationsStatus}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
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
                  disabled={saving}
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
                  disabled={saving}
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
                  disabled={saving}
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
                  disabled={saving}
                />
              </div>

              <Button 
                variant="hero" 
                className="w-full mt-4"
                onClick={handleSaveNotifications}
                disabled={saving}
                aria-disabled={saving}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "שמור הגדרות התראות"}
              </Button>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card className={`overflow-hidden transition-all duration-300 ${showPrivacySuccess ? 'ring-2 ring-success/50' : ''}`} aria-busy={saving ? true : undefined}>
            <CardHeader className="bg-gradient-to-l from-primary/5 to-transparent relative">
              <AnimatePresence>
                {showPrivacySuccess && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute left-4 top-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-success animate-bounce" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Eye className="w-4 h-4 text-primary" aria-hidden="true" />
                </div>
                פרטיות
              </CardTitle>
              <CardDescription>שליטה במה שאחרים רואים</CardDescription>
              {privacyStatus && (
                <p className="text-sm font-medium text-success flex items-center gap-1" aria-live="polite">
                  <Check className="w-4 h-4" />
                  {privacyStatus}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
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
                  disabled={saving}
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
                  disabled={saving}
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
                  disabled={saving}
                />
              </div>

              <Button 
                variant="hero" 
                className="w-full mt-4"
                onClick={handleSavePrivacy}
                disabled={saving}
                aria-disabled={saving}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "שמור הגדרות פרטיות"}
              </Button>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-l from-primary/5 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-primary" aria-hidden="true" />
                </div>
                אבטחה
              </CardTitle>
              <CardDescription>הגדרות אבטחת חשבון</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-12"
                onClick={handleResetPassword}
                disabled={resetLoading}
              >
                {resetLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    שולח...
                  </>
                ) : (
                  <>
                    <Key className="w-5 h-5 text-muted-foreground" />
                    שנה סיסמה
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-12 text-muted-foreground hover:text-foreground"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                התנתק
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/30 overflow-hidden">
            <CardHeader className="bg-gradient-to-l from-destructive/5 to-transparent">
              <CardTitle className="flex items-center gap-2 text-destructive">
                <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </div>
                אזור מסוכן
              </CardTitle>
              <CardDescription>פעולות בלתי הפיכות</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start gap-3 h-12 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground">
                    <Trash2 className="w-5 h-5" />
                    מחק את החשבון שלי
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent dir="rtl">
                  <AlertDialogHeader>
                    <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                      <Trash2 className="w-6 h-6 text-destructive" />
                    </div>
                    <AlertDialogTitle className="text-center">האם אתה בטוח?</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                      פעולה זו תמחק את כל הנתונים שלך לצמיתות, כולל:
                      <ul className="list-disc list-inside mt-4 space-y-1 text-right">
                        <li>הפרופיל שלך</li>
                        <li>כל התמונות שלך</li>
                        <li>כל ההתאמות וההודעות</li>
                        <li>כל הלייקים והפעילות</li>
                      </ul>
                      <p className="mt-4 font-medium text-destructive">
                        לא ניתן לשחזר את הנתונים לאחר מחיקה.
                      </p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex gap-2 sm:flex-row-reverse">
                    <AlertDialogCancel className="flex-1">ביטול</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteAccount}
                      className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Settings;
