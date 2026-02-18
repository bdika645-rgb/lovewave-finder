import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import SwipeCard from "@/components/SwipeCard";
import ReportDialog from "@/components/ReportDialog";
import DiscoverFilters, { DiscoverFiltersState } from "@/components/DiscoverFilters";
import OnboardingTooltip from "@/components/OnboardingTooltip";
import SEOHead from "@/components/SEOHead";
import EmptyState from "@/components/EmptyState";
import SkipToContent from "@/components/SkipToContent";
import FullPageLoader from "@/components/FullPageLoader";
import { useProfiles } from "@/hooks/useProfiles";
import { useLikes } from "@/hooks/useLikes";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";
import { useActionHistory } from "@/hooks/useActionHistory";
import { useConfetti } from "@/hooks/useConfetti";
import { Button } from "@/components/ui/button";
import { Heart, Loader2, RefreshCcw, Sparkles, ArrowRight, ArrowLeft, ArrowUp, Star, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Animation variants for card entrance
const cardEntranceVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 25 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8, 
    y: -50,
    transition: { duration: 0.2 }
  }
};

const Discover = () => {
  const { user } = useAuth();
  const { profile: myProfile } = useCurrentProfile();
  
  // Filters state
  const [filters, setFilters] = useState<DiscoverFiltersState>({
    ageFrom: null,
    ageTo: null,
    city: "",
    interests: [],
    relationshipGoal: "",
    onlineOnly: false
  });

  const { profiles, loading, refetch } = useProfiles({ 
    filterByOppositeGender: true,
    excludeCurrentUser: true,
    ageFrom: filters.ageFrom || undefined,
    ageTo: filters.ageTo || undefined,
    city: filters.city || undefined,
  });
  const { sendLike, removeLike } = useLikes();
  const { recordAction, undoLastAction } = useActionHistory();
  const { fireConfetti } = useConfetti();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedProfiles, setLikedProfiles] = useState<Set<string>>(new Set());
  const [passedProfiles, setPassedProfiles] = useState<Set<string>>(new Set());
  const [showMatchAnimation, setShowMatchAnimation] = useState(false);
  const [matchedName, setMatchedName] = useState("");
  const [matchedImage, setMatchedImage] = useState("");
  const [canUndo, setCanUndo] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [showSuperLikeAnim, setShowSuperLikeAnim] = useState(false);
  const [currentProfilePhotos, setCurrentProfilePhotos] = useState<string[]>([]);
  const [currentProfileBio, setCurrentProfileBio] = useState("");
  const [currentProfileVerified, setCurrentProfileVerified] = useState(false);
  // Preload cache: profileId -> { photos, bio, verified }
  const preloadCache = useState<Map<string, { photos: string[]; bio: string; verified: boolean }>>(
    () => new Map()
  )[0];

  // Allow closing match overlay with ESC
  useEffect(() => {
    if (!showMatchAnimation) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowMatchAnimation(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showMatchAnimation]);

  // Filter out already liked/passed profiles and apply online filter
  const availableProfiles = profiles.filter(
    (p) => !likedProfiles.has(p.id) && !passedProfiles.has(p.id) && (!filters.onlineOnly || p.is_online)
  );

  const currentProfile = availableProfiles[currentIndex];

  // Helper: fetch and cache profile details
  const fetchAndCacheProfile = useCallback(async (profileId: string, avatarUrl: string | null) => {
    if (preloadCache.has(profileId)) return;

    const [photosRes, profileRes] = await Promise.all([
      supabase
        .from('photos')
        .select('url')
        .eq('profile_id', profileId)
        .order('display_order', { ascending: true }),
      supabase
        .from('profiles')
        .select('bio, looking_for, relationship_goal, is_verified')
        .eq('id', profileId)
        .single(),
    ]);

    const photos = photosRes.data && photosRes.data.length > 0
      ? photosRes.data.map(p => p.url)
      : avatarUrl ? [avatarUrl] : ["/profiles/profile1.jpg"];

    preloadCache.set(profileId, {
      photos,
      bio: profileRes.data?.bio || "",
      verified: profileRes.data?.is_verified || false,
    });
  }, [preloadCache]);

  // Fetch current profile details + preload next profile
  useEffect(() => {
    if (!currentProfile) {
      setCurrentProfilePhotos([]);
      setCurrentProfileBio("");
      setCurrentProfileVerified(false);
      return;
    }

    const load = async () => {
      await fetchAndCacheProfile(currentProfile.id, currentProfile.avatar_url);
      const cached = preloadCache.get(currentProfile.id)!;
      setCurrentProfilePhotos(cached.photos);
      setCurrentProfileBio(cached.bio);
      setCurrentProfileVerified(cached.verified);

      // Preload the next profile silently
      const nextProfile = availableProfiles[currentIndex + 1];
      if (nextProfile) {
        fetchAndCacheProfile(nextProfile.id, nextProfile.avatar_url);
      }
    };

    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile?.id]);

  const goToNext = useCallback(() => {
    if (currentIndex < availableProfiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  }, [currentIndex, availableProfiles.length]);

  const handleLike = useCallback(async () => {
    if (!user) {
      toast.error("נא להתחבר כדי לשלוח לייקים");
      return;
    }

    if (!currentProfile) return;

    setLikedProfiles(prev => new Set([...prev, currentProfile.id]));
    
    const { error, isMatch, alreadyLiked } = await sendLike(currentProfile.id);
    
    if (error) {
      toast.error("שגיאה בשליחת הלייק");
      setLikedProfiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(currentProfile.id);
        return newSet;
      });
      return;
    }

    // Record action for undo
    await recordAction(currentProfile.id, 'like');
    setCanUndo(true);

    if (alreadyLiked) {
      toast.info(`כבר שלחת לייק ל${currentProfile.name}`);
    } else if (isMatch) {
      setMatchedName(currentProfile.name);
      setMatchedImage(currentProfile.avatar_url || "/profiles/profile1.jpg");
      setShowMatchAnimation(true);
      // Fire confetti for match celebration! 🎉
      fireConfetti();
      setTimeout(() => setShowMatchAnimation(false), 4000);
    } else {
      toast.success(`💕 שלחת לייק ל${currentProfile.name}!`);
    }

    goToNext();
  }, [user, currentProfile, sendLike, recordAction, goToNext, fireConfetti]);

  const handlePass = useCallback(async () => {
    if (!currentProfile) return;
    
    setPassedProfiles(prev => new Set([...prev, currentProfile.id]));
    
    // Record action for undo
    if (user) {
      await recordAction(currentProfile.id, 'pass');
      setCanUndo(true);
    }
    
    toast(`דילגת על ${currentProfile.name}`);
    goToNext();
  }, [currentProfile, user, recordAction, goToNext]);

  const handleSuperLike = useCallback(async () => {
    if (!user) {
      toast.error("נא להתחבר כדי לשלוח לייקים");
      return;
    }

    if (!currentProfile) return;

    setLikedProfiles(prev => new Set([...prev, currentProfile.id]));
    
    // Send super like (with is_super flag)
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      toast.error("שגיאה בשליחת הסופר לייק");
      return;
    }

    const { error } = await supabase
      .from('likes')
      .insert({
        liker_id: profile.id,
        liked_id: currentProfile.id,
        is_super: true,
      });
    
    if (error) {
      if (error.code === '23505') {
        toast.info(`כבר שלחת לייק ל${currentProfile.name}`);
      } else {
        toast.error("שגיאה בשליחת הסופר לייק");
      }
      return;
    }

    // Record action for undo
    await recordAction(currentProfile.id, 'super_like');
    setCanUndo(true);

    // Check for match - did the other person already like ME?
    const { data: mutualLike } = await supabase
      .from('likes')
      .select('id')
      .eq('liker_id', currentProfile.id)
      .eq('liked_id', profile.id)
      .maybeSingle();

    // Also check reverse - did I already like them before?
    const { data: reverseMutual } = await supabase
      .from('matches')
      .select('id')
      .or(`and(profile1_id.eq.${profile.id},profile2_id.eq.${currentProfile.id}),and(profile1_id.eq.${currentProfile.id},profile2_id.eq.${profile.id})`)
      .maybeSingle();

    if (mutualLike || reverseMutual) {
      setMatchedName(currentProfile.name);
      setMatchedImage(currentProfile.avatar_url || "/profiles/profile1.jpg");
      setShowMatchAnimation(true);
      // Fire confetti for match celebration! 🎉
      fireConfetti();
      setTimeout(() => setShowMatchAnimation(false), 4000);
    } else {
      toast.success(`⭐ שלחת סופר לייק ל${currentProfile.name}!`);
      setShowSuperLikeAnim(true);
      setTimeout(() => setShowSuperLikeAnim(false), 1200);
    }

    goToNext();
  }, [user, currentProfile, recordAction, goToNext]);

  const handleUndo = useCallback(async () => {
    const { undoneAction, error } = await undoLastAction();
    
    if (error || !undoneAction) {
      toast.error("אין פעולה לבטל");
      return;
    }

    // Remove from appropriate set
    if (undoneAction.action_type === 'like' || undoneAction.action_type === 'super_like') {
      setLikedProfiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(undoneAction.target_profile_id);
        return newSet;
      });
    } else {
      setPassedProfiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(undoneAction.target_profile_id);
        return newSet;
      });
    }

    // Move index back to show that profile again
    const profileIndex = profiles.findIndex(p => p.id === undoneAction.target_profile_id);
    if (profileIndex !== -1) {
      setCurrentIndex(0); // Reset to beginning to show the undone profile
    }

    setCanUndo(false);
    toast.success("הפעולה בוטלה!");
  }, [undoLastAction, profiles]);

  const resetProfiles = () => {
    setLikedProfiles(new Set());
    setPassedProfiles(new Set());
    setCurrentIndex(0);
    setCanUndo(false);
    preloadCache.clear();
    refetch();
    toast.success("הפרופילים אופסו!");
  };

  // Keyboard shortcut for Ctrl+Z undo only (arrow keys handled by SwipeCard)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentProfile || !user) return;
      
      if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        handleUndo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentProfile, user, handleUndo]);

  // Not logged in state
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30" dir="rtl">
        <SkipToContent />
        <SEOHead 
          title="גלו התאמות"
          description="מצאו את ההתאמה המושלמת שלכם עם מנגנון הסוויפ החכם של Spark."
        />
        <Navbar />
        <main id="main-content" className="container mx-auto px-6 pt-28 pb-24 md:pb-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <EmptyState
            icon={<Heart className="w-10 h-10" />}
            title="התחברו כדי להתחיל"
            description="צריך להתחבר כדי לגלות פרופילים ולשלוח לייקים"
            actionLabel="הרשמה"
            actionLink="/register"
            secondaryActionLabel="התחברות"
            secondaryActionLink="/login"
          />
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30" dir="rtl">
        <SkipToContent />
        <SEOHead title="גלו התאמות" />
        <Navbar />
        <FullPageLoader
          label="מחפשים התאמות מושלמות..."
          branded
          className="min-h-[calc(100vh-80px)] bg-transparent flex items-center justify-center"
        />
      </div>
    );
  }

  if (availableProfiles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30" dir="rtl">
        <SkipToContent />
        <SEOHead title="גלו התאמות" />
        <Navbar />
        <main id="main-content" className="container mx-auto px-6 pt-28 pb-24 md:pb-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <EmptyState
            icon={<Sparkles className="w-12 h-12" />}
            title="עברתם על כל הפרופילים! 🎉"
            description="וואו, אתם ממש פעילים! סיימתם לעבור על כל הפרופילים הזמינים כרגע. נסו שוב מאוחר יותר או אפסו את הרשימה כדי להתחיל מחדש."
            actionLabel="התחל מחדש"
            onAction={resetProfiles}
            showInvite
          />
        </main>
      </div>
    );
  }

  const onboardingSteps = [
    {
      title: "גררו ימינה ללייק",
      description: "מצאתם מישהו שמוצא חן בעיניכם? גררו את הכרטיס ימינה או לחצו על כפתור הלב.",
      icon: <ArrowRight className="w-6 h-6" />,
    },
    {
      title: "גררו שמאלה לדלג",
      description: "לא מרגישים חיבור? גררו שמאלה או לחצו על X כדי לעבור לפרופיל הבא.",
      icon: <ArrowLeft className="w-6 h-6" />,
    },
    {
      title: "גררו למעלה לסופר לייק",
      description: "מישהו ממש מיוחד? גררו למעלה לשליחת סופר לייק שיבלוט מעל האחרים.",
      icon: <ArrowUp className="w-6 h-6" />,
    },
    {
      title: "מזל טוב על התאמה!",
      description: "כשיש לייק הדדי - נוצרת התאמה ותוכלו להתחיל לשוחח!",
      icon: <Star className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30" dir="rtl">
      <SkipToContent />
      <SEOHead 
        title="גלו התאמות"
        description="מצאו את ההתאמה המושלמת שלכם עם מנגנון הסוויפ החכם של Spark."
      />
      <Navbar />

      {/* Onboarding Tooltip */}
      <OnboardingTooltip
        steps={onboardingSteps}
        storageKey="spark-discover-onboarding"
      />
      
      {/* Global Undo Button - Outside swipe card for visibility */}
      {canUndo && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 md:bottom-8 md:left-8 md:translate-x-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                onClick={handleUndo}
                className="shadow-elevated bg-card hover:bg-accent gap-2 animate-fade-in"
                aria-label="בטל פעולה אחרונה (Ctrl+Z)"
              >
                <Undo2 className="w-5 h-5" />
                <span className="hidden md:inline">בטל</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>בטל פעולה אחרונה (Ctrl+Z)</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}
      
      {/* Super Like Animation */}
      <AnimatePresence>
        {showSuperLikeAnim && (
          <motion.div
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Star burst particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1.5, 0],
                  x: Math.cos((i * 30 * Math.PI) / 180) * 150,
                  y: Math.sin((i * 30 * Math.PI) / 180) * 150,
                  opacity: [1, 1, 0],
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Star className="w-6 h-6 text-secondary fill-secondary" />
              </motion.div>
            ))}
            {/* Central star */}
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: [0, 2, 1.5], rotate: [0, 180, 360] }}
              transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
            >
              <Star className="w-20 h-20 text-secondary fill-secondary drop-shadow-lg" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Match Animation Overlay with Focus Trap */}
      {showMatchAnimation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="match-title"
          aria-describedby="match-description"
          onKeyDown={(e) => {
            if (e.key === 'Escape') setShowMatchAnimation(false);
            // Focus trap: prevent tabbing outside
            if (e.key === 'Tab') {
              const focusableElements = e.currentTarget.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
              );
              const firstElement = focusableElements[0];
              const lastElement = focusableElements[focusableElements.length - 1];
              
              if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement?.focus();
              } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement?.focus();
              }
            }
          }}
          ref={(el) => {
            // Auto-focus first button when overlay opens
            if (el) {
              const firstButton = el.querySelector<HTMLElement>('button, [href]');
              setTimeout(() => firstButton?.focus(), 100);
            }
          }}
        >
          <div className="sr-only" role="status" aria-live="assertive">
            יש התאמה עם {matchedName}
          </div>
          <div className="text-center animate-scale-in">
            <div className="relative mb-8">
              <div className="flex items-center justify-center">
                {/* My photo */}
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary shadow-elevated z-10 -ml-4">
                  <img 
                    src={myProfile?.avatar_url || "/profiles/profile1.jpg"} 
                    alt="התמונה שלך"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Heart in the middle */}
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center z-20 -mx-5 shadow-lg">
                  <Heart className="w-8 h-8 text-primary-foreground fill-current animate-heart-beat" aria-hidden="true" />
                </div>
                {/* Match photo */}
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-secondary shadow-elevated z-10 -mr-4">
                  <img 
                    src={matchedImage} 
                    alt={`תמונת פרופיל של ${matchedName}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <Sparkles className="w-8 h-8 text-secondary absolute -top-4 -right-4 animate-float" aria-hidden="true" />
              <Sparkles className="w-6 h-6 text-primary absolute -bottom-2 -left-6 animate-float" style={{ animationDelay: "0.5s" }} aria-hidden="true" />
              <Sparkles className="w-5 h-5 text-secondary absolute top-0 left-0 animate-float" style={{ animationDelay: "1s" }} aria-hidden="true" />
            </div>
            <h1 id="match-title" className="font-display text-5xl font-bold text-gradient mb-4">
              יש התאמה! 🎉
            </h1>
            <p id="match-description" className="text-xl text-muted-foreground mb-8">
              את/ה ו{matchedName} אהבתם אחד את השני!
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/messages">
                <Button variant="hero" size="lg">שלחו הודעה</Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => setShowMatchAnimation(false)}
                aria-label="סגור חלון התאמה והמשך לגלות"
              >
                המשיכו לגלות
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Report Dialog */}
      {currentProfile && (
        <ReportDialog
          open={reportDialogOpen}
          onOpenChange={setReportDialogOpen}
          profileId={currentProfile.id}
          profileName={currentProfile.name}
        />
      )}

      <div className="container mx-auto px-6 pt-28 pb-24 md:pb-16">
        {/* Header with Filters */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              <span className="text-gradient">גלו</span> את ההתאמה שלכם
            </h1>
            <DiscoverFilters 
              filters={filters} 
              onFiltersChange={setFilters}
              activeFilterCount={
                (filters.ageFrom ? 1 : 0) + 
                (filters.ageTo ? 1 : 0) + 
                (filters.city ? 1 : 0) + 
                filters.interests.length +
                (filters.relationshipGoal ? 1 : 0) +
                (filters.onlineOnly ? 1 : 0)
              }
            />
          </div>
          <p className="text-muted-foreground">
            גררו ימינה ללייק, שמאלה לדלג, למעלה לסופר לייק
          </p>
        </div>

        {/* Progress */}
        <div className="max-w-md mx-auto mb-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>{likedProfiles.size} לייקים</span>
            <span>{availableProfiles.length} פרופילים נותרו</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full gradient-primary transition-all duration-300"
              style={{ 
                width: `${((profiles.length - availableProfiles.length) / Math.max(profiles.length, 1)) * 100}%` 
              }}
            />
          </div>
        </div>

        {/* Swipe Card */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Stack effect - show next cards behind */}
            {availableProfiles.slice(currentIndex + 1, currentIndex + 3).map((profile, idx) => (
              <motion.div
                key={profile.id}
                className="absolute inset-0 rounded-3xl bg-card shadow-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: 1 - (idx + 1) * 0.3,
                  scale: 1 - (idx + 1) * 0.05,
                  y: (idx + 1) * 10 
                }}
                style={{
                  zIndex: -idx - 1,
                }}
                transition={{ duration: 0.3 }}
              />
            ))}

            <AnimatePresence mode="wait">
              {currentProfile && (
                <motion.div
                  key={currentProfile.id}
                  variants={cardEntranceVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <SwipeCard
                    member={{
                      id: currentProfile.id,
                      name: currentProfile.name,
                      age: currentProfile.age,
                      city: currentProfile.city,
                      bio: currentProfileBio,
                      image: currentProfile.avatar_url || "/profiles/profile1.jpg",
                      interests: currentProfile.interests || [],
                      isOnline: currentProfile.is_online || false,
                      isVerified: currentProfileVerified,
                    }}
                    images={currentProfilePhotos}
                    onLike={handleLike}
                    onPass={handlePass}
                    onSuperLike={handleSuperLike}
                    onUndo={handleUndo}
                    onReport={() => setReportDialogOpen(true)}
                    canUndo={canUndo}
                    myCity={myProfile?.city}
                    myInterests={myProfile?.interests || []}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Keyboard hints */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-8 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-muted rounded text-xs">←</kbd>
            דלג
          </span>
          <span className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-muted rounded text-xs">↑</kbd>
            סופר לייק
          </span>
          <span className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-muted rounded text-xs">→</kbd>
            לייק
          </span>
          <span className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+Z</kbd>
            בטל
          </span>
        </div>
      </div>
    </div>
  );
};

export default Discover;
