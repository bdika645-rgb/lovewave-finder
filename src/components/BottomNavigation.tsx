import { Link, useLocation } from "react-router-dom";
import { Home, Users, Heart, MessageCircle, User, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { cn } from "@/lib/utils";

const BottomNavigation = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { unreadCount } = useUnreadMessages();

  // Navigation items for authenticated users
  const authNavItems = [
    { path: "/", icon: Home, label: "בית" },
    { path: "/members", icon: Users, label: "פרופילים" },
    { path: "/matches", icon: Heart, label: "התאמות" },
    { path: "/messages", icon: MessageCircle, label: "הודעות", badge: unreadCount },
    { path: "/profile", icon: User, label: "פרופיל" },
  ];

  // Navigation items for guests
  const guestNavItems = [
    { path: "/", icon: Home, label: "בית" },
    { path: "/members", icon: Users, label: "פרופילים" },
    { path: "/login", icon: LogIn, label: "התחברות" },
  ];

  const navItems = user ? authNavItems : guestNavItems;

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border sm:hidden"
      dir="rtl"
      aria-label="ניווט ראשי במובייל"
      role="navigation"
    >
      <ul className="flex justify-around items-center h-16 px-2 list-none m-0 p-0">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          const badgeValue = 'badge' in item && typeof item.badge === 'number' ? item.badge : 0;

          return (
            <li key={item.path} className="flex-1 h-full">
              <Link
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center h-full relative transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
                aria-label={badgeValue > 0 ? `${item.label} - ${badgeValue} הודעות חדשות` : item.label}
              >
                <div className="relative">
                  <Icon className={cn("w-5 h-5", isActive && "fill-primary/20")} aria-hidden="true" />
                  {badgeValue > 0 && (
                    <span 
                      className="absolute -top-1 -right-2 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1"
                      aria-hidden="true"
                    >
                      {badgeValue > 9 ? "9+" : badgeValue}
                    </span>
                  )}
                </div>
                <span className={cn(
                  "text-[10px] mt-1 font-medium",
                  isActive && "text-primary"
                )} aria-hidden="true">
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" aria-hidden="true" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNavigation;
