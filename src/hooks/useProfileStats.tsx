import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useMyProfileId } from './useMyProfileId';

interface ProfileStats {
  likesReceived: number;
  likesSent: number;
  matchesCount: number;
}

export function useProfileStats() {
  const { user } = useAuth();
  const { profileId } = useMyProfileId();
  const [stats, setStats] = useState<ProfileStats>({
    likesReceived: 0,
    likesSent: 0,
    matchesCount: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!user || !profileId) {
      setStats({ likesReceived: 0, likesSent: 0, matchesCount: 0 });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch all stats in parallel
      const [likesReceivedRes, likesSentRes, matchesRes] = await Promise.all([
        // Likes received
        supabase
          .from('likes')
          .select('id', { count: 'exact', head: true })
          .eq('liked_id', profileId),
        
        // Likes sent
        supabase
          .from('likes')
          .select('id', { count: 'exact', head: true })
          .eq('liker_id', profileId),
        
        // Matches count
        supabase
          .from('matches')
          .select('id', { count: 'exact', head: true })
          .or(`profile1_id.eq.${profileId},profile2_id.eq.${profileId}`),
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
  }, [user, profileId]);

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
