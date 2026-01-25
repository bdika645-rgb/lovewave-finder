import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useVisualEditor } from "./VisualEditorProvider";
import { Settings } from "lucide-react";

interface EditableSectionProps {
  children: ReactNode;
  sectionName: string;
  className?: string;
  onOpenSettings?: () => void;
}

/**
 * Wrapper for sections that shows edit controls in edit mode
 */
export default function EditableSection({
  children,
  sectionName,
  className,
  onOpenSettings,
}: EditableSectionProps) {
  const { isEditMode, openSidebar } = useVisualEditor();

  if (!isEditMode) {
    return <>{children}</>;
  }

  return (
    <div
      className={cn(
        "relative group/section",
        "outline-2 outline-dashed outline-transparent",
        "hover:outline-primary/30 transition-all duration-300",
        className
      )}
    >
      {/* Section label */}
      <div 
        className="absolute -top-3 right-4 z-20 opacity-0 group-hover/section:opacity-100 transition-all duration-200 flex items-center gap-2"
      >
        <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full shadow-lg">
          {sectionName}
        </span>
        <button
          onClick={onOpenSettings || openSidebar}
          className="bg-muted hover:bg-muted/80 text-foreground p-1.5 rounded-full shadow-lg transition-colors"
          aria-label={`הגדרות ${sectionName}`}
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>
      
      {children}
    </div>
  );
}
