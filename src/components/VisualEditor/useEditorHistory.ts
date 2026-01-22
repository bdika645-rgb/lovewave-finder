import { useState, useCallback } from "react";
import { LandingContent } from "@/contexts/LandingContentContext";

interface HistoryState {
  past: LandingContent[];
  present: LandingContent;
  future: LandingContent[];
}

export function useEditorHistory(initialContent: LandingContent) {
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: initialContent,
    future: [],
  });

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const pushState = useCallback((newContent: LandingContent) => {
    setHistory((prev) => ({
      past: [...prev.past.slice(-19), prev.present], // Keep max 20 states
      present: newContent,
      future: [],
    }));
  }, []);

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;
      
      const newPast = [...prev.past];
      const previousState = newPast.pop()!;
      
      return {
        past: newPast,
        present: previousState,
        future: [prev.present, ...prev.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;
      
      const newFuture = [...prev.future];
      const nextState = newFuture.shift()!;
      
      return {
        past: [...prev.past, prev.present],
        present: nextState,
        future: newFuture,
      };
    });
  }, []);

  const reset = useCallback((content: LandingContent) => {
    setHistory({
      past: [],
      present: content,
      future: [],
    });
  }, []);

  return {
    content: history.present,
    pushState,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    historyLength: history.past.length,
  };
}
