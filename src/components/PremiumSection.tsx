import { premiumFeatures } from "@/data/members";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Heart, Eye, Filter, Undo2, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "heart":
      return Heart;
    case "eye":
      return Eye;
    case "filter":
      return Filter;
    case "undo":
      return Undo2;
    case "rocket":
      return Rocket;
    case "crown":
      return Crown;
    default:
      return Heart;
  }
};

const PremiumSection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass-gold px-5 py-2 rounded-full mb-6">
            <Crown className="w-4 h-4 text-primary" />
            <span className="text-primary font-medium text-sm">Premium</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            שדרגו את <span className="text-gradient">החוויה</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            גלו את כל היתרונות של חברות פרימיום
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {premiumFeatures.map((feature) => {
            const Icon = getIcon(feature.icon);
            return (
              <Card key={feature.id} className="card-hover border-gold/20 bg-gradient-to-br from-card to-card/50">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Link to="/register">
            <Button variant="hero" size="xl" className="gap-3">
              <Crown className="w-5 h-5" />
              התחילו עכשיו
            </Button>
          </Link>
          <p className="text-muted-foreground text-sm mt-4">
            7 ימי ניסיון חינם • ביטול בכל עת
          </p>
        </div>
      </div>
    </section>
  );
};

export default PremiumSection;
