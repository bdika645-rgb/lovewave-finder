import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  UserPlus, Heart, ThumbsUp, MessageCircle, Flag, Users, Activity,
  ArrowUpRight 
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";
import { motion } from "framer-motion";

interface ActivityLog {
  id: string;
  action_type: string;
  description: string;
  created_at: string;
  user?: {
    name?: string;
    avatar_url?: string;
  };
}

interface DashboardActivityFeedProps {
  activities: ActivityLog[];
  loading: boolean;
}

const activityConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  signup: { icon: UserPlus, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  match: { icon: Heart, color: "text-pink-500", bg: "bg-pink-500/10" },
  like: { icon: ThumbsUp, color: "text-rose-500", bg: "bg-rose-500/10" },
  message: { icon: MessageCircle, color: "text-blue-500", bg: "bg-blue-500/10" },
  report: { icon: Flag, color: "text-orange-500", bg: "bg-orange-500/10" },
  login: { icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
  default: { icon: Activity, color: "text-muted-foreground", bg: "bg-muted" }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function DashboardActivityFeed({ activities, loading }: DashboardActivityFeedProps) {
  return (
    <motion.div variants={itemVariants} className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">פעילות אחרונה</h3>
        <Button variant="ghost" size="sm" asChild className="text-xs">
          <Link to="/admin/activity">
            צפה בהכל
            <ArrowUpRight className="w-3 h-3 mr-1" />
          </Link>
        </Button>
      </div>
      <div className="divide-y divide-border max-h-[320px] overflow-y-auto">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-3">
              <Skeleton className="w-9 h-9 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="h-4 w-3/4 mb-1.5" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))
        ) : activities.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Activity className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">אין פעילות אחרונה</p>
          </div>
        ) : (
          activities.map((activity) => {
            const config = activityConfig[activity.action_type] || activityConfig.default;
            const IconComponent = config.icon;
            
            return (
              <div key={activity.id} className="p-3 flex items-center gap-3 hover:bg-muted/50 transition-colors">
                <div className={cn("p-2 rounded-lg", config.bg)}>
                  <IconComponent className={cn("w-4 h-4", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {activity.user && (
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={activity.user.avatar_url || undefined} />
                        <AvatarFallback className="text-[10px]">{activity.user.name?.[0]}</AvatarFallback>
                      </Avatar>
                    )}
                    <p className="text-sm text-foreground truncate">{activity.description}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDistanceToNow(new Date(activity.created_at), { 
                      addSuffix: true, 
                      locale: he 
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
