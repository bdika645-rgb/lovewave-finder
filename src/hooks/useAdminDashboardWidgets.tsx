import { useState, useEffect } from "react";
import { safeJsonParse } from "@/lib/utils";

export interface DashboardWidget {
  id: string;
  type: "stats" | "chart" | "activity" | "quick-actions" | "cities" | "funnel" | "at-risk";
  title: string;
  enabled: boolean;
  order: number;
  size: "small" | "medium" | "large";
}

const DEFAULT_WIDGETS: DashboardWidget[] = [
  { id: "stats", type: "stats", title: "סטטיסטיקות ראשיות", enabled: true, order: 0, size: "large" },
  { id: "quick-actions", type: "quick-actions", title: "פעולות מהירות", enabled: true, order: 1, size: "large" },
  { id: "age-chart", type: "chart", title: "התפלגות גילאים", enabled: true, order: 2, size: "medium" },
  { id: "gender-chart", type: "chart", title: "התפלגות מגדרים", enabled: true, order: 3, size: "medium" },
  { id: "activity", type: "activity", title: "פעילות אחרונה", enabled: true, order: 4, size: "large" },
  { id: "weekly-stats", type: "stats", title: "סטטיסטיקות שבועיות", enabled: true, order: 5, size: "small" },
  { id: "cities", type: "cities", title: "ערים מובילות", enabled: true, order: 6, size: "large" },
  { id: "funnel", type: "funnel", title: "Funnel המרה", enabled: false, order: 7, size: "large" },
  { id: "at-risk", type: "at-risk", title: "משתמשים בסיכון", enabled: false, order: 8, size: "medium" },
];

const STORAGE_KEY = "admin-dashboard-widgets";

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const isDashboardWidgetArray = (v: unknown): v is DashboardWidget[] => {
  if (!Array.isArray(v)) return false;
  return v.every((item) =>
    isRecord(item) &&
    typeof item.id === "string" &&
    typeof item.enabled === "boolean" &&
    typeof item.order === "number" &&
    (item.size === "small" || item.size === "medium" || item.size === "large")
  );
};

export function useAdminDashboardWidgets() {
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = safeJsonParse<DashboardWidget[]>(saved, DEFAULT_WIDGETS, isDashboardWidgetArray);

    // Merge with defaults to handle new widgets (and ignore unknown ids)
    const merged = DEFAULT_WIDGETS.map((defaultWidget) => {
      const savedWidget = parsed.find((w) => w.id === defaultWidget.id);
      return savedWidget ? { ...defaultWidget, ...savedWidget } : defaultWidget;
    });

    setWidgets(merged);
    setLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (loaded && widgets.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
    }
  }, [widgets, loaded]);

  const toggleWidget = (id: string) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w))
    );
  };

  const reorderWidgets = (startIndex: number, endIndex: number) => {
    setWidgets((prev) => {
      const result = [...prev];
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result.map((w, i) => ({ ...w, order: i }));
    });
  };

  const resetToDefaults = () => {
    setWidgets(DEFAULT_WIDGETS);
    localStorage.removeItem(STORAGE_KEY);
  };

  const enabledWidgets = widgets
    .filter((w) => w.enabled)
    .sort((a, b) => a.order - b.order);

  return {
    widgets,
    enabledWidgets,
    toggleWidget,
    reorderWidgets,
    resetToDefaults,
    loaded,
  };
}
