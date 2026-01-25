import { useState, useCallback, useEffect } from "react";
import { LandingContent } from "@/contexts/LandingContentContext";

interface HistoryState {
  past: LandingContent[];
  future: LandingContent[];
}

interface UseEditorHistoryProps {
  content: LandingContent;
  updateContent: <K extends keyof LandingContent>(
    section: K,
    data: Partial<LandingContent[K]>
  ) => void;
  isEditMode: boolean;
}

interface UseEditorHistoryReturn {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  historyLength: number;
  hasChanges: boolean;
}

export function useEditorHistory({
  content,
  updateContent,
  isEditMode,
}: UseEditorHistoryProps): UseEditorHistoryReturn {
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

  // Push to history on content change (debounced)
  useEffect(() => {
    if (!isEditMode) return;

    const handler = setTimeout(() => {
      setHistory((prev) => ({
        past: [...prev.past.slice(-19), content],
        future: [],
      }));
    }, 500);

    return () => clearTimeout(handler);
  }, [content, isEditMode]);

  const applyState = useCallback(
    (state: LandingContent) => {
      Object.keys(state).forEach((key) => {
        const sectionKey = key as keyof LandingContent;
        updateContent(sectionKey, state[sectionKey] as Partial<LandingContent[typeof sectionKey]>);
      });
    },
    [updateContent]
  );

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length <= 1) return prev;

      const newPast = [...prev.past];
      const previousState = newPast.pop()!;

      applyState(previousState);

      return {
        past: newPast,
        future: [content, ...prev.future],
      };
    });
  }, [content, applyState]);

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;

      const newFuture = [...prev.future];
      const nextState = newFuture.shift()!;

      applyState(nextState);

      return {
        past: [...prev.past, content],
        future: newFuture,
      };
    });
  }, [content, applyState]);

  return {
    canUndo: history.past.length > 1,
    canRedo: history.future.length > 0,
    undo,
    redo,
    historyLength: history.past.length,
    hasChanges,
  };
}
