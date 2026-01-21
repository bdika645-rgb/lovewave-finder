import { Link, useLocation } from "react-router-dom";
import { Heart, Menu, X, User, MessageCircle, Search, LogOut, Sparkles, Users, Bell, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import NotificationBell from "@/components/NotificationBell";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { user, signOut } = useAuth();
  const { unreadCount } = useUnreadMessages();

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
            >
              <Sparkles className="w-4 h-4" />
              Swipe
            </Link>
            <Link 
              to="/members" 
              className={`font-body font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                isHome && !isScrolled ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-muted-foreground"
              } ${location.pathname === '/members' ? 'text-primary' : ''}`}
            >
              <Search className="w-4 h-4" />
              חפש
            </Link>
            <Link 
              to="/matches" 
              className={`font-body font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                isHome && !isScrolled ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-muted-foreground"
              } ${location.pathname === '/matches' ? 'text-primary' : ''}`}
            >
              <Heart className="w-4 h-4" />
              התאמות
            </Link>
            <Link 
              to="/messages" 
              className={`font-body font-medium transition-colors hover:text-primary flex items-center gap-1 relative ${
                isHome && !isScrolled ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-muted-foreground"
              } ${location.pathname === '/messages' ? 'text-primary' : ''}`}
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
              to="/profile" 
              className={`font-body font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                isHome && !isScrolled ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-muted-foreground"
              } ${location.pathname === '/profile' ? 'text-primary' : ''}`}
            >
              <User className="w-4 h-4" />
              פרופיל
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3" role="group" aria-label="פעולות משתמש">
            <ThemeToggle />
            {user ? (
              <>
                <Link to="/who-liked-me" aria-label="מי עשה לי לייק">
                  <Button 
                    variant={isHome && !isScrolled ? "hero-outline" : "ghost"} 
                    size="icon"
                    className="relative"
                    aria-label="מי עשה לי לייק"
                  >
                    <Bell className="w-5 h-5" aria-hidden="true" />
                  </Button>
                </Link>
                <Button 
                  variant={isHome && !isScrolled ? "hero-outline" : "ghost"} 
                  onClick={handleLogout}
                  aria-label="התנתק מהחשבון"
                >
                  <LogOut className="w-4 h-4 ml-1" aria-hidden="true" />
                  התנתק
                </Button>
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
              className="p-2 -mr-2"
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
          <div 
            id="mobile-menu" 
            className="md:hidden bg-card rounded-2xl p-6 mb-4 animate-slide-up shadow-elevated border border-border"
            role="menu"
          >
            <div className="flex flex-col gap-3">
              <Link 
                to="/discover" 
                className="font-body text-foreground py-3 px-4 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
              >
                <Sparkles className="w-5 h-5 text-primary" />
                Swipe
              </Link>
              <Link 
                to="/members" 
                className="font-body text-foreground py-3 px-4 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
              >
                <Search className="w-5 h-5 text-primary" />
                חפש פרופילים
              </Link>
              <Link 
                to="/matches" 
                className="font-body text-foreground py-3 px-4 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
              >
                <Heart className="w-5 h-5 text-primary" />
                התאמות
              </Link>
              <Link 
                to="/messages" 
                className="font-body text-foreground py-3 px-4 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
              >
                <MessageCircle className="w-5 h-5 text-primary" />
                הודעות
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="mr-auto">
                    {unreadCount}
                  </Badge>
                )}
              </Link>
              <Link 
                to="/who-liked-me" 
                className="font-body text-foreground py-3 px-4 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
              >
                <Heart className="w-5 h-5 text-primary fill-primary" />
                מי לייק אותי
              </Link>
              <Link 
                to="/who-viewed-me" 
                className="font-body text-foreground py-3 px-4 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
              >
                <Eye className="w-5 h-5 text-primary" />
                מי צפה בי
              </Link>
              <Link 
                to="/profile" 
                className="font-body text-foreground py-3 px-4 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
              >
                <User className="w-5 h-5 text-primary" />
                הפרופיל שלי
              </Link>
              
              <hr className="border-border my-2" />
              
              {user ? (
                <Button variant="outline" className="w-full justify-center" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 ml-2" />
                  התנתק
                </Button>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/login">
                    <Button variant="outline" className="w-full">התחברות</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="hero" className="w-full">הרשמה</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
