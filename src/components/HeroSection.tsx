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
          {/* Badge - enhanced with shadow and pulse */}
          <div className="inline-flex items-center gap-2 glass-gold px-5 py-2.5 rounded-full mb-8 shadow-lg animate-pulse-soft border-shimmer">
            <Diamond className="w-4 h-4 text-primary" />
            <span className="text-primary font-semibold text-sm tracking-wide">
              {hero.badge}
            </span>
          </div>
          
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 sm:mb-8 leading-[1.05] tracking-tight text-shadow-premium">
            {hero.titleLine1}<br />
            <span className="text-gradient drop-shadow-lg">{hero.titleLine2}</span>
          </h1>
          
          <p className="font-body text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 sm:mb-14 leading-relaxed px-4 font-medium">
            {hero.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link to="/register">
              <Button variant="hero" size="xl" className="gap-3 shadow-lg">
                <Crown className="w-5 h-5" />
                {hero.ctaButton}
              </Button>
            </Link>
            <Link to="/members">
              <Button variant="hero-outline" size="xl" className="shadow-sm">
                {hero.secondaryButton}
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats - enhanced spacing and hover */}
        <div className="mt-20 sm:mt-32 grid grid-cols-3 gap-4 sm:gap-6 md:gap-10 max-w-4xl mx-auto animate-slide-up">
          <div className="glass-effect rounded-2xl sm:rounded-3xl p-4 sm:p-8 card-hover border border-white/20 dark:border-white/10 hover:border-primary/20 transition-colors">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4 icon-pulse">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <p className="font-display text-3xl sm:text-5xl font-bold text-gradient tracking-tight">{hero.stat1Value}</p>
            <p className="text-muted-foreground text-sm sm:text-base mt-2 font-medium">{hero.stat1Label}</p>
          </div>
          <div className="glass-effect rounded-2xl sm:rounded-3xl p-4 sm:p-8 card-hover border border-white/20 dark:border-white/10 hover:border-primary/20 transition-colors">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4 icon-pulse">
              <Diamond className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <p className="font-display text-3xl sm:text-5xl font-bold text-gradient tracking-tight">{hero.stat2Value}</p>
            <p className="text-muted-foreground text-sm sm:text-base mt-2 font-medium">{hero.stat2Label}</p>
          </div>
          <div className="glass-effect rounded-2xl sm:rounded-3xl p-4 sm:p-8 card-hover border border-white/20 dark:border-white/10 hover:border-primary/20 transition-colors">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4 icon-pulse">
              <Star className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <p className="font-display text-3xl sm:text-5xl font-bold text-gradient tracking-tight">{hero.stat3Value}</p>
            <p className="text-muted-foreground text-sm sm:text-base mt-2 font-medium">{hero.stat3Label}</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - enhanced visibility */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float" aria-hidden="true">
        <div className="w-6 h-10 border-2 border-primary/60 rounded-full flex justify-center pt-2 shadow-lg">
          <div className="w-1.5 h-2.5 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
