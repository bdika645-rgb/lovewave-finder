import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import MemberCard from "@/components/MemberCard";
import { useProfiles } from "@/hooks/useProfiles";
import { useLikes } from "@/hooks/useLikes";
import { useAuth } from "@/hooks/useAuth";
import { Search, SlidersHorizontal, MapPin, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Members = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();
  const { sendLike } = useLikes();
  
  // Filter states
  const [ageFrom, setAgeFrom] = useState("");
  const [ageTo, setAgeTo] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [activeFilters, setActiveFilters] = useState<{ageFrom?: number; ageTo?: number; city?: string}>({});

  // When user is logged in, show opposite gender by default
  const { profiles, loading, error } = useProfiles({
    search: searchQuery || undefined,
    ageFrom: activeFilters.ageFrom,
    ageTo: activeFilters.ageTo,
    city: activeFilters.city,
    filterByOppositeGender: !!user, // If logged in, filter by opposite gender
  });

  const handleLike = async (memberId: string, memberName: string) => {
    if (!user) {
      toast.error("נא להתחבר כדי לשלוח לייקים");
      return;
    }

    const { error, isMatch, alreadyLiked } = await sendLike(memberId);
    
    if (error) {
      toast.error("שגיאה בשליחת הלייק");
      return;
    }

    if (alreadyLiked) {
      toast.info(`כבר שלחת לייק ל${memberName}`);
      return;
    }

    if (isMatch) {
      toast.success(`🎉 יש התאמה! את/ה ו${memberName} אהבתם אחד את השני!`);
    } else {
      toast.success(`שלחת לייק ל${memberName}! 💕`);
    }
  };

  const handlePass = (memberName: string) => {
    toast(`דילגת על ${memberName}`);
  };

  const applyFilters = () => {
    const filters: {ageFrom?: number; ageTo?: number; city?: string} = {};
    const filterLabels: string[] = [];
    
    if (ageFrom) {
      filters.ageFrom = parseInt(ageFrom);
      filterLabels.push(`גיל מ-${ageFrom}`);
    }
    if (ageTo) {
      filters.ageTo = parseInt(ageTo);
      filterLabels.push(`גיל עד ${ageTo}`);
    }
    if (locationFilter) {
      filters.city = locationFilter;
      filterLabels.push(`מיקום: ${locationFilter}`);
    }
    
    setActiveFilters(filters);
    setShowFilters(false);
    
    if (filterLabels.length > 0) {
      toast.success(`הופעלו ${filterLabels.length} פילטרים`);
    } else {
      toast.info("לא נבחרו פילטרים");
    }
  };

  const clearFilters = () => {
    setAgeFrom("");
    setAgeTo("");
    setLocationFilter("");
    setActiveFilters({});
    setSearchQuery("");
    toast.info("הפילטרים נוקו");
  };

  const activeFilterLabels = useMemo(() => {
    const labels: string[] = [];
    if (activeFilters.ageFrom) labels.push(`גיל מ-${activeFilters.ageFrom}`);
    if (activeFilters.ageTo) labels.push(`גיל עד ${activeFilters.ageTo}`);
    if (activeFilters.city) labels.push(`מיקום: ${activeFilters.city}`);
    return labels;
  }, [activeFilters]);

  return (
    <div className="min-h-screen bg-muted/20" dir="rtl">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            גלו את <span className="text-gradient">ההתאמה</span> שלכם
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            דפדפו בפרופילים ומצאו אנשים שמתאימים לכם
          </p>
        </div>

        {/* Search & Filters */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="חפשו לפי שם או עיר..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12 h-14 rounded-xl bg-card border-border text-lg"
              />
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className={`h-14 w-14 rounded-xl ${activeFilterLabels.length > 0 ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
          </div>

          {/* Active Filters Tags */}
          {activeFilterLabels.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {activeFilterLabels.map((filter, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                >
                  {filter}
                </span>
              ))}
              <button 
                onClick={clearFilters}
                className="inline-flex items-center gap-1 bg-destructive/10 text-destructive px-3 py-1 rounded-full text-sm hover:bg-destructive/20"
              >
                <X className="w-3 h-3" />
                נקה הכל
              </button>
            </div>
          )}

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-6 bg-card rounded-2xl shadow-card animate-slide-up">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">גיל</label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="מ-" 
                      className="h-10" 
                      type="number"
                      value={ageFrom}
                      onChange={(e) => setAgeFrom(e.target.value)}
                    />
                    <Input 
                      placeholder="עד" 
                      className="h-10" 
                      type="number"
                      value={ageTo}
                      onChange={(e) => setAgeTo(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">מיקום</label>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="עיר או אזור" 
                      className="pr-10 h-10"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <Button variant="hero" className="w-full" onClick={applyFilters}>
                    החל פילטרים
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">טוען פרופילים...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <p className="text-destructive mb-4">שגיאה בטעינת הפרופילים</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              נסה שוב
            </Button>
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <>
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                נמצאו <span className="font-semibold text-foreground">{profiles.length}</span> פרופילים
              </p>
            </div>

            {/* Members Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {profiles.map((profile) => (
                <MemberCard 
                  key={profile.id} 
                  member={{
                    id: profile.id,
                    name: profile.name,
                    age: profile.age,
                    city: profile.city,
                    bio: profile.bio || "",
                    image: profile.avatar_url || "/profiles/profile1.jpg",
                    interests: profile.interests || [],
                    isOnline: profile.is_online || false,
                    lastActive: profile.last_seen ? new Date(profile.last_seen).toLocaleString('he-IL') : undefined,
                  }}
                  onLike={() => handleLike(profile.id, profile.name)}
                  onPass={() => handlePass(profile.name)}
                />
              ))}
            </div>

            {profiles.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg mb-4">לא נמצאו תוצאות. נסו לשנות את החיפוש.</p>
                {activeFilterLabels.length > 0 && (
                  <Button variant="outline" onClick={clearFilters}>
                    נקה פילטרים
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Members;
