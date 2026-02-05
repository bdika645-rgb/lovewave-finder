import { useState, useCallback, useEffect } from "react";
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

const Discover = () => {
  const { user } = useAuth();
  
  // Filters state
  const [filters, setFilters] = useState<DiscoverFiltersState>({
    ageFrom: null,
    ageTo: null,
    city: "",
    interests: [],
    relationshipGoal: ""
  });

  const { profiles, loading, refetch } = useProfiles({ 
    filterByOppositeGender: true,
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
  const [currentProfilePhotos, setCurrentProfilePhotos] = useState<string[]>([]);

  // Allow closing match overlay with ESC
  useEffect(() => {
    if (!showMatchAnimation) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowMatchAnimation(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showMatchAnimation]);

  // Filter out already liked/passed profiles
  const availableProfiles = profiles.filter(
    (p) => !likedProfiles.has(p.id) && !passedProfiles.has(p.id)
  );

  const currentProfile = availableProfiles[currentIndex];

  // Fetch photos for current profile
  useEffect(() => {
    const fetchPhotos = async () => {
      if (!currentProfile) {
        setCurrentProfilePhotos([]);
        return;
      }

      const { data } = await supabase
        .from('photos')
        .select('url')
        .eq('profile_id', currentProfile.id)
        .order('display_order', { ascending: true });

      if (data && data.length > 0) {
        setCurrentProfilePhotos(data.map(p => p.url));
      } else if (currentProfile.avatar_url) {
        setCurrentProfilePhotos([currentProfile.avatar_url]);
      } else {
        setCurrentProfilePhotos(["/profiles/profile1.jpg"]);
      }
    };

    fetchPhotos();
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

    // Check for match
    const { data: mutualLike } = await supabase
      .from('likes')
      .select('id')
      .eq('liker_id', currentProfile.id)
      .eq('liked_id', profile.id)
      .maybeSingle();

    if (mutualLike) {
      setMatchedName(currentProfile.name);
      setMatchedImage(currentProfile.avatar_url || "/profiles/profile1.jpg");
      setShowMatchAnimation(true);
      // Fire confetti for match celebration! 🎉
      fireConfetti();
      setTimeout(() => setShowMatchAnimation(false), 4000);
    } else {
      toast.success(`⭐ שלחת סופר לייק ל${currentProfile.name}!`);
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
    refetch();
    toast.success("הפרופילים אופסו!");
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentProfile || !user) return;
      
      switch (e.key) {
        case 'ArrowRight':
          handleLike();
          break;
        case 'ArrowLeft':
          handlePass();
          break;
        case 'ArrowUp':
          handleSuperLike();
          break;
        case 'z':
          if (e.ctrlKey || e.metaKey) {
            handleUndo();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentProfile, user, handleLike, handlePass, handleSuperLike, handleUndo]);

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
        <main id="main-content" className="container mx-auto px-6 pt-28 pb-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
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
        <main id="main-content" className="container mx-auto px-6 pt-28 pb-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
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
              <div className="flex items-center justify-center gap-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary shadow-elevated animate-pulse">
                  <img 
                    src={matchedImage} 
                    alt={`תמונת פרופיל של ${matchedName}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <Heart className="w-16 h-16 text-primary mx-auto mt-4 fill-current animate-heart-beat" aria-hidden="true" />
              <Sparkles className="w-8 h-8 text-secondary absolute -top-4 -right-4 animate-float" aria-hidden="true" />
              <Sparkles className="w-6 h-6 text-primary absolute -bottom-2 -left-6 animate-float" style={{ animationDelay: "0.5s" }} aria-hidden="true" />
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

      <div className="container mx-auto px-6 pt-28 pb-16">
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
                (filters.relationshipGoal ? 1 : 0)
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
              <div
                key={profile.id}
                className="absolute inset-0 rounded-3xl bg-card shadow-card"
                style={{
                  transform: `scale(${1 - (idx + 1) * 0.05}) translateY(${(idx + 1) * 10}px)`,
                  zIndex: -idx - 1,
                  opacity: 1 - (idx + 1) * 0.3,
                }}
              />
            ))}

            {currentProfile && (
              <SwipeCard
                member={{
                  id: currentProfile.id,
                  name: currentProfile.name,
                  age: currentProfile.age,
                  city: currentProfile.city,
                  bio: "",
                  image: currentProfile.avatar_url || "/profiles/profile1.jpg",
                  interests: currentProfile.interests || [],
                  isOnline: currentProfile.is_online || false,
                  isVerified: false,
                }}
                images={currentProfilePhotos}
                onLike={handleLike}
                onPass={handlePass}
                onSuperLike={handleSuperLike}
                onUndo={handleUndo}
                onReport={() => setReportDialogOpen(true)}
                canUndo={canUndo}
              />
            )}
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
