import { Link, useLocation } from "react-router-dom";
import { Heart, Menu, X, User, MessageCircle, Search, LogOut, Sparkles, Bell, Eye, Settings, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { user, signOut } = useAuth();
  const { unreadCount } = useUnreadMessages();
  const { profile } = useCurrentProfile();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Add scroll listener for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    setIsOpen(false);
  };

  const navBgClass = isHome && !isScrolled && !isOpen
    ? "bg-transparent" 
    : "glass-effect shadow-soft";

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBgClass}`}
      role="navigation"
      aria-label="ניווט ראשי"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" aria-label="Spark - דף הבית">
            <Heart className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
              isHome && !isScrolled ? "text-primary-foreground" : "text-primary"
            } fill-current group-hover:scale-110 transition-transform`} aria-hidden="true" />
            <span className={`font-display text-xl sm:text-2xl font-bold ${
              isHome && !isScrolled ? "text-primary-foreground" : "text-foreground"
            }`}>
              Spark
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link 
              to="/discover" 
              className={`font-body font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                isHome && !isScrolled ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-muted-foreground"
              } ${location.pathname === '/discover' ? 'text-primary' : ''}`}
              aria-current={location.pathname === "/discover" ? "page" : undefined}
            >
              <Sparkles className="w-4 h-4" />
              Swipe
            </Link>
            <Link 
              to="/members" 
              className={`font-body font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                isHome && !isScrolled ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-muted-foreground"
              } ${location.pathname === '/members' ? 'text-primary' : ''}`}
              aria-current={location.pathname === "/members" ? "page" : undefined}
            >
              <Search className="w-4 h-4" />
              חפש
            </Link>
            <Link 
              to="/matches" 
              className={`font-body font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                isHome && !isScrolled ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-muted-foreground"
              } ${location.pathname === '/matches' ? 'text-primary' : ''}`}
              aria-current={location.pathname === "/matches" ? "page" : undefined}
            >
              <Heart className="w-4 h-4" />
              התאמות
            </Link>
            <Link 
              to="/messages" 
              className={`font-body font-medium transition-colors hover:text-primary flex items-center gap-1 relative ${
                isHome && !isScrolled ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-muted-foreground"
              } ${location.pathname === '/messages' ? 'text-primary' : ''}`}
              aria-current={location.pathname === "/messages" ? "page" : undefined}
            >
              <MessageCircle className="w-4 h-4" />
              הודעות
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 min-w-5 px-1 flex items-center justify-center text-xs"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}
            </Link>
            <Link 
              to="/who-viewed-me" 
              className={`font-body font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                isHome && !isScrolled ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-muted-foreground"
              } ${location.pathname === '/who-viewed-me' ? 'text-primary' : ''}`}
              aria-current={location.pathname === "/who-viewed-me" ? "page" : undefined}
            >
              <Eye className="w-4 h-4" />
              צפו בי
            </Link>
            <Link 
              to="/who-liked-me" 
              className={`font-body font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                isHome && !isScrolled ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-muted-foreground"
              } ${location.pathname === '/who-liked-me' ? 'text-primary' : ''}`}
              aria-current={location.pathname === "/who-liked-me" ? "page" : undefined}
            >
              <Heart className="w-4 h-4 fill-current" />
              לייקים
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3" role="group" aria-label="פעולות משתמש">
            <ThemeToggle />
            {user ? (
              <>
                {/* Profile Dropdown */}
                <DropdownMenu dir="rtl">
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant={isHome && !isScrolled ? "hero-outline" : "outline"} 
                      className="gap-2 focus-ring"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.name} />
                        <AvatarFallback className="text-xs">
                          {profile?.name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden lg:inline">{profile?.name || "הפרופיל שלי"}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                        <User className="w-4 h-4" />
                        הפרופיל שלי
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/who-liked-me" className="flex items-center gap-2 cursor-pointer">
                        <Heart className="w-4 h-4" />
                        מי לייק אותי
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/who-viewed-me" className="flex items-center gap-2 cursor-pointer">
                        <Eye className="w-4 h-4" />
                        מי צפה בי
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
                        <Settings className="w-4 h-4" />
                        הגדרות
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="w-4 h-4" />
                      התנתק
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant={isHome && !isScrolled ? "hero-outline" : "ghost"}>
                    התחברות
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="hero">
                    הרשמה
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button 
              onClick={() => setIsOpen(!isOpen)}
               className="p-2 -mr-2 rounded-md focus-ring"
              aria-label={isOpen ? "סגור תפריט" : "פתח תפריט"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? (
                <X className={`w-6 h-6 ${isHome && !isScrolled && !isOpen ? "text-primary-foreground" : "text-foreground"}`} aria-hidden="true" />
              ) : (
                <Menu className={`w-6 h-6 ${isHome && !isScrolled ? "text-primary-foreground" : "text-foreground"}`} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
           <nav 
            id="mobile-menu" 
            className="md:hidden bg-card rounded-2xl p-6 mb-4 animate-slide-up shadow-elevated border border-border"
             aria-label="ניווט במובייל"
          >
             <ul className="flex flex-col gap-3">
               <li>
              <Link 
                to="/discover" 
                className="font-body text-foreground py-3 px-4 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
                 aria-current={location.pathname === "/discover" ? "page" : undefined}
              >
                <Sparkles className="w-5 h-5 text-primary" />
                Swipe
              </Link>
               </li>
               <li>
              <Link 
                to="/members" 
                className="font-body text-foreground py-3 px-4 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
                 aria-current={location.pathname === "/members" ? "page" : undefined}
              >
                <Search className="w-5 h-5 text-primary" />
                חפש פרופילים
              </Link>
               </li>
               <li>
              <Link 
                to="/matches" 
                className="font-body text-foreground py-3 px-4 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
                 aria-current={location.pathname === "/matches" ? "page" : undefined}
              >
                <Heart className="w-5 h-5 text-primary" />
                התאמות
              </Link>
               </li>
               <li>
              <Link 
                to="/messages" 
                className="font-body text-foreground py-3 px-4 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
                 aria-current={location.pathname === "/messages" ? "page" : undefined}
              >
                <MessageCircle className="w-5 h-5 text-primary" />
                הודעות
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="mr-auto">
                    {unreadCount}
                  </Badge>
                )}
              </Link>
               </li>
               <li>
              <Link 
                to="/who-liked-me" 
                className="font-body text-foreground py-3 px-4 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
                 aria-current={location.pathname === "/who-liked-me" ? "page" : undefined}
              >
                <Heart className="w-5 h-5 text-primary fill-primary" />
                מי לייק אותי
              </Link>
               </li>
               <li>
              <Link 
                to="/who-viewed-me" 
                className="font-body text-foreground py-3 px-4 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
                 aria-current={location.pathname === "/who-viewed-me" ? "page" : undefined}
              >
                <Eye className="w-5 h-5 text-primary" />
                מי צפה בי
              </Link>
               </li>
               <li>
              <Link 
                to="/profile" 
                className="font-body text-foreground py-3 px-4 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
                 aria-current={location.pathname === "/profile" ? "page" : undefined}
              >
                <User className="w-5 h-5 text-primary" />
                הפרופיל שלי
              </Link>
               </li>
              
              <li role="separator" aria-hidden="true" className="my-2 border-t border-border" />
              
              {user ? (
                 <li>
                   <Button variant="outline" className="w-full justify-center" onClick={handleLogout}>
                     <LogOut className="w-4 h-4 ml-2" />
                     התנתק
                   </Button>
                 </li>
              ) : (
                 <li>
                   <div className="flex flex-col gap-3">
                     <Link to="/login">
                       <Button variant="outline" className="w-full">התחברות</Button>
                     </Link>
                     <Link to="/register">
                       <Button variant="hero" className="w-full">הרשמה</Button>
                     </Link>
                   </div>
                 </li>
              )}
             </ul>
           </nav>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
