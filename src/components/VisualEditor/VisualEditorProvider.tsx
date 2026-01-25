import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useLandingContent, LandingContent } from "@/contexts/LandingContentContext";
import { useEditorHistory, useEditorKeyboard, useEditorIO } from "./hooks";

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

export function VisualEditorProvider({ children }: { children: ReactNode }) {
  const { content, updateContent, resetContent: resetLandingContent, isEditMode, setIsEditMode } = useLandingContent();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // History management (extracted hook)
  const { canUndo, canRedo, undo, redo, historyLength, hasChanges } = useEditorHistory({
    content,
    updateContent,
    isEditMode,
  });

  // Clear history function for reset
  const clearHistory = useCallback(() => {
    // History is managed internally by the hook, this triggers a reset via content change
  }, []);

  // Import/Export/Reset (extracted hook)
  const { exportContent, importContent, resetContent } = useEditorIO({
    content,
    updateContent,
    resetLandingContent,
    clearHistory,
  });

  // Exit handler for keyboard shortcuts
  const handleExit = useCallback(() => {
    setIsEditMode(false);
    setIsSidebarOpen(false);
  }, [setIsEditMode]);

  // Keyboard shortcuts (extracted hook)
  useEditorKeyboard({
    isEditMode,
    onUndo: undo,
    onRedo: redo,
    onExit: handleExit,
  });

  const toggleEditMode = useCallback(() => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      setIsSidebarOpen(true);
    }
  }, [isEditMode, setIsEditMode]);

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
        canUndo,
        canRedo,
        undo,
        redo,
        exportContent,
        importContent,
        resetContent,
        historyLength,
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
