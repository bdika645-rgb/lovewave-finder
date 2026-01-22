import { Crown, Diamond, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import { useLandingContent } from "@/contexts/LandingContentContext";

const HeroSection = () => {
  const { content } = useLandingContent();
  const { hero } = content;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroBg} 
          alt="זוג מחויך ברקע רומנטי" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse-soft" aria-hidden="true" />
      <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-float" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-gold px-5 py-2 rounded-full mb-8">
            <Diamond className="w-4 h-4 text-primary" />
            <span className="text-primary font-medium text-sm tracking-wide">
              {hero.badge}
            </span>
          </div>
          
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
            {hero.titleLine1}<br />
            <span className="text-gradient">{hero.titleLine2}</span>
          </h1>
          
          <p className="font-body text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4">
            {hero.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register">
              <Button variant="hero" size="xl" className="gap-3">
                <Crown className="w-5 h-5" />
                {hero.ctaButton}
              </Button>
            </Link>
            <Link to="/members">
              <Button variant="hero-outline" size="xl">
                {hero.secondaryButton}
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 sm:mt-24 grid grid-cols-3 gap-3 sm:gap-6 max-w-3xl mx-auto animate-slide-up">
          <div className="glass-effect rounded-xl sm:rounded-2xl p-3 sm:p-6 card-hover border border-border">
            <Users className="w-5 h-5 sm:w-8 sm:h-8 text-primary mx-auto mb-2 sm:mb-3" />
            <p className="font-display text-2xl sm:text-4xl font-bold text-gradient">{hero.stat1Value}</p>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">{hero.stat1Label}</p>
          </div>
          <div className="glass-effect rounded-xl sm:rounded-2xl p-3 sm:p-6 card-hover border border-border">
            <Diamond className="w-5 h-5 sm:w-8 sm:h-8 text-primary mx-auto mb-2 sm:mb-3" />
            <p className="font-display text-2xl sm:text-4xl font-bold text-gradient">{hero.stat2Value}</p>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">{hero.stat2Label}</p>
          </div>
          <div className="glass-effect rounded-xl sm:rounded-2xl p-3 sm:p-6 card-hover border border-border">
            <Star className="w-5 h-5 sm:w-8 sm:h-8 text-primary mx-auto mb-2 sm:mb-3" />
            <p className="font-display text-2xl sm:text-4xl font-bold text-gradient">{hero.stat3Value}</p>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">{hero.stat3Label}</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float" aria-hidden="true">
        <div className="w-6 h-10 border-2 border-primary/40 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-primary/60 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
