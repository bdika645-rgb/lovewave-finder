import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useMyProfileId } from './useMyProfileId';
import { useLikes } from './useLikes';

interface ActionHistoryItem {
  id: string;
  profile_id: string;
  target_profile_id: string;
  action_type: 'like' | 'super_like' | 'pass';
  created_at: string;
}

export function useActionHistory() {
  const [loading, setLoading] = useState(false);
  const { getMyProfileId, profileId: cachedProfileId } = useMyProfileId();
  const { removeLike } = useLikes();

  const recordAction = useCallback(async (
    targetProfileId: string, 
    actionType: 'like' | 'super_like' | 'pass'
  ): Promise<{ error: Error | null }> => {
    try {
      setLoading(true);
      const myProfileId = cachedProfileId || await getMyProfileId();
      if (!myProfileId) throw new Error('Profile not found');

      const { error } = await supabase
        .from('action_history')
        .insert({
          profile_id: myProfileId,
          target_profile_id: targetProfileId,
          action_type: actionType,
        });

      if (error) throw error;
      return { error: null };
    } catch (err) {
      console.error('Error recording action:', err);
      return { error: err as Error };
    } finally {
      setLoading(false);
    }
  }, [getMyProfileId, cachedProfileId]);

  const getLastAction = useCallback(async (): Promise<ActionHistoryItem | null> => {
    try {
      const myProfileId = cachedProfileId || await getMyProfileId();
      if (!myProfileId) return null;

      const { data, error } = await supabase
        .from('action_history')
        .select('*')
        .eq('profile_id', myProfileId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as ActionHistoryItem | null;
    } catch (err) {
      console.error('Error getting last action:', err);
      return null;
    }
  }, [getMyProfileId, cachedProfileId]);

  const undoLastAction = useCallback(async (): Promise<{ 
    error: Error | null; 
    undoneAction: ActionHistoryItem | null;
  }> => {
    try {
      setLoading(true);
      const lastAction = await getLastAction();
      
      if (!lastAction) {
        return { error: new Error('No action to undo'), undoneAction: null };
      }

      // If it was a like/super_like, remove the like
      if (lastAction.action_type === 'like' || lastAction.action_type === 'super_like') {
        await removeLike(lastAction.target_profile_id);
      }

      // Delete the action from history
      const { error } = await supabase
        .from('action_history')
        .delete()
        .eq('id', lastAction.id);

      if (error) throw error;

      return { error: null, undoneAction: lastAction };
    } catch (err) {
      console.error('Error undoing action:', err);
      return { error: err as Error, undoneAction: null };
    } finally {
      setLoading(false);
    }
  }, [getLastAction, removeLike]);

  return {
    recordAction,
    getLastAction,
    undoLastAction,
    loading,
  };
}
