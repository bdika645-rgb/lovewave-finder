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
      <div className="pt-24 pb-12 px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Heart className="w-5 h-5 fill-current" />
            <span className="font-medium">{matches.length} התאמות</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            ההתאמות שלי
          </h1>
          <p className="text-muted-foreground">
            אלה האנשים שגם הם עשו לכם לייק! התחילו שיחה
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className="gap-2"
          >
            <Users className="w-4 h-4" />
            כל ההתאמות ({matches.length})
          </Button>
          <Button
            variant={filter === "new" ? "default" : "outline"}
            onClick={() => setFilter("new")}
            className="gap-2"
          >
            <Sparkles className="w-4 h-4" />
            חדשות ({newMatches.length})
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : displayedMatches.length === 0 ? (
          <div className="text-center py-20 max-w-md mx-auto">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-6 animate-pulse-soft">
              <Heart className="w-12 h-12 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-3">
              {filter === "new" ? "אין התאמות חדשות" : "עדיין אין התאמות"}
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {filter === "new"
                ? "לא היו התאמות חדשות בשבוע האחרון. המשיכו לגלות פרופילים חדשים!"
                : "כשמישהו שעשיתם לו לייק יעשה לכם לייק בחזרה, תראו את ההתאמה כאן. בינתיים, המשיכו לגלות!"}
            </p>
            <div className="bg-muted/50 rounded-xl p-4 mb-6 text-right" dir="rtl">
              <p className="text-sm font-medium text-foreground mb-2">💡 טיפים לקבלת התאמות:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• שלחו לייקים לאנשים שבאמת מעניינים אתכם</li>
                <li>• סופר לייק בולט יותר ומגדיל סיכויים</li>
                <li>• פרופיל מלא מושך יותר התאמות</li>
              </ul>
            </div>
            <Link to="/discover">
              <Button variant="hero" size="lg" className="gap-2">
                <Sparkles className="w-5 h-5" />
                גלו פרופילים חדשים
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedMatches.map((match) => {
              const profile = match.matchedProfile;
              const isNew =
                new Date(match.created_at) >
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

              return (
                <div
                  key={match.id}
                  className="bg-card rounded-3xl overflow-hidden shadow-card card-hover relative group"
                >
                  {isNew && (
                    <Badge className="absolute top-3 right-3 z-10 bg-primary text-primary-foreground">
                      חדש!
                    </Badge>
                  )}

                  <Link to={`/member/${profile.id}`}>
                    <div className="aspect-[4/5] relative overflow-hidden">
                      <img
                        src={profile.avatar_url || "/profiles/profile1.jpg"}
                        alt={profile.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-4 right-4 left-4 text-white">
                        <h3 className="font-display text-xl font-bold">
                          {profile.name}, {profile.age}
                        </h3>
                        <p className="text-white/80 text-sm">{profile.city}</p>
                      </div>
                    </div>
                  </Link>

                  <div className="p-4">
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {profile.bio || "אין תיאור"}
                    </p>
                    <Button
                      variant="hero"
                      className="w-full gap-2"
                      disabled={loadingMessage === profile.id}
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
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <MessageCircle className="w-4 h-4" />
                      )}
                      שלחו הודעה
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
