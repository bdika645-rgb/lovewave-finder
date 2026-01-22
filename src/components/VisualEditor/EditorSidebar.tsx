import { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  Search,
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
  Star,
  Palette,
  Type,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LandingContent } from "@/contexts/LandingContentContext";

interface SectionConfig {
  key: keyof LandingContent;
  title: string;
  icon: React.ReactNode;
  fields: FieldConfig[];
}

interface FieldConfig {
  key: string;
  label: string;
  multiline?: boolean;
  placeholder?: string;
  nested?: string;
}

const SECTIONS: SectionConfig[] = [
  {
    key: "nav",
    title: "ניווט",
    icon: <Navigation className="w-4 h-4" />,
    fields: [
      { key: "brandName", label: "שם המותג" },
      { key: "loginButton", label: "כפתור התחברות" },
      { key: "registerButton", label: "כפתור הרשמה" },
    ],
  },
  {
    key: "hero",
    title: "Hero - כותרת ראשית",
    icon: <Home className="w-4 h-4" />,
    fields: [
      { key: "badge", label: "תגית (Badge)" },
      { key: "titleLine1", label: "כותרת שורה 1" },
      { key: "titleLine2", label: "כותרת שורה 2 (מודגשת)" },
      { key: "description", label: "תיאור", multiline: true },
      { key: "ctaButton", label: "כפתור ראשי" },
      { key: "secondaryButton", label: "כפתור משני" },
      { key: "stat1Value", label: "סטטיסטיקה 1 - ערך" },
      { key: "stat1Label", label: "סטטיסטיקה 1 - תווית" },
      { key: "stat2Value", label: "סטטיסטיקה 2 - ערך" },
      { key: "stat2Label", label: "סטטיסטיקה 2 - תווית" },
      { key: "stat3Value", label: "סטטיסטיקה 3 - ערך" },
      { key: "stat3Label", label: "סטטיסטיקה 3 - תווית" },
    ],
  },
  {
    key: "features",
    title: "תכונות / יתרונות",
    icon: <Star className="w-4 h-4" />,
    fields: [
      { key: "title", label: "כותרת" },
      { key: "titleHighlight", label: "חלק מודגש" },
      { key: "description", label: "תיאור", multiline: true },
    ],
  },
  {
    key: "featuredMembers",
    title: "פרופילים מובחרים",
    icon: <Users className="w-4 h-4" />,
    fields: [
      { key: "title", label: "כותרת" },
      { key: "titleHighlight", label: "חלק מודגש" },
      { key: "description", label: "תיאור", multiline: true },
      { key: "ctaButton", label: "כפתור CTA" },
    ],
  },
  {
    key: "stats",
    title: "סטטיסטיקות",
    icon: <BarChart3 className="w-4 h-4" />,
    fields: [
      { key: "stat1Label", label: "תווית 1" },
      { key: "stat2Label", label: "תווית 2" },
      { key: "stat3Label", label: "תווית 3" },
      { key: "stat4Label", label: "תווית 4" },
      { key: "stat5Label", label: "תווית 5" },
      { key: "stat6Label", label: "תווית 6" },
    ],
  },
  {
    key: "successStories",
    title: "סיפורי הצלחה",
    icon: <Heart className="w-4 h-4" />,
    fields: [
      { key: "title", label: "כותרת" },
      { key: "titleHighlight", label: "חלק מודגש" },
      { key: "description", label: "תיאור", multiline: true },
    ],
  },
  {
    key: "datingTips",
    title: "טיפים לדייטינג",
    icon: <Lightbulb className="w-4 h-4" />,
    fields: [
      { key: "title", label: "כותרת" },
      { key: "titleHighlight", label: "חלק מודגש" },
      { key: "description", label: "תיאור", multiline: true },
    ],
  },
  {
    key: "faq",
    title: "שאלות נפוצות",
    icon: <HelpCircle className="w-4 h-4" />,
    fields: [
      { key: "title", label: "כותרת" },
      { key: "titleHighlight", label: "חלק מודגש" },
      { key: "description", label: "תיאור", multiline: true },
    ],
  },
  {
    key: "cta",
    title: "קריאה לפעולה",
    icon: <MousePointerClick className="w-4 h-4" />,
    fields: [
      { key: "title", label: "כותרת" },
      { key: "description", label: "תיאור", multiline: true },
      { key: "button", label: "כפתור" },
    ],
  },
  {
    key: "footer",
    title: "פוטר",
    icon: <Layout className="w-4 h-4" />,
    fields: [
      { key: "brandDescription", label: "תיאור מותג", multiline: true },
      { key: "quickLinksTitle", label: "כותרת - קישורים מהירים" },
      { key: "quickLink1", label: "קישור מהיר 1" },
      { key: "quickLink2", label: "קישור מהיר 2" },
      { key: "quickLink3", label: "קישור מהיר 3" },
      { key: "accountTitle", label: "כותרת - חשבון" },
      { key: "accountLink1", label: "קישור חשבון 1" },
      { key: "accountLink2", label: "קישור חשבון 2" },
      { key: "accountLink3", label: "קישור חשבון 3" },
      { key: "supportTitle", label: "כותרת - תמיכה" },
      { key: "supportLink1", label: "קישור תמיכה 1" },
      { key: "supportLink2", label: "קישור תמיכה 2" },
      { key: "supportLink3", label: "קישור תמיכה 3" },
      { key: "supportLink4", label: "קישור תמיכה 4" },
      { key: "copyright", label: "זכויות יוצרים", placeholder: "השתמש ב-{year} לשנה דינמית" },
      { key: "madeWith", label: "תגית תחתונה" },
    ],
  },
];

