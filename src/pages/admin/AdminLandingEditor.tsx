import { useEffect, lazy, Suspense, useState } from "react";
import { useLandingContent } from "@/contexts/LandingContentContext";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SkipToContent from "@/components/SkipToContent";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Heart, 
  Shield, 
  Sparkles, 
  Users,
  Eye,
  Download,
  Upload,
  RotateCcw,
  X,
  Pencil,
  Check,
} from "lucide-react";

// Import all landing page sections
import AnimatedSection from "@/components/AnimatedSection";
import AnimatedCard from "@/components/AnimatedCard";
import MemberCard from "@/components/MemberCard";
import { InlineEditable, EditableSection, EditorToolbar } from "@/components/VisualEditor";
import { useEditorActions } from "@/hooks/useEditorActions";

// Lazy load sections
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

// Demo profiles
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

// The actual WYSIWYG editor content
function WYSIWYGEditorContent() {
  const { content, updateContent, resetContent, isEditMode, setIsEditMode } = useLandingContent();
  const { features, featuredMembers, cta, footer, nav } = content;
  const [showHelp, setShowHelp] = useState(() => {
    return localStorage.getItem("editor_help_dismissed") !== "true";
  });

  const dismissHelp = () => {
    setShowHelp(false);
    localStorage.setItem("editor_help_dismissed", "true");
  };

  // Editor actions hook for undo/redo and import/export
  const {
    canUndo,
    canRedo,
    undo,
    redo,
    handleExport,
    handleImport,
    handleReset,
    historyLength,
    hasChanges,
  } = useEditorActions({
    content,
    updateContent,
    resetContent,
  });

  const updateFeatures = (key: keyof typeof features, value: string) => {
    updateContent("features", { [key]: value });
  };

  const updateFeaturedMembers = (key: keyof typeof featuredMembers, value: string) => {
    updateContent("featuredMembers", { [key]: value });
  };

  const updateCta = (key: keyof typeof cta, value: string) => {
    updateContent("cta", { [key]: value });
  };

  // Enable edit mode on mount
  useEffect(() => {
    setIsEditMode(true);
    return () => setIsEditMode(false);
  }, [setIsEditMode]);

  return (
    <div className="min-h-screen relative" dir="rtl">
      {/* Editor Toolbar Component */}
      <EditorToolbar
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onReset={handleReset}
        onExport={handleExport}
        onImport={handleImport}
        historyLength={historyLength}
        hasChanges={hasChanges}
      />

      {/* Actual Landing Page Content with padding for toolbar */}
      <div className="pt-[68px]">
        <SkipToContent />
        <Navbar />
        <main id="main-content">
          <HeroSection />

          {/* Features Section */}
          <EditableSection sectionName="פיצ'רים">
            <section id="features" className="py-28 md:py-36 bg-muted/20 relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-[100px]" />
              </div>

              <div className="container mx-auto px-6 relative z-10">
                <AnimatedSection className="text-center mb-20">
                  <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
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

                <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
                  {features.items.map((item, index) => {
                    const Icon = featureIcons[index] || Sparkles;
                    return (
                      <AnimatedCard key={item.id} index={index}>
                        <div className="glass-effect p-10 rounded-3xl text-center h-full border border-white/30 dark:border-white/10 hover:border-primary/30 transition-all duration-500 tilt-card bg-noise group">
                          <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl group-hover:scale-110 transition-transform duration-500">
                            <Icon className="w-10 h-10 text-primary-foreground" />
                          </div>
                          <h3 className="font-display text-2xl font-bold text-foreground mb-4 tracking-tight">
                            <InlineEditable
                              value={item.title}
                              onChange={(v) => {
                                const newItems = [...features.items];
                                newItems[index] = { ...newItems[index], title: v };
                                updateContent("features", { items: newItems });
                              }}
                              as="span"
                            />
                          </h3>
                          <p className="text-muted-foreground leading-relaxed text-lg">
                            <InlineEditable
                              value={item.description}
                              onChange={(v) => {
                                const newItems = [...features.items];
                                newItems[index] = { ...newItems[index], description: v };
                                updateContent("features", { items: newItems });
                              }}
                              as="span"
                              multiline
                            />
                          </p>
                        </div>
                      </AnimatedCard>
                    );
                  })}
                </div>
              </div>
            </section>
          </EditableSection>

          {/* Featured Members */}
          <EditableSection sectionName="חברים מומלצים">
            <section id="featured-members" className="py-28 md:py-36 relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute top-1/4 right-0 w-72 h-72 bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-[80px]" />
              </div>

              <div className="container mx-auto px-6 relative z-10">
                <AnimatedSection className="text-center mb-20">
                  <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
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

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                  {demoProfiles.map((profile, index) => (
                    <AnimatedCard key={profile.id} index={index}>
                      <MemberCard member={profile} />
                    </AnimatedCard>
                  ))}
                </div>

                <AnimatedSection delay={0.3} className="text-center mt-16">
                  <Button variant="hero" size="lg" className="btn-lift shadow-xl">
                    <InlineEditable
                      value={featuredMembers.ctaButton}
                      onChange={(v) => updateFeaturedMembers("ctaButton", v)}
                      as="span"
                    />
                  </Button>
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

          {/* CTA Section */}
          <EditableSection sectionName="קריאה לפעולה">
            <section className="py-32 md:py-40 gradient-primary overflow-hidden relative">
              <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
              </div>

              <AnimatedSection className="container mx-auto px-6 text-center relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-10 shadow-xl">
                  <Heart className="w-10 h-10 text-primary-foreground animate-pulse-soft" />
                </div>
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground mb-8 tracking-tight drop-shadow-lg">
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
                  className="text-primary-foreground/90 text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto mb-14 leading-relaxed font-medium block"
                  as="p"
                  multiline
                />
                <Button 
                  size="xl" 
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold shadow-2xl hover:shadow-3xl transition-all btn-lift text-lg px-10"
                >
                  <InlineEditable
                    value={cta.button}
                    onChange={(v) => updateCta("button", v)}
                    as="span"
                  />
                </Button>
              </AnimatedSection>
            </section>
          </EditableSection>
        </main>

        {/* Footer */}
        <EditableSection sectionName="פוטר">
          <footer className="bg-foreground py-16">
            <div className="container mx-auto px-6">
              <div className="grid md:grid-cols-4 gap-8 mb-12">
                <div className="md:col-span-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Heart className="w-7 h-7 text-primary fill-current" />
                    <InlineEditable
                      value={nav.brandName}
                      onChange={(v) => updateContent("nav", { brandName: v })}
                      className="font-display text-2xl font-bold text-primary-foreground"
                      as="span"
                    />
                  </div>
                  <InlineEditable
                    value={footer.brandDescription}
                    onChange={(v) => updateContent("footer", { brandDescription: v })}
                    className="text-primary-foreground/60 text-sm leading-relaxed block"
                    as="p"
                    multiline
                  />
                </div>
                
                {/* Quick Links */}
                <div>
                  <InlineEditable
                    value={footer.quickLinksTitle}
                    onChange={(v) => updateContent("footer", { quickLinksTitle: v })}
                    className="font-semibold text-primary-foreground mb-4 block"
                    as="h4"
                  />
                  <ul className="space-y-2 text-primary-foreground/60 text-sm">
                    <li>
                      <InlineEditable
                        value={footer.quickLink1}
                        onChange={(v) => updateContent("footer", { quickLink1: v })}
                        as="span"
                      />
                    </li>
                    <li>
                      <InlineEditable
                        value={footer.quickLink2}
                        onChange={(v) => updateContent("footer", { quickLink2: v })}
                        as="span"
                      />
                    </li>
                    <li>
                      <InlineEditable
                        value={footer.quickLink3}
                        onChange={(v) => updateContent("footer", { quickLink3: v })}
                        as="span"
                      />
                    </li>
                  </ul>
                </div>
                
                {/* Account */}
                <div>
                  <InlineEditable
                    value={footer.accountTitle}
                    onChange={(v) => updateContent("footer", { accountTitle: v })}
                    className="font-semibold text-primary-foreground mb-4 block"
                    as="h4"
                  />
                  <ul className="space-y-2 text-primary-foreground/60 text-sm">
                    <li>
                      <InlineEditable
                        value={footer.accountLink1}
                        onChange={(v) => updateContent("footer", { accountLink1: v })}
                        as="span"
                      />
                    </li>
                    <li>
                      <InlineEditable
                        value={footer.accountLink2}
                        onChange={(v) => updateContent("footer", { accountLink2: v })}
                        as="span"
                      />
                    </li>
                    <li>
                      <InlineEditable
                        value={footer.accountLink3}
                        onChange={(v) => updateContent("footer", { accountLink3: v })}
                        as="span"
                      />
                    </li>
                  </ul>
                </div>
                
                {/* Support */}
                <div>
                  <InlineEditable
                    value={footer.supportTitle}
                    onChange={(v) => updateContent("footer", { supportTitle: v })}
                    className="font-semibold text-primary-foreground mb-4 block"
                    as="h4"
                  />
                  <ul className="space-y-2 text-primary-foreground/60 text-sm">
                    <li>
                      <InlineEditable
                        value={footer.supportLink1}
                        onChange={(v) => updateContent("footer", { supportLink1: v })}
                        as="span"
                      />
                    </li>
                    <li>
                      <InlineEditable
                        value={footer.supportLink2}
                        onChange={(v) => updateContent("footer", { supportLink2: v })}
                        as="span"
                      />
                    </li>
                    <li>
                      <InlineEditable
                        value={footer.supportLink3}
                        onChange={(v) => updateContent("footer", { supportLink3: v })}
                        as="span"
                      />
                    </li>
                    <li>
                      <InlineEditable
                        value={footer.supportLink4}
                        onChange={(v) => updateContent("footer", { supportLink4: v })}
                        as="span"
                      />
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-primary-foreground/10 pt-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/50">
                  <InlineEditable
                    value={footer.copyright.replace("{year}", new Date().getFullYear().toString())}
                    onChange={(v) => updateContent("footer", { copyright: v })}
                    as="p"
                  />
                  <InlineEditable
                    value={footer.madeWith}
                    onChange={(v) => updateContent("footer", { madeWith: v })}
                    as="p"
                  />
                </div>
              </div>
            </div>
          </footer>
        </EditableSection>
      </div>

      {/* Floating Help Tooltip */}
      {showHelp && (
        <div className="fixed bottom-6 left-6 z-50 animate-fade-in">
          <div className="bg-card border border-border rounded-2xl shadow-2xl p-4 max-w-xs relative">
            <button
              onClick={dismissHelp}
              className="absolute top-2 left-2 p-1 hover:bg-muted rounded-full transition-colors"
              aria-label="סגור טיפ"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
                <Pencil className="w-4 h-4 text-primary" />
              </div>
              <div className="pl-4">
                <h4 className="font-bold text-sm mb-1">עורך ויזואלי WYSIWYG</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  לחץ על כל טקסט באתר כדי לערוך אותו ישירות. השינויים נשמרים אוטומטית.
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <kbd className="px-1.5 py-0.5 bg-muted rounded font-mono text-[10px]">Ctrl+Z</kbd>
                  <span>ביטול</span>
                  <kbd className="px-1.5 py-0.5 bg-muted rounded font-mono text-[10px]">Esc</kbd>
                  <span>בטל עריכה</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminLandingEditor() {
  return <WYSIWYGEditorContent />;
}
