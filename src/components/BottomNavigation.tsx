import { Link, useLocation } from "react-router-dom";
import { Home, Users, Heart, MessageCircle, User, LogIn, Compass } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import { memo, useMemo, useCallback, useState } from "react";

interface NavItem {
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: number;
}

// Extracted NavIcon component for better performance and cleaner code
const NavIcon = memo(({ 
  Icon, 
  isActive, 
  shouldAnimate 
}: { 
  Icon: React.ComponentType<{ className?: string }>; 
  isActive: boolean;
  shouldAnimate: boolean;
}) => (
  <motion.div
    initial={false}
    animate={shouldAnimate ? { 
      scale: isActive ? 1.1 : 1,
      y: isActive ? -2 : 0 
    } : {}}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
  >
    <Icon 
      className={cn(
        "w-5 h-5 transition-all duration-200",
        isActive && "fill-primary/20 stroke-[2.5px]"
      )} 
      aria-hidden="true" 
    />
  </motion.div>
));

NavIcon.displayName = 'NavIcon';

// Animated badge component with pulse effect
const AnimatedBadge = memo(({ 
  value, 
  shouldAnimate 
}: { 
  value: number;
  shouldAnimate: boolean;
}) => (
  <AnimatePresence mode="wait">
    {value > 0 && (
      <motion.span
        key="badge"
        initial={shouldAnimate ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        exit={shouldAnimate ? { scale: 0, opacity: 0 } : {}}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
        className="absolute -top-1.5 -right-2.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg shadow-destructive/30"
        aria-hidden="true"
      >
        <motion.span
          key={value}
          initial={shouldAnimate ? { y: -8, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          {value > 99 ? "99+" : value > 9 ? "9+" : value}
        </motion.span>
      </motion.span>
    )}
  </AnimatePresence>
));

AnimatedBadge.displayName = 'AnimatedBadge';

// Active indicator with smooth morph animation
const ActiveIndicator = memo(({ shouldAnimate }: { shouldAnimate: boolean }) => (
  <motion.div
    layoutId={shouldAnimate ? "activeTab" : undefined}
    className="absolute -top-0.5 left-1/2 w-10 h-1 bg-gradient-to-r from-primary/80 via-primary to-primary/80 rounded-full shadow-lg shadow-primary/30"
    initial={shouldAnimate ? { x: "-50%", opacity: 0 } : { x: "-50%" }}
    animate={{ x: "-50%", opacity: 1 }}
    transition={{ type: "spring", stiffness: 380, damping: 30 }}
    aria-hidden="true"
  />
));

ActiveIndicator.displayName = 'ActiveIndicator';

// NavItem component with tap feedback
const NavItemComponent = memo(({ 
  item, 
  isActive, 
  shouldAnimate 
}: { 
  item: NavItem; 
  isActive: boolean;
  shouldAnimate: boolean;
}) => {
  const [isTapped, setIsTapped] = useState(false);
  const badgeValue = item.badge ?? 0;

  const handleTapStart = useCallback(() => setIsTapped(true), []);
  const handleTapEnd = useCallback(() => setIsTapped(false), []);

  return (
    <li className="flex-1 h-full">
      <Link
        to={item.path}
        className={cn(
          "flex flex-col items-center justify-center h-full relative min-h-[44px] min-w-[44px]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg",
          "transition-colors duration-150",
          isActive ? "text-primary" : "text-muted-foreground"
        )}
        aria-current={isActive ? "page" : undefined}
        aria-label={badgeValue > 0 ? `${item.label} - ${badgeValue} הודעות חדשות` : item.label}
        onMouseDown={handleTapStart}
        onMouseUp={handleTapEnd}
        onMouseLeave={handleTapEnd}
        onTouchStart={handleTapStart}
        onTouchEnd={handleTapEnd}
      >
        <motion.div
          className="flex flex-col items-center relative"
          animate={shouldAnimate ? {
            scale: isTapped ? 0.9 : 1,
            opacity: isTapped ? 0.7 : 1
          } : {}}
          transition={{ duration: 0.1 }}
        >
          {/* Glow effect behind active icon */}
          <AnimatePresence>
            {isActive && shouldAnimate && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute inset-0 w-10 h-10 -top-2.5 -left-2.5 rounded-full bg-primary/10 blur-md"
                aria-hidden="true"
              />
            )}
          </AnimatePresence>

          <div className="relative z-10">
            <NavIcon Icon={item.icon} isActive={isActive} shouldAnimate={shouldAnimate} />
            <AnimatedBadge value={badgeValue} shouldAnimate={shouldAnimate} />
          </div>

          <motion.span 
            className={cn(
              "text-[10px] mt-1 font-medium transition-colors duration-150",
              isActive && "text-primary font-semibold"
            )}
            animate={shouldAnimate ? { 
              opacity: isActive ? 1 : 0.8,
              y: isActive ? 0 : 1
            } : {}}
            aria-hidden="true"
          >
            {item.label}
          </motion.span>
        </motion.div>

        {/* Active indicator bar */}
        {isActive && <ActiveIndicator shouldAnimate={shouldAnimate} />}
      </Link>
    </li>
  );
});

NavItemComponent.displayName = 'NavItemComponent';

const BottomNavigation = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { unreadCount } = useUnreadMessages();
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  // Memoized navigation items
  const navItems = useMemo<NavItem[]>(() => {
    if (user) {
      return [
        { path: "/", icon: Home, label: "בית" },
        { path: "/discover", icon: Compass, label: "גלו" },
        { path: "/matches", icon: Heart, label: "התאמות" },
        { path: "/messages", icon: MessageCircle, label: "הודעות", badge: unreadCount },
        { path: "/profile", icon: User, label: "פרופיל" },
      ];
    }
    return [
      { path: "/", icon: Home, label: "בית" },
      { path: "/members", icon: Users, label: "פרופילים" },
      { path: "/login", icon: LogIn, label: "התחברות" },
    ];
  }, [user, unreadCount]);

  return (
    <motion.nav 
      initial={shouldAnimate ? { y: 100 } : false}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 25, delay: 0.1 }}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 md:hidden",
        "bg-background/80 backdrop-blur-xl backdrop-saturate-150",
        "border-t border-border/50",
        "shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.1)]",
        "dark:shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.3)]"
      )}
      dir="rtl"
      aria-label="ניווט ראשי במובייל"
      role="navigation"
    >
      {/* Subtle top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" aria-hidden="true" />
      
      <ul className="flex justify-around items-center h-16 px-1 list-none m-0 p-0">
        {navItems.map((item) => (
          <NavItemComponent
            key={item.path}
            item={item}
            isActive={location.pathname === item.path}
            shouldAnimate={shouldAnimate}
          />
        ))}
      </ul>

      {/* Safe area padding for iOS */}
      <div className="h-safe-area-inset-bottom bg-background/80" aria-hidden="true" />
    </motion.nav>
  );
};

export default memo(BottomNavigation);
