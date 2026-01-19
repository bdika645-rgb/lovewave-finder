import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface UserFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  gender: string;
  onGenderChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export default function UserFilters({
  search,
  onSearchChange,
  gender,
  onGenderChange,
  sortBy,
  onSortChange,
}: UserFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 p-4 bg-card rounded-xl border border-border">
      <div className="relative flex-1 min-w-0">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="חפש משתמשים..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pr-10"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={gender} onValueChange={onGenderChange}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="מגדר" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל המגדרים</SelectItem>
            <SelectItem value="male">גברים</SelectItem>
            <SelectItem value="female">נשים</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
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
      </div>
    </div>
  );
}
