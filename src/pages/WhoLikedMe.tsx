import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SkipToContent from "@/components/SkipToContent";
import SEOHead from "@/components/SEOHead";
import { MatchCardSkeleton } from "@/components/MatchCardSkeleton";
import EmptyState from "@/components/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LazyImage from "@/components/LazyImage";
import { Heart, Star, Eye, Sparkles, MessageCircle } from "lucide-react";
import { useLikes } from "@/hooks/useLikes";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";

interface LikerProfile {
  id: string;
  name: string;
  age: number;
  city: string;
  avatar_url: string | null;
  bio: string | null;
  is_super: boolean;
  liked_at: string;
}

const WhoLikedMe = () => {
  const { user } = useAuth();
  const { sendLike } = useLikes();
  const [likers, setLikers] = useState<LikerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [likeBackLoading, setLikeBackLoading] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchLikers();
    }
  }, [user]);

  const fetchLikers = async () => {
    try {
      // Get current user's profile ID
      const { data: myProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user!.id)
        .single();

      if (!myProfile) return;

      // Get all likes where I am the liked person
      const { data: likes, error } = await supabase
        .from("likes")
        .select(
          `
          is_super,
          created_at,
          liker_id
        `
        )
        .eq("liked_id", myProfile.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get the profiles of likers
      if (likes && likes.length > 0) {
        const likerIds = likes.map((l) => l.liker_id);
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, name, age, city, avatar_url, bio")
          .in("id", likerIds);

        if (profiles) {
          const combined = likes.map((like) => {
            const profile = profiles.find((p) => p.id === like.liker_id);
            return {
              ...profile,
              is_super: like.is_super || false,
              liked_at: like.created_at,
            } as LikerProfile;
          });
          setLikers(combined.filter((l) => l.id));
        }
      }
    } catch (error) {
      console.error("Error fetching likers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeBack = async (profileId: string, profileName: string) => {
    setLikeBackLoading(profileId);
    try {
      const result = await sendLike(profileId);
      if (result.isMatch) {
        toast.success(`🎉 יש התאמה עם ${profileName}!`, {
          description: "עכשיו אפשר לשלוח הודעה",
          action: {
            label: "פתח צ'אט",
            onClick: () => window.location.href = "/messages"
          }
        });
      } else {
        toast.success(`💕 שלחת לייק ל${profileName}`);
      }
      fetchLikers();
    } finally {
      setLikeBackLoading(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <SkipToContent />
        <SEOHead title="מי עשה לי לייק" />
        <Navbar />
        <main id="main-content" className="pt-24 flex flex-col items-center justify-center gap-4 px-4">
          <Heart className="w-16 h-16 text-muted-foreground" />
          <h1 className="text-2xl font-display font-bold">
            התחברו כדי לראות מי עשה לכם לייק
          </h1>
          <Link to="/login">
            <Button variant="hero">התחברות</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <SkipToContent />
      <SEOHead 
        title="מי עשה לי לייק" 
        description="ראו מי התעניין בכם ועשו לייק בחזרה ליצירת התאמה"
      />
      <Navbar />
      
      <main id="main-content" className="pt-24 pb-24 md:pb-12 px-4 max-w-6xl mx-auto">
        {/* Header - Enhanced */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-secondary/20 text-primary px-5 py-2.5 rounded-full mb-4 shadow-sm">
            <Heart className="w-5 h-5 fill-current" aria-hidden="true" />
            <span className="font-bold text-lg">{likers.length}</span>
            <span className="font-medium">אנשים אהבו אותך</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            מי עשה לי לייק? 💕
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            האנשים האלה התעניינו בכם! עשו להם לייק בחזרה ליצירת התאמה
          </p>
        </motion.div>

        {loading ? (
          <div role="status" aria-label="טוען לייקים" aria-live="polite" aria-busy="true">
            <span className="sr-only">טוען לייקים...</span>
            <MatchCardSkeleton count={4} />
          </div>
        ) : likers.length === 0 ? (
          <EmptyState
            icon={<Heart className="w-12 h-12" />}
            title="עדיין אין לייקים"
            description="שפרו את הפרופיל שלכם וקבלו יותר לייקים!"
            actionLabel="שפרו את הפרופיל"
            actionLink="/profile"
            secondaryActionLabel="גלו פרופילים"
            secondaryActionLink="/discover"
            tips={[
              "הוסיפו תמונות איכותיות ומגוונות",
              "כתבו ביו מעניין ואותנטי",
              "עדכנו את תחומי העניין שלכם"
            ]}
            showInvite
          />
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {likers.map((liker, index) => (
              <motion.article
                key={liker.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 relative group hover:-translate-y-1"
                aria-label={`${liker.name} עשה לך לייק`}
              >
                {/* Super Like Badge */}
                {liker.is_super && (
                  <Badge className="absolute top-3 right-3 z-10 bg-gradient-to-r from-primary to-secondary text-primary-foreground gap-1 shadow-lg animate-pulse">
                    <Star className="w-3 h-3 fill-current" aria-hidden="true" />
                    Super Like
                  </Badge>
                )}

                {/* Time Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm text-xs">
                    {formatDistanceToNow(new Date(liker.liked_at), { 
                      addSuffix: true, 
                      locale: he 
                    })}
                  </Badge>
                </div>

                <Link to={`/member/${liker.id}`} aria-label={`צפה בפרופיל של ${liker.name}`}>
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <LazyImage
                      src={liker.avatar_url || "/profiles/profile1.jpg"}
                      alt={`תמונת פרופיל של ${liker.name}`}
                      className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                      priority={index < 4}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 right-4 left-4 text-white">
                      <h3 className="font-display text-xl font-bold drop-shadow-lg">
                        {liker.name}, {liker.age}
                      </h3>
                      <p className="text-white/80 text-sm flex items-center gap-1">
                        📍 {liker.city}
                      </p>
                    </div>
                  </div>
                </Link>

                <div className="p-4 space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                    {liker.bio || "לא הוסיף/ה תיאור עדיין"}
                  </p>
                  
                  {/* Hint text */}
                  <p className="text-xs text-primary flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    {liker.name} מחכה לתשובה שלך!
                  </p>

                  <Button
                    variant="hero"
                    className="w-full gap-2 h-11 font-semibold group/btn"
                    onClick={() => handleLikeBack(liker.id, liker.name)}
                    disabled={likeBackLoading === liker.id}
                  >
                    {likeBackLoading === liker.id ? (
                      <span className="animate-spin">⏳</span>
                    ) : (
                      <Heart className="w-4 h-4 group-hover/btn:fill-current transition-all group-hover/btn:scale-110" />
                    )}
                    לייק בחזרה
                  </Button>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default WhoLikedMe;