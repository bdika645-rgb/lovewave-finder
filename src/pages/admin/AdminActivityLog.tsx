import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useActivityLogs, ActivityLog } from "@/hooks/useActivityLogs";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, UserPlus, Heart, MessageCircle, LogIn, Settings, RefreshCw, ThumbsUp, Flag, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";

export default function AdminActivityLog() {
  const [filterType, setFilterType] = useState<string>("all");
  const { activities, loading, refetch } = useActivityLogs({ actionType: filterType });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user_signup":
        return <UserPlus className="w-4 h-4 text-green-500" />;
      case "match":
        return <Heart className="w-4 h-4 text-pink-500" />;
      case "message":
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case "login":
        return <LogIn className="w-4 h-4 text-purple-500" />;
      case "profile_update":
        return <Settings className="w-4 h-4 text-orange-500" />;
      case "like":
        return <ThumbsUp className="w-4 h-4 text-red-500" />;
      case "report":
        return <Flag className="w-4 h-4 text-yellow-500" />;
      case "role_change":
        return <User className="w-4 h-4 text-indigo-500" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getActivityBadge = (type: string) => {
    const labels: Record<string, { label: string; className: string }> = {
      user_signup: { label: "הרשמה", className: "bg-green-500/10 text-green-600" },
      match: { label: "מאץ'", className: "bg-pink-500/10 text-pink-600" },
      message: { label: "הודעה", className: "bg-blue-500/10 text-blue-600" },
      login: { label: "התחברות", className: "bg-purple-500/10 text-purple-600" },
      profile_update: { label: "עדכון פרופיל", className: "bg-orange-500/10 text-orange-600" },
      like: { label: "לייק", className: "bg-red-500/10 text-red-600" },
      report: { label: "דיווח", className: "bg-yellow-500/10 text-yellow-600" },
      role_change: { label: "שינוי תפקיד", className: "bg-indigo-500/10 text-indigo-600" },
    };
    const config = labels[type] || { label: type, className: "bg-gray-500/10 text-gray-600" };
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-foreground">יומן פעילות</h1>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">יומן פעילות</h1>
            <p className="text-muted-foreground mt-1">צפייה בפעילות אחרונה במערכת</p>
          </div>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 ml-2" />
            רענן
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="סנן לפי סוג" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">הכל</SelectItem>
              <SelectItem value="user_signup">הרשמות</SelectItem>
              <SelectItem value="match">מאצ'ים</SelectItem>
              <SelectItem value="message">הודעות</SelectItem>
              <SelectItem value="login">התחברויות</SelectItem>
              <SelectItem value="profile_update">עדכוני פרופיל</SelectItem>
              <SelectItem value="like">לייקים</SelectItem>
              <SelectItem value="report">דיווחים</SelectItem>
              <SelectItem value="role_change">שינויי תפקיד</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Activity Feed */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">פעילות אחרונה</h3>
          </div>
          <div className="divide-y divide-border">
            {activities.map((activity) => (
              <div key={activity.id} className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                <div className="p-2 bg-muted rounded-lg">
                  {getActivityIcon(activity.action_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {activity.user && (
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={activity.user.avatar_url || undefined} />
                        <AvatarFallback className="text-xs">{activity.user.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <p className="text-foreground">{activity.description}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true, locale: he })}
                  </p>
                </div>
                {getActivityBadge(activity.action_type)}
              </div>
            ))}
            {activities.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                אין פעילות להצגה
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
