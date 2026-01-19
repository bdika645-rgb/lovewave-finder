import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import SwipeCard from "@/components/SwipeCard";
import { useProfiles } from "@/hooks/useProfiles";
import { useLikes } from "@/hooks/useLikes";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Heart, Loader2, RefreshCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Discover = () => {
  const { user } = useAuth();
  const { profiles, loading, refetch } = useProfiles({ filterByOppositeGender: true });
  const { sendLike, checkIfLiked } = useLikes();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedProfiles, setLikedProfiles] = useState<Set<string>>(new Set());
  const [passedProfiles, setPassedProfiles] = useState<Set<string>>(new Set());
  const [showMatchAnimation, setShowMatchAnimation] = useState(false);
  const [matchedName, setMatchedName] = useState("");

  // Filter out already liked/passed profiles
  const availableProfiles = profiles.filter(
    (p) => !likedProfiles.has(p.id) && !passedProfiles.has(p.id)
  );

  const currentProfile = availableProfiles[currentIndex];

  const goToNext = useCallback(() => {
    if (currentIndex < availableProfiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Reset when we've gone through all
      setCurrentIndex(0);
    }
  }, [currentIndex, availableProfiles.length]);

  const handleLike = async () => {
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

    if (alreadyLiked) {
      toast.info(`כבר שלחת לייק ל${currentProfile.name}`);
    } else if (isMatch) {
      setMatchedName(currentProfile.name);
      setShowMatchAnimation(true);
      setTimeout(() => setShowMatchAnimation(false), 3000);
    } else {
      toast.success(`💕 שלחת לייק ל${currentProfile.name}!`);
    }

    goToNext();
  };

  const handlePass = () => {
    if (!currentProfile) return;
    setPassedProfiles(prev => new Set([...prev, currentProfile.id]));
    toast(`דילגת על ${currentProfile.name}`);
    goToNext();
  };

  const handleSuperLike = async () => {
    if (!user) {
      toast.error("נא להתחבר כדי לשלוח לייקים");
      return;
    }

    if (!currentProfile) return;

    setLikedProfiles(prev => new Set([...prev, currentProfile.id]));
    
    const { error, isMatch } = await sendLike(currentProfile.id);
    
    if (error) {
      toast.error("שגיאה בשליחת הסופר לייק");
      return;
    }

    if (isMatch) {
      setMatchedName(currentProfile.name);
      setShowMatchAnimation(true);
      setTimeout(() => setShowMatchAnimation(false), 3000);
    } else {
      toast.success(`⭐ שלחת סופר לייק ל${currentProfile.name}!`);
    }

    goToNext();
  };

  const resetProfiles = () => {
    setLikedProfiles(new Set());
    setPassedProfiles(new Set());
    setCurrentIndex(0);
    refetch();
    toast.success("הפרופילים אופסו!");
  };

  // Not logged in state
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30" dir="rtl">
        <Navbar />
        <div className="container mx-auto px-6 pt-28 pb-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center max-w-md">
            <Heart className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              התחברו כדי להתחיל
            </h1>
            <p className="text-muted-foreground mb-8">
              צריך להתחבר כדי לגלות פרופילים ולשלוח לייקים
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/login">
                <Button variant="outline" size="lg">התחברות</Button>
              </Link>
              <Link to="/register">
                <Button variant="hero" size="lg">הרשמה</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30" dir="rtl">
        <Navbar />
        <div className="container mx-auto px-6 pt-28 pb-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">טוען פרופילים...</p>
          </div>
        </div>
      </div>
    );
  }

  if (availableProfiles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30" dir="rtl">
        <Navbar />
        <div className="container mx-auto px-6 pt-28 pb-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center max-w-md">
            <Sparkles className="w-16 h-16 text-muted-foreground/50 mx-auto mb-6" />
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              אין עוד פרופילים
            </h1>
            <p className="text-muted-foreground mb-8">
              סיימתם לעבור על כל הפרופילים הזמינים. נסו שוב מאוחר יותר או אפסו את הרשימה.
            </p>
            <Button variant="hero" size="lg" onClick={resetProfiles}>
              <RefreshCcw className="w-5 h-5" />
              אפס פרופילים
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30" dir="rtl">
      <Navbar />
      
      {/* Match Animation Overlay */}
      {showMatchAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md animate-fade-in">
          <div className="text-center animate-scale-in">
            <div className="relative">
              <Heart className="w-32 h-32 text-primary mx-auto mb-6 animate-pulse fill-current" />
              <Sparkles className="w-12 h-12 text-secondary absolute -top-4 -right-4 animate-float" />
              <Sparkles className="w-8 h-8 text-primary absolute -bottom-2 -left-6 animate-float" style={{ animationDelay: "0.5s" }} />
            </div>
            <h1 className="font-display text-5xl font-bold text-gradient mb-4">
              יש התאמה! 🎉
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
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
              >
                המשיכו לגלות
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">
            <span className="text-gradient">גלו</span> את ההתאמה שלכם
          </h1>
          <p className="text-muted-foreground">
            החליקו ימינה ללייק, שמאלה לדלג
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
                  bio: currentProfile.bio || "",
                  image: currentProfile.avatar_url || "/profiles/profile1.jpg",
                  interests: currentProfile.interests || [],
                  isOnline: currentProfile.is_online || false,
                }}
                onLike={handleLike}
                onPass={handlePass}
                onSuperLike={handleSuperLike}
              />
            )}
          </div>
        </div>

        {/* Keyboard hints */}
        <div className="flex justify-center gap-8 mt-8 text-sm text-muted-foreground">
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
        </div>
      </div>
    </div>
  );
};

export default Discover;
