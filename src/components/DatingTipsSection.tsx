import { useState, useMemo } from "react";
import { datingTips } from "@/data/members";
import { useLandingContent } from "@/contexts/LandingContentContext";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, User, MessageSquare, Calendar, Sparkles } from "lucide-react";
import TipsCategoryFilter, { type TipCategory } from "@/components/TipsCategoryFilter";
import { motion, AnimatePresence } from "framer-motion";
import { InlineEditable, EditableSection } from "@/components/VisualEditor";

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "פרופיל":
      return User;
    case "שיחות":
      return MessageSquare;
    case "דייטים":
      return Calendar;
    case "מוטיבציה":
      return Sparkles;
    default:
      return Lightbulb;
  }
};

const DatingTipsSection = () => {
  const { content, updateContent } = useLandingContent();
  const { datingTips: tipsContent } = content;
  const [activeCategory, setActiveCategory] = useState<TipCategory>("all");

  const updateTips = (key: keyof typeof tipsContent, value: string) => {
    updateContent("datingTips", { [key]: value });
  };

  const filteredTips = useMemo(() => {
    if (activeCategory === "all") return datingTips;
    return datingTips.filter((tip) => tip.category === activeCategory);
  }, [activeCategory]);

  return (
    <EditableSection sectionName="טיפים לדייטינג">
      <section id="dating-tips" className="py-24 bg-muted/30" aria-labelledby="dating-tips-heading">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 gradient-primary rounded-2xl mb-6" aria-hidden="true">
              <Lightbulb className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 id="dating-tips-heading" className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              <InlineEditable
                value={tipsContent.title}
                onChange={(v) => updateTips("title", v)}
                as="span"
              />{" "}
              <InlineEditable
                value={tipsContent.titleHighlight}
                onChange={(v) => updateTips("titleHighlight", v)}
                className="text-gradient"
                as="span"
              />
            </h2>
            <InlineEditable
              value={tipsContent.description}
              onChange={(v) => updateTips("description", v)}
              className="text-muted-foreground text-lg max-w-2xl mx-auto block"
              as="p"
              multiline
            />
          </div>

        {/* Category Filter */}
        <TipsCategoryFilter 
          activeCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
        />

        <div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" 
          role="tabpanel" 
          id={`tips-panel-${activeCategory}`}
          aria-label="רשימת טיפים"
        >
          <AnimatePresence mode="popLayout">
            {filteredTips.map((tip, index) => {
              const Icon = getCategoryIcon(tip.category);
              return (
                <motion.article 
                  key={tip.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                  layout
                  className="card-premium card-accent-hover bg-card rounded-xl overflow-hidden" 
                >
                  <div className="pb-3 p-6">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-primary/10 text-primary font-medium">
                        {tip.category}
                      </Badge>
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center icon-pulse">
                        <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
                      </div>
                    </div>
                    <h3 className="font-display text-lg mt-4 font-semibold tracking-tight">
                      {tip.title}
                    </h3>
                  </div>
                  <div className="p-6 pt-0">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {tip.content}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredTips.length === 0 && (
          <div className="text-center py-12">
            <Lightbulb className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">לא נמצאו טיפים בקטגוריה זו</p>
          </div>
        )}
      </div>
    </section>
  </EditableSection>
  );
};

export default DatingTipsSection;
