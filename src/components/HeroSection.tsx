import { Heart, MessageCircle, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroBg} 
          alt="Romantic couple at sunset" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Heart className="w-8 h-8 text-primary fill-primary animate-pulse-soft" />
            <span className="text-primary-foreground/80 font-body text-lg tracking-wide">
              מצא את האהבה שלך
            </span>
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground mb-6 leading-tight">
            התחברו.<br />
            <span className="text-gradient">התאהבו.</span>
          </h1>
          
          <p className="font-body text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            הצטרפו לקהילה הגדולה ביותר של רווקים ורווקות בישראל. 
            מצאו את ההתאמה המושלמת שלכם היום.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/members">
              <Button variant="hero" size="xl">
                <Sparkles className="w-5 h-5" />
                התחילו עכשיו
              </Button>
            </Link>
            <Link to="/members">
              <Button variant="hero-outline" size="xl">
                גלו פרופילים
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-slide-up">
          <div className="glass-effect rounded-2xl p-6">
            <Users className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-display text-3xl font-bold text-foreground">50K+</p>
            <p className="text-muted-foreground text-sm">משתמשים פעילים</p>
          </div>
          <div className="glass-effect rounded-2xl p-6">
            <Heart className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-display text-3xl font-bold text-foreground">12K+</p>
            <p className="text-muted-foreground text-sm">התאמות מוצלחות</p>
          </div>
          <div className="glass-effect rounded-2xl p-6">
            <MessageCircle className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-display text-3xl font-bold text-foreground">1M+</p>
            <p className="text-muted-foreground text-sm">הודעות ביום</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 border-2 border-primary-foreground/40 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-primary-foreground/60 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
