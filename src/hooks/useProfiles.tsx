import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;

interface UseProfilesOptions {
  search?: string;
  ageFrom?: number;
  ageTo?: number;
  city?: string;
  excludeCurrentUser?: boolean;
  filterByOppositeGender?: boolean;
}

export function useProfiles(options: UseProfilesOptions = {}) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserGender, setCurrentUserGender] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch current user's gender for filtering
  useEffect(() => {
    const fetchCurrentUserGender = async () => {
      if (user && options.filterByOppositeGender !== false) {
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
    // If user is logged in and we need to filter by gender but haven't fetched it yet, wait
    if (user && options.filterByOppositeGender !== false && currentUserGender === null) {
      return;
    }
    // If no user, or filterByOppositeGender is false, or we have the gender - proceed
    fetchProfiles();
  }, [options.search, options.ageFrom, options.ageTo, options.city, user, currentUserGender, options.filterByOppositeGender]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      // Exclude current user's profile if logged in
      if (user && options.excludeCurrentUser !== false) {
        query = query.neq('user_id', user.id);
      }

      // Filter by opposite gender - men see women, women see men
      if (currentUserGender && options.filterByOppositeGender !== false) {
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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error };
}
