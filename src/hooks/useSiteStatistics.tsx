import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';

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

  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminAuth();

  const fetchStats = useCallback(async () => {
    try {
      // Only admins can read/refresh site_statistics. For everyone else we keep safe defaults
      // (the landing page already swaps in demo numbers where appropriate).
      if (!user || adminLoading || !isAdmin) {
        setError(null);
        setLoading(false);
        return;
      }

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
    } finally {
      setLoading(false);
    }
  }, [user, adminLoading, isAdmin]);

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
