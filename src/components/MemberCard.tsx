import { memo, useState } from "react";
import { Heart, X, MapPin, Sparkles, Check, Target, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import LazyImage from "@/components/LazyImage";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Member } from "@/data/members";
import { motion, AnimatePresence } from "framer-motion";

interface MemberCardProps {
  member: Member;
  onLike?: () => void;
  onPass?: () => void;
}

const MemberCard = memo(({ member, onLike, onPass }: MemberCardProps) => {
  const [actionFeedback, setActionFeedback] = useState<"like" | "pass" | null>(null);

  const handleLike = () => {
    setActionFeedback("like");
    onLike?.();
    setTimeout(() => setActionFeedback(null), 1500);
  };

  const handlePass = () => {
    setActionFeedback("pass");
    onPass?.();
    setTimeout(() => setActionFeedback(null), 1500);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <article 
        className="group relative bg-card rounded-2xl overflow-hidden border border-border shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        aria-label={`פרופיל של ${member.name}`}
      >
        {/* Action Feedback Overlay */}
        <AnimatePresence>
          {actionFeedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className={`absolute inset-0 z-20 flex items-center justify-center pointer-events-none ${
                actionFeedback === "like" 
                  ? "bg-success/20 backdrop-blur-sm" 
                  : "bg-muted/20 backdrop-blur-sm"
              }`}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`w-20 h-20 rounded-full flex items-center justify-center ${
                  actionFeedback === "like" 
                    ? "bg-success text-success-foreground" 
                    : "bg-muted-foreground/80 text-primary-foreground"
                }`}
              >
                {actionFeedback === "like" ? (
                  <Heart className="w-10 h-10 fill-current" />
                ) : (
                  <X className="w-10 h-10" />
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image */}
        <Link 
          to={`/member/${member.id}`}
          aria-label={`צפייה בפרופיל של ${member.name}`}
        >
          <div className="relative aspect-[3/4] overflow-hidden">
            <LazyImage
              src={member.image}
              alt={`תמונת פרופיל של ${member.name}`}
              className="w-full h-full transition-transform duration-300 group-hover:scale-105"
              aspectRatio="portrait"
              priority
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            {/* Online Status - Enhanced */}
            {member.isOnline ? (
              <div 
                className="absolute top-3 right-3 flex items-center gap-1.5 bg-card/95 backdrop-blur-md px-2.5 py-1.5 rounded-full shadow-lg border border-success/20"
                role="status"
                aria-label="מחובר כעת"
              >
                <span className="w-2.5 h-2.5 bg-success rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" aria-hidden="true" />
                <span className="text-xs font-semibold text-success">מחובר/ת</span>
              </div>
            ) : member.lastActive ? (
              <div 
                className="absolute top-3 right-3 flex items-center gap-1.5 bg-card/95 backdrop-blur-md px-2.5 py-1.5 rounded-full shadow-lg"
                role="status"
                aria-label={`פעיל/ה לאחרונה ${formatDistanceToNow(new Date(member.lastActive), { addSuffix: true, locale: he })}`}
              >
                <Clock className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(member.lastActive), { addSuffix: true, locale: he })}
                </span>
              </div>
            ) : null}

            {/* Verified Badge */}
            {member.interests && member.interests.length >= 3 && (
              <div className="absolute top-3 left-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-lg">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>פרופיל מושלם</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}

            {/* Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white drop-shadow-lg tracking-tight">
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
          {member.bio && (
            <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 mb-3">
              {member.bio}
            </p>
          )}

          {/* Looking For Badge */}
          {member.lookingFor && (
            <div className="flex items-center gap-1.5 mb-3 text-xs text-muted-foreground">
              <Target className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
              <span>
                {member.lookingFor === 'serious' ? 'מחפש/ת קשר רציני' :
                 member.lookingFor === 'casual' ? 'מחפש/ת הכרויות' :
                 member.lookingFor === 'friendship' ? 'מחפש/ת חברות' : member.lookingFor}
              </span>
            </div>
          )}

          {/* Interests */}
          {member.interests && member.interests.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3" role="list" aria-label="תחומי עניין">
              {member.interests.slice(0, 3).map((interest) => (
                <Badge 
                  key={interest} 
                  variant="secondary" 
                  className="bg-accent text-accent-foreground text-[10px] sm:text-xs px-2 py-0.5 hover:bg-accent/80 transition-colors"
                  role="listitem"
                >
                  {interest}
                </Badge>
              ))}
              {member.interests.length > 3 && (
                <Badge 
                  variant="outline" 
                  className="text-[10px] sm:text-xs px-2 py-0.5"
                >
                  +{member.interests.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Action Buttons - Enhanced with tooltips */}
          <div className="flex gap-2" role="group" aria-label="פעולות">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="pass"
                  size="sm"
                  onClick={handlePass}
                  className="flex-1 h-10 hover:scale-105 active:scale-95 transition-transform"
                  aria-label={`דלג על ${member.name}`}
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>דלג</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="like"
                  size="sm"
                  onClick={handleLike}
                  className="flex-1 h-10 hover:scale-105 active:scale-95 transition-transform group/btn"
                  aria-label={`שלח לייק ל${member.name}`}
                >
                  <Heart className="w-5 h-5 group-hover/btn:fill-current transition-all" aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>לייק 💕</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </article>
    </TooltipProvider>
  );
});

MemberCard.displayName = 'MemberCard';

export default MemberCard;