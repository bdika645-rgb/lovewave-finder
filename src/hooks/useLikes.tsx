import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useMyProfileId } from './useMyProfileId';
import { useImpersonationGuard } from '@/contexts/ImpersonationContext';

export function useLikes() {
  const { getMyProfileId, profileId: cachedProfileId } = useMyProfileId();
  const [loading, setLoading] = useState(false);
  const { guardAction } = useImpersonationGuard();

  const sendLike = async (likedProfileId: string): Promise<{
    error: Error | null;
    isMatch?: boolean;
    alreadyLiked?: boolean;
  }> => {
    // Block action during impersonation
    if (!guardAction('like_profile', 'לבצע לייק')) {
      return { error: new Error('Action blocked during impersonation') };
    }

    setLoading(true);
    try {
      const myProfileId = cachedProfileId || await getMyProfileId();
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
    // Block action during impersonation
    if (!guardAction('unlike_profile', 'להסיר לייק')) {
      return { error: new Error('Action blocked during impersonation') };
    }

    setLoading(true);
    try {
      const myProfileId = cachedProfileId || await getMyProfileId();
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
    const myProfileId = cachedProfileId || await getMyProfileId();
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
