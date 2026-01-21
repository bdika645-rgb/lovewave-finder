import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useCurrentProfile } from './useCurrentProfile';

/**
 * Hook to get the current user's profile ID efficiently.
 * Uses the CurrentProfileContext when available, falls back to RPC.
 * This consolidates all getMyProfileId logic into one place.
 */
export function useMyProfileId() {
  const { user } = useAuth();
  const { profileId: contextProfileId } = useCurrentProfile();

  /**
   * Get profile ID - uses context if available, otherwise calls RPC
   */
  const getMyProfileId = useCallback(async (): Promise<string | null> => {
    // First, try to use the cached profile ID from context
    if (contextProfileId) {
      return contextProfileId;
    }

    // Fallback to RPC if context not ready
    if (!user) return null;
    
    const { data, error } = await supabase.rpc('get_my_profile_id');

    if (error) {
      console.error('Error getting profile ID:', error);
      return null;
    }
    
    return data || null;
  }, [user, contextProfileId]);

  return { 
    getMyProfileId, 
    profileId: contextProfileId,
  };
}
