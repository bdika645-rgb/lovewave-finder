import { Heart, X, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import type { Member } from "@/data/members";

interface MemberCardProps {
  member: Member;
  onLike?: () => void;
  onPass?: () => void;
}

const MemberCard = ({ member, onLike, onPass }: MemberCardProps) => {
  return (
    <div className="group relative bg-card rounded-3xl overflow-hidden shadow-card card-hover">
      {/* Image */}
      <Link to={`/member/${member.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 gradient-overlay opacity-60" />
          
          {/* Online Status */}
          {member.isOnline && (
            <div className="absolute top-4 right-4 flex items-center gap-2 glass-effect px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-foreground">מחובר/ת</span>
            </div>
          )}

          {/* Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="font-display text-2xl font-bold text-primary-foreground">
                  {member.name}, {member.age}
                </h3>
                <p className="flex items-center gap-1 text-primary-foreground/80 text-sm mt-1">
                  <MapPin className="w-4 h-4" />
                  {member.city}
                </p>
              </div>
              <Sparkles className="w-6 h-6 text-secondary animate-pulse-soft" />
            </div>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-6">
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {member.bio}
        </p>

        {/* Interests */}
        <div className="flex flex-wrap gap-2 mb-6">
          {member.interests.slice(0, 3).map((interest) => (
            <Badge key={interest} variant="secondary" className="bg-accent text-accent-foreground">
              {interest}
            </Badge>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="pass"
            size="icon-lg"
            onClick={onPass}
            className="flex-1"
          >
            <X className="w-6 h-6" />
          </Button>
          <Button
            variant="like"
            size="icon-lg"
            onClick={onLike}
            className="flex-1"
          >
            <Heart className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
