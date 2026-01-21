import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Photo {
  id: string;
  profile_id: string;
  url: string;
  display_order: number;
  created_at: string;
}

export function usePhotos(profileId?: string) {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPhotos = useCallback(async () => {
    if (!profileId) {
      setPhotos([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('photos')
        .select('*')
        .eq('profile_id', profileId)
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;
      setPhotos(data || []);
    } catch (err) {
      console.error('Error fetching photos:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [profileId]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const uploadPhoto = async (file: File): Promise<{ url: string | null; error: Error | null }> => {
    if (!user) return { url: null, error: new Error('Not authenticated') };

    try {
      // Get user's profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) throw new Error('Profile not found');

      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const url = urlData.publicUrl;

      // Add to photos table
      const maxOrder = photos.length > 0 ? Math.max(...photos.map(p => p.display_order)) : -1;
      
      const { error: insertError } = await supabase
        .from('photos')
        .insert({
          profile_id: profile.id,
          url,
          display_order: maxOrder + 1,
        });

      if (insertError) throw insertError;

      await fetchPhotos();
      return { url, error: null };
    } catch (err) {
      console.error('Error uploading photo:', err);
      return { url: null, error: err as Error };
    }
  };

  const deletePhoto = async (photoId: string): Promise<{ error: Error | null }> => {
    try {
      const photo = photos.find(p => p.id === photoId);
      if (!photo) throw new Error('Photo not found');

      // Extract file path from URL
      const urlParts = photo.url.split('/avatars/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage.from('avatars').remove([filePath]);
      }

      const { error } = await supabase
        .from('photos')
        .delete()
        .eq('id', photoId);

      if (error) throw error;

      await fetchPhotos();
      return { error: null };
    } catch (err) {
      console.error('Error deleting photo:', err);
      return { error: err as Error };
    }
  };

  const reorderPhotos = async (orderedIds: string[]): Promise<{ error: Error | null }> => {
    try {
      const updates = orderedIds.map((id, index) => ({
        id,
        display_order: index,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('photos')
          .update({ display_order: update.display_order })
          .eq('id', update.id);

        if (error) throw error;
      }

      await fetchPhotos();
      return { error: null };
    } catch (err) {
      console.error('Error reordering photos:', err);
      return { error: err as Error };
    }
  };

  const setAsAvatar = async (photoUrl: string): Promise<{ error: Error | null }> => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: photoUrl })
        .eq('user_id', user.id);

      if (error) throw error;
      return { error: null };
    } catch (err) {
      console.error('Error setting avatar:', err);
      return { error: err as Error };
    }
  };

  return {
    photos,
    loading,
    error,
    uploadPhoto,
    deletePhoto,
    reorderPhotos,
    setAsAvatar,
    refetch: fetchPhotos,
  };
}
