import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { useLandingContent } from "@/contexts/LandingContentContext";
import { Settings, GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const { isEditMode } = useLandingContent();
  const [isHovered, setIsHovered] = useState(false);

  if (!isEditMode) {
    return <>{children}</>;
  }

  return (
    <div
      className={cn(
        "relative",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Section highlight border */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 pointer-events-none z-10"
          >
            <div className="absolute inset-0 border-2 border-dashed border-primary/40 rounded-lg" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Section label badge */}
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-2 right-2 z-20 flex items-center gap-1.5"
          >
            <div className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-xl">
              <GripVertical className="w-3 h-3 opacity-60" />
              {sectionName}
            </div>
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="bg-card hover:bg-muted text-foreground p-2 rounded-full shadow-xl transition-colors border border-border"
                aria-label={`הגדרות ${sectionName}`}
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {children}
    </div>
  );
}
