import { useState } from "react";
import { Settings2, GripVertical, RotateCcw, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { DashboardWidget } from "@/hooks/useAdminDashboardWidgets";

interface DashboardWidgetSettingsProps {
  widgets: DashboardWidget[];
  onToggle: (id: string) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
  onReset: () => void;
}

export default function DashboardWidgetSettings({
  widgets,
  onToggle,
  onReorder,
  onReset,
}: DashboardWidgetSettingsProps) {
  const [open, setOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    onReorder(draggedIndex, index);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="w-4 h-4" />
          <span className="hidden sm:inline">התאמת לוח</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[350px] sm:w-[400px]" dir="rtl">
        <SheetHeader>
          <SheetTitle>התאמת ווידג'טים</SheetTitle>
          <SheetDescription>
            בחר אילו ווידג'טים להציג וסדר אותם בגרירה
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">ווידג'טים</span>
            <Button variant="ghost" size="sm" onClick={onReset} className="text-xs gap-1">
              <RotateCcw className="w-3 h-3" />
              איפוס לברירת מחדל
            </Button>
          </div>

          <div className="space-y-2">
            {widgets.map((widget, index) => (
              <div
                key={widget.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-3 p-3 rounded-lg border bg-card transition-all ${
                  draggedIndex === index ? "opacity-50 border-primary" : ""
                } ${widget.enabled ? "" : "opacity-60"}`}
              >
                <button
                  type="button"
                  className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
                  aria-label="גרור לשינוי סדר"
                >
                  <GripVertical className="w-4 h-4" />
                </button>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{widget.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {widget.size === "small" ? "קטן" : widget.size === "medium" ? "בינוני" : "גדול"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {widget.enabled ? (
                    <Eye className="w-4 h-4 text-success" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  )}
                  <Switch
                    checked={widget.enabled}
                    onCheckedChange={() => onToggle(widget.id)}
                    aria-label={widget.enabled ? "הסתר ווידג'ט" : "הצג ווידג'ט"}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
