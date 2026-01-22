import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useProfileViews } from "@/hooks/useProfileViews";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Loader2, UserPlus, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";

const WhoViewedMe = () => {
  const { user } = useAuth();
  const { views, loading } = useProfileViews();

  if (!user) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Navbar />
        <div className="pt-24 flex flex-col items-center justify-center gap-4 px-4">
          <Eye className="w-16 h-16 text-muted-foreground" />
          <h1 className="text-2xl font-display font-bold">התחברו כדי לראות מי צפה בכם</h1>
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
      <div className="pt-24 pb-24 sm:pb-12 px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Eye className="w-5 h-5" />
            <span className="font-medium">{views.length} צפיות</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            מי צפה בי
          </h1>
          <p className="text-muted-foreground">
            אלה האנשים שביקרו בפרופיל שלכם לאחרונה
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20" role="status" aria-label="טוען צפיות">
            <Loader2 className="w-12 h-12 text-primary animate-spin" aria-hidden="true" />
            <span className="sr-only">טוען צפיות...</span>
          </div>
        ) : views.length === 0 ? (
          <div className="text-center py-20">
            <Eye className="w-20 h-20 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-display font-semibold text-foreground mb-2">
              עדיין אין צפיות
            </h2>
            <p className="text-muted-foreground mb-6">
              השלימו את הפרופיל שלכם כדי למשוך יותר מבטים!
            </p>
            <Link to="/profile">
              <Button variant="hero" size="lg">
                <UserPlus className="w-5 h-5 ml-2" />
                שפרו את הפרופיל
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {views.map((view) => {
              if (!view.viewer) return null;
              const viewer = view.viewer;
              
              return (
                <div
                  key={view.id}
                  className="bg-card rounded-3xl overflow-hidden shadow-card card-hover relative group"
                >
                  <Badge className="absolute top-3 right-3 z-10 bg-secondary text-secondary-foreground">
                    <Clock className="w-3 h-3 ml-1" />
                    {formatDistanceToNow(new Date(view.viewed_at), { addSuffix: true, locale: he })}
                  </Badge>

                  <Link to={`/member/${viewer.id}`}>
                    <div className="aspect-[4/5] relative overflow-hidden">
                      <img
                        src={viewer.avatar_url || "/profiles/profile1.jpg"}
                        alt={viewer.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-4 right-4 left-4 text-white">
                        <h3 className="font-display text-xl font-bold">
                          {viewer.name}, {viewer.age}
                        </h3>
                        <p className="text-white/80 text-sm">{viewer.city}</p>
                      </div>
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link to={`/member/${viewer.id}`}>
                      <Button variant="hero" className="w-full gap-2">
                        <Eye className="w-4 h-4" />
                        צפו בפרופיל
                      </Button>
                    </Link>
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

export default WhoViewedMe;
