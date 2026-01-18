import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
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

  const getMyProfileId = useCallback(async (): Promise<string | null> => {
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error getting profile:', error);
      return null;
    }
    
    return data?.id || null;
  }, [user]);

  const fetchConversations = useCallback(async () => {
    if (!user) {
      setConversations([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const myProfileId = await getMyProfileId();
      
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

      // Get all participants for these conversations
      const { data: allParticipants, error: allParticipantsError } = await supabase
        .from('conversation_participants')
        .select('conversation_id, profile_id')
        .in('conversation_id', conversationIds);

      if (allParticipantsError) throw allParticipantsError;

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

      // Get conversations with updated_at
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select('*')
        .in('id', conversationIds)
        .order('updated_at', { ascending: false });

      if (conversationsError) throw conversationsError;

      // Get last messages for each conversation
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .in('conversation_id', conversationIds)
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      // Build conversation details
      const conversationsWithDetails: ConversationWithDetails[] = conversationsData?.map(conv => {
        const otherParticipant = allParticipants?.find(
          p => p.conversation_id === conv.id && p.profile_id !== myProfileId
        );
        const otherProfile = profiles?.find(p => p.id === otherParticipant?.profile_id);
        
        const conversationMessages = messages?.filter(m => m.conversation_id === conv.id) || [];
        const lastMessage = conversationMessages[0];
        const unreadCount = conversationMessages.filter(
          m => !m.is_read && m.sender_id !== myProfileId
        ).length;

        return {
          ...conv,
          otherProfile: otherProfile!,
          lastMessage,
          unreadCount,
        };
      }).filter(c => c.otherProfile) || [];

      setConversations(conversationsWithDetails);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [user, getMyProfileId]);

  const createOrGetConversation = async (otherProfileId: string): Promise<string | null> => {
    try {
      const myProfileId = await getMyProfileId();
      if (!myProfileId) return null;

      // Check if conversation already exists
      const { data: myParticipations } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('profile_id', myProfileId);

      if (myParticipations && myParticipations.length > 0) {
        const conversationIds = myParticipations.map(p => p.conversation_id);
        
        const { data: otherParticipations } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('profile_id', otherProfileId)
          .in('conversation_id', conversationIds);

        if (otherParticipations && otherParticipations.length > 0) {
          // Conversation exists
          return otherParticipations[0].conversation_id;
        }
      }

      // Create new conversation
      const { data: newConversation, error: convError } = await supabase
        .from('conversations')
        .insert({})
        .select()
        .single();

      if (convError) throw convError;

      // Add participants
      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert([
          { conversation_id: newConversation.id, profile_id: myProfileId },
          { conversation_id: newConversation.id, profile_id: otherProfileId },
        ]);

      if (participantsError) throw participantsError;

      return newConversation.id;
    } catch (err) {
      console.error('Error creating conversation:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return { conversations, loading, error, refetch: fetchConversations, createOrGetConversation, getMyProfileId };
}
