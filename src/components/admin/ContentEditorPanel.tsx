import { useState } from "react";
import { useLandingContent } from "@/contexts/LandingContentContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  X,
  ChevronDown,
  RotateCcw,
  Save,
  Eye,
  EyeOff,
  Sparkles,
  Home,
  Users,
  BarChart3,
  Heart,
  Lightbulb,
  HelpCircle,
  MousePointerClick,
  Layout,
  Navigation,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionEditorProps {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function SectionEditor({ title, icon, defaultOpen = false, children }: SectionEditorProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors text-right">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              {icon}
            </div>
            <span className="font-medium text-sm">{title}</span>
          </div>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 pb-2 px-1 space-y-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
}

function Field({ label, value, onChange, multiline = false, placeholder }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {multiline ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[80px] text-sm resize-none"
          dir="rtl"
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="text-sm"
          dir="rtl"
        />
      )}
    </div>
  );
}

export default function ContentEditorPanel() {
  const { content, updateContent, resetContent, isEditMode, setIsEditMode } = useLandingContent();

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={() => setIsEditMode(!isEditMode)}
        className={cn(
          "fixed bottom-24 left-4 z-50 shadow-lg gap-2 transition-all",
          isEditMode ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
        )}
        size="lg"
      >
        {isEditMode ? (
          <>
            <EyeOff className="w-4 h-4" />
            סגור עורך
          </>
        ) : (
          <>
            <Eye className="w-4 h-4" />
            ערוך תוכן
          </>
        )}
      </Button>

      {/* Editor Sheet */}
      <Sheet open={isEditMode} onOpenChange={setIsEditMode}>
        <SheetContent
          side="left"
          className="w-[400px] sm:w-[450px] p-0 bg-background/95 backdrop-blur-xl border-r border-border"
        >
          <SheetHeader className="p-6 pb-4 border-b border-border bg-card/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 gradient-primary rounded-lg">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <SheetTitle className="text-lg">עורך תוכן</SheetTitle>
                  <SheetDescription className="text-xs">
                    עריכה בזמן אמת
                  </SheetDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditMode(false)}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-180px)]">
            <div className="p-4 space-y-4">
              {/* Navigation Section */}
              <SectionEditor title="ניווט" icon={<Navigation className="w-4 h-4" />}>
                <Field
                  label="שם המותג"
                  value={content.nav.brandName}
                  onChange={(v) => updateContent("nav", { brandName: v })}
                />
                <Field
                  label="כפתור התחברות"
                  value={content.nav.loginButton}
                  onChange={(v) => updateContent("nav", { loginButton: v })}
                />
                <Field
                  label="כפתור הרשמה"
                  value={content.nav.registerButton}
                  onChange={(v) => updateContent("nav", { registerButton: v })}
                />
              </SectionEditor>

              <Separator />

              {/* Hero Section */}
              <SectionEditor title="Hero - כותרת ראשית" icon={<Home className="w-4 h-4" />} defaultOpen>
                <Field
                  label="תגית (Badge)"
                  value={content.hero.badge}
                  onChange={(v) => updateContent("hero", { badge: v })}
                />
                <Field
                  label="כותרת שורה 1"
                  value={content.hero.titleLine1}
                  onChange={(v) => updateContent("hero", { titleLine1: v })}
                />
                <Field
                  label="כותרת שורה 2 (מודגשת)"
                  value={content.hero.titleLine2}
                  onChange={(v) => updateContent("hero", { titleLine2: v })}
                />
                <Field
                  label="תיאור"
                  value={content.hero.description}
                  onChange={(v) => updateContent("hero", { description: v })}
                  multiline
                />
                <Field
                  label="כפתור ראשי"
                  value={content.hero.ctaButton}
                  onChange={(v) => updateContent("hero", { ctaButton: v })}
                />
                <Field
                  label="כפתור משני"
                  value={content.hero.secondaryButton}
                  onChange={(v) => updateContent("hero", { secondaryButton: v })}
                />
                <Separator className="my-3" />
                <p className="text-xs text-muted-foreground font-medium">סטטיסטיקות</p>
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="ערך 1"
                    value={content.hero.stat1Value}
                    onChange={(v) => updateContent("hero", { stat1Value: v })}
                  />
                  <Field
                    label="תווית 1"
                    value={content.hero.stat1Label}
                    onChange={(v) => updateContent("hero", { stat1Label: v })}
                  />
                  <Field
                    label="ערך 2"
                    value={content.hero.stat2Value}
                    onChange={(v) => updateContent("hero", { stat2Value: v })}
                  />
                  <Field
                    label="תווית 2"
                    value={content.hero.stat2Label}
                    onChange={(v) => updateContent("hero", { stat2Label: v })}
                  />
                  <Field
                    label="ערך 3"
                    value={content.hero.stat3Value}
                    onChange={(v) => updateContent("hero", { stat3Value: v })}
                  />
                  <Field
                    label="תווית 3"
                    value={content.hero.stat3Label}
                    onChange={(v) => updateContent("hero", { stat3Label: v })}
                  />
                </div>
              </SectionEditor>

              <Separator />

              {/* Features Section */}
              <SectionEditor title="תכונות / יתרונות" icon={<Sparkles className="w-4 h-4" />}>
                <Field
                  label="כותרת"
                  value={content.features.title}
                  onChange={(v) => updateContent("features", { title: v })}
                />
                <Field
                  label="חלק מודגש"
                  value={content.features.titleHighlight}
                  onChange={(v) => updateContent("features", { titleHighlight: v })}
                />
                <Field
                  label="תיאור"
                  value={content.features.description}
                  onChange={(v) => updateContent("features", { description: v })}
                  multiline
                />
                <Separator className="my-3" />
                {content.features.items.map((item, idx) => (
                  <div key={item.id} className="p-3 bg-muted/30 rounded-lg space-y-3">
                    <p className="text-xs font-medium text-primary">תכונה {idx + 1}</p>
                    <Field
                      label="כותרת"
                      value={item.title}
                      onChange={(v) => {
                        const newItems = [...content.features.items];
                        newItems[idx] = { ...newItems[idx], title: v };
                        updateContent("features", { items: newItems });
                      }}
                    />
                    <Field
                      label="תיאור"
                      value={item.description}
                      onChange={(v) => {
                        const newItems = [...content.features.items];
                        newItems[idx] = { ...newItems[idx], description: v };
                        updateContent("features", { items: newItems });
                      }}
                      multiline
                    />
                  </div>
                ))}
              </SectionEditor>

              <Separator />

              {/* Featured Members Section */}
              <SectionEditor title="פרופילים מובחרים" icon={<Users className="w-4 h-4" />}>
                <Field
                  label="כותרת"
                  value={content.featuredMembers.title}
                  onChange={(v) => updateContent("featuredMembers", { title: v })}
                />
                <Field
                  label="חלק מודגש"
                  value={content.featuredMembers.titleHighlight}
                  onChange={(v) => updateContent("featuredMembers", { titleHighlight: v })}
                />
                <Field
                  label="תיאור"
                  value={content.featuredMembers.description}
                  onChange={(v) => updateContent("featuredMembers", { description: v })}
                />
                <Field
                  label="כפתור CTA"
                  value={content.featuredMembers.ctaButton}
                  onChange={(v) => updateContent("featuredMembers", { ctaButton: v })}
                />
              </SectionEditor>

              <Separator />

              {/* Stats Section */}
              <SectionEditor title="סטטיסטיקות" icon={<BarChart3 className="w-4 h-4" />}>
                <Field
                  label="תווית 1"
                  value={content.stats.stat1Label}
                  onChange={(v) => updateContent("stats", { stat1Label: v })}
                />
                <Field
                  label="תווית 2"
                  value={content.stats.stat2Label}
                  onChange={(v) => updateContent("stats", { stat2Label: v })}
                />
                <Field
                  label="תווית 3"
                  value={content.stats.stat3Label}
                  onChange={(v) => updateContent("stats", { stat3Label: v })}
                />
                <Field
                  label="תווית 4"
                  value={content.stats.stat4Label}
                  onChange={(v) => updateContent("stats", { stat4Label: v })}
                />
                <Field
                  label="תווית 5"
                  value={content.stats.stat5Label}
                  onChange={(v) => updateContent("stats", { stat5Label: v })}
                />
                <Field
                  label="תווית 6"
                  value={content.stats.stat6Label}
                  onChange={(v) => updateContent("stats", { stat6Label: v })}
                />
              </SectionEditor>

              <Separator />

              {/* Success Stories Section */}
              <SectionEditor title="סיפורי הצלחה" icon={<Heart className="w-4 h-4" />}>
                <Field
                  label="כותרת"
                  value={content.successStories.title}
                  onChange={(v) => updateContent("successStories", { title: v })}
                />
                <Field
                  label="חלק מודגש"
                  value={content.successStories.titleHighlight}
                  onChange={(v) => updateContent("successStories", { titleHighlight: v })}
                />
                <Field
                  label="תיאור"
                  value={content.successStories.description}
                  onChange={(v) => updateContent("successStories", { description: v })}
                />
              </SectionEditor>

              <Separator />

              {/* Dating Tips Section */}
              <SectionEditor title="טיפים לדייטינג" icon={<Lightbulb className="w-4 h-4" />}>
                <Field
                  label="כותרת"
                  value={content.datingTips.title}
                  onChange={(v) => updateContent("datingTips", { title: v })}
                />
                <Field
                  label="חלק מודגש"
                  value={content.datingTips.titleHighlight}
                  onChange={(v) => updateContent("datingTips", { titleHighlight: v })}
                />
                <Field
                  label="תיאור"
                  value={content.datingTips.description}
                  onChange={(v) => updateContent("datingTips", { description: v })}
                />
              </SectionEditor>

              <Separator />

              {/* FAQ Section */}
              <SectionEditor title="שאלות נפוצות" icon={<HelpCircle className="w-4 h-4" />}>
                <Field
                  label="כותרת"
                  value={content.faq.title}
                  onChange={(v) => updateContent("faq", { title: v })}
                />
                <Field
                  label="חלק מודגש"
                  value={content.faq.titleHighlight}
                  onChange={(v) => updateContent("faq", { titleHighlight: v })}
                />
                <Field
                  label="תיאור"
                  value={content.faq.description}
                  onChange={(v) => updateContent("faq", { description: v })}
                />
              </SectionEditor>

              <Separator />

              {/* CTA Section */}
              <SectionEditor title="קריאה לפעולה (CTA)" icon={<MousePointerClick className="w-4 h-4" />}>
                <Field
                  label="כותרת"
                  value={content.cta.title}
                  onChange={(v) => updateContent("cta", { title: v })}
                />
                <Field
                  label="תיאור"
                  value={content.cta.description}
                  onChange={(v) => updateContent("cta", { description: v })}
                  multiline
                />
                <Field
                  label="כפתור"
                  value={content.cta.button}
                  onChange={(v) => updateContent("cta", { button: v })}
                />
              </SectionEditor>

              <Separator />

              {/* Footer Section */}
              <SectionEditor title="פוטר" icon={<Layout className="w-4 h-4" />}>
                <Field
                  label="תיאור מותג"
                  value={content.footer.brandDescription}
                  onChange={(v) => updateContent("footer", { brandDescription: v })}
                  multiline
                />
                <Separator className="my-3" />
                <p className="text-xs text-muted-foreground font-medium">קישורים מהירים</p>
                <Field
                  label="כותרת"
                  value={content.footer.quickLinksTitle}
                  onChange={(v) => updateContent("footer", { quickLinksTitle: v })}
                />
                <Field
                  label="קישור 1"
                  value={content.footer.quickLink1}
                  onChange={(v) => updateContent("footer", { quickLink1: v })}
                />
                <Field
                  label="קישור 2"
                  value={content.footer.quickLink2}
                  onChange={(v) => updateContent("footer", { quickLink2: v })}
                />
                <Field
                  label="קישור 3"
                  value={content.footer.quickLink3}
                  onChange={(v) => updateContent("footer", { quickLink3: v })}
                />
                <Separator className="my-3" />
                <p className="text-xs text-muted-foreground font-medium">חשבון</p>
                <Field
                  label="כותרת"
                  value={content.footer.accountTitle}
                  onChange={(v) => updateContent("footer", { accountTitle: v })}
                />
                <Field
                  label="קישור 1"
                  value={content.footer.accountLink1}
                  onChange={(v) => updateContent("footer", { accountLink1: v })}
                />
                <Field
                  label="קישור 2"
                  value={content.footer.accountLink2}
                  onChange={(v) => updateContent("footer", { accountLink2: v })}
                />
                <Field
                  label="קישור 3"
                  value={content.footer.accountLink3}
                  onChange={(v) => updateContent("footer", { accountLink3: v })}
                />
                <Separator className="my-3" />
                <p className="text-xs text-muted-foreground font-medium">תמיכה</p>
                <Field
                  label="כותרת"
                  value={content.footer.supportTitle}
                  onChange={(v) => updateContent("footer", { supportTitle: v })}
                />
                <Field
                  label="קישור 1"
                  value={content.footer.supportLink1}
                  onChange={(v) => updateContent("footer", { supportLink1: v })}
                />
                <Field
                  label="קישור 2"
                  value={content.footer.supportLink2}
                  onChange={(v) => updateContent("footer", { supportLink2: v })}
                />
                <Field
                  label="קישור 3"
                  value={content.footer.supportLink3}
                  onChange={(v) => updateContent("footer", { supportLink3: v })}
                />
                <Field
                  label="קישור 4"
                  value={content.footer.supportLink4}
                  onChange={(v) => updateContent("footer", { supportLink4: v })}
                />
                <Separator className="my-3" />
                <Field
                  label="זכויות יוצרים"
                  value={content.footer.copyright}
                  onChange={(v) => updateContent("footer", { copyright: v })}
                  placeholder="השתמש ב-{year} לשנה דינמית"
                />
                <Field
                  label="תגית תחתונה"
                  value={content.footer.madeWith}
                  onChange={(v) => updateContent("footer", { madeWith: v })}
                />
              </SectionEditor>
            </div>
          </ScrollArea>

          {/* Footer Actions */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card/80 backdrop-blur-sm">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={resetContent}
                className="flex-1 gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                איפוס
              </Button>
              <Button
                onClick={() => setIsEditMode(false)}
                className="flex-1 gap-2 bg-primary"
              >
                <Save className="w-4 h-4" />
                סיום
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
