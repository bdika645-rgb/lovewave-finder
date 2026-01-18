import { datingTips } from "@/data/members";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 gradient-primary rounded-2xl mb-6">
            <Lightbulb className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            טיפים <span className="text-gradient">לדייטינג</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            עצות מקצועיות שיעזרו לכם למצוא את האהבה
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {datingTips.map((tip) => {
            const Icon = getCategoryIcon(tip.category);
            return (
              <Card key={tip.id} className="card-hover border-gold/10">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {tip.category}
                    </Badge>
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="font-display text-lg mt-3">
                    {tip.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {tip.content}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DatingTipsSection;
