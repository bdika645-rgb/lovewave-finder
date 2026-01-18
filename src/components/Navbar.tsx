import { Link, useLocation } from "react-router-dom";
import { Heart, Menu, X, User, MessageCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isHome ? "bg-transparent" : "glass-effect shadow-soft"
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Heart className={`w-8 h-8 transition-colors ${
              isHome ? "text-primary-foreground" : "text-primary"
            } fill-current group-hover:scale-110 transition-transform`} />
            <span className={`font-display text-2xl font-bold ${
              isHome ? "text-primary-foreground" : "text-foreground"
            }`}>
              Spark
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/members" 
              className={`font-body font-medium transition-colors hover:text-primary ${
                isHome ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              <Search className="w-4 h-4 inline-block ml-1" />
              גלה
            </Link>
            <Link 
              to="/messages" 
              className={`font-body font-medium transition-colors hover:text-primary ${
                isHome ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              <MessageCircle className="w-4 h-4 inline-block ml-1" />
              הודעות
            </Link>
            <Link 
              to="/profile" 
              className={`font-body font-medium transition-colors hover:text-primary ${
                isHome ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              <User className="w-4 h-4 inline-block ml-1" />
              פרופיל
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant={isHome ? "hero-outline" : "ghost"}>
                התחברות
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="hero">
                הרשמה
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
          >
            {isOpen ? (
              <X className={`w-6 h-6 ${isHome ? "text-primary-foreground" : "text-foreground"}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isHome ? "text-primary-foreground" : "text-foreground"}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden glass-effect rounded-2xl p-6 mb-4 animate-slide-up">
            <div className="flex flex-col gap-4">
              <Link to="/members" className="font-body text-foreground py-2">
                גלה פרופילים
              </Link>
              <Link to="/messages" className="font-body text-foreground py-2">
                הודעות
              </Link>
              <Link to="/profile" className="font-body text-foreground py-2">
                הפרופיל שלי
              </Link>
              <hr className="border-border" />
              <Link to="/login">
                <Button variant="outline" className="w-full">התחברות</Button>
              </Link>
              <Link to="/register">
                <Button variant="hero" className="w-full">הרשמה</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
