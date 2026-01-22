import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
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
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  className,
  variant = "default" 
}: StatsCardProps) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl p-5 transition-all duration-300 hover:shadow-lg group",
      variant === "default" && "bg-card border border-border",
      variant === "gradient" && "bg-gradient-to-br from-primary/10 via-card to-secondary/10 border border-primary/20",
      variant === "outlined" && "bg-transparent border-2 border-dashed border-border hover:border-primary/50",
      className
    )}>
      {/* Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none">
        <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-primary" />
        <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-secondary" />
      </div>

      <div className="relative flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground text-sm font-medium truncate">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-2 tabular-nums">
            {typeof value === 'number' ? value.toLocaleString('he-IL') : value}
          </p>
          {trend && (
            <div className={cn(
              "flex items-center gap-1.5 mt-2 text-sm font-medium",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground font-normal text-xs">מהחודש שעבר</span>
            </div>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-xl shrink-0 transition-transform group-hover:scale-110",
          "bg-gradient-to-br from-primary/20 to-primary/5"
        )}>
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </div>
  );
}
