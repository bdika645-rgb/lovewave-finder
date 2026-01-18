import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, UserPlus, Heart, MessageCircle, LogIn, Settings, Trash2 } from "lucide-react";
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

interface ActivityItem {
  id: string;
  type: "user_signup" | "match" | "message" | "login" | "profile_update" | "like";
  user?: { name: string; avatar_url: string | null };
  target?: { name: string; avatar_url: string | null };
  description: string;
  created_at: string;
}

// Mock activity data for demonstration
const generateMockActivity = (): ActivityItem[] => {
  const activities: ActivityItem[] = [];
  const types: ActivityItem["type"][] = ["user_signup", "match", "message", "login", "profile_update", "like"];
  const names = ["דני כהן", "מיכל לוי", "יוסי אברהם", "שרה דוד", "רון ישראלי", "דנה מזרחי"];
  
  for (let i = 0; i < 20; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const user = { name: names[Math.floor(Math.random() * names.length)], avatar_url: null };
    const target = { name: names[Math.floor(Math.random() * names.length)], avatar_url: null };
    
    let description = "";
    switch (type) {
      case "user_signup":
        description = `${user.name} נרשם/ה למערכת`;
        break;
      case "match":
        description = `${user.name} ו-${target.name} עשו מאץ'!`;
        break;
      case "message":
        description = `${user.name} שלח/ה הודעה ל-${target.name}`;
        break;
      case "login":
        description = `${user.name} התחבר/ה למערכת`;
        break;
      case "profile_update":
        description = `${user.name} עדכן/ה את הפרופיל`;
        break;
      case "like":
        description = `${user.name} עשה לייק ל-${target.name}`;
        break;
    }
    
    activities.push({
      id: `activity-${i}`,
      type,
      user,
      target: type !== "user_signup" && type !== "login" && type !== "profile_update" ? target : undefined,
      description,
      created_at: new Date(Date.now() - i * 1000 * 60 * Math.random() * 60).toISOString(),
    });
  }
  
  return activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

export default function AdminActivityLog() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setActivities(generateMockActivity());
      setLoading(false);
    }, 500);
  }, []);

  const getActivityIcon = (type: ActivityItem["type"]) => {
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
        return <Heart className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getActivityBadge = (type: ActivityItem["type"]) => {
    const labels: Record<ActivityItem["type"], { label: string; className: string }> = {
      user_signup: { label: "הרשמה", className: "bg-green-500/10 text-green-600" },
      match: { label: "מאץ'", className: "bg-pink-500/10 text-pink-600" },
      message: { label: "הודעה", className: "bg-blue-500/10 text-blue-600" },
      login: { label: "התחברות", className: "bg-purple-500/10 text-purple-600" },
      profile_update: { label: "עדכון פרופיל", className: "bg-orange-500/10 text-orange-600" },
      like: { label: "לייק", className: "bg-red-500/10 text-red-600" },
    };
    const config = labels[type];
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  const filteredActivities = filterType === "all"
    ? activities
    : activities.filter(a => a.type === filterType);

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
          <Button variant="outline" onClick={() => setActivities(generateMockActivity())}>
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
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                <div className="p-2 bg-muted rounded-lg">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground">{activity.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true, locale: he })}
                  </p>
                </div>
                {getActivityBadge(activity.type)}
              </div>
            ))}
            {filteredActivities.length === 0 && (
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
