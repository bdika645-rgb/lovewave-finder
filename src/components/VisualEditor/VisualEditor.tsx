import { useLandingContent } from "@/contexts/LandingContentContext";
import EditorToolbar from "./EditorToolbar";
import EditorSidebar from "./EditorSidebar";
import { useEditorActions } from "@/hooks/useEditorActions";

export default function VisualEditor() {
  const { content, updateContent, resetContent, isEditMode } = useLandingContent();
  
  const {
    canUndo,
    canRedo,
    undo,
    redo,
    handleExport,
    handleImport,
    handleReset,
    historyLength,
    hasChanges,
  } = useEditorActions({
    content,
    updateContent,
    resetContent,
  });

  if (!isEditMode) {
    return null;
  }

  return (
    <>
      <EditorToolbar
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onReset={handleReset}
        onExport={handleExport}
        onImport={handleImport}
        historyLength={historyLength}
        hasChanges={hasChanges}
      />

      <EditorSidebar
        isOpen={false}
        onClose={() => {}}
        content={content}
        onUpdateContent={updateContent}
        searchQuery=""
      />
    </>
  );
}
