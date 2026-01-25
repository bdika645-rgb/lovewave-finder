import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRef } from "react";

interface FAQSearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  resultsCount: number;
  totalCount: number;
}

const FAQSearch = ({ query, onQueryChange, resultsCount, totalCount }: FAQSearchProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onQueryChange("");
    inputRef.current?.focus();
  };

  return (
    <div className="max-w-xl mx-auto mb-10">
      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="חפש בשאלות נפוצות..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full pr-12 pl-10 py-3 h-12 text-base bg-card border-border rounded-xl placeholder:text-muted-foreground/60 focus:border-primary/50 transition-all"
          aria-label="חיפוש בשאלות נפוצות"
          aria-describedby="faq-search-results"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
            aria-label="נקה חיפוש"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>
      
      {query && (
        <p 
          id="faq-search-results" 
          className="text-sm text-muted-foreground text-center mt-3"
          aria-live="polite"
        >
          {resultsCount === 0 
            ? "לא נמצאו תוצאות" 
            : `נמצאו ${resultsCount} מתוך ${totalCount} שאלות`
          }
        </p>
      )}
    </div>
  );
};

export default FAQSearch;
