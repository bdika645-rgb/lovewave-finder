import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SkipToContent from "@/components/SkipToContent";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Star, Trash2, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMyProfileId } from "@/hooks/useMyProfileId";
import { useFavorites } from "@/hooks/useFavorites";
import LazyImage from "@/components/LazyImage";
import EmptyState from "@/components/EmptyState";
import { MatchCardSkeleton } from "@/components/MatchCardSkeleton";
import { motion, AnimatePresence } from "framer-motion";

interface FavoriteProfile {
  id: string;
  name: string;
  age: number;
  city: string;
  avatar_url: string | null;
  is_online: boolean | null;
  bio: string | null;
}

const Favorites = () => {
  const { profileId } = useMyProfileId();
  const { toggleFavorite } = useFavorites();
  const [profiles, setProfiles] = useState<FavoriteProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileId) return;

    const fetchFavorites = async () => {
      const { data: favs } = await supabase
        .from("favorites")
        .select("favorited_id, created_at")
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false });

      if (!favs || favs.length === 0) {
        setProfiles([]);
        setLoading(false);
        return;
      }

      const ids = favs.map((f: any) => f.favorited_id);
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, name, age, city, avatar_url, is_online, bio")
        .in("id", ids);

      if (profilesData) {
        // Preserve order from favorites
        const profileMap = new Map(profilesData.map(p => [p.id, p]));
        const ordered = ids
          .map(id => profileMap.get(id))
          .filter(Boolean) as FavoriteProfile[];
        setProfiles(ordered);
      }
      setLoading(false);
    };

    fetchFavorites();
  }, [profileId]);

  const handleRemove = async (id: string) => {
    setProfiles(prev => prev.filter(p => p.id !== id));
    await toggleFavorite(id);
  };

  return (
    <div className="min-h-screen bg-muted/20" dir="rtl">
      <SkipToContent />
      <SEOHead title="מועדפים" description="הפרופילים שהוספת למועדפים" />
      <Navbar />

      <main id="main-content" className="container mx-auto px-6 pt-28 pb-24 md:pb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Star className="w-6 h-6 text-primary fill-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">מועדפים</h1>
            <p className="text-muted-foreground">
              {profiles.length > 0 ? `${profiles.length} פרופילים שמורים` : "הפרופילים ששמרת"}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <MatchCardSkeleton key={i} />)}
          </div>
        ) : profiles.length === 0 ? (
          <EmptyState
            icon={<Star className="w-16 h-16 text-primary/30" />}
            title="אין מועדפים עדיין"
            description="כשתמצא פרופיל שאתה רוצה לשמור, לחץ על כפתור הכוכב ⭐"
            actionLabel="חפש פרופילים"
            actionLink="/members"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {profiles.map((profile, i) => (
                <motion.div
                  key={profile.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                  transition={{ delay: i * 0.05 }}
                >
                  <article className="bg-card rounded-2xl overflow-hidden border border-border shadow-card hover:shadow-elevated transition-all group">
                    <Link to={`/member/${profile.id}`}>
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <LazyImage
                          src={profile.avatar_url || "/profiles/profile1.jpg"}
                          alt={profile.name}
                          className="w-full h-full transition-transform group-hover:scale-105"
                          aspectRatio="landscape"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        {profile.is_online && (
                          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-full">
                            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                            <span className="text-xs font-medium text-success">מחובר/ת</span>
                          </div>
                        )}
                        <div className="absolute bottom-3 right-3 left-3">
                          <h3 className="font-display text-lg font-bold text-white">
                            {profile.name}, {profile.age}
                          </h3>
                          <p className="flex items-center gap-1 text-white/80 text-sm">
                            <MapPin className="w-3.5 h-3.5" />
                            {profile.city}
                          </p>
                        </div>
                      </div>
                    </Link>
                    <div className="p-3 flex items-center justify-between">
                      {profile.bio && (
                        <p className="text-muted-foreground text-sm line-clamp-1 flex-1 ml-2">
                          {profile.bio}
                        </p>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(profile.id)}
                        className="text-muted-foreground hover:text-destructive shrink-0"
                        aria-label={`הסר ${profile.name} מהמועדפים`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </article>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
};

export default Favorites;
