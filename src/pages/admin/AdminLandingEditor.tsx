import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  MousePointer2,
  Code2,
  Eye,
  Save,
  RotateCcw,
  Download,
  Upload,
  ChevronDown,
  ChevronLeft,
  Navigation,
  Sparkles,
  Users,
  BarChart3,
  Heart,
  Lightbulb,
  HelpCircle,
  Megaphone,
  FileText,
  ExternalLink,
  Check,
  AlertCircle,
} from "lucide-react";
import { useLandingContent, LandingContent } from "@/contexts/LandingContentContext";
import { toast } from "sonner";

// Section configuration with icons and fields
const SECTIONS_CONFIG = [
  {
    key: "nav" as keyof LandingContent,
    title: "ניווט",
    icon: Navigation,
    fields: [
      { key: "brand", label: "שם המותג", multiline: false },
      { key: "members", label: "טקסט כפתור חברים", multiline: false },
      { key: "login", label: "טקסט כניסה", multiline: false },
      { key: "register", label: "טקסט הרשמה", multiline: false },
    ],
  },
  {
    key: "hero" as keyof LandingContent,
    title: "באנר ראשי",
    icon: Sparkles,
    fields: [
      { key: "title", label: "כותרת ראשית", multiline: false },
      { key: "subtitle", label: "כותרת משנה", multiline: true },
      { key: "cta", label: "טקסט כפתור CTA", multiline: false },
      { key: "secondaryCta", label: "טקסט כפתור משני", multiline: false },
    ],
  },
  {
    key: "features" as keyof LandingContent,
    title: "תכונות",
    icon: Lightbulb,
    fields: [
      { key: "title", label: "כותרת הסקשן", multiline: false },
      { key: "subtitle", label: "תיאור הסקשן", multiline: true },
    ],
  },
  {
    key: "featuredMembers" as keyof LandingContent,
    title: "חברים מובילים",
    icon: Users,
    fields: [
      { key: "title", label: "כותרת", multiline: false },
      { key: "subtitle", label: "תיאור", multiline: true },
    ],
  },
  {
    key: "stats" as keyof LandingContent,
    title: "סטטיסטיקות",
    icon: BarChart3,
    fields: [
      { key: "title", label: "כותרת", multiline: false },
      { key: "subtitle", label: "תיאור", multiline: true },
    ],
  },
  {
    key: "successStories" as keyof LandingContent,
    title: "סיפורי הצלחה",
    icon: Heart,
    fields: [
      { key: "title", label: "כותרת", multiline: false },
      { key: "subtitle", label: "תיאור", multiline: true },
    ],
  },
  {
    key: "datingTips" as keyof LandingContent,
    title: "טיפים להיכרויות",
    icon: Lightbulb,
    fields: [
      { key: "title", label: "כותרת", multiline: false },
      { key: "subtitle", label: "תיאור", multiline: true },
    ],
  },
  {
    key: "faq" as keyof LandingContent,
    title: "שאלות נפוצות",
    icon: HelpCircle,
    fields: [
      { key: "title", label: "כותרת", multiline: false },
      { key: "subtitle", label: "תיאור", multiline: true },
    ],
  },
  {
    key: "cta" as keyof LandingContent,
    title: "קריאה לפעולה",
    icon: Megaphone,
    fields: [
      { key: "title", label: "כותרת", multiline: false },
      { key: "subtitle", label: "תיאור", multiline: true },
      { key: "buttonText", label: "טקסט כפתור", multiline: false },
    ],
  },
  {
    key: "footer" as keyof LandingContent,
    title: "פוטר",
    icon: FileText,
    fields: [
      { key: "brand", label: "שם המותג", multiline: false },
      { key: "description", label: "תיאור", multiline: true },
      { key: "copyright", label: "זכויות יוצרים", multiline: false },
    ],
  },
];

