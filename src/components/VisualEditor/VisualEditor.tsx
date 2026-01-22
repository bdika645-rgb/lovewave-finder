import { useLandingContent } from "@/contexts/LandingContentContext";
import { useVisualEditor } from "./VisualEditorProvider";
import EditorToolbar from "./EditorToolbar";
import EditorSidebar from "./EditorSidebar";

export default function VisualEditor() {
  const { content, updateContent } = useLandingContent();
  const {
    isEditMode,
    toggleEditMode,
    searchQuery,
    setSearchQuery,
    isSidebarOpen,
    closeSidebar,
    canUndo,
    canRedo,
    undo,
    redo,
    exportContent,
    importContent,
    resetContent,
    historyLength,
    hasChanges,
  } = useVisualEditor();

  return (
    <>
      <EditorToolbar
        isEditMode={isEditMode}
        onToggleEditMode={toggleEditMode}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onReset={resetContent}
        onExport={exportContent}
        onImport={importContent}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        historyLength={historyLength}
        hasChanges={hasChanges}
      />

      <EditorSidebar
        isOpen={isEditMode && isSidebarOpen}
        onClose={closeSidebar}
        content={content}
        onUpdateContent={updateContent}
        searchQuery={searchQuery}
      />

      {/* Edit mode overlay indicator */}
      {isEditMode && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-primary z-50 animate-pulse" />
      )}
    </>
  );
}
