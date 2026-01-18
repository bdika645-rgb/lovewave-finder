import AdminLayout from "@/components/admin/AdminLayout";
import StatsCard from "@/components/admin/StatsCard";
import { useAdminStats } from "@/hooks/useAdminStats";
import { Users, Heart, MessageCircle, ThumbsUp, UserPlus, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">לוח בקרה</h1>
          <p className="text-muted-foreground mt-1">סקירה כללית של האפליקציה</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Age Distribution */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">התפלגות גילאים</h3>
            <ResponsiveContainer width="100%" height={300}>
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
            <ResponsiveContainer width="100%" height={300}>
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

          {/* Top Cities */}
          <div className="bg-card rounded-xl p-6 border border-border lg:col-span-2">
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

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-2">משתמשים השבוע</h3>
            <p className="text-4xl font-bold text-primary">{stats?.newUsersThisWeek || 0}</p>
          </div>
          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-2">משתמשים החודש</h3>
            <p className="text-4xl font-bold text-primary">{stats?.newUsersThisMonth || 0}</p>
          </div>
          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-2">יחס מאצ'ים להרשמות</h3>
            <p className="text-4xl font-bold text-primary">
              {stats && stats.totalUsers > 0 
                ? ((stats.totalMatches / stats.totalUsers) * 100).toFixed(1) 
                : 0}%
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
