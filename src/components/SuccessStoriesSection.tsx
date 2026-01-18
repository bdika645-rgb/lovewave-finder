import { successStories } from "@/data/members";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Quote } from "lucide-react";

const SuccessStoriesSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            סיפורי <span className="text-gradient">הצלחה</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            זוגות אמיתיים שמצאו את האהבה דרך Spark
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {successStories.map((story) => (
            <Card key={story.id} className="overflow-hidden card-hover border-gold/20">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex -space-x-4 rtl:space-x-reverse">
                    <img
                      src={story.image1}
                      alt=""
                      className="w-16 h-16 rounded-full border-4 border-background object-cover"
                    />
                    <img
                      src={story.image2}
                      alt=""
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
                  <Heart className="w-6 h-6 text-primary fill-primary mr-auto" />
                </div>
                
                <div className="relative">
                  <Quote className="w-8 h-8 text-primary/20 absolute -top-2 -right-2" />
                  <p className="text-muted-foreground leading-relaxed pr-6">
                    {story.story}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;
