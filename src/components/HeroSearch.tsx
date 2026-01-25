import { useState, useEffect, useRef } from "react";
import { Search, MapPin, User, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import LazyImage from "@/components/LazyImage";

interface SearchResult {
  id: string;
  name: string;
  age: number;
  city: string;
  avatar_url: string | null;
  interests: string[];
}

const HeroSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search profiles
  useEffect(() => {
    const searchProfiles = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles_public")
          .select("id, name, age, city, avatar_url, interests")
          .eq("is_visible", true)
          .or(`name.ilike.%${query}%,city.ilike.%${query}%`)
          .limit(5);

        if (error) throw error;
        setResults(data || []);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchProfiles, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  // Also search by interests
  useEffect(() => {
    if (query.length < 2 || results.length > 0) return;

    const searchByInterests = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles_public")
          .select("id, name, age, city, avatar_url, interests")
          .eq("is_visible", true)
          .contains("interests", [query])
          .limit(5);

        if (error) throw error;
        if (data && data.length > 0) {
          setResults(data);
        }
      } catch (err) {
        console.error("Interest search error:", err);
      }
    };

    searchByInterests();
  }, [query, results.length]);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-lg mx-auto mt-8">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="חפש פרופילים לפי שם, עיר או תחומי עניין..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pr-12 pl-10 py-4 h-14 text-base glass-effect border-white/20 dark:border-white/10 rounded-2xl placeholder:text-muted-foreground/60 focus:border-primary/50 transition-all"
          aria-label="חיפוש פרופילים"
          aria-expanded={isOpen && (results.length > 0 || loading)}
          aria-controls="search-results"
          role="combobox"
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

      {/* Results Dropdown */}
      <AnimatePresence>
        {isOpen && query.length >= 2 && (
          <motion.div
            id="search-results"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 glass-effect rounded-2xl border border-white/20 dark:border-white/10 shadow-2xl overflow-hidden"
            role="listbox"
          >
            {loading ? (
              <div className="p-6 text-center">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground mt-2">מחפש...</p>
              </div>
            ) : results.length > 0 ? (
              <ul className="divide-y divide-border/50">
                {results.map((profile) => (
                  <li key={profile.id}>
                    <Link
                      to={`/member/${profile.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-4 p-4 hover:bg-primary/10 transition-colors group"
                      role="option"
                    >
                      <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all flex-shrink-0">
                        <LazyImage
                          src={profile.avatar_url || "/placeholder.svg"}
                          alt={profile.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 text-right">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-primary" />
                          <span className="font-semibold text-foreground truncate">
                            {profile.name}, {profile.age}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>{profile.city}</span>
                        </div>
                        {profile.interests && profile.interests.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {profile.interests.slice(0, 3).map((interest, i) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center">
                <Search className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-muted-foreground">לא נמצאו תוצאות</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  נסה לחפש שם אחר או עיר
                </p>
              </div>
            )}
            
            {/* View All Results */}
            {results.length > 0 && (
              <Link
                to={`/members?search=${encodeURIComponent(query)}`}
                onClick={() => setIsOpen(false)}
                className="block p-4 text-center text-primary font-medium hover:bg-primary/10 transition-colors border-t border-border/50"
              >
                הצג את כל התוצאות →
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeroSearch;
