import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useMyProfileId } from './useMyProfileId';
import type { Tables } from '@/integrations/supabase/types';

type Match = Tables<'matches'>;
type Profile = Tables<'profiles'>;

export interface MatchWithProfile extends Match {
  matchedProfile: Profile;
}

export function useMatches() {
  const [matches, setMatches] = useState<MatchWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { getMyProfileId, profileId: cachedProfileId } = useMyProfileId();

  const fetchMatches = useCallback(async () => {
    if (!user) {
      setMatches([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const myProfileId = cachedProfileId || await getMyProfileId();
      
      if (!myProfileId) {
        setMatches([]);
        setLoading(false);
        return;
      }

      // Get all matches where current user is either profile1 or profile2
      const { data: matchData, error: matchError } = await supabase
        .from('matches')
        .select('*')
        .or(`profile1_id.eq.${myProfileId},profile2_id.eq.${myProfileId}`)
        .order('created_at', { ascending: false });

      if (matchError) throw matchError;

      if (!matchData || matchData.length === 0) {
        setMatches([]);
        setLoading(false);
        return;
      }

      // Get the profile IDs of matched users (not the current user)
      const matchedProfileIds = matchData.map(match => 
        match.profile1_id === myProfileId ? match.profile2_id : match.profile1_id
      );

      // Fetch all matched profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', matchedProfileIds);

      if (profileError) throw profileError;

      // Combine matches with profiles
       const matchesWithProfiles: MatchWithProfile[] = matchData
         .map((match) => {
           const matchedProfileId = match.profile1_id === myProfileId ? match.profile2_id : match.profile1_id;
           const matchedProfile = profileData?.find((p) => p.id === matchedProfileId);
           if (!matchedProfile) return null;

           return {
             ...match,
             matchedProfile,
           };
         })
         .filter(Boolean) as MatchWithProfile[];

      setMatches(matchesWithProfiles);
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [user, getMyProfileId, cachedProfileId]);

  useEffect(() => {
    fetchMatches();

    if (!user) return;

    // Realtime: auto-refresh when new match is created or deleted
    const channel = supabase
      .channel('matches-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'matches' },
        () => { fetchMatches(); }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'matches' },
        (payload) => {
          // Optimistically remove from local state without full refetch
          const deletedId = (payload.old as Match).id;
          setMatches(prev => prev.filter(m => m.id !== deletedId));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchMatches, user]);

  return { matches, loading, error, refetch: fetchMatches };
}
