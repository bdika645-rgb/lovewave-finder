import { useParams, Link, useNavigate } from "react-router-dom";
import { getCityDistance, formatDistance } from "@/lib/cityDistance";
import { useProfileById } from "@/hooks/useProfiles";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";
import { useLikes } from "@/hooks/useLikes";
import { useConversations } from "@/hooks/useConversations";
import { useAuth } from "@/hooks/useAuth";
import { useCompatibility } from "@/hooks/useCompatibility";
import { useFavorites } from "@/hooks/useFavorites";
import { useProfileViews } from "@/hooks/useProfileViews";
import Navbar from "@/components/Navbar";
import SkipToContent from "@/components/SkipToContent";
import FullPageLoader from "@/components/FullPageLoader";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, MapPin, ArrowRight, Star, Share2, Loader2, Sparkles, Check, GraduationCap, Ruler, Cigarette, Target, ShieldCheck, ChevronLeft, ChevronRight, Bookmark, Clock } from "lucide-react";
import ImageLightbox from "@/components/ImageLightbox";
import ProfilePromptsDisplay from "@/components/ProfilePromptsDisplay";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const MemberProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile: member, loading, error } = useProfileById(id || "");
  const { profile: currentUserProfile } = useCurrentProfile();
  const { sendLike, loading: likeLoading } = useLikes();
  const { createOrGetConversation } = useConversations();
  const { user } = useAuth();
  const [messageLoading, setMessageLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { isFavorited, toggleFavorite } = useFavorites();
  const { recordView } = useProfileViews();
  const [showDoubleTapHeart, setShowDoubleTapHeart] = useState(false);
  const lastTapRef = useState({ time: 0 })[0];

  // Record profile view
  useEffect(() => {
    if (id && user) {
      recordView(id);
    }
  }, [id, user, recordView]);
  
  // Fetch member photos
  useEffect(() => {
    if (!id) return;
    const fetchPhotos = async () => {
      const { data } = await supabase
        .from('photos')
        .select('url')
        .eq('profile_id', id)
        .order('display_order', { ascending: true });
      if (data && data.length > 0) {
        setPhotos(data.map(p => p.url));
      }
    };
    fetchPhotos();
  }, [id]);

  // Calculate compatibility score
  const compatibility = useCompatibility(currentUserProfile as any, member as any);

  if (loading) {
    return (
      <FullPageLoader 
        label="טוען פרופיל..." 
        branded 
        className="min-h-screen bg-muted/20 flex items-center justify-center" 
      />
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

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.time < 350) {
      // Double tap detected
      setShowDoubleTapHeart(true);
      navigator.vibrate?.(30);
      handleLike();
      setTimeout(() => setShowDoubleTapHeart(false), 1000);
    } else {
      // Single tap - open lightbox after delay only if no double tap
      lastTapRef.time = now;
      setTimeout(() => {
        if (Date.now() - lastTapRef.time >= 340) {
          setLightboxOpen(true);
        }
      }, 350);
    }
    lastTapRef.time = now;
  };

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

  const allImages = photos.length > 0 ? photos : [member.avatar_url || "/profiles/profile1.jpg"];
  const currentImage = allImages[activePhotoIndex] || allImages[0];

  return (
    <div className="min-h-screen bg-muted/20" dir="rtl">
      <SkipToContent />
      <SEOHead 
        title={`${member.name}, ${member.age} - פרופיל`}
        description={`צפו בפרופיל של ${member.name} מ${member.city}`}
      />
      <Navbar />

      <main id="main-content" className="container mx-auto px-6 pt-28 pb-24 md:pb-16">
        {/* Back Button */}
        <Link 
          to="/members" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors group"
          aria-label="חזרה לפרופילים"
        >
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          חזרה לפרופילים
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Section with Gallery */}
          <div className="relative">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-elevated relative">
              <img 
                src={currentImage} 
                alt={`${member.name} - תמונה ${activePhotoIndex + 1}`} 
                className="w-full h-full object-cover transition-opacity duration-300 cursor-pointer select-none"
                onClick={handleDoubleTap}
                draggable={false}
              />
              <div className="absolute inset-0 gradient-overlay opacity-30 pointer-events-none" />

              {/* Double-tap heart animation */}
              <AnimatePresence>
                {showDoubleTapHeart && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -15 }}
                      animate={{ scale: [0, 1.4, 1.1], rotate: [-15, 10, 0] }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
                    >
                      <Heart className="w-24 h-24 text-primary fill-primary drop-shadow-lg" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Photo Navigation Dots */}
              {allImages.length > 1 && (
                <div className="absolute top-4 left-4 right-4 flex gap-1">
                  {allImages.map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setActivePhotoIndex(i)}
                      className={`flex-1 h-1.5 rounded-full transition-all ${
                        i === activePhotoIndex ? "bg-white" : "bg-white/40"
                      }`}
                      aria-label={`תמונה ${i + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Photo Navigation Arrows */}
              {allImages.length > 1 && (
                <>
                  {activePhotoIndex > 0 && (
                    <button
                      onClick={() => setActivePhotoIndex(i => i - 1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-card/70 backdrop-blur-sm rounded-full hover:bg-card/90 transition-colors"
                      aria-label="תמונה קודמת"
                    >
                      <ChevronRight className="w-5 h-5 text-foreground" />
                    </button>
                  )}
                  {activePhotoIndex < allImages.length - 1 && (
                    <button
                      onClick={() => setActivePhotoIndex(i => i + 1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-card/70 backdrop-blur-sm rounded-full hover:bg-card/90 transition-colors"
                      aria-label="תמונה הבאה"
                    >
                      <ChevronLeft className="w-5 h-5 text-foreground" />
                    </button>
                  )}
                </>
              )}

              {/* Photo Counter */}
              {allImages.length > 1 && (
                <div className="absolute bottom-4 left-4 bg-card/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-foreground">
                  {activePhotoIndex + 1} / {allImages.length}
                </div>
              )}
              
              {member.is_online ? (
                <div className="absolute top-6 right-6 flex items-center gap-2 glass-effect px-4 py-2 rounded-full">
                  <span className="w-3 h-3 bg-success rounded-full animate-pulse" />
                  <span className="font-medium text-foreground">מחובר/ת עכשיו</span>
                </div>
              ) : member.last_seen ? (
                <div className="absolute top-6 right-6 flex items-center gap-2 glass-effect px-4 py-2 rounded-full">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground text-sm">
                    {(() => {
                      const diff = Date.now() - new Date(member.last_seen).getTime();
                      const mins = Math.floor(diff / 60000);
                      if (mins < 60) return `פעיל/ה לפני ${mins} דקות`;
                      const hours = Math.floor(mins / 60);
                      if (hours < 24) return `פעיל/ה לפני ${hours} שעות`;
                      const days = Math.floor(hours / 24);
                      return `פעיל/ה לפני ${days} ימים`;
                    })()}
                  </span>
                </div>
              ) : null}
            </div>

            {/* Photo Lightbox */}
            <ImageLightbox
              images={allImages}
              initialIndex={activePhotoIndex}
              open={lightboxOpen}
              onClose={() => setLightboxOpen(false)}
              alt={member.name}
            />

            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
              <Button
                variant="pass"
                size="icon-xl"
                className="shadow-elevated"
                onClick={() => navigate(-1)}
                aria-label="חזרה"
              >
                <ArrowRight className="w-6 h-6" />
              </Button>
              <Button
                size="icon-xl"
                className={`shadow-elevated transition-colors ${
                  member && isFavorited(member.id) 
                    ? "bg-yellow-500 text-white hover:bg-yellow-600" 
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                }`}
                onClick={() => member && toggleFavorite(member.id)}
                aria-label={member && isFavorited(member.id) ? "הסר מהמועדפים" : "הוסף למועדפים"}
              >
                <Bookmark className={`w-6 h-6 ${member && isFavorited(member.id) ? "fill-current" : ""}`} />
              </Button>
              <Button
                size="icon-xl"
                className="bg-secondary text-secondary-foreground shadow-elevated hover:bg-secondary/90"
                onClick={handleShare}
                aria-label="שתף פרופיל"
              >
                <Share2 className="w-6 h-6" />
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
                    {(() => {
                      const dist = formatDistance(getCityDistance(currentUserProfile?.city, member.city));
                      return dist && dist !== "באותה עיר" ? (
                        <span className="text-sm opacity-80">· {dist}</span>
                      ) : dist === "באותה עיר" ? (
                        <span className="text-sm opacity-80">· באותה עיר 📍</span>
                      ) : null;
                    })()}
                  </p>
                </div>
              </div>

              {/* Verified Badge */}
              {member.is_verified && (
                <div className="flex items-center gap-2 mb-4 bg-success/10 text-success px-4 py-2 rounded-xl w-fit">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="font-medium text-sm">פרופיל מאומת</span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                  קצת עליי
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {member.bio || "עדיין אין תיאור ציבורי."}
                </p>
              </div>

              {/* Details Grid */}
              {(member.education || member.height || member.smoking || member.relationship_goal) && (
                <div className="mb-8">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                    פרטים נוספים
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {member.education && (
                      <div className="flex items-center gap-2 bg-muted/50 rounded-xl p-3">
                        <GraduationCap className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">השכלה</p>
                          <p className="text-sm font-medium text-foreground">{member.education}</p>
                        </div>
                      </div>
                    )}
                    {member.height && (
                      <div className="flex items-center gap-2 bg-muted/50 rounded-xl p-3">
                        <Ruler className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">גובה</p>
                          <p className="text-sm font-medium text-foreground">{member.height} ס"מ</p>
                        </div>
                      </div>
                    )}
                    {member.smoking && (
                      <div className="flex items-center gap-2 bg-muted/50 rounded-xl p-3">
                        <Cigarette className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">עישון</p>
                          <p className="text-sm font-medium text-foreground">
                            {member.smoking === 'no' ? 'לא מעשן/ת' :
                             member.smoking === 'sometimes' ? 'לפעמים' :
                             member.smoking === 'yes' ? 'מעשן/ת' : member.smoking}
                          </p>
                        </div>
                      </div>
                    )}
                    {member.relationship_goal && (
                      <div className="flex items-center gap-2 bg-muted/50 rounded-xl p-3">
                        <Target className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">מחפש/ת</p>
                          <p className="text-sm font-medium text-foreground">
                            {member.relationship_goal === 'serious' ? 'קשר רציני' :
                             member.relationship_goal === 'casual' ? 'הכרויות' :
                             member.relationship_goal === 'friendship' ? 'חברות' : member.relationship_goal}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Profile Prompts */}
              <ProfilePromptsDisplay profileId={member.id} />

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
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-card via-card to-primary/5 rounded-2xl p-6 shadow-card mt-6 border border-primary/10"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      התאמה
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {compatibility.score}%
                    </div>
                  </div>
                </div>
                
                {/* Compatibility Breakdown */}
                <div className="space-y-3 mb-5">
                  {[
                    { label: "תחומי עניין", value: compatibility.breakdown.interests, max: 40, icon: "🎯" },
                    { label: "מיקום", value: compatibility.breakdown.location, max: 25, icon: "📍" },
                    { label: "מטרות", value: compatibility.breakdown.relationshipGoal, max: 20, icon: "💕" },
                    { label: "גיל", value: compatibility.breakdown.ageRange, max: 15, icon: "🎂" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <span>{item.icon}</span>
                        {item.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-28 h-2.5 bg-muted rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.value / item.max) * 100}%` }}
                            transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" 
                          />
                        </div>
                        <span className="text-xs font-medium text-foreground w-10 text-left">
                          {item.value}/{item.max}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Match Reasons */}
                {compatibility.matchReasons.length > 0 && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-success" />
                      מה משותף לכם:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {compatibility.matchReasons.map((reason, i) => (
                        <Badge key={i} className="bg-success/10 text-success border-success/20 text-xs">
                          {reason}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default MemberProfile;
