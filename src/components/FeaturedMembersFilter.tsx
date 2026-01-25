import { useState } from "react";
import { Users, Wifi, MapPin, Calendar, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type FilterType = "all" | "online" | "nearby" | "age25-35";
export type SortType = "newest" | "popular";

interface FeaturedMembersFilterProps {
  activeFilter: FilterType;
  activeSort: SortType;
  onFilterChange: (filter: FilterType) => void;
  onSortChange: (sort: SortType) => void;
}

const filters: { id: FilterType; label: string; icon: typeof Users }[] = [
  { id: "all", label: "כולם", icon: Users },
  { id: "online", label: "אונליין עכשיו", icon: Wifi },
  { id: "nearby", label: "באזור שלי", icon: MapPin },
  { id: "age25-35", label: "בני 25-35", icon: Calendar },
];

const sorts: { id: SortType; label: string; icon: typeof TrendingUp }[] = [
  { id: "newest", label: "הכי חדשים", icon: Clock },
  { id: "popular", label: "הכי פופולריים", icon: TrendingUp },
];

const FeaturedMembersFilter = ({
  activeFilter,
  activeSort,
  onFilterChange,
  onSortChange,
}: FeaturedMembersFilterProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="סינון פרופילים">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.id;
          return (
            <Button
              key={filter.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange(filter.id)}
              className={cn(
                "gap-2 rounded-full transition-all duration-300",
                isActive 
                  ? "shadow-lg scale-105" 
                  : "hover:bg-primary/10 hover:border-primary/30"
              )}
              aria-pressed={isActive}
            >
              <Icon className="w-4 h-4" />
              <span>{filter.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Sort Buttons */}
      <div className="flex gap-2" role="group" aria-label="מיון פרופילים">
        {sorts.map((sort) => {
          const Icon = sort.icon;
          const isActive = activeSort === sort.id;
          return (
            <Button
              key={sort.id}
              variant="ghost"
              size="sm"
              onClick={() => onSortChange(sort.id)}
              className={cn(
                "gap-2 text-sm transition-all",
                isActive 
                  ? "text-primary font-semibold" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-pressed={isActive}
            >
              <Icon className="w-4 h-4" />
              <span>{sort.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedMembersFilter;