// Section Editor Component
function SectionEditor({
  section,
  content,
  onUpdateContent,
  defaultOpen = false,
}: {
  section: typeof SECTIONS_CONFIG[0];
  content: LandingContent;
  onUpdateContent: <K extends keyof LandingContent>(section: K, data: Partial<LandingContent[K]>) => void;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const Icon = section.icon;
  const sectionContent = content[section.key] as unknown as Record<string, unknown>;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button
          className="w-full flex items-center justify-between p-4 bg-muted/50 hover:bg-muted rounded-lg transition-colors focus-ring"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <span className="font-medium">{section.title}</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-4 p-4 bg-card rounded-lg border border-border">
        {section.fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={`${section.key}-${field.key}`}>{field.label}</Label>
            {field.multiline ? (
              <Textarea
                id={`${section.key}-${field.key}`}
                value={(sectionContent[field.key] as string) || ""}
                onChange={(e) =>
                  onUpdateContent(section.key, { [field.key]: e.target.value } as Partial<LandingContent[typeof section.key]>)
                }
                rows={3}
                dir="rtl"
                className="resize-none"
              />
            ) : (
              <Input
                id={`${section.key}-${field.key}`}
                value={(sectionContent[field.key] as string) || ""}
                onChange={(e) =>
                  onUpdateContent(section.key, { [field.key]: e.target.value } as Partial<LandingContent[typeof section.key]>)
                }
                dir="rtl"
              />
            )}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

// Raw JSON Editor Component
function RawEditor({
  content,
  onImport,
}: {
  content: LandingContent;
  onImport: (content: LandingContent) => void;
}) {
  const [jsonText, setJsonText] = useState(() => JSON.stringify(content, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(true);

  const handleTextChange = (text: string) => {
    setJsonText(text);
    try {
      JSON.parse(text);
      setError(null);
      setIsValid(true);
    } catch (e) {
      setError((e as Error).message);
      setIsValid(false);
    }
  };

  const handleApply = () => {
    try {
      const parsed = JSON.parse(jsonText);
      onImport(parsed);
      toast.success("התוכן עודכן בהצלחה");
    } catch (e) {
      toast.error("שגיאה בפורמט JSON");
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
      setError(null);
      setIsValid(true);
    } catch (e) {
      toast.error("לא ניתן לפרמט - JSON לא תקין");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isValid ? (
            <Badge variant="outline" className="gap-1 text-green-600 border-green-600">
              <Check className="w-3 h-3" />
              תקין
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1 text-destructive border-destructive">
              <AlertCircle className="w-3 h-3" />
              שגיאה
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleFormat} disabled={!isValid}>
            <Code2 className="w-4 h-4 ml-2" />
            פרמט
          </Button>
          <Button size="sm" onClick={handleApply} disabled={!isValid}>
            <Save className="w-4 h-4 ml-2" />
            החל שינויים
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
          {error}
        </div>
      )}

      <Textarea
        value={jsonText}
        onChange={(e) => handleTextChange(e.target.value)}
        className="font-mono text-sm min-h-[500px] resize-none"
        dir="ltr"
        spellCheck={false}
      />
    </div>
  );
}

export default function AdminLandingEditor() {
  const { content, updateContent, resetContent } = useLandingContent();
  const [activeTab, setActiveTab] = useState<"visual" | "raw">("visual");

  const handleExport = () => {
    const dataStr = JSON.stringify(content, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "landing-content.json";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("הקובץ יורד בהצלחה");
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target?.result as string);
            // Update each section
            Object.keys(imported).forEach((key) => {
              updateContent(key as keyof LandingContent, imported[key]);
            });
            toast.success("התוכן יובא בהצלחה");
          } catch {
            toast.error("שגיאה בקריאת הקובץ");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleReset = () => {
    if (confirm("האם אתה בטוח שברצונך לאפס את כל התוכן לברירת המחדל?")) {
      resetContent();
      toast.success("התוכן אופס לברירת מחדל");
    }
  };

  const handleRawImport = (newContent: LandingContent) => {
    Object.keys(newContent).forEach((key) => {
      updateContent(key as keyof LandingContent, newContent[key as keyof LandingContent]);
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">עורך דף נחיתה</h1>
            <p className="text-muted-foreground mt-1">ערוך את תוכן דף הבית של האתר</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" asChild>
              <a href="/" target="_blank" rel="noopener noreferrer">
                <Eye className="w-4 h-4 ml-2" />
                צפה באתר
                <ExternalLink className="w-3 h-3 mr-1" />
              </a>
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 ml-2" />
              ייצוא
            </Button>
            <Button variant="outline" size="sm" onClick={handleImport}>
              <Upload className="w-4 h-4 ml-2" />
              יבוא
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 ml-2" />
              איפוס
            </Button>
          </div>
        </div>

        {/* Editor Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "visual" | "raw")}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="visual" className="gap-2">
              <MousePointer2 className="w-4 h-4" />
              עורך ויזואלי
            </TabsTrigger>
            <TabsTrigger value="raw" className="gap-2">
              <Code2 className="w-4 h-4" />
              עורך קוד
            </TabsTrigger>
          </TabsList>

          {/* Visual Editor */}
          <TabsContent value="visual" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MousePointer2 className="w-5 h-5 text-primary" />
                  עריכה ויזואלית
                </CardTitle>
                <CardDescription>
                  ערוך את תוכן הסקשנים השונים בדף הנחיתה בקלות
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-3">
                    {SECTIONS_CONFIG.map((section, index) => (
                      <SectionEditor
                        key={section.key}
                        section={section}
                        content={content}
                        onUpdateContent={updateContent}
                        defaultOpen={index === 0}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Raw JSON Editor */}
          <TabsContent value="raw" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-primary" />
                  עריכת קוד JSON
                </CardTitle>
                <CardDescription>
                  ערוך את כל התוכן ישירות בפורמט JSON לשליטה מלאה
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RawEditor content={content} onImport={handleRawImport} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Help Card */}
        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">טיפים לעריכה</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• השינויים נשמרים אוטומטית ב-localStorage</li>
                  <li>• ניתן לייצא את התוכן לגיבוי או לשיתוף</li>
                  <li>• השתמש בכפתור "איפוס" לחזרה לברירת המחדל</li>
                  <li>• בעורך הקוד, ודא שה-JSON תקין לפני החלת השינויים</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
