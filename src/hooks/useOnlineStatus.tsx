import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

/**
 * Tracks user online status by updating is_online and last_seen
 * on visibility change and periodic heartbeat.
 */
export function useOnlineStatus() {
  const { user } = useAuth();

  const setOnline = useCallback(async (online: boolean) => {
    if (!user) return;
    try {
      await supabase
        .from('profiles')
        .update({ 
          is_online: online, 
          last_seen: new Date().toISOString() 
        })
        .eq('user_id', user.id);
    } catch {
      // Silently fail
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    // Set online on mount
    setOnline(true);

    // Handle visibility change
    const handleVisibility = () => {
      setOnline(!document.hidden);
    };

    // Handle beforeunload — just call setOnline directly (async best-effort)
    const handleUnload = () => {
      setOnline(false);
    };

    // Heartbeat every 2 minutes
    const heartbeat = setInterval(() => {
      if (!document.hidden) {
        setOnline(true);
      }
    }, 120000);

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('beforeunload', handleUnload);
      clearInterval(heartbeat);
      setOnline(false);
    };
  }, [user, setOnline]);
}
