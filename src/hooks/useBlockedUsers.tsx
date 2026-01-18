import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface BlockedUser {
  id: string;
  blocker_id: string;
  blocked_id: string;
  reason: string | null;
  blocked_by_admin: boolean;
  admin_id: string | null;
  created_at: string;
  blocked_profile?: {
    id: string;
    name: string;
    avatar_url: string | null;
    city: string;
    age: number;
  } | null;
}

export function useBlockedUsers() {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBlockedUsers = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error: fetchError } = await supabase
        .from("blocked_users")
        .select("*")
        .eq("blocked_by_admin", true)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      // Fetch blocked profiles details
      const blockedIds = data?.map(b => b.blocked_id) || [];
      
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, name, avatar_url, city, age")
        .in("id", blockedIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      const enrichedData = data?.map(b => ({
        ...b,
        blocked_profile: profileMap.get(b.blocked_id) || null
      })) || [];

      setBlockedUsers(enrichedData);
    } catch (err) {
      setError(err as Error);
      console.error("Error fetching blocked users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlockedUsers();
  }, [fetchBlockedUsers]);

  const blockUser = async (profileId: string, reason: string) => {
    try {
      // Get current user's profile
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: adminProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!adminProfile) throw new Error("Admin profile not found");

      // Insert into blocked_users
      const { error: insertError } = await supabase
        .from("blocked_users")
        .insert({
          blocker_id: adminProfile.id,
          blocked_id: profileId,
          reason,
          blocked_by_admin: true,
          admin_id: adminProfile.id
        });

      if (insertError) throw insertError;

      // Update profile to mark as blocked
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          is_blocked: true,
          blocked_reason: reason,
          blocked_at: new Date().toISOString(),
          blocked_by: adminProfile.id
        })
        .eq("id", profileId);

      if (updateError) throw updateError;

      toast.success("המשתמש נחסם בהצלחה");
      fetchBlockedUsers();
    } catch (err) {
      console.error("Error blocking user:", err);
      toast.error("שגיאה בחסימת המשתמש");
    }
  };

  const unblockUser = async (profileId: string) => {
    try {
      // Remove from blocked_users
      const { error: deleteError } = await supabase
        .from("blocked_users")
        .delete()
        .eq("blocked_id", profileId)
        .eq("blocked_by_admin", true);

      if (deleteError) throw deleteError;

      // Update profile to unblock
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          is_blocked: false,
          blocked_reason: null,
          blocked_at: null,
          blocked_by: null
        })
        .eq("id", profileId);

      if (updateError) throw updateError;

      toast.success("המשתמש שוחרר בהצלחה");
      fetchBlockedUsers();
    } catch (err) {
      console.error("Error unblocking user:", err);
      toast.error("שגיאה בשחרור המשתמש");
    }
  };

  return {
    blockedUsers,
    loading,
    error,
    blockUser,
    unblockUser,
    refetch: fetchBlockedUsers
  };
}
