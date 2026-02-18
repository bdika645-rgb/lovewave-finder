import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useCurrentProfile } from './useCurrentProfile';

interface Notification {
  id: string;
  type: 'match' | 'like' | 'message' | 'super_like';
  title: string;
  message: string;
  profileId?: string;
  profileName?: string;
  profileImage?: string;
  createdAt: string;
  read: boolean;
}

export function useNotifications() {
  const { user } = useAuth();
  const { profile } = useCurrentProfile();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Persist read state in localStorage
  const getReadIds = useCallback((): Set<string> => {
    try {
      const stored = localStorage.getItem(`read-notifs-${user?.id}`);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch { return new Set(); }
  }, [user?.id]);

  const saveReadId = useCallback((id: string) => {
    try {
      const readIds = getReadIds();
      readIds.add(id);
      // Keep only last 200 IDs to avoid bloat
      const arr = Array.from(readIds).slice(-200);
      localStorage.setItem(`read-notifs-${user?.id}`, JSON.stringify(arr));
    } catch { /* ignore */ }
  }, [user?.id, getReadIds]);

  const fetchNotifications = useCallback(async () => {
    if (!profile) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch recent matches (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const [matchesResult, likesResult] = await Promise.all([
        supabase
          .from('matches')
          .select(`
            id,
            created_at,
            profile1_id,
            profile2_id
          `)
          .or(`profile1_id.eq.${profile.id},profile2_id.eq.${profile.id}`)
          .gte('created_at', weekAgo.toISOString())
          .order('created_at', { ascending: false })
          .limit(10),
        
        supabase
          .from('likes')
          .select(`
            id,
            created_at,
            liker_id,
            is_super
          `)
          .eq('liked_id', profile.id)
          .gte('created_at', weekAgo.toISOString())
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      const notifs: Notification[] = [];
      const allProfileIds = new Set<string>();

      // Collect all profile IDs that we need
      if (matchesResult.data) {
        matchesResult.data.forEach(m => {
          allProfileIds.add(m.profile1_id === profile.id ? m.profile2_id : m.profile1_id);
        });
      }
      if (likesResult.data) {
        likesResult.data.forEach(l => allProfileIds.add(l.liker_id));
      }

      // Fetch ALL needed profiles in ONE query
      const profileIds = Array.from(allProfileIds);
      const profileMap = new Map<string, { id: string; name: string; avatar_url: string | null }>();
      if (profileIds.length > 0) {
        const { data: allProfiles } = await supabase
          .from('profiles')
          .select('id, name, avatar_url')
          .in('id', profileIds);
        allProfiles?.forEach(p => profileMap.set(p.id, p));
      }

      // Process matches
      if (matchesResult.data) {
        matchesResult.data.forEach(match => {
          const otherId = match.profile1_id === profile.id ? match.profile2_id : match.profile1_id;
          const otherProfile = profileMap.get(otherId);
          notifs.push({
            id: `match-${match.id}`,
            type: 'match',
            title: 'יש התאמה חדשה! 💕',
            message: otherProfile ? `את/ה ו${otherProfile.name} אהבתם אחד את השני` : 'יש לך התאמה חדשה',
            profileId: otherId,
            profileName: otherProfile?.name,
            profileImage: otherProfile?.avatar_url || undefined,
            createdAt: match.created_at,
            read: false
          });
        });
      }

      // Process likes
      if (likesResult.data) {
        likesResult.data.forEach(like => {
          const likerProfile = profileMap.get(like.liker_id);
          notifs.push({
            id: `like-${like.id}`,
            type: like.is_super ? 'super_like' : 'like',
            title: like.is_super ? 'קיבלת סופר לייק! ⭐' : 'קיבלת לייק! ❤️',
            message: likerProfile ? `${likerProfile.name} ${like.is_super ? 'שלח/ה לך סופר לייק' : 'אוהב/ת אותך'}` : 'מישהו אוהב אותך',
            profileId: like.liker_id,
            profileName: likerProfile?.name,
            profileImage: likerProfile?.avatar_url || undefined,
            createdAt: like.created_at,
            read: false
          });
        });
      }

      // Sort by date
      notifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      // Apply persisted read state
      const readIds = getReadIds();
      const notifsWithRead = notifs.map(n => ({ ...n, read: readIds.has(n.id) }));
      
      setNotifications(notifsWithRead);
      setUnreadCount(notifsWithRead.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [profile, getReadIds]);

  useEffect(() => {
    fetchNotifications();

    // Refetch notifications when tab becomes visible (user returns to app)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchNotifications();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fetchNotifications]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!profile) return;

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'matches',
          filter: `profile1_id=eq.${profile.id}`
        },
        () => fetchNotifications()
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'matches',
          filter: `profile2_id=eq.${profile.id}`
        },
        () => fetchNotifications()
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'likes',
          filter: `liked_id=eq.${profile.id}`
        },
        () => fetchNotifications()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile, fetchNotifications]);

  const markAsRead = useCallback((notificationId: string) => {
    saveReadId(notificationId);
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, [saveReadId]);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      prev.forEach(n => { if (!n.read) saveReadId(n.id); });
      return prev.map(n => ({ ...n, read: true }));
    });
    setUnreadCount(0);
  }, [saveReadId]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications
  };
}
