import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAppSettings } from "@/hooks/useAppSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Save, Bell, Shield, Palette, Globe, Loader2 } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
} as const;
export default function AdminSettings() {
  const { settings, loading, saving, updateSettings } = useAppSettings();
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = async () => {
    await updateSettings(localSettings);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-8 max-w-4xl">
          <div>
            <h1 className="text-3xl font-bold text-foreground">הגדרות</h1>
            <p className="text-muted-foreground mt-1">הגדרות כלליות של האפליקציה</p>
          </div>
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div 
        className="space-y-8 max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-foreground">הגדרות</h1>
          <p className="text-muted-foreground mt-1">הגדרות כלליות של האפליקציה</p>
        </motion.div>

        {/* General Settings */}
        <motion.div variants={itemVariants} className="bg-card rounded-xl p-6 border border-border space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">הגדרות כלליות</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="siteName">שם האתר</Label>
              <Input
                id="siteName"
                value={localSettings.site_name}
                onChange={(e) => setLocalSettings({ ...localSettings, site_name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteDescription">תיאור האתר</Label>
              <Input
                id="siteDescription"
                value={localSettings.site_description}
                onChange={(e) => setLocalSettings({ ...localSettings, site_description: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="welcomeMessage">הודעת פתיחה</Label>
            <Textarea
              id="welcomeMessage"
              value={localSettings.welcome_message}
              onChange={(e) => setLocalSettings({ ...localSettings, welcome_message: e.target.value })}
              rows={3}
            />
          </div>
        </motion.div>

        {/* Security Settings */}
        <motion.div variants={itemVariants} className="bg-card rounded-xl p-6 border border-border space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">אבטחה</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">מצב תחזוקה</p>
                <p className="text-sm text-muted-foreground">חסום גישה לאתר למשתמשים רגילים</p>
              </div>
              <Switch
                checked={localSettings.maintenance_mode}
                onCheckedChange={(checked) => setLocalSettings({ ...localSettings, maintenance_mode: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">אפשר הרשמה</p>
                <p className="text-sm text-muted-foreground">אפשר למשתמשים חדשים להירשם</p>
              </div>
              <Switch
                checked={localSettings.allow_registration}
                onCheckedChange={(checked) => setLocalSettings({ ...localSettings, allow_registration: checked })}
              />
            </div>
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div variants={itemVariants} className="bg-card rounded-xl p-6 border border-border space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">התראות</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">התראות אימייל</p>
                <p className="text-sm text-muted-foreground">שלח התראות באימייל למשתמשים</p>
              </div>
              <Switch
                checked={localSettings.email_notifications}
                onCheckedChange={(checked) => setLocalSettings({ ...localSettings, email_notifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">שלח התראות push למכשירים</p>
              </div>
              <Switch
                checked={localSettings.push_notifications}
                onCheckedChange={(checked) => setLocalSettings({ ...localSettings, push_notifications: checked })}
              />
            </div>
          </div>
        </motion.div>

        {/* Profile Settings */}
        <motion.div variants={itemVariants} className="bg-card rounded-xl p-6 border border-border space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">הגדרות פרופיל</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="minAge">גיל מינימלי</Label>
              <Input
                id="minAge"
                type="number"
                value={localSettings.min_age}
                onChange={(e) => setLocalSettings({ ...localSettings, min_age: parseInt(e.target.value) || 18 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxAge">גיל מקסימלי</Label>
              <Input
                id="maxAge"
                type="number"
                value={localSettings.max_age}
                onChange={(e) => setLocalSettings({ ...localSettings, max_age: parseInt(e.target.value) || 99 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxPhotos">מקסימום תמונות</Label>
              <Input
                id="maxPhotos"
                type="number"
                value={localSettings.max_photos}
                onChange={(e) => setLocalSettings({ ...localSettings, max_photos: parseInt(e.target.value) || 6 })}
              />
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div variants={itemVariants} className="flex justify-end">
          <Button onClick={handleSave} size="lg" disabled={saving}>
            {saving ? (
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 ml-2" />
            )}
            שמור הגדרות
          </Button>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}
