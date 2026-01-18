import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useLikes() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const getMyProfileId = async (): Promise<string | null> => {
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error getting profile:', error);
      return null;
    }
    
    return data?.id || null;
  };

  const sendLike = async (likedProfileId: string) => {
    setLoading(true);
    try {
      const myProfileId = await getMyProfileId();
      if (!myProfileId) {
        throw new Error('Profile not found');
      }

      const { error } = await supabase
        .from('likes')
        .insert({
          liker_id: myProfileId,
          liked_id: likedProfileId,
        });

      if (error) {
        // Check if it's a duplicate
        if (error.code === '23505') {
          return { error: null, alreadyLiked: true };
        }
        throw error;
      }

      // Check if it's a match (mutual like)
      const { data: mutualLike } = await supabase
        .from('likes')
        .select('id')
        .eq('liker_id', likedProfileId)
        .eq('liked_id', myProfileId)
        .single();

      return { error: null, isMatch: !!mutualLike };
    } catch (err) {
      return { error: err as Error };
    } finally {
      setLoading(false);
    }
  };

  const removeLike = async (likedProfileId: string) => {
    setLoading(true);
    try {
      const myProfileId = await getMyProfileId();
      if (!myProfileId) {
        throw new Error('Profile not found');
      }

      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('liker_id', myProfileId)
        .eq('liked_id', likedProfileId);

      if (error) throw error;
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    } finally {
      setLoading(false);
    }
  };

  return { sendLike, removeLike, loading };
}
