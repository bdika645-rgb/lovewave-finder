import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Icebreaker {
  id: string;
  question: string;
  category: string;
}

export function useIcebreakers() {
  const [icebreakers, setIcebreakers] = useState<Icebreaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIcebreakers = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('icebreakers')
        .select('id, question, category')
        .eq('is_active', true);

      if (error) throw error;
      setIcebreakers(data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIcebreakers();
  }, [fetchIcebreakers]);

  const getRandomIcebreaker = useCallback(() => {
    if (icebreakers.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * icebreakers.length);
    return icebreakers[randomIndex];
  }, [icebreakers]);

  const getIcebreakersByCategory = useCallback((category: string) => {
    return icebreakers.filter(ib => ib.category === category);
  }, [icebreakers]);

  return {
    icebreakers,
    loading,
    error,
    getRandomIcebreaker,
    getIcebreakersByCategory,
    refetch: fetchIcebreakers,
  };
}
