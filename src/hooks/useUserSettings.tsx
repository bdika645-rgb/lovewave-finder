import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface UserSettings {
  id?: string;
  user_id?: string;
  email_notifications: boolean;
  push_notifications: boolean;
  match_notifications: boolean;
  message_notifications: boolean;
  show_online_status: boolean;
  show_last_seen: boolean;
  profile_visible: boolean;
}

const defaultSettings: UserSettings = {
  email_notifications: true,
  push_notifications: true,
  match_notifications: true,
  message_notifications: true,
  show_online_status: true,
  show_last_seen: true,
  profile_visible: true,
};

export function useUserSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSettings = useCallback(async () => {
    if (!user) {
      setSettings(defaultSettings);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (data) {
        setSettings({
          id: data.id,
          user_id: data.user_id,
          email_notifications: data.email_notifications ?? true,
          push_notifications: data.push_notifications ?? true,
          match_notifications: data.match_notifications ?? true,
          message_notifications: data.message_notifications ?? true,
          show_online_status: data.show_online_status ?? true,
          show_last_seen: data.show_last_seen ?? true,
          profile_visible: data.profile_visible ?? true,
        });
      } else {
        // Create default settings for new user
        const { data: newData, error: insertError } = await supabase
          .from('user_settings')
          .insert({ user_id: user.id })
          .select()
          .single();

        if (insertError) throw insertError;
        if (newData) {
          setSettings({
            id: newData.id,
            user_id: newData.user_id,
            email_notifications: newData.email_notifications ?? true,
            push_notifications: newData.push_notifications ?? true,
            match_notifications: newData.match_notifications ?? true,
            message_notifications: newData.message_notifications ?? true,
            show_online_status: newData.show_online_status ?? true,
            show_last_seen: newData.show_last_seen ?? true,
            profile_visible: newData.profile_visible ?? true,
          });
        }
      }
    } catch (err) {
      console.error('Error fetching user settings:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (updates: Partial<UserSettings>): Promise<{ error: Error | null }> => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      setSaving(true);

      const { error: updateError } = await supabase
        .from('user_settings')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Also update profile visibility if changed
      if (updates.profile_visible !== undefined) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ is_visible: updates.profile_visible })
          .eq('user_id', user.id);

        if (profileError) console.error('Error updating profile visibility:', profileError);
      }

      // Update online status preference
      if (updates.show_online_status !== undefined) {
        const { error: onlineError } = await supabase
          .from('profiles')
          .update({ is_online: updates.show_online_status ? true : false })
          .eq('user_id', user.id);

        if (onlineError) console.error('Error updating online status:', onlineError);
      }

      setSettings(prev => ({ ...prev, ...updates }));
      return { error: null };
    } catch (err) {
      console.error('Error updating settings:', err);
      return { error: err as Error };
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
    refetch: fetchSettings,
  };
}
