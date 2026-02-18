import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useMyProfileId } from './useMyProfileId';
import { useImpersonationGuard } from '@/contexts/ImpersonationContext';
import type { Tables } from '@/integrations/supabase/types';

type Conversation = Tables<'conversations'>;
type Message = Tables<'messages'>;
type Profile = Tables<'profiles'>;

export interface ConversationWithDetails extends Conversation {
  otherProfile: Profile;
  lastMessage?: Message;
  unreadCount: number;
}

export function useConversations() {
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { getMyProfileId, profileId: cachedProfileId } = useMyProfileId();
  const { guardAction } = useImpersonationGuard();
  const refetchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchConversations = useCallback(async () => {
    if (!user) {
      setConversations([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const myProfileId = cachedProfileId || await getMyProfileId();
      
      if (!myProfileId) {
        setConversations([]);
        setLoading(false);
        return;
      }

      // Get conversations where current user is a participant
      const { data: participations, error: participationsError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('profile_id', myProfileId);

      if (participationsError) throw participationsError;

      if (!participations || participations.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      const conversationIds = participations.map(p => p.conversation_id);

      // Fetch all data in parallel for better performance
      const [allParticipantsRes, conversationsRes, messagesRes] = await Promise.all([
        // Get all participants for these conversations
        supabase
          .from('conversation_participants')
          .select('conversation_id, profile_id')
          .in('conversation_id', conversationIds),
        // Get conversations with updated_at
        supabase
          .from('conversations')
          .select('*')
          .in('id', conversationIds)
          .order('updated_at', { ascending: false }),
        // Get last messages for each conversation
        // We need max(50, convCount * 5) to ensure at least 5 messages per conversation
        // but cap at 1000 to avoid supabase limit
        supabase
          .from('messages')
          .select('*')
          .in('conversation_id', conversationIds)
          .order('created_at', { ascending: false })
          .limit(Math.min(Math.max(conversationIds.length * 10, 50), 500)),
      ]);

      if (allParticipantsRes.error) throw allParticipantsRes.error;
      if (conversationsRes.error) throw conversationsRes.error;
      if (messagesRes.error) throw messagesRes.error;

      const allParticipants = allParticipantsRes.data;
      const conversationsData = conversationsRes.data;
      const messages = messagesRes.data;

      // Get the other profile IDs (not the current user)
      const otherProfileIds = allParticipants
        ?.filter(p => p.profile_id !== myProfileId)
        .map(p => p.profile_id) || [];

      // Fetch other profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', otherProfileIds);

      if (profilesError) throw profilesError;

      // Build conversation details
      const conversationsWithDetails = (conversationsData ?? [])
        .map((conv) => {
          const otherParticipant = allParticipants?.find(
            (p) => p.conversation_id === conv.id && p.profile_id !== myProfileId
          );
          const otherProfile = profiles?.find((p) => p.id === otherParticipant?.profile_id);
          if (!otherProfile) return null;

          const conversationMessages = messages?.filter((m) => m.conversation_id === conv.id) || [];
          // Sort by created_at descending to get latest first
          conversationMessages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          const lastMessage = conversationMessages[0];
          // Count unread from loaded batch - accurate because we load last 50 per conv
          const unreadCount = conversationMessages.filter(
            (m) => !m.is_read && m.sender_id !== myProfileId
          ).length;

          return {
            ...conv,
            otherProfile,
            lastMessage,
            unreadCount,
          };
        })
        .filter(Boolean) as ConversationWithDetails[];

      setConversations(conversationsWithDetails);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [user, getMyProfileId, cachedProfileId]);

  const createOrGetConversation = async (otherProfileId: string): Promise<string | null> => {
    // Block action during impersonation
    if (!guardAction('create_conversation', 'ליצור שיחה')) {
      return null;
    }
    try {
      // Server-side creation prevents unauthorized participant injection.
      const { data, error } = await supabase.functions.invoke('create-conversation', {
        body: { otherProfileId },
      });

      if (error) throw error;
      if (!data?.conversationId) return null;

      return data.conversationId as string;
    } catch (err) {
      console.error('Error creating conversation:', err);
      return null;
    }
  };

  const debouncedRefetch = useCallback(() => {
    if (refetchDebounceRef.current) clearTimeout(refetchDebounceRef.current);
    refetchDebounceRef.current = setTimeout(() => {
      fetchConversations();
    }, 400);
  }, [fetchConversations]);

  useEffect(() => {
    fetchConversations();

    if (!user) return;

    // On INSERT (new message): optimistically update lastMessage + unreadCount without full refetch
    // On UPDATE (read status change): debounce refetch to avoid storms
    const channel = supabase
      .channel('conversations-list-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMsg = payload.new as Tables<'messages'>;
          // Optimistically update the conversation's last message & unread count
          setConversations(prev =>
            prev.map(conv => {
              if (conv.id !== newMsg.conversation_id) return conv;
              const isFromOther = newMsg.sender_id !== cachedProfileId;
              return {
                ...conv,
                lastMessage: newMsg,
                unreadCount: isFromOther ? conv.unreadCount + 1 : conv.unreadCount,
              };
            }).sort((a, b) => {
              const aTime = a.lastMessage?.created_at ?? a.updated_at;
              const bTime = b.lastMessage?.created_at ?? b.updated_at;
              return new Date(bTime).getTime() - new Date(aTime).getTime();
            })
          );
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'messages' },
        (payload) => {
          const updatedMsg = payload.new as Tables<'messages'>;
          // Update is_read locally, then debounce a full refresh for accuracy
          setConversations(prev =>
            prev.map(conv => {
              if (conv.id !== updatedMsg.conversation_id) return conv;
              const newUnread = Math.max(
                0,
                conv.unreadCount - (updatedMsg.is_read && updatedMsg.sender_id !== cachedProfileId ? 1 : 0)
              );
              return { ...conv, unreadCount: newUnread };
            })
          );
          debouncedRefetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      if (refetchDebounceRef.current) clearTimeout(refetchDebounceRef.current);
    };
  }, [fetchConversations, user, cachedProfileId, debouncedRefetch]);

  return { conversations, loading, error, refetch: fetchConversations, createOrGetConversation, getMyProfileId };
}
