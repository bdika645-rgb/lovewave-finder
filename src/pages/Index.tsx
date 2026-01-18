import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MemberCard from "@/components/MemberCard";
import SuccessStoriesSection from "@/components/SuccessStoriesSection";
import FAQSection from "@/components/FAQSection";
import StatsSection from "@/components/StatsSection";
import DatingTipsSection from "@/components/DatingTipsSection";
import PremiumSection from "@/components/PremiumSection";
import { useProfiles } from "@/hooks/useProfiles";
import { Heart, Shield, Sparkles, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  // Fetch featured profiles from database (limit to 4)
  const { profiles, loading } = useProfiles({});
  const featuredProfiles = profiles.slice(0, 4);
  return (
    <div className="min-h-screen" dir="rtl">
      <Navbar />
      <HeroSection />

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              למה <span className="text-gradient">Spark</span>?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              הפלטפורמה המובילה להיכרויות בישראל, עם מיליוני משתמשים וטכנולוגיה חכמה להתאמות מושלמות.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-3xl shadow-card card-hover text-center">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                התאמה חכמה
              </h3>
              <p className="text-muted-foreground">
                האלגוריתם שלנו מנתח את ההעדפות שלכם ומציע התאמות מושלמות
              </p>
            </div>

            <div className="bg-card p-8 rounded-3xl shadow-card card-hover text-center">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                פרטיות מלאה
              </h3>
              <p className="text-muted-foreground">
                המידע שלכם מאובטח ומוגן. אתם שולטים במה שאחרים רואים
              </p>
            </div>

            <div className="bg-card p-8 rounded-3xl shadow-card card-hover text-center">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                קהילה אמיתית
              </h3>
              <p className="text-muted-foreground">
                כל הפרופילים מאומתים. רק אנשים אמיתיים ורציניים
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Members */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              פרופילים <span className="text-gradient">מובחרים</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              הכירו כמה מהמשתמשים הפעילים שלנו
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProfiles.map((profile) => (
                <MemberCard 
                  key={profile.id} 
                  member={{
                    id: profile.id,
                    name: profile.name,
                    age: profile.age,
                    city: profile.city,
                    bio: profile.bio || "",
                    image: profile.avatar_url || "/profiles/profile1.jpg",
                    interests: profile.interests || [],
                    isOnline: profile.is_online || false,
                  }}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/members">
              <Button variant="hero" size="lg">
                ראו עוד פרופילים
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Success Stories */}
      <SuccessStoriesSection />

      {/* Dating Tips */}
      <DatingTipsSection />

      {/* Premium Section */}
      <PremiumSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <section className="py-24 gradient-primary">
        <div className="container mx-auto px-6 text-center">
          <Heart className="w-16 h-16 text-primary-foreground mx-auto mb-6 animate-pulse-soft" />
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            מוכנים להתחיל?
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-10">
            הצטרפו לאלפי אנשים שכבר מצאו את האהבה דרכנו. ההרשמה חינם!
          </p>
          <Link to="/register">
            <Button 
              size="xl" 
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
            >
              הירשמו עכשיו - חינם
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary fill-current" />
              <span className="font-display text-xl font-bold text-primary-foreground">Spark</span>
            </div>
            <p className="text-primary-foreground/60 text-sm">
              © 2024 Spark. כל הזכויות שמורות.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
