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

interface AdminStats {
  totalUsers: number;
  totalMatches: number;
  totalLikes: number;
  totalMessages: number;
  genderStats: { male: number; female: number; other: number };
  ageStats: { range: string; count: number }[];
  cityStats: { city: string; count: number }[];
}

interface DashboardChartsProps {
  stats: AdminStats | null;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function AgeDistributionChart({ stats }: DashboardChartsProps) {
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
}

export function GenderDistributionChart({ stats }: DashboardChartsProps) {
  const genderData = stats ? [
    { name: "גברים", value: stats.genderStats.male },
    { name: "נשים", value: stats.genderStats.female },
    { name: "אחר", value: stats.genderStats.other }
  ] : [];

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
}

export function CitiesChart({ stats }: DashboardChartsProps) {
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
}

export function ConversionFunnelChart({ stats }: DashboardChartsProps) {
  const funnelData = stats ? [
    { name: "הרשמות", value: stats.totalUsers, fill: "hsl(var(--primary))" },
    { name: "פרופיל מלא", value: Math.floor(stats.totalUsers * 0.7), fill: "hsl(var(--secondary))" },
    { name: "לייק ראשון", value: stats.totalLikes, fill: "hsl(var(--accent))" },
    { name: "מאצ'ים", value: stats.totalMatches, fill: "hsl(142, 72%, 45%)" },
    { name: "הודעות", value: stats.totalMessages, fill: "hsl(200, 70%, 50%)" },
  ] : [];

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
}
