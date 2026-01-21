import { useSiteStatistics } from "@/hooks/useSiteStatistics";
import { Users, Heart, MessageCircle, MapPin, TrendingUp, Clock, Loader2 } from "lucide-react";

const StatsSection = () => {
  const { stats, loading } = useSiteStatistics();

  const statItems = [
    {
      icon: Users,
      value: stats.totalMembers,
      label: "חברים רשומים",
    },
    {
      icon: Heart,
      value: stats.successfulMatches,
      label: "זוגות מאושרים",
    },
    {
      icon: MessageCircle,
      value: stats.messagesPerDay,
      label: "הודעות ביום",
    },
    {
      icon: TrendingUp,
      value: stats.dailyActiveUsers,
      label: "משתמשים פעילים",
    },
    {
      icon: MapPin,
      value: stats.mostActiveCity,
      label: "העיר הפעילה ביותר",
    },
    {
      icon: Clock,
      value: stats.averageMatchTime,
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
              {loading ? (
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
