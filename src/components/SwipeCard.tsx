import { useState } from "react";
import { Heart, X, Star, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Member } from "@/data/members";

interface SwipeCardProps {
  member: Member;
  onLike: () => void;
  onPass: () => void;
  onSuperLike?: () => void;
}

const SwipeCard = ({ member, onLike, onPass, onSuperLike }: SwipeCardProps) => {
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [imageIndex, setImageIndex] = useState(0);

  const handleLike = () => {
    setSwipeDirection("right");
    setTimeout(onLike, 400);
  };

  const handlePass = () => {
    setSwipeDirection("left");
    setTimeout(onPass, 400);
  };

  return (
    <div 
      className={`relative w-full max-w-md mx-auto ${
        swipeDirection === "right" ? "animate-swipe-right" : 
        swipeDirection === "left" ? "animate-swipe-left" : ""
      }`}
    >
      <div className="relative bg-card rounded-3xl overflow-hidden shadow-elevated">
        {/* Image */}
        <div className="relative aspect-[3/4]">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 gradient-overlay opacity-50" />

          {/* Image Navigation */}
          <div className="absolute top-4 left-4 right-4 flex gap-1">
            {[1, 2, 3].map((_, i) => (
              <div 
                key={i} 
                className={`flex-1 h-1 rounded-full ${
                  i === imageIndex ? "bg-primary-foreground" : "bg-primary-foreground/30"
                }`}
              />
            ))}
          </div>

          <button 
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 glass-effect rounded-full opacity-0 hover:opacity-100 transition-opacity"
            onClick={() => setImageIndex(Math.max(0, imageIndex - 1))}
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>
          
          <button 
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 glass-effect rounded-full opacity-0 hover:opacity-100 transition-opacity"
            onClick={() => setImageIndex(Math.min(2, imageIndex + 1))}
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>

          {/* Online Badge */}
          {member.isOnline && (
            <div className="absolute top-12 right-4 flex items-center gap-2 glass-effect px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-foreground">מחובר/ת</span>
            </div>
          )}

          {/* Info */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h2 className="font-display text-4xl font-bold text-primary-foreground mb-2">
              {member.name}, {member.age}
            </h2>
            <p className="flex items-center gap-2 text-primary-foreground/80 mb-4">
              <MapPin className="w-5 h-5" />
              {member.city}
            </p>
            <p className="text-primary-foreground/90 text-lg mb-4">
              {member.bio}
            </p>
            <div className="flex flex-wrap gap-2">
              {member.interests.map((interest) => (
                <Badge 
                  key={interest} 
                  className="bg-primary-foreground/20 text-primary-foreground border-none backdrop-blur-sm"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <Button
          variant="pass"
          size="icon-xl"
          onClick={handlePass}
          className="shadow-card hover:shadow-elevated"
        >
          <X className="w-8 h-8" />
        </Button>
        
        {onSuperLike && (
          <Button
            size="icon-lg"
            onClick={onSuperLike}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-card"
          >
            <Star className="w-6 h-6" />
          </Button>
        )}

        <Button
          variant="like"
          size="icon-xl"
          onClick={handleLike}
          className="shadow-card hover:shadow-elevated"
        >
          <Heart className="w-8 h-8" />
        </Button>
      </div>
    </div>
  );
};

export default SwipeCard;
