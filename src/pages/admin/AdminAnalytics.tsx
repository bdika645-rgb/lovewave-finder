import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { he } from "date-fns/locale";

interface DailyStats {
  date: string;
  newUsers: number;
  newMatches: number;
  messages: number;
}

export default function AdminAnalytics() {
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const days = 30;
        const stats: DailyStats[] = [];

        for (let i = days - 1; i >= 0; i--) {
          const date = startOfDay(subDays(new Date(), i));
          const nextDate = startOfDay(subDays(new Date(), i - 1));

          const [usersResult, matchesResult, messagesResult] = await Promise.all([
            supabase
              .from("profiles")
              .select("id", { count: "exact", head: true })
              .gte("created_at", date.toISOString())
              .lt("created_at", nextDate.toISOString())
              .eq("is_demo", false),
            supabase
              .from("matches")
              .select("id", { count: "exact", head: true })
              .gte("created_at", date.toISOString())
              .lt("created_at", nextDate.toISOString()),
            supabase
              .from("messages")
              .select("id", { count: "exact", head: true })
              .gte("created_at", date.toISOString())
              .lt("created_at", nextDate.toISOString())
          ]);

          stats.push({
            date: format(date, "dd/MM", { locale: he }),
            newUsers: usersResult.count || 0,
            newMatches: matchesResult.count || 0,
            messages: messagesResult.count || 0
          });
        }

        setDailyStats(stats);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-foreground">סטטיסטיקות</h1>
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">סטטיסטיקות</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">נתונים מ-30 הימים האחרונים</p>
        </div>

        {/* New Users Chart */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">משתמשים חדשים</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Area
                type="monotone"
                dataKey="newUsers"
                name="משתמשים חדשים"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary) / 0.2)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Matches Chart */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">מאצ'ים חדשים</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Line
                type="monotone"
                dataKey="newMatches"
                name="מאצ'ים"
                stroke="#ec4899"
                strokeWidth={2}
                dot={{ fill: "#ec4899" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Messages Chart */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">הודעות</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Area
                type="monotone"
                dataKey="messages"
                name="הודעות"
                stroke="#8b5cf6"
                fill="hsl(280 70% 60% / 0.2)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AdminLayout>
  );
}
