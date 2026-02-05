import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Users, Flag, Mail, BarChart3, MessageCircle, Settings,
  ArrowUpRight, AlertCircle, TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface QuickAction {
  icon: typeof Users;
  label: string;
  description: string;
  path: string;
  gradient: string;
  priority?: "critical" | "high" | "normal";
  badge?: string;
  trend?: "up" | "down";
}

const quickActions: QuickAction[] = [
  { 
    icon: Flag, 
    label: "דיווחים", 
    description: "דורש טיפול מיידי", 
    path: "/admin/reports", 
    gradient: "from-rose-500 to-rose-600",
    priority: "critical",
    badge: "3 חדשים"
  },
  { 
    icon: Users, 
    label: "משתמשים", 
    description: "ניהול וצפייה", 
    path: "/admin/users", 
    gradient: "from-blue-500 to-blue-600",
    priority: "high",
    trend: "up"
  },
  { 
    icon: Mail, 
    label: "קמפיינים", 
    description: "שליחת אימיילים", 
    path: "/admin/campaigns", 
    gradient: "from-pink-500 to-pink-600" 
  },
  { 
    icon: BarChart3, 
    label: "ניתוח", 
    description: "סטטיסטיקות", 
    path: "/admin/analytics", 
    gradient: "from-emerald-500 to-emerald-600",
    trend: "up"
  },
  { 
    icon: MessageCircle, 
    label: "הודעות", 
    description: "צפייה בהודעות", 
    path: "/admin/messages", 
    gradient: "from-violet-500 to-violet-600" 
  },
  { 
    icon: Settings, 
    label: "הגדרות", 
    description: "הגדרות מערכת", 
    path: "/admin/settings", 
    gradient: "from-slate-500 to-slate-600" 
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function DashboardQuickActions() {
  return (
    <motion.div variants={itemVariants}>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {quickActions.map((action) => (
          <Link
            key={action.path}
            to={action.path}
            className={cn(
              "group relative overflow-hidden rounded-xl p-4 bg-card border transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
              action.priority === "critical" 
                ? "border-destructive/50 bg-destructive/5 hover:border-destructive ring-1 ring-destructive/20" 
                : action.priority === "high"
                  ? "border-primary/30 hover:border-primary/50"
                  : "border-border hover:border-primary/30"
            )}
          >
            {/* Priority indicator */}
            {action.priority === "critical" && (
              <div className="absolute top-2 left-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive"></span>
                </span>
              </div>
            )}

            {/* Badge for new items */}
            {action.badge && (
              <Badge 
                variant={action.priority === "critical" ? "destructive" : "secondary"} 
                className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5"
              >
                {action.badge}
              </Badge>
            )}

            <div className={cn(
              "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3 transition-transform group-hover:scale-110",
              action.gradient,
              action.priority === "critical" && "ring-2 ring-destructive/30 ring-offset-2 ring-offset-background"
            )}>
              <action.icon className="w-5 h-5 text-white" />
            </div>
            
            <div className="flex items-center gap-1.5">
              <h3 className={cn(
                "font-semibold text-sm",
                action.priority === "critical" ? "text-destructive" : "text-foreground"
              )}>
                {action.label}
              </h3>
              {action.trend === "up" && (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              )}
            </div>
            
            <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
            
            <ArrowUpRight className={cn(
              "absolute bottom-3 left-3 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity",
              action.priority === "critical" ? "text-destructive" : "text-muted-foreground"
            )} />
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
