import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useDeleteAccount() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const deleteAccount = async (): Promise<{ error: Error | null }> => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      setLoading(true);

      // Get user's profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        // Delete all photos from storage
        const { data: photos } = await supabase
          .from('photos')
          .select('url')
          .eq('profile_id', profile.id);

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
        await supabase.from('photos').delete().eq('profile_id', profile.id);

        // Delete action history
        await supabase.from('action_history').delete().eq('profile_id', profile.id);
        await supabase.from('action_history').delete().eq('target_profile_id', profile.id);

        // Delete likes
        await supabase.from('likes').delete().eq('liker_id', profile.id);
        await supabase.from('likes').delete().eq('liked_id', profile.id);

        // Delete matches
        await supabase.from('matches').delete().eq('profile1_id', profile.id);
        await supabase.from('matches').delete().eq('profile2_id', profile.id);

        // Delete messages
        await supabase.from('messages').delete().eq('sender_id', profile.id);

        // Delete conversation participants
        await supabase.from('conversation_participants').delete().eq('profile_id', profile.id);

        // Delete reports
        await supabase.from('reports').delete().eq('reporter_id', profile.id);
        await supabase.from('reports').delete().eq('reported_id', profile.id);

        // Delete blocked users
        await supabase.from('blocked_users').delete().eq('blocker_id', profile.id);
        await supabase.from('blocked_users').delete().eq('blocked_id', profile.id);

        // Delete profile
        await supabase.from('profiles').delete().eq('id', profile.id);
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
