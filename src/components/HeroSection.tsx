import { Crown, Diamond, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroBg} 
          alt="Elegant couple" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-deep/30 via-transparent to-purple-deep/30" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-gold/5 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-purple-glow/10 rounded-full blur-3xl animate-float" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-gold px-5 py-2 rounded-full mb-8">
            <Diamond className="w-4 h-4 text-primary" />
            <span className="text-primary font-medium text-sm tracking-wide">
              חוויית היכרויות יוקרתית
            </span>
          </div>
          
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
            מפגשים<br />
            <span className="text-gradient">ברמה אחרת.</span>
          </h1>
          
          <p className="font-body text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4">
            הצטרפו לקהילה האקסקלוסיבית של רווקים ורווקות נבחרים. 
            כאן הקשרים נוצרים ברמה הכי גבוהה.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/members">
              <Button variant="hero" size="xl" className="gap-3">
                <Crown className="w-5 h-5" />
                הצטרפו לאליטה
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
        <div className="mt-16 sm:mt-24 grid grid-cols-3 gap-3 sm:gap-6 max-w-3xl mx-auto animate-slide-up">
          <div className="glass-effect rounded-xl sm:rounded-2xl p-3 sm:p-6 card-hover border border-gold/10">
            <Users className="w-5 h-5 sm:w-8 sm:h-8 text-primary mx-auto mb-2 sm:mb-3" />
            <p className="font-display text-2xl sm:text-4xl font-bold text-gradient">15K+</p>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">חברים נבחרים</p>
          </div>
          <div className="glass-effect rounded-xl sm:rounded-2xl p-3 sm:p-6 card-hover border border-gold/10">
            <Diamond className="w-5 h-5 sm:w-8 sm:h-8 text-primary mx-auto mb-2 sm:mb-3" />
            <p className="font-display text-2xl sm:text-4xl font-bold text-gradient">8K+</p>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">זוגות מאושרים</p>
          </div>
          <div className="glass-effect rounded-xl sm:rounded-2xl p-3 sm:p-6 card-hover border border-gold/10">
            <Star className="w-5 h-5 sm:w-8 sm:h-8 text-primary mx-auto mb-2 sm:mb-3" />
            <p className="font-display text-2xl sm:text-4xl font-bold text-gradient">98%</p>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">שביעות רצון</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 border-2 border-primary/40 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-primary/60 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
