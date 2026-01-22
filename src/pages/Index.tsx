import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MemberCard from "@/components/MemberCard";
import AnimatedSection from "@/components/AnimatedSection";
import AnimatedCard from "@/components/AnimatedCard";
import SkipToContent from "@/components/SkipToContent";
import { SkeletonGrid } from "@/components/ui/skeleton-card";
import { VisualEditor } from "@/components/VisualEditor";
import { useLandingContent } from "@/contexts/LandingContentContext";

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

// Demo profiles for unauthenticated users on homepage
const demoProfiles = [
  {
    id: "demo-1",
    name: "מיכל",
    age: 28,
    city: "תל אביב",
    bio: "אוהבת טיולים, קפה טוב ושיחות עמוקות 🌸",
    image: "/profiles/profile1.jpg",
    interests: ["טיולים", "קפה", "מוזיקה"],
    isOnline: true,
  },
  {
    id: "demo-2",
    name: "דניאל",
    age: 32,
    city: "הרצליה",
    bio: "יזם, ספורטאי חובב, מחפש את זו שתצחיק אותי 😊",
    image: "/profiles/profile2.jpg",
    interests: ["ספורט", "יזמות", "בישול"],
    isOnline: false,
  },
  {
    id: "demo-3",
    name: "נועה",
    age: 26,
    city: "ירושלים",
    bio: "סטודנטית לפסיכולוגיה, אוהבת תיאטרון ואמנות",
    image: "/profiles/profile3.jpg",
    interests: ["תיאטרון", "אמנות", "יוגה"],
    isOnline: true,
  },
  {
    id: "demo-4",
    name: "אורי",
    age: 30,
    city: "חיפה",
    bio: "מהנדס תוכנה, מטייל בזמני הפנוי, אוהב ים 🌊",
    image: "/profiles/profile4.jpg",
    interests: ["טכנולוגיה", "טיולים", "שחייה"],
    isOnline: false,
  },
];

const featureIcons = [Sparkles, Shield, Users];

const QuickSectionNav = () => {
  const items = [
    { href: "#features", label: "מה תקבלו" },
    { href: "#featured-members", label: "חברים מומלצים" },
    { href: "#stats", label: "סטטיסטיקות" },
    { href: "#success-stories", label: "סיפורי הצלחה" },
    { href: "#dating-tips", label: "טיפים" },
    { href: "#faq", label: "שאלות" },
  ];

  return (
    <nav
      aria-label="ניווט מהיר בעמוד"
      className="border-y border-border bg-background/70 backdrop-blur-sm"
    >
      <div className="container mx-auto px-6 py-3">
        <h2 className="sr-only">ניווט מהיר</h2>
        <div
          className="flex gap-2 overflow-x-auto pb-1 scroll-smooth-ios"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {items.map((item) => (
            <Button key={item.href} asChild variant="outline" size="sm" className="shrink-0">
              <a href={item.href}>{item.label}</a>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};

const Index = () => {
  // Fetch featured profiles from database (limit to 4)
  const { profiles, loading } = useProfiles({});
  const featuredProfiles = profiles.length > 0 ? profiles.slice(0, 4) : [];
  // Use demo profiles as fallback when not logged in or no profiles available
  const displayProfiles = featuredProfiles.length > 0 ? featuredProfiles : demoProfiles;
  
  const { content } = useLandingContent();
  const { features, featuredMembers, cta, footer, nav } = content;
  
  return (
    <div className="min-h-screen" dir="rtl">
      <SkipToContent />
      <Navbar />
      <main id="main-content">
        <HeroSection />

        <QuickSectionNav />

        {/* Features Section */}
        <section id="features" className="py-24 bg-muted/30" aria-labelledby="features-title">
          <div className="container mx-auto px-6">
            <AnimatedSection className="text-center mb-16">
              <h2 id="features-title" className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                {features.title} <span className="text-gradient">{features.titleHighlight}</span>?
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {features.description}
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-8">
              {features.items.map((item, index) => {
                const Icon = featureIcons[index] || Sparkles;
                return (
                  <AnimatedCard key={item.id} index={index}>
                    <div className="bg-card p-8 rounded-3xl shadow-card text-center h-full">
                      <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Icon className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <h3 className="font-display text-xl font-bold text-foreground mb-3">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </AnimatedCard>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Members - Always show with demo or real profiles */}
        <section id="featured-members" className="py-24" aria-labelledby="featured-title">
          <div className="container mx-auto px-6">
            <AnimatedSection className="text-center mb-16">
              <h2 id="featured-title" className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                {featuredMembers.title} <span className="text-gradient">{featuredMembers.titleHighlight}</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {featuredMembers.description}
              </p>
            </AnimatedSection>

            {loading ? (
              <SkeletonGrid count={4} />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayProfiles.map((profile, index) => (
                  <AnimatedCard key={profile.id} index={index}>
                    <MemberCard 
                      member={{
                        id: profile.id,
                        name: profile.name,
                        age: profile.age,
                        city: profile.city,
                        bio: 'bio' in profile ? profile.bio || "" : (profile as any).bio,
                        image: 'avatar_url' in profile ? profile.avatar_url || "/profiles/profile1.jpg" : (profile as any).image,
                        interests: profile.interests || [],
                        isOnline: 'is_online' in profile ? profile.is_online || false : (profile as any).isOnline,
                      }}
                    />
                  </AnimatedCard>
                ))}
              </div>
            )}

            <AnimatedSection delay={0.3} className="text-center mt-12">
              <Link to="/members">
                <Button variant="hero" size="lg">
                  {featuredMembers.ctaButton}
                </Button>
              </Link>
            </AnimatedSection>
          </div>
        </section>

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
              {cta.title}
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-10">
              {cta.description}
            </p>
            <Link to="/register">
              <Button 
                size="xl" 
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
              >
                {cta.button}
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
                <span className="font-display text-2xl font-bold text-primary-foreground">{nav.brandName}</span>
              </div>
              <p className="text-primary-foreground/60 text-sm leading-relaxed">
                {footer.brandDescription}
              </p>
            </div>

            {/* Quick Links */}
            <nav aria-label="קישורים מהירים">
              <h4 className="font-display text-lg font-semibold text-primary-foreground mb-4">{footer.quickLinksTitle}</h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link to="/members" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
                    {footer.quickLink1}
                  </Link>
                </li>
                <li>
                  <Link to="/discover" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
                    {footer.quickLink2}
                  </Link>
                </li>
                <li>
                  <Link to="/messages" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
                    {footer.quickLink3}
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Account */}
            <nav aria-label="חשבון">
              <h4 className="font-display text-lg font-semibold text-primary-foreground mb-4">{footer.accountTitle}</h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link to="/login" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
                    {footer.accountLink1}
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
                    {footer.accountLink2}
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
                    {footer.accountLink3}
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Support */}
            <nav aria-label="תמיכה">
              <h4 className="font-display text-lg font-semibold text-primary-foreground mb-4">{footer.supportTitle}</h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <a href="#faq" className="text-right text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
                    {footer.supportLink1}
                  </a>
                </li>
                <li>
                  <Link to="/support" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
                    {footer.supportLink2}
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
                    {footer.supportLink3}
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
                    {footer.supportLink4}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/50 text-sm">
              {footer.copyright.replace("{year}", new Date().getFullYear().toString())}
            </p>
            <div className="flex items-center gap-4">
              <span className="text-primary-foreground/40 text-xs">
                {footer.madeWith}
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Visual Editor */}
      <VisualEditor />
    </div>
  );
};

export default Index;
