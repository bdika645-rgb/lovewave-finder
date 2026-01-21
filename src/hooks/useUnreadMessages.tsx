import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useMyProfileId } from './useMyProfileId';

export function useUnreadMessages() {
  const { user } = useAuth();
  const { profileId } = useMyProfileId();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUnreadCount = useCallback(async () => {
    if (!user || !profileId) {
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      // Get conversations this user is part of
      const { data: participants } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('profile_id', profileId);

      if (!participants || participants.length === 0) {
        setUnreadCount(0);
        setLoading(false);
        return;
      }

      const conversationIds = participants.map(p => p.conversation_id);

      // Count unread messages not sent by this user
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .in('conversation_id', conversationIds)
        .neq('sender_id', profileId)
        .eq('is_read', false);

      if (error) throw error;

      setUnreadCount(count || 0);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    } finally {
      setLoading(false);
    }
  }, [user, profileId]);

  useEffect(() => {
    fetchUnreadCount();

    // Subscribe to new messages
    if (!user) return;

    const channel = supabase
      .channel('unread-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        () => {
          fetchUnreadCount();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchUnreadCount, user]);

  return { unreadCount, loading, refetch: fetchUnreadCount };
}