interface EditorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  content: LandingContent;
  onUpdateContent: <K extends keyof LandingContent>(
    section: K,
    data: Partial<LandingContent[K]>
  ) => void;
  searchQuery: string;
}

function SectionEditor({
  section,
  content,
  onUpdateContent,
  isHighlighted,
}: {
  section: SectionConfig;
  content: LandingContent;
  onUpdateContent: EditorSidebarProps["onUpdateContent"];
  isHighlighted: boolean;
}) {
  const [isOpen, setIsOpen] = useState(isHighlighted);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sectionContent = content[section.key] as any;

  return (
    <Collapsible open={isOpen || isHighlighted} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            "flex items-center justify-between w-full p-3 rounded-lg transition-all text-right",
            isHighlighted
              ? "bg-primary/20 border border-primary"
              : "bg-muted/50 hover:bg-muted"
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "p-2 rounded-lg",
                isHighlighted ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
              )}
            >
              {section.icon}
            </div>
            <span className="font-medium text-sm">{section.title}</span>
            {isHighlighted && (
              <Badge variant="secondary" className="text-xs">
                תוצאה
              </Badge>
            )}
          </div>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform",
              (isOpen || isHighlighted) && "rotate-180"
            )}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 pb-2 px-1 space-y-4">
        {section.fields.map((field) => {
          const value = String(sectionContent[field.key] || "");
          return (
            <div key={field.key} className="space-y-2">
              <Label className="text-xs text-muted-foreground flex items-center gap-2">
                <Type className="w-3 h-3" />
                {field.label}
              </Label>
              {field.multiline ? (
                <Textarea
                  value={value}
                  onChange={(e) =>
                    onUpdateContent(section.key, { [field.key]: e.target.value } as Partial<LandingContent[typeof section.key]>)
                  }
                  placeholder={field.placeholder}
                  className="min-h-[80px] text-sm resize-none"
                  dir="rtl"
                />
              ) : (
                <Input
                  value={value}
                  onChange={(e) =>
                    onUpdateContent(section.key, { [field.key]: e.target.value } as Partial<LandingContent[typeof section.key]>)
                  }
                  placeholder={field.placeholder}
                  className="text-sm"
                  dir="rtl"
                />
              )}
            </div>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function EditorSidebar({
  isOpen,
  onClose,
  content,
  onUpdateContent,
  searchQuery,
}: EditorSidebarProps) {
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return SECTIONS;

    const query = searchQuery.toLowerCase();
    return SECTIONS.filter((section) => {
      // Check section title
      if (section.title.toLowerCase().includes(query)) return true;

      // Check field labels
      if (section.fields.some((f) => f.label.toLowerCase().includes(query))) return true;

      // Check content values
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sectionContent = content[section.key] as any;
      return section.fields.some((f) => {
        const value = String(sectionContent[f.key] || "");
        return value.toLowerCase().includes(query);
      });
    });
  }, [searchQuery, content]);

  const highlightedSections = useMemo(() => {
    if (!searchQuery.trim()) return new Set<string>();

    const query = searchQuery.toLowerCase();
    const highlighted = new Set<string>();

    SECTIONS.forEach((section) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sectionContent = content[section.key] as any;
      section.fields.forEach((f) => {
        const value = String(sectionContent[f.key] || "");
        if (
          f.label.toLowerCase().includes(query) ||
          value.toLowerCase().includes(query)
        ) {
          highlighted.add(section.key);
        }
      });
    });

    return highlighted;
  }, [searchQuery, content]);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-[420px] sm:w-[480px] p-0 bg-background/98 backdrop-blur-xl border-l border-border"
      >
        <SheetHeader className="p-6 pb-4 border-b border-border bg-gradient-to-l from-primary/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 gradient-primary rounded-xl">
                <Palette className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <SheetTitle className="text-lg font-display">עורך תוכן</SheetTitle>
                <SheetDescription className="text-xs">
                  ערוך את כל הטקסטים באתר
                </SheetDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </SheetHeader>

        {/* Search */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={() => {}}
              placeholder="חיפוש בתוכן..."
              className="pr-10 bg-muted/50"
              dir="rtl"
              disabled
            />
          </div>
          {searchQuery && (
            <p className="text-xs text-muted-foreground mt-2">
              נמצאו {filteredSections.length} סעיפים
            </p>
          )}
        </div>

        <ScrollArea className="h-[calc(100vh-220px)]">
          <div className="p-4 space-y-3">
            {filteredSections.map((section, idx) => (
              <div key={section.key}>
                <SectionEditor
                  section={section}
                  content={content}
                  onUpdateContent={onUpdateContent}
                  isHighlighted={highlightedSections.has(section.key)}
                />
                {idx < filteredSections.length - 1 && <Separator className="my-3" />}
              </div>
            ))}

            {filteredSections.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-medium">לא נמצאו תוצאות</p>
                <p className="text-sm">נסה לחפש מילים אחרות</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Features Items Editor - Special Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>השינויים נשמרים אוטומטית</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
