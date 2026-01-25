import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AdminUser {
  id: string;
  user_id: string | null;
  name: string;
  age: number;
  city: string;
  gender: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_online: boolean | null;
  is_demo: boolean | null;
  is_verified: boolean | null;
  created_at: string;
  last_seen: string | null;
  role?: string;
}

interface UseAdminUsersOptions {
  search?: string;
  gender?: string;
  city?: string;
  isOnline?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export function useAdminUsers(options: UseAdminUsersOptions = {}) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const {
    search = "",
    gender,
    city,
    isOnline,
    sortBy = "created_at",
    sortOrder = "desc",
    page = 1,
    pageSize = 20
  } = options;

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .eq("is_demo", false);

      if (search) {
        query = query.or(`name.ilike.%${search}%,city.ilike.%${search}%,bio.ilike.%${search}%`);
      }

      if (gender && gender !== "all") {
        query = query.eq("gender", gender);
      }

      if (city && city !== "all") {
        query = query.eq("city", city);
      }

      if (isOnline !== undefined) {
        query = query.eq("is_online", isOnline);
      }

      // Sorting
      query = query.order(sortBy, { ascending: sortOrder === "asc" });

      // Pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      // Fetch roles for users
      const userIds = (data || []).filter(u => u.user_id).map(u => u.user_id);
      let roles: Record<string, string> = {};
      
      if (userIds.length > 0) {
        const { data: rolesData } = await supabase
          .from("user_roles")
          .select("user_id, role")
          .in("user_id", userIds as string[]);
        
        if (rolesData) {
          roles = rolesData.reduce((acc, r) => {
            acc[r.user_id] = r.role;
            return acc;
          }, {} as Record<string, string>);
        }
      }

      const usersWithRoles = (data || []).map(user => ({
        ...user,
        role: user.user_id ? roles[user.user_id] || "user" : "user"
      }));

      setUsers(usersWithRoles);
      setTotalCount(count || 0);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [search, gender, city, isOnline, sortBy, sortOrder, page, pageSize]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUserRole = async (userId: string, role: "admin" | "moderator" | "user") => {
    try {
      // First check if user already has a role
      const { data: existingRole } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (existingRole) {
        // Update existing role
        const { error } = await supabase
          .from("user_roles")
          .update({ role })
          .eq("user_id", userId);
        
        if (error) throw error;
      } else {
        // Insert new role
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role });
        
        if (error) throw error;
      }

      toast.success("התפקיד עודכן בהצלחה");
      fetchUsers();
    } catch (err) {
      console.error("Error updating role:", err);
      toast.error("שגיאה בעדכון התפקיד");
    }
  };

  const deleteUser = async (profileId: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", profileId);
      
      if (error) throw error;
      
      toast.success("המשתמש נמחק בהצלחה");
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("שגיאה במחיקת המשתמש");
    }
  };

  const verifyUser = async (profileId: string, verified: boolean = true) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_verified: verified })
        .eq("id", profileId);
      
      if (error) throw error;
      
      toast.success(verified ? "המשתמש אומת בהצלחה" : "האימות הוסר בהצלחה");
      fetchUsers();
    } catch (err) {
      console.error("Error verifying user:", err);
      toast.error("שגיאה באימות המשתמש");
    }
  };

  return { 
    users, 
    loading, 
    error, 
    totalCount, 
    refetch: fetchUsers,
    updateUserRole,
    deleteUser,
    verifyUser
  };
}
