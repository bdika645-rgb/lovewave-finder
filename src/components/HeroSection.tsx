import { Crown, Diamond, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import { useLandingContent } from "@/contexts/LandingContentContext";
import AnimatedCounter from "@/components/AnimatedCounter";

// Parse stat value to extract number
const parseStatValue = (value: string): { num: number; suffix: string } => {
  const match = value.match(/^([\d,]+)([+%K]*)$/);
  if (match) {
    const num = parseInt(match[1].replace(/,/g, ''), 10);
    return { num, suffix: match[2] || '' };
  }
  return { num: 0, suffix: '' };
};

const HeroSection = () => {
  const { content } = useLandingContent();
  const { hero } = content;

  const stat1 = parseStatValue(hero.stat1Value);
  const stat2 = parseStatValue(hero.stat2Value);
  const stat3 = parseStatValue(hero.stat3Value);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroBg} 
          alt="זוג מחויך ברקע רומנטי" 
          className="w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/15 via-transparent to-primary/15" />
      </div>

      {/* Floating Glass Panels - Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Large floating panel - top left */}
        <div 
          className="absolute -top-20 -left-20 w-96 h-96 glass-panel rounded-[3rem] opacity-30 floating-panel rotate-12"
          style={{ animationDelay: '0s' }}
        />
        {/* Medium panel - top right */}
        <div 
          className="absolute top-1/4 -right-16 w-72 h-72 glass-panel rounded-[2rem] opacity-25 floating-panel -rotate-6"
          style={{ animationDelay: '2s' }}
        />
        {/* Small panel - bottom left */}
        <div 
          className="absolute bottom-1/3 -left-10 w-48 h-48 glass-panel rounded-2xl opacity-20 floating-panel rotate-3"
          style={{ animationDelay: '4s' }}
        />
      </div>

      {/* Decorative Glow Elements */}
      <div className="absolute top-1/4 left-10 w-40 h-40 bg-primary/10 rounded-full blur-[80px] animate-pulse-soft" aria-hidden="true" />
      <div className="absolute bottom-1/4 right-10 w-52 h-52 bg-secondary/15 rounded-full blur-[100px] animate-float" aria-hidden="true" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="animate-fade-in">
          {/* Badge - enhanced glassmorphism */}
          <div className="inline-flex items-center gap-2 glass-gold px-6 py-3 rounded-full mb-10 shadow-lg border-shimmer bg-noise">
            <Diamond className="w-5 h-5 text-primary animate-pulse-soft" />
            <span className="text-primary font-bold text-sm tracking-wide">
              {hero.badge}
            </span>
          </div>
          
          {/* Hero Title - Enhanced typography with shimmer */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-foreground mb-8 leading-[1.02] tracking-tight text-shadow-premium">
            {hero.titleLine1}
            <br />
            <span className="text-gradient-shimmer drop-shadow-lg">
              {hero.titleLine2}
            </span>
          </h1>
          
          <p className="font-body text-lg sm:text-xl md:text-2xl text-muted-foreground/90 max-w-2xl mx-auto mb-12 leading-relaxed px-4 font-medium">
            {hero.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link to="/register">
              <Button variant="hero" size="xl" className="gap-3 shadow-xl hover:shadow-2xl transition-all btn-lift">
                <Crown className="w-5 h-5" />
                {hero.ctaButton}
              </Button>
            </Link>
            <Link to="/members">
              <Button variant="hero-outline" size="xl" className="shadow-md backdrop-blur-sm">
                {hero.secondaryButton}
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats - Enhanced Glass Cards with Animated Counters */}
        <div className="mt-24 sm:mt-36 grid grid-cols-3 gap-4 sm:gap-6 md:gap-10 max-w-5xl mx-auto animate-slide-up">
          {/* Stat Card 1 */}
          <div className="glass-effect rounded-2xl sm:rounded-3xl p-5 sm:p-10 card-glow border border-white/30 dark:border-white/10 hover:border-primary/30 transition-all duration-500 tilt-card bg-noise group">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
              <Users className="w-7 h-7 sm:w-10 sm:h-10 text-primary-foreground" />
            </div>
            <p className="font-display text-4xl sm:text-6xl font-bold text-gradient-shimmer tracking-tight">
              <AnimatedCounter end={stat1.num} suffix={stat1.suffix} duration={2500} />
            </p>
            <p className="text-muted-foreground text-sm sm:text-base mt-3 font-semibold">{hero.stat1Label}</p>
          </div>

          {/* Stat Card 2 */}
          <div className="glass-effect rounded-2xl sm:rounded-3xl p-5 sm:p-10 card-glow border border-white/30 dark:border-white/10 hover:border-primary/30 transition-all duration-500 tilt-card bg-noise group">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
              <Diamond className="w-7 h-7 sm:w-10 sm:h-10 text-primary-foreground" />
            </div>
            <p className="font-display text-4xl sm:text-6xl font-bold text-gradient-shimmer tracking-tight">
              <AnimatedCounter end={stat2.num} suffix={stat2.suffix} duration={2500} delay={200} />
            </p>
            <p className="text-muted-foreground text-sm sm:text-base mt-3 font-semibold">{hero.stat2Label}</p>
          </div>

          {/* Stat Card 3 */}
          <div className="glass-effect rounded-2xl sm:rounded-3xl p-5 sm:p-10 card-glow border border-white/30 dark:border-white/10 hover:border-primary/30 transition-all duration-500 tilt-card bg-noise group">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
              <Star className="w-7 h-7 sm:w-10 sm:h-10 text-primary-foreground" />
            </div>
            <p className="font-display text-4xl sm:text-6xl font-bold text-gradient-shimmer tracking-tight">
              <AnimatedCounter end={stat3.num} suffix={stat3.suffix} duration={2500} delay={400} />
            </p>
            <p className="text-muted-foreground text-sm sm:text-base mt-3 font-semibold">{hero.stat3Label}</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - enhanced */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float" aria-hidden="true">
        <div className="w-7 h-12 border-2 border-primary/50 rounded-full flex justify-center pt-2 backdrop-blur-sm bg-background/20">
          <div className="w-2 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
