import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles_public'>;
type FullProfile = Tables<'profiles'>;

interface UseProfilesOptions {
  search?: string;
  ageFrom?: number;
  ageTo?: number;
  city?: string;
  gender?: string;
  excludeCurrentUser?: boolean;
  filterByOppositeGender?: boolean;
}

export function useProfiles(options: UseProfilesOptions = {}) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserGender, setCurrentUserGender] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch current user's gender for filtering (only when filterByOppositeGender is explicitly true)
  useEffect(() => {
    const fetchCurrentUserGender = async () => {
      if (user && options.filterByOppositeGender === true) {
        const { data } = await supabase
          .from('profiles')
          .select('gender')
          .eq('user_id', user.id)
          .single();
        
        if (data?.gender) {
          setCurrentUserGender(data.gender);
        }
      }
    };
    fetchCurrentUserGender();
  }, [user, options.filterByOppositeGender]);

  const fetchProfiles = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('profiles_public')
        .select('id, name, age, city, avatar_url, interests, is_visible, is_online, updated_at, gender')
        .eq('is_visible', true)
        .order('updated_at', { ascending: false })
        .limit(500);

      // Exclude current user's profile if logged in AND explicitly requested
      if (user && options.excludeCurrentUser === true) {
        const { data: myProfileId } = await supabase.rpc('get_my_profile_id');
        if (myProfileId) query = query.neq('id', myProfileId);
      }

      // Filter by opposite gender only if explicitly set to true
      if (options.filterByOppositeGender === true && currentUserGender) {
        const oppositeGender = currentUserGender === 'male' ? 'female' : 'male';
        query = query.eq('gender', oppositeGender);
      }

      // Apply filters
      if (options.ageFrom) query = query.gte('age', options.ageFrom);
      if (options.ageTo) query = query.lte('age', options.ageTo);
      if (options.city) query = query.ilike('city', `%${options.city}%`);
      if (options.gender) query = query.eq('gender', options.gender);
      if (options.search) {
        query = query.or(`name.ilike.%${options.search}%,city.ilike.%${options.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      const raw = data || [];

      // Smart sort: online-with-avatar → online → with-avatar → rest
      // Seed changes every 5 min to rotate ordering gently
      const seed = Math.floor(Date.now() / (5 * 60 * 1000));
      const pseudoRandom = (id: string, index: number) =>
        ((id.charCodeAt(0) + seed + index) % 100) / 100;

      const tier = (p: typeof raw[0], i: number) => {
        let base = 0;
        if (p.is_online && p.avatar_url) base = 300;
        else if (p.is_online) base = 200;
        else if (p.avatar_url) base = 100;
        base += Math.min((p.interests?.length || 0) * 5, 40);
        base += pseudoRandom(p.id, i) * 30;
        return base;
      };

      const sorted = raw
        .map((p, i) => ({ p, score: tier(p, i) }))
        .sort((a, b) => b.score - a.score)
        .map(({ p }) => p);

      setProfiles(sorted);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, currentUserGender, options.search, options.ageFrom, options.ageTo, options.city, options.gender, options.filterByOppositeGender, options.excludeCurrentUser]);

  useEffect(() => {
    if (options.filterByOppositeGender === true && user && currentUserGender === null) return;
    fetchProfiles();
  }, [fetchProfiles, options.filterByOppositeGender, user, currentUserGender]);

  return { profiles, loading, error, refetch: fetchProfiles };
}

export function useProfileById(id: string) {
  const [profile, setProfile] = useState<FullProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id, user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      // Try full profile table first (RLS will control visibility)
      if (user) {
        const { data, error: fullError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (!fullError && data) {
          setProfile(data);
          return;
        }
      }

      // Fallback to public view
      const { data, error } = await supabase
        .from('profiles_public')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      // Map public profile to full profile shape with nulls for missing fields
      setProfile({
        ...data,
        bio: null,
        education: null,
        height: null,
        smoking: null,
        relationship_goal: null,
        looking_for: null,
        is_verified: null,
        is_blocked: null,
        is_demo: null,
        blocked_at: null,
        blocked_by: null,
        blocked_reason: null,
        last_seen: null,
        user_id: null,
        created_at: data.updated_at,
      } as FullProfile);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error };
}
