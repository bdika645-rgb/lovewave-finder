import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MemberCard from "@/components/MemberCard";
import AnimatedSection from "@/components/AnimatedSection";
import AnimatedCard from "@/components/AnimatedCard";
import SkipToContent from "@/components/SkipToContent";
import { SkeletonGrid } from "@/components/ui/skeleton-card";

import { useProfiles } from "@/hooks/useProfiles";
import { Heart, Shield, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Lazy load non-critical sections
const StatsSection = lazy(() => import("@/components/StatsSection"));
const SuccessStoriesSection = lazy(() => import("@/components/SuccessStoriesSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const DatingTipsSection = lazy(() => import("@/components/DatingTipsSection"));

const SectionLoader = () => (
  <div className="py-24 flex justify-center">
    <div className="animate-pulse w-full max-w-4xl mx-auto px-6">
      <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-4" />
      <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
    </div>
  </div>
);

const Index = () => {
  // Fetch featured profiles from database (limit to 4)
  const { profiles, loading } = useProfiles({});
  const featuredProfiles = profiles.slice(0, 4);
  const hasFeaturedProfiles = featuredProfiles.length > 0;
  
  return (
    <div className="min-h-screen" dir="rtl">
      <SkipToContent />
      <Navbar />
      <main id="main-content">
        <HeroSection />

        {/* Features Section */}
        <section className="py-24 bg-muted/30" aria-labelledby="features-title">
          <div className="container mx-auto px-6">
            <AnimatedSection className="text-center mb-16">
              <h2 id="features-title" className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                למה <span className="text-gradient">Spark</span>?
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                הפלטפורמה המובילה להיכרויות בישראל, עם מיליוני משתמשים וטכנולוגיה חכמה להתאמות מושלמות.
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-8">
              <AnimatedCard index={0}>
                <div className="bg-card p-8 rounded-3xl shadow-card text-center h-full">
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
              </AnimatedCard>

              <AnimatedCard index={1}>
                <div className="bg-card p-8 rounded-3xl shadow-card text-center h-full">
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
              </AnimatedCard>

              <AnimatedCard index={2}>
                <div className="bg-card p-8 rounded-3xl shadow-card text-center h-full">
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
              </AnimatedCard>
            </div>
          </div>
        </section>

        {/* Featured Members - Only show if there are profiles */}
        {(loading || hasFeaturedProfiles) && (
          <section className="py-24" aria-labelledby="featured-title">
            <div className="container mx-auto px-6">
              <AnimatedSection className="text-center mb-16">
                <h2 id="featured-title" className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                  פרופילים <span className="text-gradient">מובחרים</span>
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  הכירו כמה מהמשתמשים הפעילים שלנו
                </p>
              </AnimatedSection>

              {loading ? (
                <SkeletonGrid count={4} />
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredProfiles.map((profile, index) => (
                    <AnimatedCard key={profile.id} index={index}>
                      <MemberCard 
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
                    </AnimatedCard>
                  ))}
                </div>
              )}

              <AnimatedSection delay={0.3} className="text-center mt-12">
                <Link to="/members">
                  <Button variant="hero" size="lg">
                    ראו עוד פרופילים
                  </Button>
                </Link>
              </AnimatedSection>
            </div>
          </section>
        )}

        {/* Lazy loaded sections */}
        <Suspense fallback={<SectionLoader />}>
          <StatsSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <SuccessStoriesSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <DatingTipsSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <FAQSection />
        </Suspense>

        {/* CTA Section */}
        <section className="py-24 gradient-primary overflow-hidden" aria-labelledby="cta-title">
          <AnimatedSection className="container mx-auto px-6 text-center">
            <Heart className="w-16 h-16 text-primary-foreground mx-auto mb-6 animate-pulse-soft" aria-hidden="true" />
            <h2 id="cta-title" className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
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
          </AnimatedSection>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-foreground py-16" role="contentinfo">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-7 h-7 text-primary fill-current" aria-hidden="true" />
                <span className="font-display text-2xl font-bold text-primary-foreground">Spark</span>
              </div>
              <p className="text-primary-foreground/60 text-sm leading-relaxed">
                הפלטפורמה המובילה להיכרויות בישראל. מצאו את האהבה שלכם היום.
              </p>
            </div>

            {/* Quick Links */}
            <nav aria-label="קישורים מהירים">
              <h4 className="font-display text-lg font-semibold text-primary-foreground mb-4">קישורים מהירים</h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link to="/members" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
                    גלה פרופילים
                  </Link>
                </li>
                <li>
                  <Link to="/discover" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
                    Swipe
                  </Link>
                </li>
                <li>
                  <Link to="/messages" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
                    הודעות
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Account */}
            <nav aria-label="חשבון">
              <h4 className="font-display text-lg font-semibold text-primary-foreground mb-4">חשבון</h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link to="/login" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
                    התחברות
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
                    הרשמה
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
                    הפרופיל שלי
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Support */}
            <nav aria-label="תמיכה">
              <h4 className="font-display text-lg font-semibold text-primary-foreground mb-4">תמיכה</h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <a href="#faq" className="text-right text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
                    שאלות נפוצות
                  </a>
                </li>
                <li>
                  <Link to="/support" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
                    צור קשר
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
                    תנאי שימוש
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
                    מדיניות פרטיות
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/50 text-sm">
              © {new Date().getFullYear()} Spark. כל הזכויות שמורות.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-primary-foreground/40 text-xs">
                עוצב עם ❤️ בישראל
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;