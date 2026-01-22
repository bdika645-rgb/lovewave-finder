import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Undo2,
  Redo2,
  RotateCcw,
  Download,
  Upload,
  Search,
  Eye,
  EyeOff,
  Sparkles,
  X,
  Check,
  Keyboard,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorToolbarProps {
  isEditMode: boolean;
  onToggleEditMode: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onExport: () => void;
  onImport: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  historyLength: number;
  hasChanges: boolean;
}

export default function EditorToolbar({
  isEditMode,
  onToggleEditMode,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReset,
  onExport,
  onImport,
  searchQuery,
  onSearchChange,
  historyLength,
  hasChanges,
}: EditorToolbarProps) {
  return (
    <TooltipProvider>
      <div
        className={cn(
          "fixed bottom-4 left-1/2 -translate-x-1/2 z-50",
          "bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-elevated",
          "p-2 flex items-center gap-2 transition-all duration-300",
          isEditMode ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        )}
        dir="rtl"
      >
        {/* Search */}
        <div className="relative">
          <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="חיפוש..."
            className="w-40 pr-8 h-9 text-sm bg-muted/50"
            dir="rtl"
          />
        </div>

        <div className="w-px h-6 bg-border" />

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onUndo}
                disabled={!canUndo}
                className="h-9 w-9"
              >
                <Undo2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <div className="flex items-center gap-2">
                <span>ביטול</span>
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Ctrl+Z</kbd>
              </div>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onRedo}
                disabled={!canRedo}
                className="h-9 w-9"
              >
                <Redo2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <div className="flex items-center gap-2">
                <span>שחזור</span>
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Ctrl+Y</kbd>
              </div>
            </TooltipContent>
          </Tooltip>

          {historyLength > 0 && (
            <Badge variant="secondary" className="text-xs">
              {historyLength}
            </Badge>
          )}
        </div>

        <div className="w-px h-6 bg-border" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onExport} className="h-9 w-9">
                <Download className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">ייצוא תוכן</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onImport} className="h-9 w-9">
                <Upload className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">יבוא תוכן</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onReset} className="h-9 w-9">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">איפוס לברירת מחדל</TooltipContent>
          </Tooltip>
        </div>

        <div className="w-px h-6 bg-border" />

        {/* Status */}
        <div className="flex items-center gap-2 px-2">
          {hasChanges && (
            <Badge variant="outline" className="text-xs gap-1 text-primary border-primary">
              <Check className="w-3 h-3" />
              נשמר אוטומטית
            </Badge>
          )}
        </div>

        {/* Keyboard shortcut hint */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Keyboard className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between gap-4">
                <span>ביטול</span>
                <kbd className="px-1 bg-muted rounded">Ctrl+Z</kbd>
              </div>
              <div className="flex justify-between gap-4">
                <span>שחזור</span>
                <kbd className="px-1 bg-muted rounded">Ctrl+Y</kbd>
              </div>
              <div className="flex justify-between gap-4">
                <span>סגירת עורך</span>
                <kbd className="px-1 bg-muted rounded">Escape</kbd>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Toggle Button */}
      <Button
        onClick={onToggleEditMode}
        className={cn(
          "fixed bottom-6 left-6 z-50 shadow-elevated gap-2 transition-all duration-300",
          "rounded-full px-6 py-6",
          isEditMode
            ? "bg-destructive hover:bg-destructive/90"
            : "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        )}
        size="lg"
      >
        {isEditMode ? (
          <>
            <X className="w-5 h-5" />
            סגור עורך
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            עורך ויזואלי
          </>
        )}
      </Button>
    </TooltipProvider>
  );
}
