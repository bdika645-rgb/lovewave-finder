import { lazy, Suspense, useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MemberCard from "@/components/MemberCard";
import AnimatedSection from "@/components/AnimatedSection";
import AnimatedCard from "@/components/AnimatedCard";
import SkipToContent from "@/components/SkipToContent";
import { SkeletonGrid } from "@/components/ui/skeleton-card";
import { InlineEditable, EditableSection } from "@/components/VisualEditor";
import { useLandingContent } from "@/contexts/LandingContentContext";
import FeaturedMembersFilter, { type FilterType, type SortType } from "@/components/FeaturedMembersFilter";

import { useProfiles } from "@/hooks/useProfiles";
import { Heart, Shield, Sparkles, Users, Star } from "lucide-react";
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

// Import demo profile images
import demoProfile1 from "@/assets/profiles/profile1.jpg";
import demoProfile2 from "@/assets/profiles/profile2.jpg";
import demoProfile3 from "@/assets/profiles/profile3.jpg";
import demoProfile4 from "@/assets/profiles/profile4.jpg";

// Demo profiles for unauthenticated users on homepage
const demoProfiles = [
  {
    id: "demo-1",
    name: "מיכל",
    age: 28,
    city: "תל אביב",
    bio: "אוהבת טיולים, קפה טוב ושיחות עמוקות 🌸",
    image: demoProfile1,
    interests: ["טיולים", "קפה", "מוזיקה"],
    isOnline: true,
  },
  {
    id: "demo-2",
    name: "דניאל",
    age: 32,
    city: "הרצליה",
    bio: "יזם, ספורטאי חובב, מחפש את זו שתצחיק אותי 😊",
    image: demoProfile2,
    interests: ["ספורט", "יזמות", "בישול"],
    isOnline: false,
  },
  {
    id: "demo-3",
    name: "נועה",
    age: 26,
    city: "ירושלים",
    bio: "סטודנטית לפסיכולוגיה, אוהבת תיאטרון ואמנות",
    image: demoProfile3,
    interests: ["תיאטרון", "אמנות", "יוגה"],
    isOnline: true,
  },
  {
    id: "demo-4",
    name: "אורי",
    age: 30,
    city: "חיפה",
    bio: "מהנדס תוכנה, מטייל בזמני הפנוי, אוהב ים 🌊",
    image: demoProfile4,
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
  // Filter state for Featured Members
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [activeSort, setActiveSort] = useState<SortType>("newest");
  
  // Fetch featured profiles from database (limit to 8 for filtering)
  const { profiles, loading } = useProfiles({});
  const featuredProfiles = profiles.length > 0 ? profiles.slice(0, 8) : [];
  // Use demo profiles as fallback when not logged in or no profiles available
  const displayProfiles = featuredProfiles.length > 0 ? featuredProfiles : demoProfiles;
  
  // Apply filters to displayed profiles
  const filteredProfiles = useMemo(() => {
    let result = [...displayProfiles];
    
    // Apply filter
    switch (activeFilter) {
      case "online":
        result = result.filter(p => 
          'is_online' in p ? p.is_online : (p as any).isOnline
        );
        break;
      case "age25-35":
        result = result.filter(p => p.age >= 25 && p.age <= 35);
        break;
      case "nearby":
        // For demo, just show Tel Aviv profiles
        result = result.filter(p => 
          p.city === "תל אביב" || p.city === "הרצליה" || p.city === "רמת גן"
        );
        break;
      default:
        break;
    }
    
    // Apply sort
    if (activeSort === "newest") {
      result.sort((a, b) => {
        const dateA = 'updated_at' in a ? new Date(a.updated_at as string).getTime() : 0;
        const dateB = 'updated_at' in b ? new Date(b.updated_at as string).getTime() : 0;
        return dateB - dateA;
      });
    } else if (activeSort === "popular") {
      // For demo, sort by online status as a proxy for popularity
      result.sort((a, b) => {
        const onlineA = 'is_online' in a ? a.is_online : (a as any).isOnline;
        const onlineB = 'is_online' in b ? b.is_online : (b as any).isOnline;
        return (onlineB ? 1 : 0) - (onlineA ? 1 : 0);
      });
    }
    
    return result.slice(0, 4);
  }, [displayProfiles, activeFilter, activeSort]);
  
  const { content, updateContent } = useLandingContent();
  const { features, featuredMembers, cta, footer, nav } = content;

  const updateFeatures = (key: keyof typeof features, value: string) => {
    updateContent("features", { [key]: value });
  };

  const updateFeaturedMembers = (key: keyof typeof featuredMembers, value: string) => {
    updateContent("featuredMembers", { [key]: value });
  };

  const updateCta = (key: keyof typeof cta, value: string) => {
    updateContent("cta", { [key]: value });
  };
  
  return (
    <div className="min-h-screen" dir="rtl">
      <SkipToContent />
      <Navbar />
      <main id="main-content">
        <HeroSection />

        <QuickSectionNav />

        {/* Features Section - enhanced with glass cards */}
        <EditableSection sectionName="פיצ'רים">
          <section id="features" className="py-28 md:py-36 bg-muted/20 relative overflow-hidden" aria-labelledby="features-title">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
              <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
              <AnimatedSection className="text-center mb-20">
                <h2 id="features-title" className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
                  <InlineEditable
                    value={features.title}
                    onChange={(v) => updateFeatures("title", v)}
                    as="span"
                  />{" "}
                  <InlineEditable
                    value={features.titleHighlight}
                    onChange={(v) => updateFeatures("titleHighlight", v)}
                    className="text-gradient-shimmer"
                    as="span"
                  />?
                </h2>
                <InlineEditable
                  value={features.description}
                  onChange={(v) => updateFeatures("description", v)}
                  className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed block"
                  as="p"
                  multiline
                />
              </AnimatedSection>

              <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                {features.items.map((item, index) => {
                  const Icon = featureIcons[index] || Sparkles;
                  return (
                    <AnimatedCard key={item.id} index={index}>
                      <div className="bg-card p-8 rounded-2xl text-center h-full border border-border shadow-lg hover:shadow-xl hover:border-primary/20 transition-all duration-300 group">
                        <div className="w-16 h-16 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-6 shadow-md group-hover:scale-105 transition-transform duration-300">
                          <Icon className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <h3 className="font-display text-xl font-bold text-foreground mb-3 tracking-tight">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </AnimatedCard>
                  );
                })}
              </div>
            </div>
          </section>
        </EditableSection>

        {/* Featured Members - Enhanced with glass styling */}
        <EditableSection sectionName="חברים מומלצים">
          <section id="featured-members" className="py-28 md:py-36 relative overflow-hidden" aria-labelledby="featured-title">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="absolute top-1/4 right-0 w-72 h-72 bg-primary/5 rounded-full blur-[100px]" />
              <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-[80px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
              <AnimatedSection className="text-center mb-20">
                <h2 id="featured-title" className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
                  <InlineEditable
                    value={featuredMembers.title}
                    onChange={(v) => updateFeaturedMembers("title", v)}
                    as="span"
                  />{" "}
                  <InlineEditable
                    value={featuredMembers.titleHighlight}
                    onChange={(v) => updateFeaturedMembers("titleHighlight", v)}
                    className="text-gradient-shimmer"
                    as="span"
                  />
                </h2>
                <InlineEditable
                  value={featuredMembers.description}
                  onChange={(v) => updateFeaturedMembers("description", v)}
                  className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed block"
                  as="p"
                  multiline
                />
              </AnimatedSection>

              {/* Smart Filter */}
              <FeaturedMembersFilter
                activeFilter={activeFilter}
                activeSort={activeSort}
                onFilterChange={setActiveFilter}
                onSortChange={setActiveSort}
              />

              {loading ? (
                <SkeletonGrid count={4} />
              ) : filteredProfiles.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  {filteredProfiles.map((profile, index) => (
                    <AnimatedCard key={profile.id} index={index}>
                      <MemberCard 
                        member={{
                          id: profile.id,
                          name: profile.name,
                          age: profile.age,
                          city: profile.city,
                          bio: 'bio' in profile ? (profile.bio as string) || "" : "",
                          image: 'avatar_url' in profile 
                            ? (profile.avatar_url as string) || demoProfile1 
                            : (profile as any).image || demoProfile1,
                          interests: profile.interests || [],
                          isOnline: 'is_online' in profile ? (profile.is_online as boolean) || false : (profile as any).isOnline || false,
                        }}
                      />
                    </AnimatedCard>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">לא נמצאו פרופילים בסינון זה</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => setActiveFilter("all")}
                  >
                    הצג הכל
                  </Button>
                </div>
              )}

              <AnimatedSection delay={0.3} className="text-center mt-16">
                <Link to="/members">
                  <Button variant="hero" size="lg" className="btn-lift shadow-xl">
                    <InlineEditable
                      value={featuredMembers.ctaButton}
                      onChange={(v) => updateFeaturedMembers("ctaButton", v)}
                      as="span"
                    />
                  </Button>
                </Link>
              </AnimatedSection>
            </div>
          </section>
        </EditableSection>

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

        {/* CTA Section - Enhanced with urgency and social proof */}
        <EditableSection sectionName="קריאה לפעולה">
          <section className="py-24 md:py-36 gradient-primary overflow-hidden relative" aria-labelledby="cta-title">
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
              <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[150px]" />
              {/* Floating hearts decoration */}
              <div className="absolute top-1/4 left-1/4 opacity-20 animate-bounce" style={{ animationDuration: '3s' }}>
                <Heart className="w-8 h-8 text-white fill-white" />
              </div>
              <div className="absolute bottom-1/3 right-1/4 opacity-15 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
            </div>

            <AnimatedSection className="container mx-auto px-6 text-center relative z-10">
              {/* Social proof badge */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full mb-8 animate-pulse">
                <div className="flex -space-x-2 rtl:space-x-reverse">
                  <div className="w-6 h-6 rounded-full bg-white/80 border-2 border-white flex items-center justify-center text-xs">👩</div>
                  <div className="w-6 h-6 rounded-full bg-white/80 border-2 border-white flex items-center justify-center text-xs">👨</div>
                  <div className="w-6 h-6 rounded-full bg-white/80 border-2 border-white flex items-center justify-center text-xs">👩</div>
                </div>
                <span className="text-white/90 text-sm font-medium">+234 נרשמו היום</span>
              </div>

              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-sm mb-8 shadow-2xl ring-4 ring-white/20">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground animate-pulse" aria-hidden="true" />
              </div>
              
              <h2 id="cta-title" className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground mb-6 tracking-tight drop-shadow-lg">
                <InlineEditable
                  value={cta.title}
                  onChange={(v) => updateCta("title", v)}
                  className="text-primary-foreground"
                  as="span"
                />
              </h2>
              
              <InlineEditable
                value={cta.description}
                onChange={(v) => updateCta("description", v)}
                className="text-primary-foreground/90 text-base sm:text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium block"
                as="p"
                multiline
              />

              {/* Enhanced CTA with urgency */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register">
                  <Button 
                    size="xl" 
                    className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold shadow-2xl hover:shadow-3xl transition-all btn-lift text-base sm:text-lg px-8 sm:px-12 py-6 gap-2 group"
                  >
                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <InlineEditable
                      value={cta.button}
                      onChange={(v) => updateCta("button", v)}
                      as="span"
                    />
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-white/70 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>100% פרטיות</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>אלפי זוגות מאושרים</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-current" />
                  <span>4.9 דירוג</span>
                </div>
              </div>
            </AnimatedSection>
          </section>
        </EditableSection>
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
    </div>
  );
};

export default Index;
