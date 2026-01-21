import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLikes } from './useLikes';

export type ReportReason = 
  | 'fake_profile'
  | 'inappropriate_content'
  | 'harassment'
  | 'spam'
  | 'underage'
  | 'other';

export const reportReasons: { value: ReportReason; label: string }[] = [
  { value: 'fake_profile', label: 'פרופיל מזויף' },
  { value: 'inappropriate_content', label: 'תוכן לא הולם' },
  { value: 'harassment', label: 'הטרדה' },
  { value: 'spam', label: 'ספאם' },
  { value: 'underage', label: 'קטין/ה' },
  { value: 'other', label: 'אחר' },
];

export function useReportProfile() {
  const [loading, setLoading] = useState(false);
  const { getMyProfileId } = useLikes();

  const reportProfile = async (
    reportedProfileId: string,
    reason: ReportReason,
    description?: string
  ): Promise<{ error: Error | null }> => {
    try {
      setLoading(true);
      const myProfileId = await getMyProfileId();
      
      if (!myProfileId) {
        throw new Error('Profile not found');
      }

      const { error } = await supabase
        .from('reports')
        .insert({
          reporter_id: myProfileId,
          reported_id: reportedProfileId,
          reason,
          description,
          status: 'pending',
        });

      if (error) throw error;
      return { error: null };
    } catch (err) {
      console.error('Error reporting profile:', err);
      return { error: err as Error };
    } finally {
      setLoading(false);
    }
  };

  return {
    reportProfile,
    loading,
    reportReasons,
  };
}
