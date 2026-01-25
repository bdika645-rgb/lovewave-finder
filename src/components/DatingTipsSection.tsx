import { datingTips } from "@/data/members";
import { useLandingContent } from "@/contexts/LandingContentContext";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, User, MessageSquare, Calendar, Sparkles } from "lucide-react";

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
  const { content } = useLandingContent();
  const { datingTips: tipsContent } = content;

  return (
    <section id="dating-tips" className="py-24 bg-muted/30" aria-labelledby="dating-tips-heading">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 gradient-primary rounded-2xl mb-6" aria-hidden="true">
            <Lightbulb className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 id="dating-tips-heading" className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            {tipsContent.title} <span className="text-gradient">{tipsContent.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {tipsContent.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" role="list" aria-label="רשימת טיפים">
          {datingTips.map((tip) => {
            const Icon = getCategoryIcon(tip.category);
            return (
              <article 
                key={tip.id} 
                className="card-premium card-accent-hover bg-card rounded-xl overflow-hidden" 
                role="listitem"
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
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DatingTipsSection;
