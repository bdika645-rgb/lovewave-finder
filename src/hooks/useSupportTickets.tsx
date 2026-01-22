import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface SupportTicket {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export function useSupportTickets() {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const getMyProfileId = async (): Promise<string | null> => {
    const { data, error } = await supabase.rpc('get_my_profile_id');
    if (error) throw error;
    return data ?? null;
  };

  const submitTicket = async (ticket: SupportTicket): Promise<{ success: boolean; error: Error | null }> => {
    try {
      setSending(true);
      setError(null);

       if (!user) {
         throw new Error('יש להתחבר כדי לשלוח פנייה לתמיכה');
       }

       const profileId = await getMyProfileId();
       if (!profileId) {
         throw new Error('לא נמצא פרופיל משתמש. נסו להתנתק ולהתחבר מחדש.');
       }

      const { error: insertError } = await supabase
        .from('support_tickets')
        .insert({
          name: ticket.name.trim(),
          email: ticket.email.trim().toLowerCase(),
          subject: ticket.subject?.trim() || null,
          message: ticket.message.trim(),
          status: 'open',
          profile_id: profileId,
          user_id: user.id,
        });

      if (insertError) throw insertError;

      return { success: true, error: null };
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      return { success: false, error: err as Error };
    } finally {
      setSending(false);
    }
  };

  return { submitTicket, sending, error };
}
