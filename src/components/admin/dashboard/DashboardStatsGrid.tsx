import StatsCard from "@/components/admin/StatsCard";
import { Users, Activity, Heart, MessageCircle, ThumbsUp, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

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
  loading?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 }
  }
} as const;

function StatsCardSkeleton() {
  return (
    <div className="bg-card rounded-xl p-4 sm:p-6 border border-border animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export default function DashboardStatsGrid({ stats, loading }: DashboardStatsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {[...Array(6)].map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
    >
      <motion.div variants={itemVariants}>
        <StatsCard
          title="סה״כ משתמשים"
          value={stats?.totalUsers || 0}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          variant="gradient"
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <StatsCard
          title="משתמשים פעילים"
          value={stats?.activeUsers || 0}
          icon={Activity}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <StatsCard
          title="סה״כ מאצ'ים"
          value={stats?.totalMatches || 0}
          icon={Heart}
          trend={{ value: 8, isPositive: true }}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <StatsCard
          title="סה״כ הודעות"
          value={stats?.totalMessages || 0}
          icon={MessageCircle}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <StatsCard
          title="סה״כ לייקים"
          value={stats?.totalLikes || 0}
          icon={ThumbsUp}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <StatsCard
          title="משתמשים חדשים היום"
          value={stats?.newUsersToday || 0}
          icon={UserPlus}
          variant="gradient"
        />
      </motion.div>
    </motion.div>
  );
}
