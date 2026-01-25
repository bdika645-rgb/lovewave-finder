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
      className="group relative bg-card rounded-2xl overflow-hidden border border-border shadow-md hover:shadow-lg transition-shadow duration-300"
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
            className="w-full h-full transition-transform duration-300 group-hover:scale-102"
            aspectRatio="portrait"
            priority
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          
          {/* Online Status */}
          {member.isOnline && (
            <div 
              className="absolute top-3 right-3 flex items-center gap-1.5 bg-card/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-md"
              role="status"
              aria-label="מחובר כעת"
            >
              <span className="w-2 h-2 bg-success rounded-full animate-pulse" aria-hidden="true" />
              <span className="text-xs font-medium text-foreground">מחובר/ת</span>
            </div>
          )}

          {/* Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-white drop-shadow-md tracking-tight">
                  {member.name}, {member.age}
                </h3>
                <p className="flex items-center gap-1 text-white/90 text-xs sm:text-sm mt-0.5 drop-shadow-md">
                  <MapPin className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                  <span>{member.city}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-3 sm:p-4 bg-card">
        <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 mb-3">
          {member.bio}
        </p>

        {/* Interests */}
        <div className="flex flex-wrap gap-1.5 mb-3" role="list" aria-label="תחומי עניין">
          {member.interests.slice(0, 3).map((interest) => (
            <Badge 
              key={interest} 
              variant="secondary" 
              className="bg-accent text-accent-foreground text-[10px] sm:text-xs px-2 py-0.5"
              role="listitem"
            >
              {interest}
            </Badge>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2" role="group" aria-label="פעולות">
          <Button
            variant="pass"
            size="sm"
            onClick={onPass}
            className="flex-1 h-9"
            aria-label={`דלג על ${member.name}`}
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </Button>
          <Button
            variant="like"
            size="sm"
            onClick={onLike}
            className="flex-1 h-9"
            aria-label={`שלח לייק ל${member.name}`}
          >
            <Heart className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </article>
  );
});

MemberCard.displayName = 'MemberCard';

export default MemberCard;
