import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMyProfileId } from "@/hooks/useMyProfileId";
import { toast } from "sonner";

export function useFavorites() {
  const { profileId } = useMyProfileId();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Fetch all favorite IDs for current user
  useEffect(() => {
    if (!profileId) {
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select("favorited_id")
        .eq("profile_id", profileId);

      if (!error && data) {
        setFavoriteIds(new Set(data.map((f: any) => f.favorited_id)));
      }
      setLoading(false);
    };

    fetchFavorites();
  }, [profileId]);

  const toggleFavorite = useCallback(async (favoritedId: string) => {
    if (!profileId) {
      toast.error("נא להתחבר כדי לשמור מועדפים");
      return;
    }

    const isFavorited = favoriteIds.has(favoritedId);

    if (isFavorited) {
      // Remove
      setFavoriteIds(prev => {
        const next = new Set(prev);
        next.delete(favoritedId);
        return next;
      });

      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("profile_id", profileId)
        .eq("favorited_id", favoritedId);

      if (error) {
        // Revert
        setFavoriteIds(prev => new Set(prev).add(favoritedId));
        toast.error("שגיאה בהסרת מועדף");
      } else {
        toast.success("הוסר מהמועדפים");
      }
    } else {
      // Add
      setFavoriteIds(prev => new Set(prev).add(favoritedId));

      const { error } = await supabase
        .from("favorites")
        .insert({ profile_id: profileId, favorited_id: favoritedId });

      if (error) {
        // Revert
        setFavoriteIds(prev => {
          const next = new Set(prev);
          next.delete(favoritedId);
          return next;
        });
        toast.error("שגיאה בהוספת מועדף");
      } else {
        toast.success("נוסף למועדפים ⭐");
      }
    }
  }, [profileId, favoriteIds]);

  const isFavorited = useCallback((id: string) => favoriteIds.has(id), [favoriteIds]);

  return { favoriteIds, toggleFavorite, isFavorited, loading };
}
