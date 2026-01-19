import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import StatsCard from "@/components/admin/StatsCard";
import { useAdminStats } from "@/hooks/useAdminStats";
import { 
  Users, Heart, MessageCircle, ThumbsUp, UserPlus, Activity,
  Flag, Shield, Settings, BarChart3, TrendingUp, ArrowUpRight
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
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
  Legend
} from "recharts";

const COLORS = ["#ec4899", "#8b5cf6", "#6366f1"];

// Quick actions for the dashboard
const quickActions = [
  { icon: Users, label: "ניהול משתמשים", path: "/admin/users", color: "bg-blue-500" },
  { icon: Flag, label: "דיווחים", path: "/admin/reports", color: "bg-red-500" },
  { icon: Shield, label: "תפקידים", path: "/admin/roles", color: "bg-yellow-500" },
  { icon: Settings, label: "הגדרות", path: "/admin/settings", color: "bg-gray-500" },
];

// Mock recent activity
const recentActivity = [
  { id: 1, type: "signup", text: "משתמש חדש נרשם: דני כהן", time: "לפני 5 דקות", icon: UserPlus },
  { id: 2, type: "match", text: "מאץ' חדש: מיכל ויוסי", time: "לפני 12 דקות", icon: Heart },
  { id: 3, type: "report", text: "דיווח חדש על תוכן לא הולם", time: "לפני 25 דקות", icon: Flag },
  { id: 4, type: "message", text: "1,234 הודעות נשלחו היום", time: "לפני שעה", icon: MessageCircle },
];

export default function AdminDashboard() {
  const { stats, loading } = useAdminStats();

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

  return (
    <AdminLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Header with welcome message */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">לוח בקרה</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">סקירה כללית של האפליקציה</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="text-xs sm:text-sm">
              <Link to="/admin/analytics">
                <BarChart3 className="w-4 h-4 ml-1 sm:ml-2" />
                <span className="hidden sm:inline">צפה בסטטיסטיקות מלאות</span>
                <span className="sm:hidden">סטטיסטיקות</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
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
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-xl p-4 sm:p-6 border border-border">
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
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Age Distribution */}
          <div className="bg-card rounded-xl p-6 border border-border">
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
          </div>

          {/* Gender Distribution */}
          <div className="bg-card rounded-xl p-6 border border-border">
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
          </div>
        </div>

        {/* Bottom Row: Recent Activity + Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border overflow-hidden">
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
              {recentActivity.map((item) => (
                <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                  <div className="p-2 bg-muted rounded-lg">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-sm">{item.text}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="space-y-4">
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
          </div>
        </div>

        {/* Top Cities */}
        <div className="bg-card rounded-xl p-6 border border-border">
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
        </div>
      </div>
    </AdminLayout>
  );
}
