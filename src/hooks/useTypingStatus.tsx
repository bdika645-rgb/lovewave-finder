import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TypingUser {
  profile_id: string;
  is_typing: boolean;
  updated_at: string;
}

export function useTypingStatus(conversationId: string | null, myProfileId: string | null) {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Subscribe to typing status changes
  useEffect(() => {
    if (!conversationId) return;

    // Fetch initial typing status
    const fetchTypingStatus = async () => {
      const { data } = await supabase
        .from('typing_status')
        .select('profile_id, is_typing, updated_at')
        .eq('conversation_id', conversationId)
        .eq('is_typing', true);

      if (data) {
        // Filter out stale typing status (older than 5 seconds)
        const now = new Date();
        const activeTyping = data.filter(t => {
          const updatedAt = new Date(t.updated_at);
          return now.getTime() - updatedAt.getTime() < 5000;
        });
        setTypingUsers(activeTyping);
      }
    };

    fetchTypingStatus();

    // Subscribe to realtime changes
    channelRef.current = supabase
      .channel(`typing:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_status',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            const oldRow = payload.old as Partial<TypingUser> | null;
            const oldProfileId = oldRow?.profile_id;
            if (!oldProfileId) return;
            setTypingUsers(prev => prev.filter(t => t.profile_id !== oldProfileId));
          } else {
            const newStatus = payload.new as TypingUser;
            setTypingUsers(prev => {
              const filtered = prev.filter(t => t.profile_id !== newStatus.profile_id);
              if (newStatus.is_typing) {
                return [...filtered, newStatus];
              }
              return filtered;
            });
          }
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [conversationId]);

  // Set typing status
  const setTyping = useCallback(async (isTyping: boolean) => {
    if (!conversationId || !myProfileId) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Upsert typing status
    await supabase
      .from('typing_status')
      .upsert({
        conversation_id: conversationId,
        profile_id: myProfileId,
        is_typing: isTyping,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'conversation_id,profile_id'
      });

    // Auto-clear typing after 3 seconds
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        setTyping(false);
      }, 3000);
    }
  }, [conversationId, myProfileId]);

  // Get other users who are typing
  const othersTyping = typingUsers.filter(t => t.profile_id !== myProfileId);

  return { othersTyping, setTyping };
}
