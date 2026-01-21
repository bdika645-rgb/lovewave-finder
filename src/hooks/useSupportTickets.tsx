import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SupportTicket {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export function useSupportTickets() {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitTicket = async (ticket: SupportTicket): Promise<{ success: boolean; error: Error | null }> => {
    try {
      setSending(true);
      setError(null);

      const { error: insertError } = await supabase
        .from('support_tickets')
        .insert({
          name: ticket.name.trim(),
          email: ticket.email.trim().toLowerCase(),
          subject: ticket.subject?.trim() || null,
          message: ticket.message.trim(),
          status: 'open',
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
