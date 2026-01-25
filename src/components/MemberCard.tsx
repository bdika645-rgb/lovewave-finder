import { memo } from "react";
import { Heart, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import LazyImage from "@/components/LazyImage";
import type { Member } from "@/data/members";

interface MemberCardProps {
  member: Member;
  onLike?: () => void;
  onPass?: () => void;
}

const MemberCard = memo(({ member, onLike, onPass }: MemberCardProps) => {
  return (
    <article 
      className="group relative glass-effect rounded-3xl overflow-hidden border border-white/30 dark:border-white/10 hover:border-primary/30 transition-all duration-500 tilt-card"
      aria-label={`פרופיל של ${member.name}`}
    >
      {/* Image */}
      <Link 
        to={`/member/${member.id}`}
        aria-label={`צפייה בפרופיל של ${member.name}`}
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <LazyImage
            src={member.image}
            alt={`תמונת פרופיל של ${member.name}`}
            className="w-full h-full transition-transform duration-500 group-hover:scale-105"
            aspectRatio="portrait"
          />
          {/* Enhanced gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent" />
          
          {/* Online Status */}
          {member.isOnline && (
            <div 
              className="absolute top-4 right-4 flex items-center gap-2 glass-effect px-3 py-1.5 rounded-full shadow-lg"
              role="status"
              aria-label="מחובר כעת"
            >
              <span className="w-2 h-2 bg-success rounded-full animate-pulse" aria-hidden="true" />
              <span className="text-xs font-medium text-foreground">מחובר/ת</span>
            </div>
          )}

          {/* Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 backdrop-blur-[2px]">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white drop-shadow-lg tracking-tight">
                  {member.name}, {member.age}
                </h3>
                <p className="flex items-center gap-1 text-white/90 text-sm mt-1 drop-shadow-md">
                  <MapPin className="w-4 h-4 text-white" aria-hidden="true" />
                  <span>{member.city}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 bg-card/50 backdrop-blur-sm">
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {member.bio}
        </p>

        {/* Interests */}
        <div className="flex flex-wrap gap-2 mb-5" role="list" aria-label="תחומי עניין">
          {member.interests.slice(0, 3).map((interest) => (
            <Badge 
              key={interest} 
              variant="secondary" 
              className="bg-accent/50 text-accent-foreground text-xs"
              role="listitem"
            >
              {interest}
            </Badge>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3" role="group" aria-label="פעולות">
          <Button
            variant="pass"
            size="icon-lg"
            onClick={onPass}
            className="flex-1 focus:ring-2 focus:ring-offset-2 focus:ring-destructive focus:outline-none"
            aria-label={`דלג על ${member.name}`}
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </Button>
          <Button
            variant="like"
            size="icon-lg"
            onClick={onLike}
            className="flex-1 focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:outline-none"
            aria-label={`שלח לייק ל${member.name}`}
          >
            <Heart className="w-5 h-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </article>
  );
});

MemberCard.displayName = 'MemberCard';

export default MemberCard;
