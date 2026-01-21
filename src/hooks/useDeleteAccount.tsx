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

      if (profileId) {
        // Delete all photos from storage
        const { data: photos } = await supabase
          .from('photos')
          .select('url')
          .eq('profile_id', profileId);

        if (photos) {
          const filePaths = photos
            .map(p => {
              const parts = p.url.split('/avatars/');
              return parts.length > 1 ? parts[1] : null;
            })
            .filter(Boolean) as string[];

          if (filePaths.length > 0) {
            await supabase.storage.from('avatars').remove(filePaths);
          }
        }

        // Delete photos records
        await supabase.from('photos').delete().eq('profile_id', profileId);

        // Delete action history
        await supabase.from('action_history').delete().eq('profile_id', profileId);
        await supabase.from('action_history').delete().eq('target_profile_id', profileId);

        // Delete likes
        await supabase.from('likes').delete().eq('liker_id', profileId);
        await supabase.from('likes').delete().eq('liked_id', profileId);

        // Delete matches
        await supabase.from('matches').delete().eq('profile1_id', profileId);
        await supabase.from('matches').delete().eq('profile2_id', profileId);

        // Delete messages
        await supabase.from('messages').delete().eq('sender_id', profileId);

        // Delete conversation participants
        await supabase.from('conversation_participants').delete().eq('profile_id', profileId);

        // Delete reports
        await supabase.from('reports').delete().eq('reporter_id', profileId);
        await supabase.from('reports').delete().eq('reported_id', profileId);

        // Delete blocked users
        await supabase.from('blocked_users').delete().eq('blocker_id', profileId);
        await supabase.from('blocked_users').delete().eq('blocked_id', profileId);

        // Delete profile
        await supabase.from('profiles').delete().eq('id', profileId);
      }

      // Delete user settings
      await supabase.from('user_settings').delete().eq('user_id', user.id);

      // Sign out
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
