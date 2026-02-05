import AdminLayout from "@/components/admin/AdminLayout";
import DashboardWidgetSettings from "@/components/admin/DashboardWidgetSettings";
import { useAdminStats } from "@/hooks/useAdminStats";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import { useAdminDashboardWidgets } from "@/hooks/useAdminDashboardWidgets";
import { RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

import {
  DashboardStatsGrid,
  DashboardQuickActions,
  DashboardActivityFeed,
  DashboardWeeklyStats,
  DashboardAtRiskUsers,
  AgeDistributionChart,
  GenderDistributionChart,
  CitiesChart,
  ConversionFunnelChart,
} from "@/components/admin/dashboard";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function AdminDashboard() {
  const { stats, loading, refetch } = useAdminStats();
  const { activities, loading: activitiesLoading } = useActivityLogs({ limit: 5 });
  const { widgets, enabledWidgets, toggleWidget, reorderWidgets, resetToDefaults } = useAdminDashboardWidgets();

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">לוח בקרה</h1>
            <p className="text-muted-foreground mt-1">סקירה כללית של האפליקציה</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">לוח בקרה</h1>
            <p className="text-muted-foreground mt-1">סקירה כללית של האפליקציה</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => refetch()} className="gap-1.5">
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">רענון</span>
            </Button>
            <DashboardWidgetSettings
              widgets={widgets}
              onToggle={toggleWidget}
              onReorder={reorderWidgets}
              onReset={resetToDefaults}
            />
          </div>
        </motion.div>

        {/* Stats Cards */}
        {enabledWidgets.some(w => w.id === "stats") && (
          <DashboardStatsGrid stats={stats} />
        )}
        
        {/* Quick Actions */}
        {enabledWidgets.some(w => w.id === "quick-actions") && (
          <DashboardQuickActions />
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {enabledWidgets.some(w => w.id === "age-chart") && (
            <AgeDistributionChart stats={stats} />
          )}
          {enabledWidgets.some(w => w.id === "gender-chart") && (
            <GenderDistributionChart stats={stats} />
          )}
        </div>

        {/* Activity + Stats Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            {enabledWidgets.some(w => w.id === "activity") && (
              <DashboardActivityFeed activities={activities} loading={activitiesLoading} />
            )}
          </div>
          <div>
            {enabledWidgets.some(w => w.id === "weekly-stats") && (
              <DashboardWeeklyStats stats={stats} />
            )}
          </div>
        </div>

        {/* Cities Chart */}
        {enabledWidgets.some(w => w.id === "cities") && (
          <CitiesChart stats={stats} />
        )}

        {/* Additional Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {enabledWidgets.some(w => w.id === "funnel") && (
            <ConversionFunnelChart stats={stats} />
          )}
          {enabledWidgets.some(w => w.id === "at-risk") && (
            <DashboardAtRiskUsers totalUsers={stats?.totalUsers || 0} />
          )}
        </div>
      </motion.div>
    </AdminLayout>
  );
}
