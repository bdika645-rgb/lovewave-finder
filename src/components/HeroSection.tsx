import { Crown, Diamond, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import { useLandingContent } from "@/contexts/LandingContentContext";
import HeroSearch from "@/components/HeroSearch";
import { InlineEditable, EditableSection } from "@/components/VisualEditor";

const HeroSection = () => {
  const { content, updateContent } = useLandingContent();
  const { hero } = content;

  const updateHero = (key: keyof typeof hero, value: string) => {
    updateContent("hero", { [key]: value });
  };

  return (
    <EditableSection sectionName="Hero">
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
          <div 
            className="absolute -top-20 -left-20 w-96 h-96 glass-panel rounded-[3rem] opacity-30 floating-panel rotate-12"
            style={{ animationDelay: '0s' }}
          />
          <div 
            className="absolute top-1/4 -right-16 w-72 h-72 glass-panel rounded-[2rem] opacity-25 floating-panel -rotate-6"
            style={{ animationDelay: '2s' }}
          />
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
              <InlineEditable
                value={hero.badge}
                onChange={(v) => updateHero("badge", v)}
                className="text-primary font-bold text-sm tracking-wide"
                as="span"
              />
            </div>
            
            {/* Hero Title - Enhanced typography with shimmer */}
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-foreground mb-8 leading-[1.02] tracking-tight text-shadow-premium">
              <InlineEditable
                value={hero.titleLine1}
                onChange={(v) => updateHero("titleLine1", v)}
                as="span"
              />
              <br />
              <InlineEditable
                value={hero.titleLine2}
                onChange={(v) => updateHero("titleLine2", v)}
                className="text-gradient-shimmer drop-shadow-lg"
                as="span"
              />
            </h1>
            
            <InlineEditable
              value={hero.description}
              onChange={(v) => updateHero("description", v)}
              className="font-body text-lg sm:text-xl md:text-2xl text-muted-foreground/90 max-w-2xl mx-auto mb-12 leading-relaxed px-4 font-medium block"
              as="p"
              multiline
            />

            {/* Quick Profile Search */}
            <HeroSearch />

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mt-8">
              <Link to="/register">
                <Button variant="hero" size="xl" className="gap-3 shadow-xl hover:shadow-2xl transition-all btn-lift">
                  <Crown className="w-5 h-5" />
                  <InlineEditable
                    value={hero.ctaButton}
                    onChange={(v) => updateHero("ctaButton", v)}
                    as="span"
                  />
                </Button>
              </Link>
              <Link to="/members">
                <Button variant="hero-outline" size="xl" className="shadow-md backdrop-blur-sm">
                  <InlineEditable
                    value={hero.secondaryButton}
                    onChange={(v) => updateHero("secondaryButton", v)}
                    as="span"
                  />
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
                <InlineEditable
                  value={hero.stat1Value}
                  onChange={(v) => updateHero("stat1Value", v)}
                  as="span"
                />
              </p>
              <InlineEditable
                value={hero.stat1Label}
                onChange={(v) => updateHero("stat1Label", v)}
                className="text-muted-foreground text-sm sm:text-base mt-3 font-semibold block"
                as="p"
              />
            </div>

            {/* Stat Card 2 */}
            <div className="glass-effect rounded-2xl sm:rounded-3xl p-5 sm:p-10 card-glow border border-white/30 dark:border-white/10 hover:border-primary/30 transition-all duration-500 tilt-card bg-noise group">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                <Diamond className="w-7 h-7 sm:w-10 sm:h-10 text-primary-foreground" />
              </div>
              <p className="font-display text-4xl sm:text-6xl font-bold text-gradient-shimmer tracking-tight">
                <InlineEditable
                  value={hero.stat2Value}
                  onChange={(v) => updateHero("stat2Value", v)}
                  as="span"
                />
              </p>
              <InlineEditable
                value={hero.stat2Label}
                onChange={(v) => updateHero("stat2Label", v)}
                className="text-muted-foreground text-sm sm:text-base mt-3 font-semibold block"
                as="p"
              />
            </div>

            {/* Stat Card 3 */}
            <div className="glass-effect rounded-2xl sm:rounded-3xl p-5 sm:p-10 card-glow border border-white/30 dark:border-white/10 hover:border-primary/30 transition-all duration-500 tilt-card bg-noise group">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                <Star className="w-7 h-7 sm:w-10 sm:h-10 text-primary-foreground" />
              </div>
              <p className="font-display text-4xl sm:text-6xl font-bold text-gradient-shimmer tracking-tight">
                <InlineEditable
                  value={hero.stat3Value}
                  onChange={(v) => updateHero("stat3Value", v)}
                  as="span"
                />
              </p>
              <InlineEditable
                value={hero.stat3Label}
                onChange={(v) => updateHero("stat3Label", v)}
                className="text-muted-foreground text-sm sm:text-base mt-3 font-semibold block"
                as="p"
              />
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
    </EditableSection>
  );
};

export default HeroSection;
