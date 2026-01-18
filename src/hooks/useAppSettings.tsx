import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AppSettings {
  site_name: string;
  site_description: string;
  maintenance_mode: boolean;
  allow_registration: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  min_age: number;
  max_age: number;
  max_photos: number;
  welcome_message: string;
}

const defaultSettings: AppSettings = {
  site_name: "Spark",
  site_description: "אפליקציית הכרויות מובילה בישראל",
  maintenance_mode: false,
  allow_registration: true,
  email_notifications: true,
  push_notifications: true,
  min_age: 18,
  max_age: 99,
  max_photos: 6,
  welcome_message: "ברוכים הבאים ל-Spark! מקווים שתמצאו את האהבה האמיתית."
};

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error: fetchError } = await supabase
        .from("app_settings")
        .select("key, value");

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        const loadedSettings: Record<string, unknown> = {};
        data.forEach(row => {
          loadedSettings[row.key] = row.value;
        });

        setSettings({
          site_name: (loadedSettings.site_name as string) || defaultSettings.site_name,
          site_description: (loadedSettings.site_description as string) || defaultSettings.site_description,
          maintenance_mode: loadedSettings.maintenance_mode === true,
          allow_registration: loadedSettings.allow_registration !== false,
          email_notifications: loadedSettings.email_notifications !== false,
          push_notifications: loadedSettings.push_notifications !== false,
          min_age: (loadedSettings.min_age as number) || defaultSettings.min_age,
          max_age: (loadedSettings.max_age as number) || defaultSettings.max_age,
          max_photos: (loadedSettings.max_photos as number) || defaultSettings.max_photos,
          welcome_message: (loadedSettings.welcome_message as string) || defaultSettings.welcome_message,
        });
      }
    } catch (err) {
      setError(err as Error);
      console.error("Error fetching settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      setSaving(true);

      const updates = Object.entries(newSettings).map(([key, value]) => ({
        key,
        value: JSON.stringify(value),
        updated_at: new Date().toISOString()
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from("app_settings")
          .upsert(
            { key: update.key, value: JSON.parse(update.value), updated_at: update.updated_at },
            { onConflict: "key" }
          );

        if (error) throw error;
      }

      setSettings(prev => ({ ...prev, ...newSettings }));
      toast.success("ההגדרות נשמרו בהצלחה");
    } catch (err) {
      console.error("Error updating settings:", err);
      toast.error("שגיאה בשמירת ההגדרות");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    settings,
    loading,
    saving,
    error,
    updateSettings,
    refetch: fetchSettings
  };
}
