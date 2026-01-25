import { successStories } from "@/data/members";
import { useLandingContent } from "@/contexts/LandingContentContext";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const SuccessStoriesSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { content } = useLandingContent();
  const { successStories: storiesContent } = content;

  // Show 2 stories at a time on desktop, 1 on mobile
  const storiesPerPage = 2;
  const totalPages = Math.ceil(successStories.length / storiesPerPage);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  // Autoplay
  useEffect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const getCurrentStories = () => {
    const start = currentIndex * storiesPerPage;
    return successStories.slice(start, start + storiesPerPage);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <section id="success-stories" className="py-24 bg-muted/30 overflow-hidden" aria-labelledby="success-stories-heading">
      <div className="container mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <h2 id="success-stories-heading" className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            {storiesContent.title} <span className="text-gradient">{storiesContent.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {storiesContent.description}
          </p>
        </AnimatedSection>

        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          role="region"
          aria-roledescription="carousel"
          aria-label="סיפורי הצלחה"
        >
          {/* Navigation Arrows - enhanced */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-card rounded-full shadow-card flex items-center justify-center hover:bg-primary hover:text-primary-foreground nav-arrow -translate-x-6 md:translate-x-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 border border-border hover:border-primary"
            aria-label="סיפורים קודמים"
          >
            <ChevronLeft className="w-6 h-6" aria-hidden="true" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-card rounded-full shadow-card flex items-center justify-center hover:bg-primary hover:text-primary-foreground nav-arrow translate-x-6 md:translate-x-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 border border-border hover:border-primary"
            aria-label="סיפורים הבאים"
          >
            <ChevronRight className="w-6 h-6" aria-hidden="true" />
          </button>

          {/* Stories Slider */}
          <div className="overflow-hidden px-6 md:px-12">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="grid md:grid-cols-2 gap-8"
                aria-live="polite"
              >
                {getCurrentStories().map((story) => (
                  <Card key={story.id} className="overflow-hidden border-gold/20 h-full">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex -space-x-4 rtl:space-x-reverse">
                          <img
                            src={story.image1}
                            alt=""
                            aria-hidden="true"
                            className="w-16 h-16 rounded-full border-4 border-background object-cover"
                          />
                          <img
                            src={story.image2}
                            alt=""
                            aria-hidden="true"
                            className="w-16 h-16 rounded-full border-4 border-background object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-display text-xl font-bold text-foreground">
                            {story.names}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {story.location} • {story.date}
                          </p>
                        </div>
                        <Heart className="w-6 h-6 text-primary fill-primary mr-auto" aria-hidden="true" />
                      </div>
                      
                      <blockquote className="relative">
                        <Quote className="w-8 h-8 text-primary/20 absolute -top-2 -right-2" aria-hidden="true" />
                        <p className="text-muted-foreground leading-relaxed pr-6">
                          {story.story}
                        </p>
                      </blockquote>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="בחירת סיפור">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  index === currentIndex 
                    ? "bg-primary w-8" 
                    : "bg-primary/30 hover:bg-primary/50"
                }`}
                role="tab"
                aria-selected={index === currentIndex}
                aria-label={`עבור לסיפור ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;
