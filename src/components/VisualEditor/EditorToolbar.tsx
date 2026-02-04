import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
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
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
    <TooltipProvider delayDuration={300}>
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        {/* Main Toolbar */}
        <div className="bg-card/98 backdrop-blur-xl border-b border-border shadow-xl">
          <div className="container mx-auto px-4 py-2.5">
            <div className="flex items-center justify-between gap-4">
              {/* Left side - Close & Status */}
              <div className="flex items-center gap-3">
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
                
                <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full">
                  <motion.div 
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                  <span className="font-medium text-sm text-primary">עריכה חיה</span>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={hasChanges ? "has-changes" : "no-changes"}
                >
                  <Badge 
                    variant={hasChanges ? "default" : "secondary"}
                    className={cn(
                      "gap-1.5 transition-colors",
                      hasChanges 
                        ? "border-primary/20 bg-primary/10 text-primary" 
                        : "border-muted bg-muted/50 text-muted-foreground"
                    )}
                  >
                    <Check className={cn("w-3 h-3", hasChanges && "animate-pulse")} />
                    {hasChanges ? "נשמר אוטומטית ✓" : "אין שינויים"}
                  </Badge>
                </motion.div>
              </div>

              {/* Center - Edit Mode Hint */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">לחץ על כל טקסט כדי לערוך אותו ישירות</span>
              </div>

              {/* Right side - Actions */}
              <div className="flex items-center gap-1">
                {/* Undo/Redo */}
                <div className="flex items-center gap-0.5 ml-2 pl-2 border-l border-border">
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
                        <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Ctrl+Z</kbd>
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
                        <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Ctrl+Y</kbd>
                      </div>
                    </TooltipContent>
                  </Tooltip>

                  {historyLength > 0 && (
                    <Badge variant="secondary" className="text-xs h-5 px-1.5 ml-1">
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
                        <span className="hidden sm:inline">תצוגה מקדימה</span>
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
                    <Button variant="ghost" size="icon" onClick={onReset} className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10">
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">איפוס לברירת מחדל</TooltipContent>
                </Tooltip>

                {/* Finish */}
                <Button size="sm" asChild className="gap-2 mr-2 shadow-lg">
                  <Link to="/admin">
                    <Check className="w-4 h-4" />
                    סיום עריכה
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Gradient accent line */}
        <div className="h-0.5 bg-gradient-to-r from-primary via-primary/50 to-primary" />
      </motion.div>
    </TooltipProvider>
  );
}
