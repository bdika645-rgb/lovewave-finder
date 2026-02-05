import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  variant?: "default" | "gradient" | "outlined";
  loading?: boolean;
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  className,
  variant = "default",
  loading = false
}: StatsCardProps) {
  if (loading) {
    return (
      <div className={cn(
        "relative overflow-hidden rounded-xl p-5 bg-card border border-border",
        className
      )}>
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            <div className="h-8 w-16 bg-muted animate-pulse rounded mt-2" />
          </div>
          <div className="p-3 rounded-xl bg-muted animate-pulse w-12 h-12" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className={cn(
        "relative overflow-hidden rounded-xl p-5 transition-all duration-300 cursor-pointer group",
        variant === "default" && "bg-card border border-border hover:border-primary/30",
        variant === "gradient" && "bg-gradient-to-br from-primary/10 via-card to-secondary/10 border border-primary/20 hover:border-primary/40",
        variant === "outlined" && "bg-transparent border-2 border-dashed border-border hover:border-primary/50",
        className
      )}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none">
        <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-primary" />
        <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-secondary" />
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="relative flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground text-xs sm:text-sm font-medium truncate">{title}</p>
          <motion.p 
            className="text-2xl sm:text-3xl font-bold text-foreground mt-2 tabular-nums"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
          >
            {typeof value === 'number' ? value.toLocaleString('he-IL') : value}
          </motion.p>
          {trend && (
            <motion.div 
              className={cn(
                "flex items-center gap-1.5 mt-2 text-xs sm:text-sm font-medium",
                trend.isPositive ? "text-success" : "text-destructive"
              )}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground font-normal text-xs hidden sm:inline">מהחודש שעבר</span>
            </motion.div>
          )}
        </div>
        <motion.div 
          className={cn(
            "p-2 sm:p-3 rounded-xl shrink-0",
            "bg-gradient-to-br from-primary/20 to-primary/5"
          )}
          whileHover={{ rotate: 10 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        </motion.div>
      </div>
    </motion.div>
  );
}