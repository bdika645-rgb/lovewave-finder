import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export interface ActivityLog {
  id: string;
  user_id: string | null;
  action_type: string;
  description: string;
  metadata: Json;
  created_at: string;
  user?: { name: string; avatar_url: string | null } | null;
}

interface UseActivityLogsOptions {
  actionType?: string;
  limit?: number;
}

export function useActivityLogs(options: UseActivityLogsOptions = {}) {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(options.limit || 50);

      if (options.actionType && options.actionType !== "all") {
        query = query.eq("action_type", options.actionType);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Get profile details
      const userIds = [...new Set((data || []).map(a => a.user_id).filter(Boolean))];
      
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, name, avatar_url")
        .in("id", userIds as string[]);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      const enrichedActivities = (data || []).map(a => ({
        ...a,
        user: a.user_id ? profileMap.get(a.user_id) || null : null
      }));

      setActivities(enrichedActivities);
    } catch (err) {
      setError(err as Error);
      console.error("Error fetching activities:", err);
    } finally {
      setLoading(false);
    }
  }, [options.actionType, options.limit]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    loading,
    error,
    refetch: fetchActivities
  };
}

// Helper function to log activity
export async function logActivity(
  actionType: string,
  description: string,
  userId?: string,
  metadata?: Json
) {
  try {
    await supabase
      .from("activity_logs")
      .insert([{
        action_type: actionType,
        description,
        user_id: userId,
        metadata: metadata ?? {}
      }]);
  } catch (err) {
    console.error("Error logging activity:", err);
  }
}
