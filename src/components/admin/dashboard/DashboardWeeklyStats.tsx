import { TrendingUp, Heart } from "lucide-react";
import { motion } from "framer-motion";

interface AdminStats {
  totalUsers: number;
  totalMatches: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
}

interface DashboardWeeklyStatsProps {
  stats: AdminStats | null;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function DashboardWeeklyStats({ stats }: DashboardWeeklyStatsProps) {
  return (
    <motion.div variants={itemVariants} className="space-y-3">
      <div className="bg-card rounded-xl p-5 border border-border hover:border-primary/30 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground text-sm">משתמשים השבוע</h3>
          <TrendingUp className="w-4 h-4 text-success" />
        </div>
        <p className="text-2xl font-bold text-primary">{stats?.newUsersThisWeek || 0}</p>
        <p className="text-xs text-muted-foreground">רשומים חדשים</p>
      </div>
      
      <div className="bg-card rounded-xl p-5 border border-border hover:border-primary/30 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground text-sm">משתמשים החודש</h3>
          <TrendingUp className="w-4 h-4 text-success" />
        </div>
        <p className="text-2xl font-bold text-primary">{stats?.newUsersThisMonth || 0}</p>
        <p className="text-xs text-muted-foreground">רשומים חדשים</p>
      </div>
      
      <div className="bg-card rounded-xl p-5 border border-border hover:border-primary/30 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground text-sm">יחס מאצ'ים</h3>
          <Heart className="w-4 h-4 text-primary" />
        </div>
        <p className="text-2xl font-bold text-primary">
          {stats && stats.totalUsers > 0 
            ? ((stats.totalMatches / stats.totalUsers) * 100).toFixed(1) 
            : 0}%
        </p>
        <p className="text-xs text-muted-foreground">מכלל המשתמשים</p>
      </div>
    </motion.div>
  );
}
