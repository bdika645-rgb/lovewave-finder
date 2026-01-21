import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function usePasswordReset() {
  const [loading, setLoading] = useState(false);

  const sendResetEmail = async (email: string): Promise<{ error: Error | null }> => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) throw error;
      return { error: null };
    } catch (err) {
      console.error('Error sending reset email:', err);
      return { error: err as Error };
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword: string): Promise<{ error: Error | null }> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      return { error: null };
    } catch (err) {
      console.error('Error updating password:', err);
      return { error: err as Error };
    } finally {
      setLoading(false);
    }
  };

  return {
    sendResetEmail,
    updatePassword,
    loading,
  };
}
