import { siteStatistics } from "@/data/members";
import { Users, Heart, MessageCircle, MapPin, TrendingUp, Clock } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      value: siteStatistics.totalMembers,
      label: "חברים רשומים",
    },
    {
      icon: Heart,
      value: siteStatistics.successfulMatches,
      label: "זוגות מאושרים",
    },
    {
      icon: MessageCircle,
      value: siteStatistics.messagesPerDay,
      label: "הודעות ביום",
    },
    {
      icon: TrendingUp,
      value: siteStatistics.dailyActiveUsers,
      label: "משתמשים פעילים",
    },
    {
      icon: MapPin,
      value: siteStatistics.mostActiveCity,
      label: "העיר הפעילה ביותר",
    },
    {
      icon: Clock,
      value: siteStatistics.averageMatchTime,
      label: "זמן ממוצע למאצ'",
    },
  ];

  return (
    <section className="py-16 gradient-primary">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <stat.icon className="w-8 h-8 text-primary-foreground/80 mx-auto mb-3" />
              <p className="font-display text-2xl md:text-3xl font-bold text-primary-foreground">
                {stat.value}
              </p>
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
