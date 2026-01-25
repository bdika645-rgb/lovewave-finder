import { Button } from "@/components/ui/button";
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
  X,
  Check,
  Eye,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface EditorToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onExport: () => void;
  onImport: () => void;
  historyLength: number;
  hasChanges: boolean;
}

export default function EditorToolbar({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReset,
  onExport,
  onImport,
  historyLength,
  hasChanges,
}: EditorToolbarProps) {
  return (
    <TooltipProvider>
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left side - Close & Status */}
            <div className="flex items-center gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link 
                    to="/admin" 
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">סגור עורך</TooltipContent>
              </Tooltip>
              
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="font-medium text-sm">מצב עריכה</span>
              </div>

              {hasChanges && (
                <Badge variant="outline" className="gap-1 text-primary border-primary/30 bg-primary/5">
                  <Check className="w-3 h-3" />
                  נשמר
                </Badge>
              )}
            </div>

            {/* Center - Edit Mode Hint */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Pencil className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">לחץ על טקסט לעריכה</span>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-1">
              {/* Undo/Redo */}
              <div className="flex items-center gap-1 ml-2 pl-2 border-l border-border">
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
                  <TooltipContent side="bottom">
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
                  <TooltipContent side="bottom">
                    <div className="flex items-center gap-2">
                      <span>שחזור</span>
                      <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Ctrl+Y</kbd>
                    </div>
                  </TooltipContent>
                </Tooltip>

                {historyLength > 0 && (
                  <Badge variant="secondary" className="text-xs h-5 px-1.5">
                    {historyLength}
                  </Badge>
                )}
              </div>

              {/* Preview */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" asChild className="gap-2">
                    <a href="/" target="_blank" rel="noopener noreferrer">
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">צפייה</span>
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">פתח בכרטיסייה חדשה</TooltipContent>
              </Tooltip>

              {/* Export */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onExport} className="h-9 w-9">
                    <Download className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">ייצוא JSON</TooltipContent>
              </Tooltip>

              {/* Import */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onImport} className="h-9 w-9">
                    <Upload className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">יבוא JSON</TooltipContent>
              </Tooltip>

              {/* Reset */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onReset} className="h-9 w-9 text-destructive hover:text-destructive">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">איפוס לברירת מחדל</TooltipContent>
              </Tooltip>

              {/* Finish */}
              <Button size="sm" asChild className="gap-2 mr-2">
                <Link to="/admin">
                  <Check className="w-4 h-4" />
                  סיום
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="fixed top-[60px] left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-primary z-50" />
    </TooltipProvider>
  );
}
