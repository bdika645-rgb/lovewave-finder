import StatsCard from "@/components/admin/StatsCard";
import { Users, Activity, Heart, MessageCircle, ThumbsUp, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalMatches: number;
  totalMessages: number;
  totalLikes: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  genderStats: { male: number; female: number; other: number };
  ageStats: { range: string; count: number }[];
  cityStats: { city: string; count: number }[];
}

interface DashboardStatsGridProps {
  stats: AdminStats | null;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
  return (
    <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
      <StatsCard
        title="סה״כ משתמשים"
        value={stats?.totalUsers || 0}
        icon={Users}
        trend={{ value: 12, isPositive: true }}
        variant="gradient"
      />
      <StatsCard
        title="משתמשים פעילים"
        value={stats?.activeUsers || 0}
        icon={Activity}
      />
      <StatsCard
        title="סה״כ מאצ'ים"
        value={stats?.totalMatches || 0}
        icon={Heart}
        trend={{ value: 8, isPositive: true }}
      />
      <StatsCard
        title="סה״כ הודעות"
        value={stats?.totalMessages || 0}
        icon={MessageCircle}
      />
      <StatsCard
        title="סה״כ לייקים"
        value={stats?.totalLikes || 0}
        icon={ThumbsUp}
      />
      <StatsCard
        title="משתמשים חדשים היום"
        value={stats?.newUsersToday || 0}
        icon={UserPlus}
        variant="gradient"
      />
    </motion.div>
  );
}
