import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X, RotateCcw } from "lucide-react";
import { israeliCities, allInterests } from "@/data/members";

export interface DiscoverFiltersState {
  ageFrom: number | null;
  ageTo: number | null;
  city: string;
  interests: string[];
  relationshipGoal: string;
}

interface DiscoverFiltersProps {
  filters: DiscoverFiltersState;
  onFiltersChange: (filters: DiscoverFiltersState) => void;
  activeFilterCount: number;
}

export function DiscoverFilters({ filters, onFiltersChange, activeFilterCount }: DiscoverFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onFiltersChange(localFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    const resetFilters: DiscoverFiltersState = {
      ageFrom: null,
      ageTo: null,
      city: "",
      interests: [],
      relationshipGoal: ""
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const toggleInterest = (interest: string) => {
    setLocalFilters(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="w-4 h-4 ml-2" />
          סינון
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -left-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto" dir="rtl">
        <SheetHeader>
          <SheetTitle>סינון פרופילים</SheetTitle>
          <SheetDescription>
            בחרו את ההעדפות שלכם כדי למצוא התאמות טובות יותר
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Age Range */}
          <div className="space-y-2">
            <Label>טווח גילאים</Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                placeholder="מ-"
                value={localFilters.ageFrom || ""}
                onChange={(e) => setLocalFilters(prev => ({
                  ...prev,
                  ageFrom: e.target.value ? parseInt(e.target.value) : null
                }))}
                min={18}
                max={120}
                className="w-24"
              />
              <span className="text-muted-foreground">עד</span>
              <Input
                type="number"
                placeholder="עד-"
                value={localFilters.ageTo || ""}
                onChange={(e) => setLocalFilters(prev => ({
                  ...prev,
                  ageTo: e.target.value ? parseInt(e.target.value) : null
                }))}
                min={18}
                max={120}
                className="w-24"
              />
            </div>
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label>עיר</Label>
            <Select
              value={localFilters.city}
              onValueChange={(value) => setLocalFilters(prev => ({ ...prev, city: value === "all" ? "" : value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="כל הערים" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הערים</SelectItem>
                {israeliCities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Relationship Goal */}
          <div className="space-y-2">
            <Label>מטרת הקשר</Label>
            <Select
              value={localFilters.relationshipGoal}
              onValueChange={(value) => setLocalFilters(prev => ({ ...prev, relationshipGoal: value === "all" ? "" : value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="כל המטרות" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל המטרות</SelectItem>
                <SelectItem value="serious">קשר רציני</SelectItem>
                <SelectItem value="casual">הכרויות</SelectItem>
                <SelectItem value="friendship">חברות</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <Label>תחומי עניין</Label>
            <p className="text-xs text-muted-foreground mb-2">
              בחרו תחומי עניין שחשובים לכם
            </p>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {allInterests.map(interest => (
                <Badge
                  key={interest}
                  variant={localFilters.interests.includes(interest) ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    localFilters.interests.includes(interest) 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-primary/10"
                  }`}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                  {localFilters.interests.includes(interest) && (
                    <X className="w-3 h-3 mr-1" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 ml-2" />
              איפוס
            </Button>
            <Button
              variant="hero"
              onClick={handleApply}
              className="flex-1"
            >
              החל סינון
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default DiscoverFilters;
