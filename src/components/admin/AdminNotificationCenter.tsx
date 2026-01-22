import { useState, useEffect } from "react";
import { Bell, X, Check, Flag, UserPlus, MessageCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface AdminNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
}

const notificationIcons: Record<string, React.ElementType> = {
  report: Flag,
  new_user: UserPlus,
  message: MessageCircle,
  alert: AlertTriangle,
  info: Bell,
};

const notificationColors: Record<string, string> = {
  report: "text-destructive bg-destructive/10",
  new_user: "text-success bg-success/10",
  message: "text-primary bg-primary/10",
  alert: "text-orange-500 bg-orange-500/10",
  info: "text-blue-500 bg-blue-500/10",
};

export default function AdminNotificationCenter() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [shake, setShake] = useState(false);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Real-time subscription for new reports and signups
  useEffect(() => {
    const reportsChannel = supabase
      .channel("admin-reports")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "reports" },
        (payload) => {
          const newNotification: AdminNotification = {
            id: `report-${payload.new.id}`,
            type: "report",
            title: "דיווח חדש",
            message: `דיווח חדש על משתמש: ${payload.new.reason}`,
            created_at: new Date().toISOString(),
            read: false,
          };
          addNotification(newNotification);
        }
      )
      .subscribe();

    const profilesChannel = supabase
      .channel("admin-profiles")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "profiles" },
        (payload) => {
          if (!payload.new.is_demo) {
            const newNotification: AdminNotification = {
              id: `user-${payload.new.id}`,
              type: "new_user",
              title: "משתמש חדש",
              message: `${payload.new.name} נרשם לאתר`,
              created_at: new Date().toISOString(),
              read: false,
            };
            addNotification(newNotification);
          }
        }
      )
      .subscribe();

    const ticketsChannel = supabase
      .channel("admin-tickets")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "support_tickets" },
        (payload) => {
          const newNotification: AdminNotification = {
            id: `ticket-${payload.new.id}`,
            type: "message",
            title: "פנייה חדשה",
            message: payload.new.subject || "פנייה חדשה מ" + payload.new.name,
            created_at: new Date().toISOString(),
            read: false,
          };
          addNotification(newNotification);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(reportsChannel);
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(ticketsChannel);
    };
  }, []);

  const fetchNotifications = async () => {
    // Fetch recent reports, signups, and tickets as notifications
    try {
      const [reportsRes, profilesRes, ticketsRes] = await Promise.all([
        supabase
          .from("reports")
          .select("id, reason, created_at")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("profiles")
          .select("id, name, created_at")
          .eq("is_demo", false)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("support_tickets")
          .select("id, name, subject, created_at")
          .eq("status", "open")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      const allNotifications: AdminNotification[] = [];

      reportsRes.data?.forEach((r) => {
        allNotifications.push({
          id: `report-${r.id}`,
          type: "report",
          title: "דיווח",
          message: r.reason,
          created_at: r.created_at,
          read: true, // Mark existing as read
        });
      });

      profilesRes.data?.forEach((p) => {
        allNotifications.push({
          id: `user-${p.id}`,
          type: "new_user",
          title: "משתמש חדש",
          message: `${p.name} נרשם לאתר`,
          created_at: p.created_at,
          read: true,
        });
      });

      ticketsRes.data?.forEach((t) => {
        allNotifications.push({
          id: `ticket-${t.id}`,
          type: "message",
          title: "פניית תמיכה",
          message: t.subject || `פנייה מ${t.name}`,
          created_at: t.created_at,
          read: true,
        });
      });

      // Sort by date
      allNotifications.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setNotifications(allNotifications.slice(0, 15));
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const addNotification = (notification: AdminNotification) => {
    setNotifications((prev) => [notification, ...prev].slice(0, 20));
    setUnreadCount((prev) => prev + 1);
    setShake(true);
    setTimeout(() => setShake(false), 500);
    
    // Show toast
    toast(notification.title, {
      description: notification.message,
      duration: 5000,
    });
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
    setUnreadCount(0);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    const notification = notifications.find((n) => n.id === id);
    if (notification && !notification.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`relative ${shake ? "animate-wiggle" : ""}`}
          aria-label="פתח התראות"
        >
          <Bell className="w-5 h-5" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1"
              >
                <Badge
                  variant="destructive"
                  className="h-5 w-5 p-0 flex items-center justify-center text-xs font-bold"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[380px] sm:w-[420px]" dir="rtl">
        <SheetHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <SheetTitle className="text-lg">התראות</SheetTitle>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <Check className="w-4 h-4 ml-1" />
              סמן הכל כנקרא
            </Button>
          )}
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-4">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">אין התראות חדשות</p>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {notifications.map((notification) => {
                  const Icon = notificationIcons[notification.type] || Bell;
                  const colorClass = notificationColors[notification.type] || notificationColors.info;

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`relative p-4 rounded-lg border transition-colors ${
                        notification.read
                          ? "bg-card"
                          : "bg-primary/5 border-primary/20"
                      }`}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 left-2 h-6 w-6 opacity-50 hover:opacity-100"
                        onClick={() => dismissNotification(notification.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>

                      <div className="flex gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{notification.title}</p>
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatDistanceToNow(new Date(notification.created_at), {
                              addSuffix: true,
                              locale: he,
                            })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
