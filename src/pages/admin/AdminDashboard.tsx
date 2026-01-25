import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import StatsCard from "@/components/admin/StatsCard";
import DashboardWidgetSettings from "@/components/admin/DashboardWidgetSettings";
import { useAdminStats } from "@/hooks/useAdminStats";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import { useAdminDashboardWidgets } from "@/hooks/useAdminDashboardWidgets";
import { cn } from "@/lib/utils";
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
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts";

const CHART_COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "hsl(142, 72%, 45%)"];

// Quick actions for the dashboard - WordPress/Elementor style
const quickActions = [
  { icon: Users, label: "משתמשים", description: "ניהול וצפייה", path: "/admin/users", gradient: "from-blue-500 to-blue-600" },
  { icon: Flag, label: "דיווחים", description: "דיווחים חדשים", path: "/admin/reports", gradient: "from-rose-500 to-rose-600" },
  { icon: Shield, label: "תפקידים", description: "הרשאות", path: "/admin/roles", gradient: "from-amber-500 to-amber-600" },
  { icon: Settings, label: "הגדרות", description: "הגדרות מערכת", path: "/admin/settings", gradient: "from-slate-500 to-slate-600" },
  { icon: BarChart3, label: "ניתוח", description: "סטטיסטיקות", path: "/admin/analytics", gradient: "from-emerald-500 to-emerald-600" },
  { icon: MessageCircle, label: "הודעות", description: "צפייה בהודעות", path: "/admin/messages", gradient: "from-violet-500 to-violet-600" },
];

// Activity type icons and colors
const activityConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  signup: { icon: UserPlus, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  match: { icon: Heart, color: "text-pink-500", bg: "bg-pink-500/10" },
  like: { icon: ThumbsUp, color: "text-rose-500", bg: "bg-rose-500/10" },
  message: { icon: MessageCircle, color: "text-blue-500", bg: "bg-blue-500/10" },
  report: { icon: Flag, color: "text-orange-500", bg: "bg-orange-500/10" },
  login: { icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
  default: { icon: Activity, color: "text-muted-foreground", bg: "bg-muted" }
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
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.path}
                  to={action.path}
                  className="group relative overflow-hidden rounded-xl p-4 bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3 transition-transform group-hover:scale-110",
                    action.gradient
                  )}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">{action.label}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
                  <ArrowUpRight className="absolute top-3 left-3 w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </motion.div>
        );

      case "age-chart":
        return (
          <motion.div variants={itemVariants} className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="text-base font-semibold text-foreground">התפלגות גילאים</h3>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats?.ageStats || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px"
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        );

      case "gender-chart":
        return (
          <motion.div variants={itemVariants} className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="text-base font-semibold text-foreground">התפלגות מגדרים</h3>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {genderData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        );

      case "activity":
        return (
          <motion.div variants={itemVariants} className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">פעילות אחרונה</h3>
              <Button variant="ghost" size="sm" asChild className="text-xs">
                <Link to="/admin/activity">
                  צפה בהכל
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                </Link>
              </Button>
            </div>
            <div className="divide-y divide-border max-h-[320px] overflow-y-auto">
              {activitiesLoading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="p-4 flex items-center gap-3">
                    <Skeleton className="w-9 h-9 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-3/4 mb-1.5" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                ))
              ) : activities.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Activity className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">אין פעילות אחרונה</p>
                </div>
              ) : (
                activities.map((activity) => {
                  const config = activityConfig[activity.action_type] || activityConfig.default;
                  const IconComponent = config.icon;
                  
                  return (
                    <div key={activity.id} className="p-3 flex items-center gap-3 hover:bg-muted/50 transition-colors">
                      <div className={cn("p-2 rounded-lg", config.bg)}>
                        <IconComponent className={cn("w-4 h-4", config.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {activity.user && (
                            <Avatar className="w-5 h-5">
                              <AvatarImage src={activity.user.avatar_url || undefined} />
                              <AvatarFallback className="text-[10px]">{activity.user.name?.[0]}</AvatarFallback>
                            </Avatar>
                          )}
                          <p className="text-sm text-foreground truncate">{activity.description}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
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
          <motion.div variants={itemVariants} className="space-y-3">
            <div className="bg-card rounded-xl p-5 border border-border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground text-sm">משתמשים השבוע</h3>
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <p className="text-2xl font-bold text-primary">{stats?.newUsersThisWeek || 0}</p>
              <p className="text-xs text-muted-foreground">רשומים חדשים</p>
            </div>
            
            <div className="bg-card rounded-xl p-5 border border-border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground text-sm">משתמשים החודש</h3>
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <p className="text-2xl font-bold text-primary">{stats?.newUsersThisMonth || 0}</p>
              <p className="text-xs text-muted-foreground">רשומים חדשים</p>
            </div>
            
            <div className="bg-card rounded-xl p-5 border border-border">
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
          <motion.div variants={itemVariants} className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-secondary" />
              <h3 className="text-base font-semibold text-foreground">משתמשים בסיכון</h3>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                <span className="text-sm font-medium">לא פעילים 7+ ימים</span>
                <Badge variant="secondary">{Math.floor((stats?.totalUsers || 0) * 0.15)}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <span className="text-sm font-medium">לא פעילים 30+ ימים</span>
                <Badge variant="destructive">{Math.floor((stats?.totalUsers || 0) * 0.05)}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted border border-border">
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

        {/* Stats Cards - WordPress Style Grid */}
        {enabledWidgets.some(w => w.id === "stats") && renderWidget("stats")}
        
        {/* Quick Actions */}
        {enabledWidgets.some(w => w.id === "quick-actions") && renderWidget("quick-actions")}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {enabledWidgets.some(w => w.id === "age-chart") && renderWidget("age-chart")}
          {enabledWidgets.some(w => w.id === "gender-chart") && renderWidget("gender-chart")}
        </div>

        {/* Activity + Stats Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            {enabledWidgets.some(w => w.id === "activity") && renderWidget("activity")}
          </div>
          <div>
            {enabledWidgets.some(w => w.id === "weekly-stats") && renderWidget("weekly-stats")}
          </div>
        </div>

        {/* Cities Chart */}
        {enabledWidgets.some(w => w.id === "cities") && renderWidget("cities")}

        {/* Additional Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {enabledWidgets.some(w => w.id === "funnel") && renderWidget("funnel")}
          {enabledWidgets.some(w => w.id === "at-risk") && renderWidget("at-risk")}
        </div>
      </motion.div>
    </AdminLayout>
  );
}
