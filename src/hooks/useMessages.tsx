import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useMyProfileId } from './useMyProfileId';
import { useImpersonationGuard } from '@/contexts/ImpersonationContext';
import type { Tables } from '@/integrations/supabase/types';

type Message = Tables<'messages'>;

export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { guardAction } = useImpersonationGuard();
  const { getMyProfileId, profileId } = useMyProfileId();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) throw error;
      // Reverse to get chronological order (oldest first for display)
      setMessages((data || []).reverse());
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  const sendMessage = useCallback(async (content: string, replyTo?: string): Promise<{ error: Error | null }> => {
    if (!guardAction('send_message', 'לשלוח הודעות')) {
      return { error: new Error('Action blocked during impersonation') };
    }
    if (!conversationId || !content.trim()) {
      return { error: new Error('Invalid message or conversation') };
    }
    try {
      const myProfileId = profileId || await getMyProfileId();
      if (!myProfileId) return { error: new Error('Profile not found') };

      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: myProfileId,
          content: content.trim(),
          ...(replyTo ? { reply_to: replyTo } : {}),
        });

      if (error) throw error;

      // Update conversation timestamp in parallel (fire-and-forget)
      supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  }, [conversationId, profileId, getMyProfileId, guardAction]);

  const markAsRead = useCallback(async () => {
    if (!conversationId || !profileId) return;

    const now = new Date().toISOString();

    // Mark all messages from other users as read, also update read_at timestamp
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true, read_at: now })
      .eq('conversation_id', conversationId)
      .neq('sender_id', profileId)
      .eq('is_read', false);

    if (!error) {
      // Update local state to reflect read status
      setMessages(prev => prev.map(msg => 
        msg.sender_id !== profileId ? { ...msg, is_read: true, read_at: now } : msg
      ));
    }
  }, [conversationId, profileId]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!conversationId) return;

    // Fetch initial messages
    fetchMessages();

    // Subscribe to new messages and read status updates
    channelRef.current = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages(prev => {
            // Avoid duplicates
            if (prev.some(m => m.id === (payload.new as Message).id)) return prev;
            return [...prev, payload.new as Message];
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          // Update is_read and read_at in real time (e.g. the other side marked as read)
          setMessages(prev => prev.map(m =>
            m.id === (payload.new as Message).id ? { ...m, ...(payload.new as Message) } : m
          ));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages(prev => prev.filter(m => m.id !== (payload.old as any).id));
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [conversationId, fetchMessages]);

  return { messages, loading, error, sendMessage, markAsRead, refetch: fetchMessages, getMyProfileId };
}
