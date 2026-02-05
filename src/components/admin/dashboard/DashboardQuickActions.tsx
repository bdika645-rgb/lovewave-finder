import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Users, Flag, Mail, BarChart3, MessageCircle, Settings,
  ArrowUpRight 
} from "lucide-react";
import { motion } from "framer-motion";

const quickActions = [
  { icon: Users, label: "משתמשים", description: "ניהול וצפייה", path: "/admin/users", gradient: "from-blue-500 to-blue-600" },
  { icon: Flag, label: "דיווחים", description: "דיווחים חדשים", path: "/admin/reports", gradient: "from-rose-500 to-rose-600" },
  { icon: Mail, label: "קמפיינים", description: "שליחת אימיילים", path: "/admin/campaigns", gradient: "from-pink-500 to-pink-600" },
  { icon: BarChart3, label: "ניתוח", description: "סטטיסטיקות", path: "/admin/analytics", gradient: "from-emerald-500 to-emerald-600" },
  { icon: MessageCircle, label: "הודעות", description: "צפייה בהודעות", path: "/admin/messages", gradient: "from-violet-500 to-violet-600" },
  { icon: Settings, label: "הגדרות", description: "הגדרות מערכת", path: "/admin/settings", gradient: "from-slate-500 to-slate-600" },
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
}
