import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface ProfileView {
  id: string;
  viewer_id: string;
  viewed_at: string;
  viewer?: {
    id: string;
    name: string;
    age: number;
    city: string;
    avatar_url: string | null;
  };
}

export function useProfileViews() {
  const [views, setViews] = useState<ProfileView[]>([]);
  const [viewCount, setViewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchViews = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get my profile ID
      const { data: myProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!myProfile) return;

      // Get views on my profile
      const { data: viewsData, error } = await supabase
        .from('profile_views')
        .select('id, viewer_id, viewed_at')
        .eq('profile_id', myProfile.id)
        .order('viewed_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Get viewer profiles
      if (viewsData && viewsData.length > 0) {
        const viewerIds = [...new Set(viewsData.map(v => v.viewer_id))];
        const { data: viewers } = await supabase
          .from('profiles')
          .select('id, name, age, city, avatar_url')
          .in('id', viewerIds);

        const enrichedViews = viewsData.map(view => ({
          ...view,
          viewer: viewers?.find(v => v.id === view.viewer_id),
        }));

        setViews(enrichedViews);
        setViewCount(viewsData.length);
      }
    } catch (error) {
      console.error('Error fetching profile views:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const recordView = useCallback(async (profileId: string) => {
    if (!user) return;

    try {
      // Get my profile ID
      const { data: myProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!myProfile || myProfile.id === profileId) return;

      // Upsert view — prevent duplicates per day using ON CONFLICT via view_date unique constraint
      await supabase
        .from('profile_views')
        .upsert(
          {
            profile_id: profileId,
            viewer_id: myProfile.id,
            view_date: new Date().toISOString().split('T')[0],
            viewed_at: new Date().toISOString(),
          },
          { onConflict: 'profile_id,viewer_id,view_date', ignoreDuplicates: true }
        );
    } catch {
      // Silently fail
    }
  }, [user]);

  useEffect(() => {
    fetchViews();
  }, [fetchViews]);

  return {
    views,
    viewCount,
    loading,
    recordView,
    refetch: fetchViews,
  };
}
