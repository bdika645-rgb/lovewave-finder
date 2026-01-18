import { useParams, Link } from "react-router-dom";
import { useProfileById } from "@/hooks/useProfiles";
import { useLikes } from "@/hooks/useLikes";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, MapPin, Clock, ArrowRight, Star, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";

const MemberProfile = () => {
  const { id } = useParams();
  const { profile: member, loading, error } = useProfileById(id || "");
  const { sendLike, loading: likeLoading } = useLikes();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">הפרופיל לא נמצא</h1>
          <Link to="/members">
            <Button variant="hero">חזרה לפרופילים</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleLike = async () => {
    if (!user) {
      toast.error("נא להתחבר כדי לשלוח לייקים");
      return;
    }

    const { error, isMatch, alreadyLiked } = await sendLike(member.id);
    
    if (error) {
      toast.error("שגיאה בשליחת הלייק");
      return;
    }

    if (alreadyLiked) {
      toast.info(`כבר שלחת לייק ל${member.name}`);
      return;
    }

    if (isMatch) {
      toast.success(`🎉 יש התאמה! את/ה ו${member.name} אהבתם אחד את השני!`);
    } else {
      toast.success(`שלחת לייק ל${member.name}! 💕`);
    }
  };

  const handleMessage = () => {
    if (!user) {
      toast.error("נא להתחבר כדי לשלוח הודעות");
      return;
    }
    toast.success("נפתח צ'אט חדש!");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${member.name} - Spark`,
          url: window.location.href,
        });
      } catch {
        // User cancelled sharing
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("הקישור הועתק!");
    }
  };

  const imageUrl = member.avatar_url || "/profiles/profile1.jpg";
  const lastSeen = member.last_seen ? new Date(member.last_seen).toLocaleString('he-IL') : undefined;

  return (
    <div className="min-h-screen bg-muted/20" dir="rtl">
      <Navbar />

      <div className="container mx-auto px-6 pt-28 pb-16">
        {/* Back Button */}
        <Link to="/members" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowRight className="w-4 h-4" />
          חזרה לפרופילים
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="relative">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-elevated">
              <img 
                src={imageUrl} 
                alt={member.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 gradient-overlay opacity-30" />
              
              {member.is_online && (
                <div className="absolute top-6 right-6 flex items-center gap-2 glass-effect px-4 py-2 rounded-full">
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-medium text-foreground">מחובר/ת עכשיו</span>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
              <Button
                variant="pass"
                size="icon-xl"
                className="shadow-elevated"
                onClick={handleShare}
              >
                <Share2 className="w-6 h-6" />
              </Button>
              <Button
                size="icon-xl"
                className="bg-secondary text-secondary-foreground shadow-elevated"
              >
                <Star className="w-6 h-6" />
              </Button>
              <Button
                variant="like"
                size="icon-xl"
                onClick={handleLike}
                className="shadow-elevated"
                disabled={likeLoading}
              >
                <Heart className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Info Section */}
          <div className="lg:pt-8">
            <div className="bg-card rounded-3xl p-8 shadow-card">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="font-display text-4xl font-bold text-foreground">
                    {member.name}, {member.age}
                  </h1>
                  <p className="flex items-center gap-2 text-muted-foreground mt-2">
                    <MapPin className="w-5 h-5" />
                    {member.city}
                  </p>
                </div>
                {!member.is_online && lastSeen && (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Clock className="w-4 h-4" />
                    פעיל/ה {lastSeen}
                  </div>
                )}
              </div>

              <div className="mb-8">
                <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                  קצת עליי
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {member.bio || "עדיין לא נכתב תיאור"}
                </p>
              </div>

              {member.interests && member.interests.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                    תחומי עניין
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {member.interests.map((interest) => (
                      <Badge 
                        key={interest} 
                        className="bg-accent text-accent-foreground px-4 py-2 text-sm"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="flex-1" 
                  onClick={handleLike}
                  disabled={likeLoading}
                >
                  {likeLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Heart className="w-5 h-5" />
                  )}
                  שלח לייק
                </Button>
                <Button variant="outline" size="lg" className="flex-1" onClick={handleMessage}>
                  <MessageCircle className="w-5 h-5" />
                  שלח הודעה
                </Button>
              </div>
            </div>

            {/* Additional Info Cards */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-card rounded-2xl p-6 shadow-card text-center">
                <p className="font-display text-2xl font-bold text-primary">98%</p>
                <p className="text-muted-foreground text-sm">התאמה</p>
              </div>
              <div className="bg-card rounded-2xl p-6 shadow-card text-center">
                <p className="font-display text-2xl font-bold text-primary">4.9★</p>
                <p className="text-muted-foreground text-sm">דירוג</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;
