import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useMyProfileId } from './useMyProfileId';

export function useDeleteAccount() {
  const { user, signOut } = useAuth();
  const { profileId } = useMyProfileId();
  const [loading, setLoading] = useState(false);

  const deleteAccount = async (): Promise<{ error: Error | null }> => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      setLoading(true);

      // Server-side deletion handles permissions and full cleanup.
      const { data, error } = await supabase.functions.invoke('delete-account');
      if (error) throw error;
      if (!data?.success) throw new Error('Delete failed');

      // Sign out locally (server deletion revokes sessions, but this keeps UI consistent)
      await signOut();

      return { error: null };
    } catch (err) {
      console.error('Error deleting account:', err);
      return { error: err as Error };
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteAccount,
    loading,
  };
}
