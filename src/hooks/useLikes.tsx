import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useLikes() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const getMyProfileId = useCallback(async (): Promise<string | null> => {
    if (!user) return null;
    
    // Use RPC function for better performance
    const { data, error } = await supabase.rpc('get_my_profile_id');

    if (error) {
      console.error('Error getting profile:', error);
      return null;
    }
    
    return data || null;
  }, [user]);

  const sendLike = async (likedProfileId: string): Promise<{
    error: Error | null;
    isMatch?: boolean;
    alreadyLiked?: boolean;
  }> => {
    setLoading(true);
    try {
      const myProfileId = await getMyProfileId();
      if (!myProfileId) {
        throw new Error('Profile not found');
      }

      // Can't like yourself
      if (myProfileId === likedProfileId) {
        return { error: new Error("Can't like yourself"), alreadyLiked: false };
      }

      const { error } = await supabase
        .from('likes')
        .insert({
          liker_id: myProfileId,
          liked_id: likedProfileId,
        });

      if (error) {
        // Check if it's a duplicate (unique constraint violation)
        if (error.code === '23505') {
          return { error: null, alreadyLiked: true };
        }
        throw error;
      }

      // Check if it's a match (mutual like) - the match is auto-created by trigger
      // But we check here to notify the user
      const { data: mutualLike } = await supabase
        .from('likes')
        .select('id')
        .eq('liker_id', likedProfileId)
        .eq('liked_id', myProfileId)
        .maybeSingle();

      return { error: null, isMatch: !!mutualLike, alreadyLiked: false };
    } catch (err) {
      return { error: err as Error };
    } finally {
      setLoading(false);
    }
  };

  const removeLike = async (likedProfileId: string): Promise<{ error: Error | null }> => {
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

  const checkIfLiked = async (profileId: string): Promise<boolean> => {
    const myProfileId = await getMyProfileId();
    if (!myProfileId) return false;

    const { data } = await supabase
      .from('likes')
      .select('id')
      .eq('liker_id', myProfileId)
      .eq('liked_id', profileId)
      .maybeSingle();

    return !!data;
  };

  return { sendLike, removeLike, checkIfLiked, loading, getMyProfileId };
}
