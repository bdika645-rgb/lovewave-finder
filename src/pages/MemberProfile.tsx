import { useParams, Link, useNavigate } from "react-router-dom";
import { useProfileById } from "@/hooks/useProfiles";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";
import { useLikes } from "@/hooks/useLikes";
import { useConversations } from "@/hooks/useConversations";
import { useAuth } from "@/hooks/useAuth";
import { useCompatibility } from "@/hooks/useCompatibility";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, MapPin, ArrowRight, Star, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const MemberProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile: member, loading, error } = useProfileById(id || "");
  const { profile: currentUserProfile } = useCurrentProfile();
  const { sendLike, loading: likeLoading } = useLikes();
  const { createOrGetConversation } = useConversations();
  const { user } = useAuth();
  const [messageLoading, setMessageLoading] = useState(false);
  
  // Calculate compatibility score
  const compatibility = useCompatibility(currentUserProfile as any, member as any);

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

  const handleMessage = async () => {
    if (!user) {
      toast.error("נא להתחבר כדי לשלוח הודעות");
      return;
    }
    
    setMessageLoading(true);
    const conversationId = await createOrGetConversation(member!.id);
    setMessageLoading(false);
    
    if (conversationId) {
      navigate("/messages");
      toast.success("נפתח צ'אט עם " + member!.name);
    } else {
      toast.error("שגיאה בפתיחת הצ'אט");
    }
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
              </div>

              <div className="mb-8">
                <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                  קצת עליי
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {/* bio intentionally not exposed in public profiles */}
                  עדיין אין תיאור ציבורי.
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
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="flex-1" 
                  onClick={handleMessage}
                  disabled={messageLoading}
                >
                  {messageLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <MessageCircle className="w-5 h-5" />
                  )}
                  {messageLoading ? "פותח..." : "שלח הודעה"}
                </Button>
              </div>
            </div>

            {/* Compatibility Card - Real Data */}
            {user && currentUserProfile && compatibility.score > 0 && (
              <div className="bg-card rounded-2xl p-6 shadow-card mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    התאמה
                  </h3>
                  <div className="text-3xl font-bold text-primary">
                    {compatibility.score}%
                  </div>
                </div>
                
                {/* Compatibility Breakdown */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">תחומי עניין</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${(compatibility.breakdown.interests / 40) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8">{compatibility.breakdown.interests}/40</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">מיקום</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${(compatibility.breakdown.location / 25) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8">{compatibility.breakdown.location}/25</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">מטרות</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${(compatibility.breakdown.relationshipGoal / 20) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8">{compatibility.breakdown.relationshipGoal}/20</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">גיל</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${(compatibility.breakdown.ageRange / 15) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8">{compatibility.breakdown.ageRange}/15</span>
                    </div>
                  </div>
                </div>

                {/* Match Reasons */}
                {compatibility.matchReasons.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {compatibility.matchReasons.map((reason, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        ✓ {reason}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;
