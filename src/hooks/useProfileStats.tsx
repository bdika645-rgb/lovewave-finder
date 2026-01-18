import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface ProfileStats {
  likesReceived: number;
  likesSent: number;
  matchesCount: number;
}

export function useProfileStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ProfileStats>({
    likesReceived: 0,
    likesSent: 0,
    matchesCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!user) {
      setStats({ likesReceived: 0, likesSent: 0, matchesCount: 0 });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Get user's profile ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        setLoading(false);
        return;
      }

      setProfileId(profile.id);

      // Fetch all stats in parallel
      const [likesReceivedRes, likesSentRes, matchesRes] = await Promise.all([
        // Likes received
        supabase
          .from('likes')
          .select('id', { count: 'exact', head: true })
          .eq('liked_id', profile.id),
        
        // Likes sent
        supabase
          .from('likes')
          .select('id', { count: 'exact', head: true })
          .eq('liker_id', profile.id),
        
        // Matches count
        supabase
          .from('matches')
          .select('id', { count: 'exact', head: true })
          .or(`profile1_id.eq.${profile.id},profile2_id.eq.${profile.id}`),
      ]);

      setStats({
        likesReceived: likesReceivedRes.count || 0,
        likesSent: likesSentRes.count || 0,
        matchesCount: matchesRes.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!profileId) return;

    const channel = supabase
      .channel('profile-stats')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'likes',
          filter: `liked_id=eq.${profileId}`,
        },
        () => {
          // Refetch stats when likes change
          fetchStats();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches',
        },
        () => {
          // Refetch stats when matches change
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profileId, fetchStats]);

  return { stats, loading, refetch: fetchStats };
}
