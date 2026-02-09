import { useState, useEffect } from 'react';
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

  useEffect(() => {
    // If we explicitly want to filter by opposite gender AND user is logged in AND we haven't fetched gender yet - wait
    if (options.filterByOppositeGender === true && user && currentUserGender === null) {
      return;
    }
    // Otherwise proceed with fetch
    fetchProfiles();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.search, options.ageFrom, options.ageTo, options.city, options.gender, user, currentUserGender, options.filterByOppositeGender, options.excludeCurrentUser]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('profiles_public')
        .select('id, name, age, city, avatar_url, interests, is_visible, is_online, updated_at, gender')
        .eq('is_visible', true)
        .order('updated_at', { ascending: false });

      // Exclude current user's profile if logged in AND explicitly requested
      if (user && options.excludeCurrentUser === true) {
        // profiles_public is keyed by profile id, so we exclude via RPC lookup
        const { data: myProfileId } = await supabase.rpc('get_my_profile_id');
        if (myProfileId) query = query.neq('id', myProfileId);
      }

      // Filter by opposite gender only if explicitly set to true
      if (options.filterByOppositeGender === true && currentUserGender) {
        const oppositeGender = currentUserGender === 'male' ? 'female' : 'male';
        query = query.eq('gender', oppositeGender);
      }

      // Apply filters
      if (options.ageFrom) {
        query = query.gte('age', options.ageFrom);
      }
      if (options.ageTo) {
        query = query.lte('age', options.ageTo);
      }
      if (options.city) {
        query = query.ilike('city', `%${options.city}%`);
      }
      if (options.gender) {
        query = query.eq('gender', options.gender);
      }
      if (options.search) {
        query = query.or(`name.ilike.%${options.search}%,city.ilike.%${options.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProfiles(data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

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
