import { useState, useRef, useCallback } from "react";
import { Heart, X, Star, MapPin, ChevronLeft, ChevronRight, Undo2, Flag, Verified } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Member } from "@/data/members";

interface SwipeCardProps {
  member: Member & { isVerified?: boolean };
  onLike: () => void;
  onPass: () => void;
  onSuperLike?: () => void;
  onUndo?: () => void;
  onReport?: () => void;
  images?: string[];
  canUndo?: boolean;
}

const SwipeCard = ({ 
  member, 
  onLike, 
  onPass, 
  onSuperLike, 
  onUndo, 
  onReport, 
  images,
  canUndo = false 
}: SwipeCardProps) => {
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | "up" | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });

  // Use provided images or fallback to member image
  const allImages = images && images.length > 0 ? images : [member.image];

  const SWIPE_THRESHOLD = 100;
  const SUPER_LIKE_THRESHOLD = -80;

  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true);
    startPos.current = { x: clientX, y: clientY };
  }, []);

  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return;
    const deltaX = clientX - startPos.current.x;
    const deltaY = clientY - startPos.current.y;
    setDragOffset({ x: deltaX, y: deltaY });
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    // Check for super like (swipe up)
    if (dragOffset.y < SUPER_LIKE_THRESHOLD && onSuperLike) {
      setSwipeDirection("up");
      setTimeout(() => {
        onSuperLike();
        setSwipeDirection(null);
        setDragOffset({ x: 0, y: 0 });
      }, 300);
      return;
    }

    // Check for like (swipe right)
    if (dragOffset.x > SWIPE_THRESHOLD) {
      setSwipeDirection("right");
      setTimeout(() => {
        onLike();
        setSwipeDirection(null);
        setDragOffset({ x: 0, y: 0 });
      }, 300);
      return;
    }

    // Check for pass (swipe left)
    if (dragOffset.x < -SWIPE_THRESHOLD) {
      setSwipeDirection("left");
      setTimeout(() => {
        onPass();
        setSwipeDirection(null);
        setDragOffset({ x: 0, y: 0 });
      }, 300);
      return;
    }

    // Snap back
    setDragOffset({ x: 0, y: 0 });
  }, [isDragging, dragOffset, onLike, onPass, onSuperLike]);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) handleDragEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  const handleLike = () => {
    setSwipeDirection("right");
    setTimeout(() => {
      onLike();
      setSwipeDirection(null);
    }, 300);
  };

  const handlePass = () => {
    setSwipeDirection("left");
    setTimeout(() => {
      onPass();
      setSwipeDirection(null);
    }, 300);
  };

  const handleSuperLike = () => {
    if (!onSuperLike) return;
    setSwipeDirection("up");
    setTimeout(() => {
      onSuperLike();
      setSwipeDirection(null);
    }, 300);
  };

  // Calculate transform based on drag or swipe animation
  const getCardTransform = () => {
    if (swipeDirection === "right") return "translateX(150%) rotate(30deg)";
    if (swipeDirection === "left") return "translateX(-150%) rotate(-30deg)";
    if (swipeDirection === "up") return "translateY(-150%) scale(0.8)";
    
    const rotation = dragOffset.x * 0.1;
    return `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`;
  };

  // Calculate opacity of action indicators
  const likeOpacity = Math.min(Math.max(dragOffset.x / SWIPE_THRESHOLD, 0), 1);
  const passOpacity = Math.min(Math.max(-dragOffset.x / SWIPE_THRESHOLD, 0), 1);
  const superLikeOpacity = Math.min(Math.max(-dragOffset.y / Math.abs(SUPER_LIKE_THRESHOLD), 0), 1);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Undo Button */}
      {canUndo && onUndo && (
        <Button
          variant="outline"
          size="icon"
          onClick={onUndo}
          className="absolute -left-16 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-card"
          aria-label="בטל פעולה אחרונה"
        >
          <Undo2 className="w-5 h-5" aria-hidden="true" />
        </Button>
      )}

      <div 
        ref={cardRef}
        className={`relative bg-card rounded-3xl overflow-hidden shadow-elevated cursor-grab active:cursor-grabbing transition-transform ${
          isDragging ? '' : 'duration-300'
        }`}
        style={{ transform: getCardTransform() }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Like Indicator */}
        <div 
          className="absolute top-8 right-8 z-20 border-4 border-success text-success font-bold text-2xl px-4 py-2 rounded-lg rotate-[-20deg] pointer-events-none bg-background/80"
          style={{ opacity: likeOpacity }}
          aria-hidden="true"
        >
          לייק ❤️
        </div>

        {/* Nope Indicator */}
        <div 
          className="absolute top-8 left-8 z-20 border-4 border-destructive text-destructive font-bold text-2xl px-4 py-2 rounded-lg rotate-[20deg] pointer-events-none bg-background/80"
          style={{ opacity: passOpacity }}
          aria-hidden="true"
        >
          דלג ✕
        </div>

        {/* Super Like Indicator */}
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 z-20 border-4 border-secondary text-secondary font-bold text-2xl px-4 py-2 rounded-lg pointer-events-none bg-background/80"
          style={{ opacity: superLikeOpacity }}
          aria-hidden="true"
        >
          סופר ⭐
        </div>

        {/* Image */}
        <div className="relative aspect-[3/4] select-none">
          <img
            src={allImages[imageIndex]}
            alt={member.name}
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
          />
          <div className="absolute inset-0 gradient-overlay opacity-50 pointer-events-none" />

          {/* Image Navigation Dots */}
          {allImages.length > 1 && (
            <div className="absolute top-4 left-4 right-4 flex gap-1">
              {allImages.map((_, i) => (
                <div 
                  key={i} 
                  className={`flex-1 h-1 rounded-full transition-all ${
                    i === imageIndex ? "bg-primary-foreground" : "bg-primary-foreground/30"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Image Navigation Buttons */}
          {allImages.length > 1 && (
            <>
              <button 
                className="absolute left-2 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center glass-effect rounded-full opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setImageIndex(Math.max(0, imageIndex - 1));
                }}
                aria-label="תמונה קודמת"
              >
                <ChevronRight className="w-6 h-6 text-foreground" aria-hidden="true" />
              </button>
              
              <button 
                className="absolute right-2 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center glass-effect rounded-full opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setImageIndex(Math.min(allImages.length - 1, imageIndex + 1));
                }}
                aria-label="תמונה הבאה"
              >
                <ChevronLeft className="w-6 h-6 text-foreground" aria-hidden="true" />
              </button>
            </>
          )}

          {/* Online Badge */}
          {member.isOnline && (
            <div className="absolute top-12 right-4 flex items-center gap-2 glass-effect px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse" aria-hidden="true" />
              <span className="text-xs font-medium text-foreground">מחובר/ת</span>
            </div>
          )}

          {/* Report Button */}
          {onReport && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReport();
              }}
              className="absolute top-12 left-4 p-2 glass-effect rounded-full opacity-50 hover:opacity-100 transition-opacity"
              aria-label="דווח על פרופיל"
            >
              <Flag className="w-4 h-4 text-foreground" />
            </button>
          )}

          {/* Info */}
          <div className="absolute bottom-0 left-0 right-0 p-8 pointer-events-none">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="font-display text-4xl font-bold text-primary-foreground">
                {member.name}, {member.age}
              </h2>
              {member.isVerified && (
                <Verified className="w-6 h-6 text-secondary fill-secondary" />
              )}
            </div>
            <p className="flex items-center gap-2 text-primary-foreground/80 mb-4">
              <MapPin className="w-5 h-5" />
              {member.city}
            </p>
            <p className="text-primary-foreground/90 text-lg mb-4 line-clamp-2">
              {member.bio}
            </p>
            <div className="flex flex-wrap gap-2">
              {member.interests.slice(0, 4).map((interest) => (
                <Badge 
                  key={interest} 
                  className="bg-primary-foreground/20 text-primary-foreground border-none backdrop-blur-sm"
                >
                  {interest}
                </Badge>
              ))}
              {member.interests.length > 4 && (
                <Badge className="bg-primary-foreground/20 text-primary-foreground border-none backdrop-blur-sm">
                  +{member.interests.length - 4}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 mt-6" role="group" aria-label="פעולות על פרופיל">
        <Button
          variant="pass"
          size="icon-xl"
          onClick={handlePass}
          className="shadow-card hover:shadow-elevated transition-all hover:scale-110"
          aria-label={`דלג על ${member.name}`}
        >
          <X className="w-8 h-8" aria-hidden="true" />
        </Button>
        
        {onSuperLike && (
          <Button
            size="icon-lg"
            onClick={handleSuperLike}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-card transition-all hover:scale-110"
            aria-label={`שלח סופר לייק ל${member.name}`}
          >
            <Star className="w-6 h-6" aria-hidden="true" />
          </Button>
        )}

        <Button
          variant="like"
          size="icon-xl"
          onClick={handleLike}
          className="shadow-card hover:shadow-elevated transition-all hover:scale-110"
          aria-label={`עשה לייק ל${member.name}`}
        >
          <Heart className="w-8 h-8" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};

export default SwipeCard;
