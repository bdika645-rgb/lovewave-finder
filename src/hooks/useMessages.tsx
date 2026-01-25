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
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  const sendMessage = async (content: string): Promise<{ error: Error | null }> => {
    // Block action during impersonation
    if (!guardAction('send_message', 'לשלוח הודעות')) {
      return { error: new Error('Action blocked during impersonation') };
    }

    if (!conversationId || !content.trim()) {
      return { error: new Error('Invalid message or conversation') };
    }

    try {
      const myProfileId = await getMyProfileId();
      if (!myProfileId) {
        return { error: new Error('Profile not found') };
      }

      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: myProfileId,
          content: content.trim(),
        });

      if (error) throw error;

      // Update conversation updated_at
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const markAsRead = useCallback(async () => {
    if (!conversationId || !profileId) return;

    // Mark all messages from other users as read
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', profileId)
      .eq('is_read', false);

    if (!error) {
      // Update local state to reflect read status
      setMessages(prev => prev.map(msg => 
        msg.sender_id !== profileId ? { ...msg, is_read: true } : msg
      ));
    }
  }, [conversationId, profileId]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!conversationId) return;

    // Fetch initial messages
    fetchMessages();

    // Subscribe to new messages
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
          setMessages(prev => [...prev, payload.new as Message]);
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
