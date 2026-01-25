import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { israeliCities } from "@/data/members";

interface UserFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  gender: string;
  onGenderChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  city?: string;
  onCityChange?: (value: string) => void;
  status?: string;
  onStatusChange?: (value: string) => void;
}

export default function UserFilters({
  search,
  onSearchChange,
  gender,
  onGenderChange,
  sortBy,
  onSortChange,
  city,
  onCityChange,
  status,
  onStatusChange,
}: UserFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const hasActiveFilters = gender !== "all" || (city && city !== "all") || (status && status !== "all");
  
  const clearFilters = () => {
    onGenderChange("all");
    onCityChange?.("all");
    onStatusChange?.("all");
    onSearchChange("");
  };

  return (
    <div className="bg-card rounded-xl border border-border">
      {/* Main filters row */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 p-4">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="חפש משתמשים..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pr-10"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Select value={gender} onValueChange={onGenderChange}>
            <SelectTrigger className="w-full sm:w-[130px]">
              <SelectValue placeholder="מגדר" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל המגדרים</SelectItem>
              <SelectItem value="male">גברים</SelectItem>
              <SelectItem value="female">נשים</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-full sm:w-[170px]">
              <SelectValue placeholder="מיין לפי" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at_desc">הרשמה (חדש לישן)</SelectItem>
              <SelectItem value="created_at_asc">הרשמה (ישן לחדש)</SelectItem>
              <SelectItem value="name_asc">שם (א-ת)</SelectItem>
              <SelectItem value="name_desc">שם (ת-א)</SelectItem>
              <SelectItem value="age_asc">גיל (צעיר לזקן)</SelectItem>
              <SelectItem value="age_desc">גיל (זקן לצעיר)</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="gap-1"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">סינון מתקדם</span>
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-1 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
              נקה
            </Button>
          )}
        </div>
      </div>
      
      {/* Advanced filters */}
      {showAdvanced && (
        <div className="border-t border-border p-4 flex flex-wrap gap-3">
          {onCityChange && (
            <Select value={city || "all"} onValueChange={onCityChange}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="עיר" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הערים</SelectItem>
                {israeliCities.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {onStatusChange && (
            <Select value={status || "all"} onValueChange={onStatusChange}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="סטטוס" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הסטטוסים</SelectItem>
                <SelectItem value="online">מחוברים</SelectItem>
                <SelectItem value="verified">מאומתים</SelectItem>
                <SelectItem value="unverified">לא מאומתים</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      )}
    </div>
  );
}
