import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import MemberCard from "@/components/MemberCard";
import SEOHead from "@/components/SEOHead";
import LazyImage from "@/components/LazyImage";
import EmptyState from "@/components/EmptyState";
import { SkeletonGrid } from "@/components/ui/skeleton-card";
import { useProfiles } from "@/hooks/useProfiles";
import { useLikes } from "@/hooks/useLikes";
import { useAuth } from "@/hooks/useAuth";
import { usePagination } from "@/hooks/usePagination";
import { Search, SlidersHorizontal, MapPin, X, Users, ChevronLeft, ChevronRight, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 20;

const Members = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { user } = useAuth();
  const { sendLike } = useLikes();
  
  // Filter states
  const [ageFrom, setAgeFrom] = useState("");
  const [ageTo, setAgeTo] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [activeFilters, setActiveFilters] = useState<{ageFrom?: number; ageTo?: number; city?: string}>({});

  // Show all profiles - don't filter by gender
  const { profiles, loading, error } = useProfiles({
    search: searchQuery || undefined,
    ageFrom: activeFilters.ageFrom,
    ageTo: activeFilters.ageTo,
    city: activeFilters.city,
    filterByOppositeGender: false,
  });

  // Pagination
  const pagination = usePagination({
    totalItems: profiles.length,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  const paginatedProfiles = pagination.paginatedItems(profiles);

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
    pagination.goToPage(1); // Reset to first page
    
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
    pagination.goToPage(1);
    toast.info("הפילטרים נוקו");
  };

  const activeFilterLabels = useMemo(() => {
    const labels: string[] = [];
    if (activeFilters.ageFrom) labels.push(`גיל מ-${activeFilters.ageFrom}`);
    if (activeFilters.ageTo) labels.push(`גיל עד ${activeFilters.ageTo}`);
    if (activeFilters.city) labels.push(`מיקום: ${activeFilters.city}`);
    return labels;
  }, [activeFilters]);

  // Show login prompt for unauthenticated users
  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-muted/20" dir="rtl">
        <SEOHead 
          title="גלו פרופילים"
          description="דפדפו בפרופילים של משתמשים ומצאו את ההתאמה המושלמת שלכם. אלפי פרופילים מאומתים מחכים לכם."
          keywords="חיפוש פרופילים, היכרויות, דייטינג, פרופילים"
        />
        <Navbar />
        
        <main className="container mx-auto px-6 pt-28 pb-16">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              גלו את <span className="text-gradient">ההתאמה</span> שלכם
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              דפדפו בפרופילים ומצאו אנשים שמתאימים לכם
            </p>
          </header>

          {/* Login Prompt */}
          <div className="max-w-lg mx-auto">
            <div className="bg-card rounded-3xl p-8 shadow-card text-center">
              <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-primary-foreground" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                הצטרפו כדי לגלות פרופילים
              </h2>
              <p className="text-muted-foreground mb-6">
                יש לנו אלפי פרופילים מאומתים של אנשים אמיתיים שמחכים להכיר אתכם. 
                הירשמו בחינם כדי לצפות בפרופילים, לשלוח לייקים ולמצוא את ההתאמה המושלמת.
              </p>
              
              {/* Preview Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-muted/50 rounded-2xl">
                <div className="text-center">
                  <div className="font-display text-2xl font-bold text-gradient">160+</div>
                  <div className="text-xs text-muted-foreground">פרופילים</div>
                </div>
                <div className="text-center">
                  <div className="font-display text-2xl font-bold text-gradient">100%</div>
                  <div className="text-xs text-muted-foreground">מאומתים</div>
                </div>
                <div className="text-center">
                  <div className="font-display text-2xl font-bold text-gradient">חינם</div>
                  <div className="text-xs text-muted-foreground">לגמרי</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/register">
                  <Button variant="hero" size="lg" className="w-full sm:w-auto">
                    הרשמה חינם
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    יש לי חשבון
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20" dir="rtl">
      <SEOHead 
        title="גלו פרופילים"
        description="דפדפו בפרופילים של משתמשים ומצאו את ההתאמה המושלמת שלכם. אלפי פרופילים מאומתים מחכים לכם."
        keywords="חיפוש פרופילים, היכרויות, דייטינג, פרופילים"
      />
      <Navbar />
      
      <main className="container mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            גלו את <span className="text-gradient">ההתאמה</span> שלכם
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            דפדפו בפרופילים ומצאו אנשים שמתאימים לכם
          </p>
        </header>

        {/* Search & Filters */}
        <section className="max-w-3xl mx-auto mb-12" aria-label="חיפוש וסינון">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
              <Input
                placeholder="חפשו לפי שם או עיר..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12 h-14 rounded-xl bg-card border-border text-lg"
                aria-label="חיפוש פרופילים"
              />
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className={`h-14 w-14 rounded-xl ${activeFilterLabels.length > 0 ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
              aria-label="פתח פילטרים"
              aria-expanded={showFilters}
            >
              <SlidersHorizontal className="w-5 h-5" aria-hidden="true" />
            </Button>
          </div>

          {/* Active Filters Tags */}
          {activeFilterLabels.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4" role="list" aria-label="פילטרים פעילים">
              {activeFilterLabels.map((filter, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                  role="listitem"
                >
                  {filter}
                </span>
              ))}
              <button 
                onClick={clearFilters}
                className="inline-flex items-center gap-1 bg-destructive/10 text-destructive px-3 py-1 rounded-full text-sm hover:bg-destructive/20 focus:outline-none focus:ring-2 focus:ring-destructive"
                aria-label="נקה את כל הפילטרים"
              >
                <X className="w-3 h-3" aria-hidden="true" />
                נקה הכל
              </button>
            </div>
          )}

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-6 bg-card rounded-2xl shadow-card animate-slide-up" role="region" aria-label="פילטרים">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block" id="age-label">גיל</label>
                  <div className="flex gap-2" aria-labelledby="age-label">
                    <Input 
                      placeholder="מ-" 
                      className="h-10" 
                      type="number"
                      value={ageFrom}
                      onChange={(e) => setAgeFrom(e.target.value)}
                      aria-label="גיל מינימלי"
                    />
                    <Input 
                      placeholder="עד" 
                      className="h-10" 
                      type="number"
                      value={ageTo}
                      onChange={(e) => setAgeTo(e.target.value)}
                      aria-label="גיל מקסימלי"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block" htmlFor="location-filter">מיקום</label>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                    <Input 
                      id="location-filter"
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
        </section>

        {/* Loading State */}
        {loading && (
          <section role="status" aria-live="polite" aria-busy="true" aria-label="טוען פרופילים">
            <SkeletonGrid count={8} />
          </section>
        )}

        {/* Error State */}
        {error && (
          <EmptyState
            icon={<X className="w-10 h-10" />}
            title="שגיאה בטעינה"
            description="אירעה שגיאה בטעינת הפרופילים. נסו שוב."
            actionLabel="נסה שוב"
            onAction={() => window.location.reload()}
          />
        )}

        {/* Results */}
        {!loading && !error && (
          <>
            {/* Results Count & View Toggle */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                נמצאו <span className="font-semibold text-foreground">{profiles.length}</span> פרופילים
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-muted rounded-lg p-1" role="group" aria-label="בחר תצוגה">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    aria-label="תצוגת רשת"
                    aria-pressed={viewMode === "grid"}
                  >
                    <Grid3X3 className="w-4 h-4" aria-hidden="true" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    aria-label="תצוגת רשימה"
                    aria-pressed={viewMode === "list"}
                  >
                    <List className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  עמוד {pagination.currentPage} מתוך {pagination.totalPages}
                </p>
              </div>
            </div>

            {/* Members Grid */}
            {paginatedProfiles.length > 0 ? (
              <>
                <div className={viewMode === "grid" 
                  ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                  : "flex flex-col gap-4"
                }>
                  {paginatedProfiles.map((profile) => (
                    viewMode === "grid" ? (
                      <MemberCard 
                        key={profile.id} 
                        member={{
                          id: profile.id,
                          name: profile.name,
                          age: profile.age,
                          city: profile.city,
                          bio: "",
                          image: profile.avatar_url || "/profiles/profile1.jpg",
                          interests: profile.interests || [],
                          isOnline: profile.is_online || false,
                          lastActive: undefined,
                        }}
                        onLike={() => handleLike(profile.id, profile.name)}
                        onPass={() => handlePass(profile.name)}
                      />
                    ) : (
                      <Link 
                        key={profile.id} 
                        to={`/member/${profile.id}`}
                        className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:shadow-card transition-shadow focus-ring"
                      >
                        <LazyImage 
                          src={profile.avatar_url || "/profiles/profile1.jpg"} 
                          alt={profile.name}
                          className="w-16 h-16 rounded-full"
                          aspectRatio="square"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground truncate">
                              {profile.name}, {profile.age}
                            </h3>
                            {profile.is_online && (
                              <span className="w-2 h-2 bg-success rounded-full" aria-label="מחובר/ת" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{profile.city}</p>
                          {/* bio intentionally not exposed in public profiles */}
                        </div>
                        <div className="flex items-center gap-2">
                          {(profile.interests || []).slice(0, 2).map((interest) => (
                            <Badge key={interest} variant="secondary" className="hidden sm:inline-flex">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </Link>
                    )
                  ))}
                </div>

                {/* Pagination Controls */}
                {pagination.totalPages > 1 && (
                  <nav className="flex items-center justify-center gap-2 mt-12" aria-label="ניווט בין דפים">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={pagination.prevPage}
                      disabled={!pagination.hasPrevPage}
                      aria-label="דף קודם"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>

                    <div className="flex items-center gap-1">
                      {pagination.pageNumbers.map((pageNum, idx) => (
                        pageNum < 0 ? (
                          <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground" aria-hidden="true">...</span>
                        ) : (
                          <Button
                            key={pageNum}
                            variant={pageNum === pagination.currentPage ? "default" : "ghost"}
                            size="sm"
                            onClick={() => pagination.goToPage(pageNum)}
                            aria-label={`עבור לדף ${pageNum}`}
                            aria-current={pageNum === pagination.currentPage ? "page" : undefined}
                          >
                            {pageNum}
                          </Button>
                        )
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={pagination.nextPage}
                      disabled={!pagination.hasNextPage}
                      aria-label="דף הבא"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                  </nav>
                )}
              </>
            ) : (
              <EmptyState
                icon={<Users className="w-10 h-10" />}
                title="לא נמצאו תוצאות"
                description="לא נמצאו פרופילים התואמים את החיפוש שלכם. נסו לשנות את הפילטרים."
                actionLabel="נקה פילטרים"
                onAction={clearFilters}
                secondaryActionLabel="עברו לגילוי"
                secondaryActionLink="/discover"
                tips={[
                  searchQuery ? "נסו לחפש רק שם פרטי או רק עיר" : null,
                  activeFilters.city ? "נסו לנקות את פילטר המיקום" : null,
                  activeFilters.ageFrom || activeFilters.ageTo ? "נסו להרחיב את טווח הגילאים" : null,
                  activeFilterLabels.length > 0 ? "טיפ: התחילו מניקוי פילטרים ובחרו מחדש רק אחד" : null,
                ].filter(Boolean) as string[]}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Members;
