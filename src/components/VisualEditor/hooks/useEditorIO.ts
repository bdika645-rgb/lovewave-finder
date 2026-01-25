import { useCallback } from "react";
import { LandingContent, defaultLandingContent } from "@/contexts/LandingContentContext";
import { toast } from "sonner";

interface UseEditorIOProps {
  content: LandingContent;
  updateContent: <K extends keyof LandingContent>(
    section: K,
    data: Partial<LandingContent[K]>
  ) => void;
  resetLandingContent: () => void;
  clearHistory: () => void;
}

interface UseEditorIOReturn {
  exportContent: () => void;
  importContent: () => void;
  resetContent: () => void;
}

export function useEditorIO({
  content,
  updateContent,
  resetLandingContent,
  clearHistory,
}: UseEditorIOProps): UseEditorIOReturn {
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

  const resetContent = useCallback(() => {
    if (window.confirm("האם אתה בטוח שברצונך לאפס את כל התוכן לברירת המחדל?")) {
      resetLandingContent();
      clearHistory();
      toast.success("התוכן אופס בהצלחה");
    }
  }, [resetLandingContent, clearHistory]);

  return {
    exportContent,
    importContent,
    resetContent,
  };
}
