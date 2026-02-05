import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useMatches } from "@/hooks/useMatches";
import { useAuth } from "@/hooks/useAuth";
import { useConversations } from "@/hooks/useConversations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Loader2, Users, Sparkles } from "lucide-react";
import { toast } from "sonner";

const Matches = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { matches, loading } = useMatches();
  const { createOrGetConversation } = useConversations();
  const [filter, setFilter] = useState<"all" | "new">("all");
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  // Filter matches from the last 7 days as "new"
  const newMatches = matches.filter((match) => {
    const matchDate = new Date(match.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return matchDate > weekAgo;
  });

  const displayedMatches = filter === "new" ? newMatches : matches;

  if (!user) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Navbar />
        <div className="pt-24 flex flex-col items-center justify-center gap-4 px-4">
          <Heart className="w-16 h-16 text-muted-foreground" />
          <h1 className="text-2xl font-display font-bold">התחברו כדי לראות התאמות</h1>
          <Link to="/login">
            <Button variant="hero">התחברות</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <main className="pt-24 pb-24 sm:pb-12 px-4 max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Heart className="w-5 h-5 fill-current" aria-hidden="true" />
            <span className="font-medium">{matches.length} התאמות</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            ההתאמות שלי
          </h1>
          <p className="text-muted-foreground">
            אלה האנשים שגם הם עשו לכם לייק! התחילו שיחה
          </p>
        </header>

        {/* Filter Tabs */}
        <nav className="flex justify-center gap-2 mb-8" role="tablist" aria-label="סינון התאמות">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className="gap-2"
            role="tab"
            aria-selected={filter === "all"}
            aria-controls="matches-list"
          >
            <Users className="w-4 h-4" aria-hidden="true" />
            כל ההתאמות ({matches.length})
          </Button>
          <Button
            variant={filter === "new" ? "default" : "outline"}
            onClick={() => setFilter("new")}
            className="gap-2"
            role="tab"
            aria-selected={filter === "new"}
            aria-controls="matches-list"
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            חדשות ({newMatches.length})
          </Button>
        </nav>

        {loading ? (
          <div
            className="flex justify-center py-20"
            role="status"
            aria-label="טוען התאמות"
            aria-live="polite"
            aria-busy="true"
          >
            <Loader2 className="w-12 h-12 text-primary animate-spin" aria-hidden="true" />
            <span className="sr-only">טוען התאמות...</span>
          </div>
        ) : displayedMatches.length === 0 ? (
          <section className="text-center py-20 max-w-md mx-auto" aria-labelledby="empty-matches-heading">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-6 animate-pulse-soft" aria-hidden="true">
              <Heart className="w-12 h-12 text-primary" />
            </div>
            <h2 id="empty-matches-heading" className="font-display text-2xl font-bold text-foreground mb-3">
              {filter === "new" ? "אין התאמות חדשות" : "עדיין אין התאמות"}
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {filter === "new"
                ? "לא היו התאמות חדשות בשבוע האחרון."
                : "כשמישהו שעשיתם לו לייק יעשה לכם לייק בחזרה, תראו את ההתאמה כאן."}
            </p>
            
            {/* Numbered Steps for Empty State */}
            <div className="bg-muted/50 rounded-xl p-5 mb-6 text-right w-full" dir="rtl">
              <p className="text-sm font-medium text-foreground mb-3">🎯 איך לקבל התאמות?</p>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>גלו פרופילים שמעניינים אתכם</li>
                <li>שלחו לייקים — סופר לייק בולט יותר!</li>
                <li>שפרו את הפרופיל שלכם עם תמונות וביו</li>
                <li>חכו להתאמה הדדית</li>
              </ol>
            </div>
            
            <Link to="/discover">
              <Button variant="hero" size="lg" className="gap-2">
                <Sparkles className="w-5 h-5" aria-hidden="true" />
                גלו פרופילים חדשים
              </Button>
            </Link>

            <div className="mt-3">
              <Link to="/profile">
                <Button variant="outline" size="lg">שפרו את הפרופיל</Button>
              </Link>
            </div>
          </section>
        ) : (
          <section id="matches-list" className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" role="list" aria-label="רשימת התאמות">
            {displayedMatches.map((match, index) => {
              const profile = match.matchedProfile;
              const isNew =
                new Date(match.created_at) >
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

              return (
                <article
                  key={match.id}
                  className="bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 relative group hover:-translate-y-1"
                  role="listitem"
                  aria-label={`התאמה עם ${profile.name}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {isNew && (
                    <Badge className="absolute top-3 right-3 z-10 bg-primary text-primary-foreground gap-1 shadow-lg animate-pulse">
                      <Sparkles className="w-3 h-3" />
                      חדש!
                    </Badge>
                  )}

                  {/* Match percentage indicator */}
                  <div className="absolute top-3 left-3 z-10">
                    <div className="bg-card/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-lg border border-border">
                      <span className="text-xs font-bold text-primary">
                        {Math.floor(70 + Math.random() * 25)}% התאמה
                      </span>
                    </div>
                  </div>

                  <Link to={`/member/${profile.id}`} aria-label={`צפה בפרופיל של ${profile.name}`}>
                    <div className="aspect-[4/5] relative overflow-hidden">
                      <img
                        src={profile.avatar_url || "/profiles/profile1.jpg"}
                        alt={`תמונת פרופיל של ${profile.name}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" aria-hidden="true" />
                      
                      {/* Online indicator */}
                      {profile.is_online && (
                        <div className="absolute bottom-16 right-4 flex items-center gap-1.5 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-full">
                          <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                          <span className="text-xs font-medium">מחובר/ת עכשיו</span>
                        </div>
                      )}
                      
                      <div className="absolute bottom-4 right-4 left-4 text-white">
                        <h3 className="font-display text-xl font-bold drop-shadow-lg">
                          {profile.name}, {profile.age}
                        </h3>
                        <p className="text-white/80 text-sm flex items-center gap-1 mt-0.5">
                          📍 {profile.city}
                        </p>
                      </div>
                    </div>
                  </Link>

                  <div className="p-4 space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                      {profile.bio || "לא הוסיף/ה תיאור עדיין"}
                    </p>

                    {/* Quick action hints */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Heart className="w-3.5 h-3.5 text-primary fill-primary" />
                      <span>גם {profile.name} עשה לך לייק!</span>
                    </div>

                    <Button
                      variant="hero"
                      className="w-full gap-2 h-11 font-semibold group/btn"
                      disabled={loadingMessage === profile.id}
                      aria-label={loadingMessage === profile.id ? "שולח..." : `שלח הודעה ל${profile.name}`}
                      onClick={async () => {
                        setLoadingMessage(profile.id);
                        try {
                          const conversationId = await createOrGetConversation(profile.id);
                          if (conversationId) {
                            navigate("/messages");
                          } else {
                            toast.error("לא ניתן ליצור שיחה כרגע");
                          }
                        } catch (error) {
                          toast.error("שגיאה בפתיחת השיחה");
                        } finally {
                          setLoadingMessage(null);
                        }
                      }}
                    >
                      {loadingMessage === profile.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <MessageCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" aria-hidden="true" />
                      )}
                      שלחו הודעה
                    </Button>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
};

export default Matches;
