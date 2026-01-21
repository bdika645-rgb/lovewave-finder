import { useSiteStatistics } from "@/hooks/useSiteStatistics";
import { Users, Heart, MessageCircle, MapPin, TrendingUp, Clock, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// נתוני דמו למשתמשים לא מחוברים
const demoStats = {
  totalMembers: "15,000+",
  successfulMatches: "8,000+",
  messagesPerDay: "50,000+",
  dailyActiveUsers: "3,500+",
  mostActiveCity: "תל אביב",
  averageMatchTime: "3 ימים",
};

const StatsSection = () => {
  const { stats, loading } = useSiteStatistics();
  const { user } = useAuth();

  // Use demo stats for non-authenticated users or when stats are all zeros
  const isStatsEmpty = !user || (
    stats.totalMembers === "0" && 
    stats.successfulMatches === "0" && 
    stats.dailyActiveUsers === "0"
  );
  
  const displayStats = isStatsEmpty ? demoStats : stats;

  const statItems = [
    {
      icon: Users,
      value: displayStats.totalMembers,
      label: "חברים רשומים",
    },
    {
      icon: Heart,
      value: displayStats.successfulMatches,
      label: "זוגות מאושרים",
    },
    {
      icon: MessageCircle,
      value: displayStats.messagesPerDay,
      label: "הודעות ביום",
    },
    {
      icon: TrendingUp,
      value: displayStats.dailyActiveUsers,
      label: "משתמשים פעילים",
    },
    {
      icon: MapPin,
      value: displayStats.mostActiveCity,
      label: "העיר הפעילה ביותר",
    },
    {
      icon: Clock,
      value: displayStats.averageMatchTime,
      label: "זמן ממוצע למאצ'",
    },
  ];

  return (
    <section className="py-16 gradient-primary">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {statItems.map((stat, index) => (
            <div key={index} className="text-center">
              <stat.icon className="w-8 h-8 text-primary-foreground/80 mx-auto mb-3" />
              {loading && !isStatsEmpty ? (
                <div className="flex justify-center">
                  <Loader2 className="w-6 h-6 text-primary-foreground/60 animate-spin" />
                </div>
              ) : (
                <p className="font-display text-2xl md:text-3xl font-bold text-primary-foreground animate-fade-in">
                  {stat.value}
                </p>
              )}
              <p className="text-primary-foreground/70 text-sm mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
