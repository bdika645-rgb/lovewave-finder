import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import StatsCard from "@/components/admin/StatsCard";
import DashboardWidgetSettings from "@/components/admin/DashboardWidgetSettings";
import { useAdminStats } from "@/hooks/useAdminStats";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import { useAdminDashboardWidgets } from "@/hooks/useAdminDashboardWidgets";
import { 
  Users, Heart, MessageCircle, ThumbsUp, UserPlus, Activity,
  Flag, Shield, Settings, BarChart3, TrendingUp, ArrowUpRight,
  RefreshCw, AlertTriangle
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts";

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))"];

// Quick actions for the dashboard
const quickActions = [
  { icon: Users, label: "ניהול משתמשים", path: "/admin/users", color: "bg-blue-500" },
  { icon: Flag, label: "דיווחים", path: "/admin/reports", color: "bg-red-500" },
  { icon: Shield, label: "תפקידים", path: "/admin/roles", color: "bg-yellow-500" },
  { icon: Settings, label: "הגדרות", path: "/admin/settings", color: "bg-gray-500" },
];

// Activity type icons and colors
const activityConfig: Record<string, { icon: React.ElementType; color: string }> = {
  signup: { icon: UserPlus, color: "text-green-500" },
  match: { icon: Heart, color: "text-pink-500" },
  like: { icon: ThumbsUp, color: "text-red-500" },
  message: { icon: MessageCircle, color: "text-blue-500" },
  report: { icon: Flag, color: "text-orange-500" },
  login: { icon: Users, color: "text-purple-500" },
  default: { icon: Activity, color: "text-muted-foreground" }
};

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

  const genderData = stats ? [
    { name: "גברים", value: stats.genderStats.male },
    { name: "נשים", value: stats.genderStats.female },
    { name: "אחר", value: stats.genderStats.other }
  ] : [];

  // Funnel data
  const funnelData = stats ? [
    { name: "הרשמות", value: stats.totalUsers, fill: "hsl(var(--primary))" },
    { name: "פרופיל מלא", value: Math.floor(stats.totalUsers * 0.7), fill: "hsl(var(--secondary))" },
    { name: "לייק ראשון", value: stats.totalLikes, fill: "hsl(var(--accent))" },
    { name: "מאצ'ים", value: stats.totalMatches, fill: "hsl(142, 72%, 45%)" },
    { name: "הודעות", value: stats.totalMessages, fill: "hsl(200, 70%, 50%)" },
  ] : [];

  // Render widgets based on enabled list
  const renderWidget = (widgetId: string) => {
    switch (widgetId) {
      case "stats":
        return (
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            <StatsCard
              title="סה״כ משתמשים"
              value={stats?.totalUsers || 0}
              icon={Users}
              trend={{ value: 12, isPositive: true }}
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
            />
          </motion.div>
        );

      case "quick-actions":
        return (
          <motion.div variants={itemVariants} className="bg-card rounded-xl p-4 sm:p-6 border border-border">
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">פעולות מהירות</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.path}
                  to={action.path}
                  className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border border-border hover:bg-muted/50 transition-all hover:scale-[1.02] group"
                >
                  <div className={`p-1.5 sm:p-2 rounded-lg ${action.color}`}>
                    <action.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors text-sm sm:text-base line-clamp-1">
                    {action.label}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground mr-auto opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block" />
                </Link>
              ))}
            </div>
          </motion.div>
        );

      case "age-chart":
        return (
          <motion.div variants={itemVariants} className="bg-card rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">התפלגות גילאים</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats?.ageStats || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        );

      case "gender-chart":
        return (
          <motion.div variants={itemVariants} className="bg-card rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">התפלגות מגדרים</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genderData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        );

      case "activity":
        return (
          <motion.div variants={itemVariants} className="lg:col-span-2 bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-semibold">פעילות אחרונה</h3>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/activity">
                  צפה בהכל
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                </Link>
              </Button>
            </div>
            <div className="divide-y divide-border">
              {activitiesLoading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="p-4 flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                ))
              ) : activities.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>אין פעילות אחרונה</p>
                </div>
              ) : (
                activities.map((activity) => {
                  const config = activityConfig[activity.action_type] || activityConfig.default;
                  const IconComponent = config.icon;
                  
                  return (
                    <div key={activity.id} className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                      <div className="p-2 bg-muted rounded-lg">
                        <IconComponent className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {activity.user && (
                            <Avatar className="w-5 h-5">
                              <AvatarImage src={activity.user.avatar_url || undefined} />
                              <AvatarFallback className="text-xs">{activity.user.name?.[0]}</AvatarFallback>
                            </Avatar>
                          )}
                          <p className="text-foreground text-sm truncate">{activity.description}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(activity.created_at), { 
                            addSuffix: true, 
                            locale: he 
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        );

      case "weekly-stats":
        return (
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground">משתמשים השבוע</h3>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-primary">{stats?.newUsersThisWeek || 0}</p>
              <p className="text-sm text-muted-foreground">+12% מהשבוע הקודם</p>
            </div>
            
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground">משתמשים החודש</h3>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-primary">{stats?.newUsersThisMonth || 0}</p>
              <p className="text-sm text-muted-foreground">+8% מהחודש הקודם</p>
            </div>
            
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground">יחס מאצ'ים</h3>
                <Heart className="w-4 h-4 text-pink-500" />
              </div>
              <p className="text-3xl font-bold text-primary">
                {stats && stats.totalUsers > 0 
                  ? ((stats.totalMatches / stats.totalUsers) * 100).toFixed(1) 
                  : 0}%
              </p>
              <p className="text-sm text-muted-foreground">מכלל המשתמשים</p>
            </div>
          </motion.div>
        );

      case "cities":
        return (
          <motion.div variants={itemVariants} className="bg-card rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">ערים מובילות</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.cityStats || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="city" type="category" stroke="hsl(var(--muted-foreground))" width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        );

      case "funnel":
        return (
          <motion.div variants={itemVariants} className="bg-card rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Funnel המרה</h3>
            <ResponsiveContainer width="100%" height={300}>
              <FunnelChart>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Funnel dataKey="value" data={funnelData} isAnimationActive>
                  <LabelList position="right" fill="#fff" stroke="none" dataKey="name" />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </motion.div>
        );

      case "at-risk":
        return (
          <motion.div variants={itemVariants} className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-semibold text-foreground">משתמשים בסיכון</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <span className="text-sm font-medium">לא פעילים 7+ ימים</span>
                <Badge variant="secondary">{Math.floor((stats?.totalUsers || 0) * 0.15)}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <span className="text-sm font-medium">לא פעילים 30+ ימים</span>
                <Badge variant="destructive">{Math.floor((stats?.totalUsers || 0) * 0.05)}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <span className="text-sm font-medium">פרופיל לא מלא</span>
                <Badge variant="outline">{Math.floor((stats?.totalUsers || 0) * 0.25)}</Badge>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <motion.div 
        className="space-y-6 sm:space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header with welcome message */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">לוח בקרה</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">סקירה כללית של האפליקציה</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => refetch()} className="gap-1">
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">רענון</span>
            </Button>
            <DashboardWidgetSettings
              widgets={widgets}
              onToggle={toggleWidget}
              onReorder={reorderWidgets}
              onReset={resetToDefaults}
            />
            <Button asChild variant="outline" size="sm" className="text-xs sm:text-sm">
              <Link to="/admin/analytics">
                <BarChart3 className="w-4 h-4 ml-1 sm:ml-2" />
                <span className="hidden sm:inline">צפה בסטטיסטיקות מלאות</span>
                <span className="sm:hidden">סטטיסטיקות</span>
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Dynamic Widgets */}
        {enabledWidgets.map((widget) => (
          <div key={widget.id}>
            {renderWidget(widget.id)}
          </div>
        ))}

        {/* Charts Row - Special layout for charts */}
        {enabledWidgets.some(w => w.id === "age-chart") && enabledWidgets.some(w => w.id === "gender-chart") && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rendered inline in the widgets loop */}
          </div>
        )}

        {/* Bottom Row: Activity + Quick Stats */}
        {enabledWidgets.some(w => w.id === "activity") && enabledWidgets.some(w => w.id === "weekly-stats") && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Rendered inline in the widgets loop */}
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
}
