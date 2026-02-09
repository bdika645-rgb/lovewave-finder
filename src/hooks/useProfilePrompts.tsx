import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useMyProfileId } from './useMyProfileId';

export const PROMPT_QUESTIONS = [
  'הדבר הכי ספונטני שעשיתי זה...',
  'הדייט האידאלי שלי הוא...',
  'אני מחפש/ת מישהו ש...',
  'הדבר שהכי חשוב לי בקשר זה...',
  'בזמן הפנוי אני אוהב/ת ל...',
  'משהו שאנשים לא יודעים עליי זה...',
  'השיר שמייצג אותי הכי טוב הוא...',
  'המקום האהוב עליי בעולם הוא...',
  'אני גאה בזה ש...',
  'הדבר שהכי מצחיק אותי הוא...',
];

export interface ProfilePrompt {
  id: string;
  profile_id: string;
  prompt_question: string;
  prompt_answer: string;
  display_order: number;
}

export function useProfilePrompts(profileId?: string) {
  const { profileId: myProfileId } = useMyProfileId();
  const targetId = profileId || myProfileId;
  const [prompts, setPrompts] = useState<ProfilePrompt[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrompts = useCallback(async () => {
    if (!targetId) return;
    setLoading(true);
    const { data } = await supabase
      .from('profile_prompts')
      .select('*')
      .eq('profile_id', targetId)
      .order('display_order', { ascending: true });
    setPrompts((data as ProfilePrompt[]) || []);
    setLoading(false);
  }, [targetId]);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  const addPrompt = useCallback(async (question: string, answer: string) => {
    if (!myProfileId) return;
    const { data, error } = await supabase
      .from('profile_prompts')
      .insert({
        profile_id: myProfileId,
        prompt_question: question,
        prompt_answer: answer,
        display_order: prompts.length,
      })
      .select()
      .single();
    if (!error && data) {
      setPrompts(prev => [...prev, data as ProfilePrompt]);
    }
    return { error };
  }, [myProfileId, prompts.length]);

  const updatePrompt = useCallback(async (id: string, answer: string) => {
    const { error } = await supabase
      .from('profile_prompts')
      .update({ prompt_answer: answer })
      .eq('id', id);
    if (!error) {
      setPrompts(prev => prev.map(p => p.id === id ? { ...p, prompt_answer: answer } : p));
    }
    return { error };
  }, []);

  const deletePrompt = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('profile_prompts')
      .delete()
      .eq('id', id);
    if (!error) {
      setPrompts(prev => prev.filter(p => p.id !== id));
    }
    return { error };
  }, []);

  return { prompts, loading, addPrompt, updatePrompt, deletePrompt, refetch: fetchPrompts };
}
