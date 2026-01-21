import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SiteStatistics {
  totalMembers: string;
  successfulMatches: string;
  messagesPerDay: string;
  dailyActiveUsers: string;
  mostActiveCity: string;
  averageMatchTime: string;
}

const defaultStats: SiteStatistics = {
  totalMembers: "0",
  successfulMatches: "0",
  messagesPerDay: "0",
  dailyActiveUsers: "0",
  mostActiveCity: "תל אביב",
  averageMatchTime: "3 ימים",
};

export function useSiteStatistics() {
  const [stats, setStats] = useState<SiteStatistics>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      
      // First, update the statistics
      await supabase.rpc('update_site_statistics');
      
      // Then fetch the updated stats
      const { data, error } = await supabase
        .from('site_statistics')
        .select('stat_key, stat_value');

      if (error) throw error;

      if (data) {
        const statsMap: Partial<SiteStatistics> = {};
        data.forEach(item => {
          switch (item.stat_key) {
            case 'total_members':
              statsMap.totalMembers = formatNumber(parseInt(item.stat_value || '0'));
              break;
            case 'successful_matches':
              statsMap.successfulMatches = formatNumber(parseInt(item.stat_value || '0'));
              break;
            case 'messages_per_day':
              statsMap.messagesPerDay = formatNumber(parseInt(item.stat_value || '0'));
              break;
            case 'daily_active_users':
              statsMap.dailyActiveUsers = formatNumber(parseInt(item.stat_value || '0'));
              break;
            case 'most_active_city':
              statsMap.mostActiveCity = item.stat_value || 'תל אביב';
              break;
            case 'average_match_time':
              statsMap.averageMatchTime = item.stat_value || '3 ימים';
              break;
          }
        });
        
        setStats(prev => ({ ...prev, ...statsMap }));
      }
    } catch (err) {
      console.error('Error fetching site statistics:', err);
      setError((err as Error).message);
      
      // Fallback: calculate stats directly if RPC fails
      await fetchStatsDirectly();
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStatsDirectly = async () => {
    try {
      // Get total visible members
      const { count: totalMembers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_blocked', false)
        .eq('is_visible', true);

      // Get total matches
      const { count: totalMatches } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true });

      // Get messages from last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count: recentMessages } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());

      // Get active users (last 24 hours)
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      
      const { count: activeUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('last_seen', oneDayAgo.toISOString());

      setStats({
        totalMembers: formatNumber(totalMembers || 0),
        successfulMatches: formatNumber(totalMatches || 0),
        messagesPerDay: formatNumber(Math.round((recentMessages || 0) / 7)),
        dailyActiveUsers: formatNumber(activeUsers || 0),
        mostActiveCity: 'תל אביב',
        averageMatchTime: '3 ימים',
      });
    } catch (err) {
      console.error('Error fetching stats directly:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M+';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K+';
  }
  return num.toString() + '+';
}
