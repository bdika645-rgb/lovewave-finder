import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import { format, subDays, startOfDay, addDays } from "date-fns";
import { he } from "date-fns/locale";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
} as const;

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
        const start = startOfDay(subDays(new Date(), days - 1));
        const end = addDays(startOfDay(new Date()), 1);

        // Fetch once per table (instead of 30x3 queries), then aggregate client-side.
        const [usersRes, matchesRes, messagesRes] = await Promise.all([
          supabase
            .from("profiles")
            .select("created_at")
            .gte("created_at", start.toISOString())
            .lt("created_at", end.toISOString())
            .eq("is_demo", false),
          supabase
            .from("matches")
            .select("created_at")
            .gte("created_at", start.toISOString())
            .lt("created_at", end.toISOString()),
          supabase
            .from("messages")
            .select("created_at")
            .gte("created_at", start.toISOString())
            .lt("created_at", end.toISOString()),
        ]);

        if (usersRes.error) throw usersRes.error;
        if (matchesRes.error) throw matchesRes.error;
        if (messagesRes.error) throw messagesRes.error;

        const usersByDay = new Map<string, number>();
        const matchesByDay = new Map<string, number>();
        const messagesByDay = new Map<string, number>();

        for (const row of usersRes.data || []) {
          const key = startOfDay(new Date(row.created_at)).toISOString();
          usersByDay.set(key, (usersByDay.get(key) || 0) + 1);
        }
        for (const row of matchesRes.data || []) {
          const key = startOfDay(new Date(row.created_at)).toISOString();
          matchesByDay.set(key, (matchesByDay.get(key) || 0) + 1);
        }
        for (const row of messagesRes.data || []) {
          const key = startOfDay(new Date(row.created_at)).toISOString();
          messagesByDay.set(key, (messagesByDay.get(key) || 0) + 1);
        }

        const stats: DailyStats[] = [];
        for (let i = 0; i < days; i++) {
          const day = startOfDay(addDays(start, i));
          const key = day.toISOString();
          stats.push({
            date: format(day, "dd/MM", { locale: he }),
            newUsers: usersByDay.get(key) || 0,
            newMatches: matchesByDay.get(key) || 0,
            messages: messagesByDay.get(key) || 0,
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
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card rounded-xl p-6 border border-border">
              <Skeleton className="h-5 w-32 mb-4" />
              <Skeleton className="h-[280px] rounded-lg" />
            </div>
          ))}
        </motion.div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div 
        className="space-y-6 sm:space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">סטטיסטיקות</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">נתונים מ-30 הימים האחרונים</p>
        </motion.div>

        {/* New Users Chart */}
        <motion.div variants={itemVariants} className="bg-card rounded-xl p-6 border border-border">
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
        </motion.div>

        {/* Matches Chart */}
        <motion.div variants={itemVariants} className="bg-card rounded-xl p-6 border border-border">
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
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Messages Chart */}
        <motion.div variants={itemVariants} className="bg-card rounded-xl p-6 border border-border">
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
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary) / 0.2)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}
