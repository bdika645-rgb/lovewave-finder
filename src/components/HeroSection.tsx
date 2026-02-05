import { Crown, Diamond, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import { useLandingContent } from "@/contexts/LandingContentContext";
import HeroSearch from "@/components/HeroSearch";
import { InlineEditable, EditableSection } from "@/components/VisualEditor";
import { motion } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

const scaleVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 150,
      damping: 15,
    },
  },
};

const statCardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
      delay: 0.6 + i * 0.1,
    },
  }),
};

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
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <img 
            src={heroBg} 
            alt="זוג מחויך ברקע רומנטי" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
        </motion.div>

        {/* Decorative Glow Elements - Animated */}
        <motion.div 
          className="absolute top-1/4 left-10 w-32 h-32 bg-primary/10 rounded-full blur-[60px]" 
          aria-hidden="true"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-[80px]" 
          aria-hidden="true"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div 
              variants={scaleVariants}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-8"
            >
              <Diamond className="w-4 h-4 text-primary" />
              <InlineEditable
                value={hero.badge}
                onChange={(v) => updateHero("badge", v)}
                className="text-primary font-semibold text-sm"
                as="span"
              />
            </motion.div>
            
            {/* Hero Title */}
            <motion.h1 
              variants={itemVariants}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight tracking-tight"
            >
              <InlineEditable
                value={hero.titleLine1}
                onChange={(v) => updateHero("titleLine1", v)}
                as="span"
              />
              <br />
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <InlineEditable
                  value={hero.titleLine2}
                  onChange={(v) => updateHero("titleLine2", v)}
                  className="text-primary"
                  as="span"
                />
              </motion.span>
            </motion.h1>
            
            <motion.div variants={itemVariants}>
              <InlineEditable
                value={hero.description}
                onChange={(v) => updateHero("description", v)}
                className="font-body text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed px-4 block"
                as="p"
                multiline
              />
            </motion.div>

            {/* Quick Profile Search */}
            <motion.div variants={itemVariants}>
              <HeroSearch />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
            >
              <Link to="/register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button variant="hero" size="lg" className="gap-2 shadow-lg">
                    <Crown className="w-4 h-4" />
                    <InlineEditable
                      value={hero.ctaButton}
                      onChange={(v) => updateHero("ctaButton", v)}
                      as="span"
                    />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/members">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button variant="outline" size="lg">
                    <InlineEditable
                      value={hero.secondaryButton}
                      onChange={(v) => updateHero("secondaryButton", v)}
                      as="span"
                    />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats Cards - Enhanced with staggered animation */}
          <div className="mt-16 sm:mt-24 grid grid-cols-3 gap-2 sm:gap-6 max-w-4xl mx-auto">
            {/* Stat Card 1 */}
            <motion.div 
              custom={0}
              variants={statCardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-card/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-8 border border-border/50 shadow-xl hover:shadow-2xl transition-shadow duration-300 group"
            >
              <motion.div 
                className="w-10 h-10 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl gradient-primary flex items-center justify-center mx-auto mb-2 sm:mb-5 shadow-lg"
                whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
              >
                <Users className="w-5 h-5 sm:w-8 sm:h-8 text-primary-foreground" />
              </motion.div>
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
            </motion.div>

            {/* Stat Card 2 - Featured/Highlighted */}
            <motion.div 
              custom={1}
              variants={statCardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-card/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-8 border-2 border-primary/30 shadow-xl hover:shadow-2xl transition-shadow duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
              <div className="relative">
                <motion.div 
                  className="w-10 h-10 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl gradient-primary flex items-center justify-center mx-auto mb-2 sm:mb-5 shadow-lg ring-2 ring-primary/20 ring-offset-2 ring-offset-card"
                  whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                >
                  <Diamond className="w-5 h-5 sm:w-8 sm:h-8 text-primary-foreground" />
                </motion.div>
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
            </motion.div>

            {/* Stat Card 3 */}
            <motion.div 
              custom={2}
              variants={statCardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-card/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-8 border border-border/50 shadow-xl hover:shadow-2xl transition-shadow duration-300 group"
            >
              <motion.div 
                className="w-10 h-10 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl gradient-primary flex items-center justify-center mx-auto mb-2 sm:mb-5 shadow-lg"
                whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
              >
                <Star className="w-5 h-5 sm:w-8 sm:h-8 text-primary-foreground" />
              </motion.div>
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
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator - Animated */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2" 
          aria-hidden="true"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <motion.div 
            className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div 
              className="w-1.5 h-2.5 bg-muted-foreground/50 rounded-full"
              animate={{ y: [0, 8, 0], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </section>
    </EditableSection>
  );
};

export default HeroSection;
