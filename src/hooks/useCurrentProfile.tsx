import { useState, useEffect, useCallback, createContext, useContext, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;

interface CurrentProfileContextType {
  profile: Profile | null;
  profileId: string | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
}

const CurrentProfileContext = createContext<CurrentProfileContextType | undefined>(undefined);

export function CurrentProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        // Profile might not exist yet
        if (fetchError.code === 'PGRST116') {
          setProfile(null);
          setError(null);
        } else {
          throw fetchError;
        }
      } else {
        setProfile(data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(async (updates: Partial<Profile>): Promise<{ error: Error | null }> => {
    if (!user || !profile) {
      return { error: new Error('Not authenticated') };
    }

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      // Update local state
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  }, [user, profile]);

  const value = useMemo(() => ({
    profile,
    profileId: profile?.id || null,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile,
  }), [profile, loading, error, fetchProfile, updateProfile]);

  return (
    <CurrentProfileContext.Provider value={value}>
      {children}
    </CurrentProfileContext.Provider>
  );
}

export function useCurrentProfile() {
  const context = useContext(CurrentProfileContext);
  if (context === undefined) {
    throw new Error('useCurrentProfile must be used within a CurrentProfileProvider');
  }
  return context;
}

// Simple hook for just getting the profile ID (for backwards compatibility)
export function useProfileId() {
  const { profileId, loading } = useCurrentProfile();
  return { profileId, loading };
}
