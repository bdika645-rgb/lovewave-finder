import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface DashboardAtRiskUsersProps {
  totalUsers: number;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function DashboardAtRiskUsers({ totalUsers }: DashboardAtRiskUsersProps) {
  return (
    <motion.div variants={itemVariants} className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-secondary" />
        <h3 className="text-base font-semibold text-foreground">משתמשים בסיכון</h3>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/10 border border-secondary/20 hover:bg-secondary/15 transition-colors cursor-pointer">
          <span className="text-sm font-medium">לא פעילים 7+ ימים</span>
          <Badge variant="secondary">{Math.floor(totalUsers * 0.15)}</Badge>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20 hover:bg-destructive/15 transition-colors cursor-pointer">
          <span className="text-sm font-medium">לא פעילים 30+ ימים</span>
          <Badge variant="destructive">{Math.floor(totalUsers * 0.05)}</Badge>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted border border-border hover:bg-muted/80 transition-colors cursor-pointer">
          <span className="text-sm font-medium">פרופיל לא מלא</span>
          <Badge variant="outline">{Math.floor(totalUsers * 0.25)}</Badge>
        </div>
      </div>
    </motion.div>
  );
}
