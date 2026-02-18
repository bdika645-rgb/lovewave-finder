import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useMyProfileId } from './useMyProfileId';
import { useImpersonationGuard } from '@/contexts/ImpersonationContext';

export function useLikes() {
  const { getMyProfileId, profileId: cachedProfileId } = useMyProfileId();
  const [loading, setLoading] = useState(false);
  const { guardAction } = useImpersonationGuard();

  const sendLike = useCallback(async (likedProfileId: string): Promise<{
    error: Error | null;
    isMatch?: boolean;
    alreadyLiked?: boolean;
  }> => {
    if (!guardAction('like_profile', 'לבצע לייק')) {
      return { error: new Error('Action blocked during impersonation') };
    }

    setLoading(true);
    try {
      const myProfileId = cachedProfileId || await getMyProfileId();
      if (!myProfileId) throw new Error('Profile not found');

      if (myProfileId === likedProfileId) {
        return { error: new Error("Can't like yourself"), alreadyLiked: false };
      }

      const { error } = await supabase
        .from('likes')
        .insert({ liker_id: myProfileId, liked_id: likedProfileId });

      if (error) {
        if (error.code === '23505') return { error: null, alreadyLiked: true };
        throw error;
      }

      // Check for mutual like → match
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
  }, [cachedProfileId, getMyProfileId, guardAction]);

  const removeLike = useCallback(async (likedProfileId: string): Promise<{ error: Error | null }> => {
    if (!guardAction('unlike_profile', 'להסיר לייק')) {
      return { error: new Error('Action blocked during impersonation') };
    }

    setLoading(true);
    try {
      const myProfileId = cachedProfileId || await getMyProfileId();
      if (!myProfileId) throw new Error('Profile not found');

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
  }, [cachedProfileId, getMyProfileId, guardAction]);

  const checkIfLiked = useCallback(async (profileId: string): Promise<boolean> => {
    const myProfileId = cachedProfileId || await getMyProfileId();
    if (!myProfileId) return false;

    const { data } = await supabase
      .from('likes')
      .select('id')
      .eq('liker_id', myProfileId)
      .eq('liked_id', profileId)
      .maybeSingle();

    return !!data;
  }, [cachedProfileId, getMyProfileId]);

  return { sendLike, removeLike, checkIfLiked, loading, getMyProfileId };
}
