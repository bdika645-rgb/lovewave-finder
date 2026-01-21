import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SupportTicket {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
  admin_note: string | null;
}

export function useAdminSupportTickets() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (err) {
      console.error('Error fetching support tickets:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTicketStatus = async (
    ticketId: string, 
    status: string, 
    adminNote?: string
  ): Promise<{ error: Error | null }> => {
    try {
      const updates: Record<string, unknown> = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (adminNote) {
        updates.admin_note = adminNote;
      }

      if (status === 'resolved') {
        updates.resolved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('support_tickets')
        .update(updates)
        .eq('id', ticketId);

      if (error) throw error;

      // Refetch tickets
      await fetchTickets();
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const deleteTicket = async (ticketId: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .delete()
        .eq('id', ticketId);

      if (error) throw error;

      await fetchTickets();
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return { 
    tickets, 
    loading, 
    error, 
    refetch: fetchTickets, 
    updateTicketStatus, 
    deleteTicket 
  };
}
