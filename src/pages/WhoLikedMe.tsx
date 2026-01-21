import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Loader2, Star, Eye, Sparkles } from "lucide-react";
import { useLikes } from "@/hooks/useLikes";
import { toast } from "sonner";

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
    const result = await sendLike(profileId);
    if (result.isMatch) {
      toast.success(`יש התאמה עם ${profileName}! 🎉`);
    } else {
      toast.success(`שלחת לייק ל${profileName}`);
    }
    fetchLikers();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Navbar />
        <div className="pt-24 flex flex-col items-center justify-center gap-4 px-4">
          <Heart className="w-16 h-16 text-muted-foreground" />
          <h1 className="text-2xl font-display font-bold">
            התחברו כדי לראות מי עשה לכם לייק
          </h1>
          <Link to="/login">
            <Button variant="hero">התחברות</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="pt-24 pb-12 px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 px-4 py-2 rounded-full mb-4">
            <Eye className="w-5 h-5" />
            <span className="font-medium">{likers.length} אנשים</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            מי עשה לי לייק?
          </h1>
          <p className="text-muted-foreground">
            האנשים האלה התעניינו בכם! עשו להם לייק בחזרה ליצירת התאמה
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : likers.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-20 h-20 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-display font-semibold text-foreground mb-2">
              עדיין אין לייקים
            </h2>
            <p className="text-muted-foreground mb-6">
              שפרו את הפרופיל שלכם וקבלו יותר לייקים!
            </p>
            <Link to="/profile">
              <Button variant="outline" size="lg">
                עריכת פרופיל
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {likers.map((liker) => (
              <div
                key={liker.id}
                className="bg-card rounded-3xl overflow-hidden shadow-card card-hover relative group"
              >
                {liker.is_super && (
                  <Badge className="absolute top-3 right-3 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Super Like
                  </Badge>
                )}

                <Link to={`/member/${liker.id}`}>
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <img
                      src={liker.avatar_url || "/profiles/profile1.jpg"}
                      alt={liker.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-4 right-4 left-4 text-white">
                      <h3 className="font-display text-xl font-bold">
                        {liker.name}, {liker.age}
                      </h3>
                      <p className="text-white/80 text-sm">{liker.city}</p>
                    </div>
                  </div>
                </Link>

                <div className="p-4">
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {liker.bio || "אין תיאור"}
                  </p>
                  <Button
                    variant="hero"
                    className="w-full gap-2"
                    onClick={() => handleLikeBack(liker.id, liker.name)}
                  >
                    <Heart className="w-4 h-4" />
                    לייק בחזרה
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WhoLikedMe;
