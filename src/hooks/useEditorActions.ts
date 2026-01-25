import { useState, useCallback, useEffect, useRef } from "react";
import { LandingContent } from "@/contexts/LandingContentContext";
import { toast } from "sonner";

interface UseEditorActionsProps {
  content: LandingContent;
  updateContent: <K extends keyof LandingContent>(
    section: K,
    data: Partial<LandingContent[K]>
  ) => void;
  resetContent: () => void;
}

interface HistoryState {
  past: LandingContent[];
  future: LandingContent[];
}

export function useEditorActions({
  content,
  updateContent,
  resetContent,
}: UseEditorActionsProps) {
  const [history, setHistory] = useState<HistoryState>({ past: [], future: [] });
  const [initialContent] = useState(() => JSON.stringify(content));
  const lastContentRef = useRef<string>(JSON.stringify(content));
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const hasChanges = JSON.stringify(content) !== initialContent;
  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  // Track content changes with debounce
  useEffect(() => {
    const currentContent = JSON.stringify(content);
    
    if (currentContent !== lastContentRef.current) {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        const previousContent = JSON.parse(lastContentRef.current) as LandingContent;
        setHistory((prev) => ({
          past: [...prev.past.slice(-19), previousContent],
          future: [],
        }));
        lastContentRef.current = currentContent;
      }, 500);
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [content]);

  const applyContent = useCallback(
    (newContent: LandingContent) => {
      Object.keys(newContent).forEach((key) => {
        const sectionKey = key as keyof LandingContent;
        updateContent(sectionKey, newContent[sectionKey] as Partial<LandingContent[typeof sectionKey]>);
      });
      lastContentRef.current = JSON.stringify(newContent);
    },
    [updateContent]
  );

  const undo = useCallback(() => {
    if (!canUndo) return;
    
    setHistory((prev) => {
      const newPast = [...prev.past];
      const previousContent = newPast.pop()!;
      
      applyContent(previousContent);
      
      return {
        past: newPast,
        future: [JSON.parse(lastContentRef.current) as LandingContent, ...prev.future],
      };
    });
  }, [canUndo, applyContent]);

  const redo = useCallback(() => {
    if (!canRedo) return;
    
    setHistory((prev) => {
      const newFuture = [...prev.future];
      const nextContent = newFuture.shift()!;
      
      applyContent(nextContent);
      
      return {
        past: [...prev.past, JSON.parse(lastContentRef.current) as LandingContent],
        future: newFuture,
      };
    });
  }, [canRedo, applyContent]);

  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(content, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `landing-content-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("הקובץ יורד בהצלחה");
  }, [content]);

  const handleImport = useCallback(() => {
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
            if (!imported.hero || !imported.nav) {
              throw new Error("Invalid structure");
            }
            applyContent(imported);
            toast.success("התוכן יובא בהצלחה");
          } catch {
            toast.error("שגיאה בקריאת הקובץ - וודא שהקובץ תקין");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [applyContent]);

  const handleReset = useCallback(() => {
    if (confirm("האם אתה בטוח שברצונך לאפס את כל התוכן לברירת המחדל?")) {
      resetContent();
      setHistory({ past: [], future: [] });
      lastContentRef.current = JSON.stringify(content);
      toast.success("התוכן אופס לברירת מחדל");
    }
  }, [resetContent, content]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey && e.key === "y") || (e.ctrlKey && e.shiftKey && e.key === "z")) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  return {
    canUndo,
    canRedo,
    undo,
    redo,
    handleExport,
    handleImport,
    handleReset,
    historyLength: history.past.length,
    hasChanges,
  };
}
