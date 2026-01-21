import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface UseRealtimeMessagesOptions {
  conversationId?: string;
  onNewMessage?: (message: any) => void;
  onMessageRead?: (messageId: string) => void;
}

export function useRealtimeMessages({
  conversationId,
  onNewMessage,
  onMessageRead,
}: UseRealtimeMessagesOptions = {}) {
  const { user } = useAuth();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!user) return;

    // Create a unique channel name
    const channelName = conversationId 
      ? `messages:${conversationId}` 
      : `messages:user:${user.id}`;

    // Subscribe to message changes
    channelRef.current = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          ...(conversationId ? { filter: `conversation_id=eq.${conversationId}` } : {}),
        },
        (payload) => {
          console.log('New message received:', payload);
          onNewMessage?.(payload.new);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          ...(conversationId ? { filter: `conversation_id=eq.${conversationId}` } : {}),
        },
        (payload) => {
          if (payload.new.is_read && !payload.old.is_read) {
            onMessageRead?.(payload.new.id);
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [user, conversationId, onNewMessage, onMessageRead]);

  return { channel: channelRef.current };
}
