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
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
        </div>

        {/* Decorative Glow Elements - simplified */}
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-primary/10 rounded-full blur-[60px]" aria-hidden="true" />
        <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-[80px]" aria-hidden="true" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-8">
              <Diamond className="w-4 h-4 text-primary" />
              <InlineEditable
                value={hero.badge}
                onChange={(v) => updateHero("badge", v)}
                className="text-primary font-semibold text-sm"
                as="span"
              />
            </div>
            
            {/* Hero Title */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight tracking-tight">
              <InlineEditable
                value={hero.titleLine1}
                onChange={(v) => updateHero("titleLine1", v)}
                as="span"
              />
              <br />
              <InlineEditable
                value={hero.titleLine2}
                onChange={(v) => updateHero("titleLine2", v)}
                className="text-primary"
                as="span"
              />
            </h1>
            
            <InlineEditable
              value={hero.description}
              onChange={(v) => updateHero("description", v)}
              className="font-body text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed px-4 block"
              as="p"
              multiline
            />

            {/* Quick Profile Search */}
            <HeroSearch />

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <Link to="/register">
                <Button variant="hero" size="lg" className="gap-2 shadow-lg">
                  <Crown className="w-4 h-4" />
                  <InlineEditable
                    value={hero.ctaButton}
                    onChange={(v) => updateHero("ctaButton", v)}
                    as="span"
                  />
                </Button>
              </Link>
              <Link to="/members">
                <Button variant="outline" size="lg">
                  <InlineEditable
                    value={hero.secondaryButton}
                    onChange={(v) => updateHero("secondaryButton", v)}
                    as="span"
                  />
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards - Enhanced for mobile */}
          <div className="mt-16 sm:mt-24 grid grid-cols-3 gap-2 sm:gap-6 max-w-4xl mx-auto animate-slide-up">
            {/* Stat Card 1 */}
            <div className="bg-card/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-8 border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 group hover:scale-[1.02] hover:-translate-y-1">
              <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl gradient-primary flex items-center justify-center mx-auto mb-2 sm:mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="w-5 h-5 sm:w-8 sm:h-8 text-primary-foreground" />
              </div>
              <p className="font-display text-xl sm:text-4xl font-bold text-primary tracking-tight leading-none">
                <InlineEditable
                  value={hero.stat1Value}
                  onChange={(v) => updateHero("stat1Value", v)}
                  as="span"
                />
              </p>
              <InlineEditable
                value={hero.stat1Label}
                onChange={(v) => updateHero("stat1Label", v)}
                className="text-muted-foreground text-[10px] sm:text-sm mt-1 sm:mt-2 font-semibold block leading-tight"
                as="p"
              />
            </div>

            {/* Stat Card 2 - Featured/Highlighted */}
            <div className="bg-card/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-8 border-2 border-primary/30 shadow-xl hover:shadow-2xl transition-all duration-300 group hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
              <div className="relative">
                <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl gradient-primary flex items-center justify-center mx-auto mb-2 sm:mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300 ring-2 ring-primary/20 ring-offset-2 ring-offset-card">
                  <Diamond className="w-5 h-5 sm:w-8 sm:h-8 text-primary-foreground" />
                </div>
                <p className="font-display text-xl sm:text-4xl font-bold text-primary tracking-tight leading-none">
                  <InlineEditable
                    value={hero.stat2Value}
                    onChange={(v) => updateHero("stat2Value", v)}
                    as="span"
                  />
                </p>
                <InlineEditable
                  value={hero.stat2Label}
                  onChange={(v) => updateHero("stat2Label", v)}
                  className="text-muted-foreground text-[10px] sm:text-sm mt-1 sm:mt-2 font-semibold block leading-tight"
                  as="p"
                />
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-card/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-8 border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 group hover:scale-[1.02] hover:-translate-y-1">
              <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl gradient-primary flex items-center justify-center mx-auto mb-2 sm:mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Star className="w-5 h-5 sm:w-8 sm:h-8 text-primary-foreground" />
              </div>
              <p className="font-display text-xl sm:text-4xl font-bold text-primary tracking-tight leading-none">
                <InlineEditable
                  value={hero.stat3Value}
                  onChange={(v) => updateHero("stat3Value", v)}
                  as="span"
                />
              </p>
              <InlineEditable
                value={hero.stat3Label}
                onChange={(v) => updateHero("stat3Label", v)}
                className="text-muted-foreground text-[10px] sm:text-sm mt-1 sm:mt-2 font-semibold block leading-tight"
                as="p"
              />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2" aria-hidden="true">
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-2.5 bg-muted-foreground/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>
    </EditableSection>
  );
};

export default HeroSection;
