import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SkipToContent from "@/components/SkipToContent";
import SEOHead from "@/components/SEOHead";
import { MatchCardSkeleton } from "@/components/MatchCardSkeleton";
import EmptyState from "@/components/EmptyState";
import LazyImage from "@/components/LazyImage";
import { useAuth } from "@/hooks/useAuth";
import { useProfileViews } from "@/hooks/useProfileViews";
import { useLikes } from "@/hooks/useLikes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, UserPlus, Clock, Heart, Sparkles, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";
import { toast } from "sonner";
import { useState } from "react";
import { motion } from "framer-motion";

const WhoViewedMe = () => {
  const { user } = useAuth();
  const { views, loading } = useProfileViews();
  const { sendLike } = useLikes();
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [likingId, setLikingId] = useState<string | null>(null);

  const handleLike = async (profileId: string, name: string) => {
    setLikingId(profileId);
    const { error, isMatch, alreadyLiked } = await sendLike(profileId);
    setLikingId(null);
    if (error) {
      toast.error("שגיאה בשליחת הלייק");
      return;
    }
    setLikedIds(prev => new Set([...prev, profileId]));
    if (alreadyLiked) {
      toast.info(`כבר שלחת לייק ל${name}`);
    } else if (isMatch) {
      toast.success(`🎉 יש התאמה עם ${name}!`);
    } else {
      toast.success(`💕 שלחת לייק ל${name}!`);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <SkipToContent />
        <SEOHead title="מי צפה בי" />
        <Navbar />
        <main id="main-content" className="pt-24 flex flex-col items-center justify-center gap-4 px-4">
          <Eye className="w-16 h-16 text-muted-foreground" />
          <h1 className="text-2xl font-display font-bold">התחברו כדי לראות מי צפה בכם</h1>
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
        title="מי צפה בי" 
        description="ראו מי ביקר בפרופיל שלכם לאחרונה"
      />
      <Navbar />
      
      <main id="main-content" className="pt-24 pb-24 md:pb-12 px-4 max-w-6xl mx-auto">
        {/* Header - Enhanced */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-secondary/20 to-accent/20 text-secondary-foreground px-5 py-2.5 rounded-full mb-4 shadow-sm">
            <Eye className="w-5 h-5" aria-hidden="true" />
            <span className="font-bold text-lg">{views.length}</span>
            <span className="font-medium">צפיות בפרופיל</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            מי צפה בי? 👀
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            אלה האנשים שביקרו בפרופיל שלכם לאחרונה - אולי כדאי לעשות להם לייק?
          </p>
        </motion.div>

        {loading ? (
          <div role="status" aria-label="טוען צפיות" aria-live="polite" aria-busy="true">
            <span className="sr-only">טוען צפיות...</span>
            <MatchCardSkeleton count={4} />
          </div>
        ) : views.length === 0 ? (
          <EmptyState
            icon={<Eye className="w-12 h-12" />}
            title="עדיין אין צפיות"
            description="השלימו את הפרופיל שלכם כדי למשוך יותר מבטים!"
            actionLabel="שפרו את הפרופיל"
            actionLink="/profile"
            secondaryActionLabel="גלו פרופילים"
            secondaryActionLink="/discover"
            tips={[
              "הוסיפו תמונת פרופיל ברורה וחייכנית",
              "מלאו את כל השדות בפרופיל",
              "היו פעילים - עשו לייקים וגלו אחרים"
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
            {views.map((view, index) => {
              if (!view.viewer) return null;
              const viewer = view.viewer;
              
              return (
                <motion.article
                  key={view.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 relative group hover:-translate-y-1"
                  aria-label={`${viewer.name} צפה בפרופיל שלך`}
                >
                  {/* Time Badge */}
                  <Badge className="absolute top-3 right-3 z-10 bg-card/90 backdrop-blur-sm text-foreground border border-border">
                    <Clock className="w-3 h-3 ml-1" aria-hidden="true" />
                    {formatDistanceToNow(new Date(view.viewed_at), { addSuffix: true, locale: he })}
                  </Badge>

                  <Link to={`/member/${viewer.id}`} aria-label={`צפה בפרופיל של ${viewer.name}`}>
                    <div className="aspect-[4/5] relative overflow-hidden">
                      <LazyImage
                        src={viewer.avatar_url || "/profiles/profile1.jpg"}
                        alt={`תמונת פרופיל של ${viewer.name}`}
                        className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                        priority={index < 4}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 right-4 left-4 text-white">
                        <h3 className="font-display text-xl font-bold drop-shadow-lg">
                          {viewer.name}, {viewer.age}
                        </h3>
                        <p className="text-white/80 text-sm flex items-center gap-1">
                          📍 {viewer.city}
                        </p>
                      </div>
                    </div>
                  </Link>

                  <div className="p-4 space-y-3">
                    {/* Hint text */}
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      {viewer.name} התעניין/ה בפרופיל שלך
                    </p>

                    <div className="flex gap-2">
                      <Link to={`/member/${viewer.id}`} className="flex-1">
                        <Button variant="outline" className="w-full gap-2 h-10">
                          <Eye className="w-4 h-4" />
                          צפייה
                        </Button>
                      </Link>
                      <Button
                        variant="hero"
                        className="flex-1 gap-2 h-10"
                        disabled={likedIds.has(viewer.id) || likingId === viewer.id}
                        onClick={() => handleLike(viewer.id, viewer.name)}
                      >
                        {likingId === viewer.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : likedIds.has(viewer.id) ? (
                          <Heart className="w-4 h-4 fill-current" />
                        ) : (
                          <Heart className="w-4 h-4" />
                        )}
                        {likedIds.has(viewer.id) ? "נשלח!" : "לייק"}
                      </Button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default WhoViewedMe;