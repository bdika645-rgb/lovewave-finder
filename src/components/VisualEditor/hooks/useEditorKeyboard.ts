import { useEffect } from "react";

interface UseEditorKeyboardProps {
  isEditMode: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onExit: () => void;
}

export function useEditorKeyboard({
  isEditMode,
  onUndo,
  onRedo,
  onExit,
}: UseEditorKeyboardProps): void {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isEditMode) return;

      // Ctrl+Z - Undo
      if (e.ctrlKey && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        onUndo();
      }

      // Ctrl+Y or Ctrl+Shift+Z - Redo
      if ((e.ctrlKey && e.key === "y") || (e.ctrlKey && e.shiftKey && e.key === "z")) {
        e.preventDefault();
        onRedo();
      }

      // Escape - Close edit mode
      if (e.key === "Escape") {
        onExit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEditMode, onUndo, onRedo, onExit]);
}
