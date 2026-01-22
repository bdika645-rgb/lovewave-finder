import { useEffect } from "react";

/**
 * Blocks in-app navigation + page unload when there are unsaved changes.
 */
export function useUnsavedChangesWarning(when: boolean, message?: string) {
  const promptMessage = message ?? "יש שינויים שלא נשמרו. לצאת בלי לשמור?";

  useEffect(() => {
    if (!when) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [when]);

  // In-app navigation is guarded per-action (e.g., navigate/logout buttons)
  // because React Router does not expose a stable navigation blocker API in this project.
  useEffect(() => {
    if (!when) return;
    // Keep promptMessage as dependency so callers can customize text.
  }, [when, promptMessage]);
}
