import { useState } from "react";
import { Switch } from "@/components/ui/switch";
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
  onlineOnly: boolean;
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
      relationshipGoal: "",
      onlineOnly: false
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
        <Button 
          variant="outline" 
          className="relative focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label={activeFilterCount > 0 ? `סינון - ${activeFilterCount} פילטרים פעילים` : "סינון פרופילים"}
          aria-expanded={isOpen}
        >
          <Filter className="w-4 h-4 ml-2" aria-hidden="true" />
          סינון
          {activeFilterCount > 0 && (
            <span 
              className="absolute -top-1 -left-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center"
              aria-hidden="true"
            >
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

        <div className="space-y-6 mt-6" role="form" aria-label="טופס סינון פרופילים">
          {/* Online Only */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="online-only">מחוברים עכשיו בלבד</Label>
              <p className="text-xs text-muted-foreground">הצג רק פרופילים מחוברים כרגע</p>
            </div>
            <Switch
              id="online-only"
              checked={localFilters.onlineOnly}
              onCheckedChange={(checked) => setLocalFilters(prev => ({ ...prev, onlineOnly: checked }))}
            />
          </div>
          {/* Age Range */}
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">טווח גילאים</legend>
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
                aria-label="גיל מינימלי"
              />
              <span className="text-muted-foreground" aria-hidden="true">עד</span>
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
                aria-label="גיל מקסימלי"
              />
            </div>
          </fieldset>

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
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">תחומי עניין</legend>
            <p className="text-xs text-muted-foreground mb-2" id="interests-description">
              בחרו תחומי עניין שחשובים לכם
            </p>
            <div 
              className="relative flex flex-wrap gap-2 max-h-48 overflow-y-auto scroll-smooth-ios pb-6" 
              role="group" 
              aria-describedby="interests-description"
              aria-label="בחירת תחומי עניין"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-card to-transparent pointer-events-none" aria-hidden="true" />
              {allInterests.map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  aria-pressed={localFilters.interests.includes(interest)}
                  className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    localFilters.interests.includes(interest) 
                      ? "bg-primary text-primary-foreground border-transparent" 
                      : "border-input hover:bg-primary/10"
                  }`}
                >
                  {interest}
                  {localFilters.interests.includes(interest) && (
                    <X className="w-3 h-3 mr-1" aria-hidden="true" />
                  )}
                </button>
              ))}
            </div>
          </fieldset>

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
