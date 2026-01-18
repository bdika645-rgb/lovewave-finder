import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, Bell, Shield, Palette, Globe } from "lucide-react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: "Spark",
    siteDescription: "אפליקציית הכרויות מובילה בישראל",
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
    pushNotifications: true,
    minAge: 18,
    maxAge: 99,
    maxPhotos: 6,
    welcomeMessage: "ברוכים הבאים ל-Spark! מקווים שתמצאו את האהבה האמיתית."
  });

  const handleSave = () => {
    // In a real app, this would save to the database
    toast.success("ההגדרות נשמרו בהצלחה");
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold text-foreground">הגדרות</h1>
          <p className="text-muted-foreground mt-1">הגדרות כלליות של האפליקציה</p>
        </div>

        {/* General Settings */}
        <div className="bg-card rounded-xl p-6 border border-border space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">הגדרות כלליות</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="siteName">שם האתר</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteDescription">תיאור האתר</Label>
              <Input
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="welcomeMessage">הודעת פתיחה</Label>
            <Textarea
              id="welcomeMessage"
              value={settings.welcomeMessage}
              onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
              rows={3}
            />
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-card rounded-xl p-6 border border-border space-y-6">
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
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">אפשר הרשמה</p>
                <p className="text-sm text-muted-foreground">אפשר למשתמשים חדשים להירשם</p>
              </div>
              <Switch
                checked={settings.allowRegistration}
                onCheckedChange={(checked) => setSettings({ ...settings, allowRegistration: checked })}
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-card rounded-xl p-6 border border-border space-y-6">
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
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">שלח התראות push למכשירים</p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
              />
            </div>
          </div>
        </div>

        {/* Profile Settings */}
        <div className="bg-card rounded-xl p-6 border border-border space-y-6">
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
                value={settings.minAge}
                onChange={(e) => setSettings({ ...settings, minAge: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxAge">גיל מקסימלי</Label>
              <Input
                id="maxAge"
                type="number"
                value={settings.maxAge}
                onChange={(e) => setSettings({ ...settings, maxAge: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxPhotos">מקסימום תמונות</Label>
              <Input
                id="maxPhotos"
                type="number"
                value={settings.maxPhotos}
                onChange={(e) => setSettings({ ...settings, maxPhotos: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg">
            <Save className="w-4 h-4 ml-2" />
            שמור הגדרות
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
