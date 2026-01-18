import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  target_user_id: string | null;
  target_all: boolean;
  read_by: string[];
  created_by: string | null;
  created_at: string;
  creator?: {
    name: string;
    avatar_url: string | null;
  } | null;
  target_user?: {
    name: string;
    avatar_url: string | null;
  } | null;
}

export function useAdminNotifications() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error: fetchError } = await supabase
        .from("admin_notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (fetchError) throw fetchError;

      // Fetch creator and target user profiles
      const creatorIds = [...new Set(data?.map(n => n.created_by).filter(Boolean) || [])];
      const targetIds = [...new Set(data?.map(n => n.target_user_id).filter(Boolean) || [])];
      const allIds = [...new Set([...creatorIds, ...targetIds])];

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, name, avatar_url")
        .in("id", allIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      const enrichedData = data?.map(n => ({
        ...n,
        read_by: n.read_by || [],
        creator: n.created_by ? profileMap.get(n.created_by) || null : null,
        target_user: n.target_user_id ? profileMap.get(n.target_user_id) || null : null
      })) || [];

      setNotifications(enrichedData);
    } catch (err) {
      setError(err as Error);
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const createNotification = async (notification: {
    title: string;
    message: string;
    type: string;
    target_user_id?: string | null;
    target_all?: boolean;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: adminProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      const { error: insertError } = await supabase
        .from("admin_notifications")
        .insert({
          title: notification.title,
          message: notification.message,
          type: notification.type,
          target_user_id: notification.target_user_id || null,
          target_all: notification.target_all || false,
          created_by: adminProfile?.id || null
        });

      if (insertError) throw insertError;

      toast.success("ההתראה נשלחה בהצלחה");
      fetchNotifications();
    } catch (err) {
      console.error("Error creating notification:", err);
      toast.error("שגיאה בשליחת ההתראה");
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from("admin_notifications")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("ההתראה נמחקה");
      fetchNotifications();
    } catch (err) {
      console.error("Error deleting notification:", err);
      toast.error("שגיאה במחיקת ההתראה");
    }
  };

  return {
    notifications,
    loading,
    error,
    createNotification,
    deleteNotification,
    refetch: fetchNotifications
  };
}
