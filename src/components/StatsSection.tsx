import { useSiteStatistics } from "@/hooks/useSiteStatistics";
import { useLandingContent } from "@/contexts/LandingContentContext";
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
  const { content } = useLandingContent();
  const { stats: statsContent } = content;

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
      label: statsContent.stat1Label,
    },
    {
      icon: Heart,
      value: displayStats.successfulMatches,
      label: statsContent.stat2Label,
    },
    {
      icon: MessageCircle,
      value: displayStats.messagesPerDay,
      label: statsContent.stat3Label,
    },
    {
      icon: TrendingUp,
      value: displayStats.dailyActiveUsers,
      label: statsContent.stat4Label,
    },
    {
      icon: MapPin,
      value: displayStats.mostActiveCity,
      label: statsContent.stat5Label,
    },
    {
      icon: Clock,
      value: displayStats.averageMatchTime,
      label: statsContent.stat6Label,
    },
  ];

  return (
    <section id="stats" className="py-16 gradient-primary" aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="sr-only">סטטיסטיקות האתר</h2>
      <div className="container mx-auto px-6">
        <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {statItems.map((stat, index) => (
            <div key={index} className="text-center">
              <stat.icon className="w-8 h-8 text-primary-foreground/80 mx-auto mb-3" aria-hidden="true" />
              {loading && !isStatsEmpty ? (
                <div className="flex justify-center" role="status" aria-label="טוען נתונים">
                  <Loader2 className="w-6 h-6 text-primary-foreground/60 animate-spin" aria-hidden="true" />
                </div>
              ) : (
                <dd className="font-display text-2xl md:text-3xl font-bold text-primary-foreground animate-fade-in">
                  {stat.value}
                </dd>
              )}
              <dt className="text-primary-foreground/70 text-sm mt-1">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default StatsSection;
