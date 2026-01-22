import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useLandingContent, LandingContent, defaultLandingContent } from "@/contexts/LandingContentContext";
import { toast } from "sonner";

interface VisualEditorContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  exportContent: () => void;
  importContent: () => void;
  resetContent: () => void;
  historyLength: number;
  hasChanges: boolean;
}

const VisualEditorContext = createContext<VisualEditorContextType | undefined>(undefined);

interface HistoryState {
  past: LandingContent[];
  future: LandingContent[];
}

export function VisualEditorProvider({ children }: { children: ReactNode }) {
  const { content, updateContent, resetContent: resetLandingContent, isEditMode, setIsEditMode } = useLandingContent();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [history, setHistory] = useState<HistoryState>({ past: [], future: [] });
  const [lastSavedContent, setLastSavedContent] = useState<string>("");

  // Track changes
  const hasChanges = JSON.stringify(content) !== lastSavedContent;

  // Initialize last saved content
  useEffect(() => {
    if (!lastSavedContent) {
      setLastSavedContent(JSON.stringify(content));
    }
  }, [content, lastSavedContent]);

  // Push to history on content change
  useEffect(() => {
    const handler = setTimeout(() => {
      setHistory((prev) => ({
        past: [...prev.past.slice(-19), content],
        future: [],
      }));
    }, 500);

    return () => clearTimeout(handler);
  }, [content]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isEditMode) return;

      // Ctrl+Z - Undo
      if (e.ctrlKey && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Ctrl+Y or Ctrl+Shift+Z - Redo
      if ((e.ctrlKey && e.key === "y") || (e.ctrlKey && e.shiftKey && e.key === "z")) {
        e.preventDefault();
        redo();
      }

      // Escape - Close edit mode
      if (e.key === "Escape") {
        setIsEditMode(false);
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEditMode]);

  const toggleEditMode = useCallback(() => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      setIsSidebarOpen(true);
    }
  }, [isEditMode, setIsEditMode]);

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length <= 1) return prev;

      const newPast = [...prev.past];
      const previousState = newPast.pop()!;
      
      // Apply the previous state
      Object.keys(previousState).forEach((key) => {
        const sectionKey = key as keyof LandingContent;
        updateContent(sectionKey, previousState[sectionKey] as Partial<LandingContent[typeof sectionKey]>);
      });

      return {
        past: newPast,
        future: [content, ...prev.future],
      };
    });
  }, [content, updateContent]);

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;

      const newFuture = [...prev.future];
      const nextState = newFuture.shift()!;

      // Apply the next state
      Object.keys(nextState).forEach((key) => {
        const sectionKey = key as keyof LandingContent;
        updateContent(sectionKey, nextState[sectionKey] as Partial<LandingContent[typeof sectionKey]>);
      });

      return {
        past: [...prev.past, content],
        future: newFuture,
      };
    });
  }, [content, updateContent]);

  const exportContent = useCallback(() => {
    const dataStr = JSON.stringify(content, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    
    const exportName = `spark-content-${new Date().toISOString().split("T")[0]}.json`;
    
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportName);
    linkElement.click();
    
    toast.success("התוכן יוצא בהצלחה!");
  }, [content]);

  const importContent = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedContent = JSON.parse(event.target?.result as string);
          
          // Validate structure
          if (!importedContent.hero || !importedContent.nav) {
            throw new Error("Invalid content structure");
          }

          // Apply imported content
          Object.keys(importedContent).forEach((key) => {
            const sectionKey = key as keyof LandingContent;
            if (defaultLandingContent[sectionKey]) {
              updateContent(sectionKey, importedContent[sectionKey]);
            }
          });

          toast.success("התוכן יובא בהצלחה!");
        } catch (error) {
          toast.error("שגיאה בייבוא התוכן. וודא שהקובץ תקין.");
        }
      };
      reader.readAsText(file);
    };

    input.click();
  }, [updateContent]);

  const handleResetContent = useCallback(() => {
    if (window.confirm("האם אתה בטוח שברצונך לאפס את כל התוכן לברירת המחדל?")) {
      resetLandingContent();
      setHistory({ past: [], future: [] });
      toast.success("התוכן אופס בהצלחה");
    }
  }, [resetLandingContent]);

  return (
    <VisualEditorContext.Provider
      value={{
        isEditMode,
        toggleEditMode,
        searchQuery,
        setSearchQuery,
        isSidebarOpen,
        openSidebar: () => setIsSidebarOpen(true),
        closeSidebar: () => setIsSidebarOpen(false),
        canUndo: history.past.length > 1,
        canRedo: history.future.length > 0,
        undo,
        redo,
        exportContent,
        importContent,
        resetContent: handleResetContent,
        historyLength: history.past.length,
        hasChanges,
      }}
    >
      {children}
    </VisualEditorContext.Provider>
  );
}

export function useVisualEditor() {
  const context = useContext(VisualEditorContext);
  if (!context) {
    throw new Error("useVisualEditor must be used within a VisualEditorProvider");
  }
  return context;
}
