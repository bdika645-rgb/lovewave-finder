import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AdminPhoto {
  id: string;
  url: string;
  profile_id: string;
  display_order: number | null;
  created_at: string;
  profile?: {
    id: string;
    name: string;
    avatar_url: string | null;
  } | null;
}

export function useAdminPhotos() {
  const [photos, setPhotos] = useState<AdminPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [stats, setStats] = useState({ total: 0, today: 0 });

  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error: fetchError } = await supabase
        .from("photos")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (fetchError) throw fetchError;

      // Fetch profile details
      const profileIds = [...new Set(data?.map(p => p.profile_id) || [])];
      
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, name, avatar_url")
        .in("id", profileIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      const enrichedData = data?.map(p => ({
        ...p,
        profile: profileMap.get(p.profile_id) || null
      })) || [];

      // Get stats
      const { count: totalCount } = await supabase
        .from("photos")
        .select("*", { count: "exact", head: true });

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count: todayCount } = await supabase
        .from("photos")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today.toISOString());

      setPhotos(enrichedData);
      setStats({
        total: totalCount || 0,
        today: todayCount || 0
      });
    } catch (err) {
      setError(err as Error);
      console.error("Error fetching photos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const deletePhoto = async (photoId: string) => {
    try {
      const { error } = await supabase
        .from("photos")
        .delete()
        .eq("id", photoId);

      if (error) throw error;

      toast.success("התמונה נמחקה בהצלחה");
      fetchPhotos();
    } catch (err) {
      console.error("Error deleting photo:", err);
      toast.error("שגיאה במחיקת התמונה");
    }
  };

  return {
    photos,
    loading,
    error,
    stats,
    deletePhoto,
    refetch: fetchPhotos
  };
}
