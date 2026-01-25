import { User, MessageSquare, Calendar, Sparkles, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export type TipCategory = "all" | "פרופיל" | "שיחות" | "דייטים" | "מוטיבציה";

interface TipsCategoryFilterProps {
  activeCategory: TipCategory;
  onCategoryChange: (category: TipCategory) => void;
}

const categories: { id: TipCategory; label: string; icon: typeof User }[] = [
  { id: "all", label: "הכל", icon: LayoutGrid },
  { id: "פרופיל", label: "פרופיל", icon: User },
  { id: "שיחות", label: "שיחות", icon: MessageSquare },
  { id: "דייטים", label: "דייטים", icon: Calendar },
  { id: "מוטיבציה", label: "מוטיבציה", icon: Sparkles },
];

const TipsCategoryFilter = ({
  activeCategory,
  onCategoryChange,
}: TipsCategoryFilterProps) => {
  return (
    <div 
      className="flex flex-wrap justify-center gap-2 mb-10" 
      role="tablist" 
      aria-label="סינון טיפים לפי קטגוריה"
    >
      {categories.map((category) => {
        const Icon = category.icon;
        const isActive = activeCategory === category.id;
        
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tips-panel-${category.id}`}
            className={cn(
              "relative flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              isActive
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTipCategory"
                className="absolute inset-0 bg-primary rounded-full shadow-lg"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Icon className="w-4 h-4" />
              {category.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default TipsCategoryFilter;
