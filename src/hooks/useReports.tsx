import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Report {
  id: string;
  reporter_id: string;
  reported_id: string;
  reason: string;
  description: string | null;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  admin_note: string | null;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
  reporter?: { name: string; avatar_url: string | null } | null;
  reported?: { name: string; avatar_url: string | null } | null;
}

interface UseReportsOptions {
  status?: string;
}

export function useReports(options: UseReportsOptions = {}) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    dismissed: 0
  });

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (options.status && options.status !== "all") {
        query = query.eq("status", options.status);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Get profile details for reporters and reported users
      const profileIds = new Set<string>();
      data?.forEach(r => {
        profileIds.add(r.reporter_id);
        profileIds.add(r.reported_id);
      });

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, name, avatar_url")
        .in("id", Array.from(profileIds));

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      const enrichedReports = (data || []).map(r => ({
        ...r,
        status: r.status as Report["status"],
        reporter: profileMap.get(r.reporter_id) || null,
        reported: profileMap.get(r.reported_id) || null
      }));

      setReports(enrichedReports);

      // Calculate stats
      const allReports = data || [];
      setStats({
        total: allReports.length,
        pending: allReports.filter(r => r.status === "pending").length,
        resolved: allReports.filter(r => r.status === "resolved").length,
        dismissed: allReports.filter(r => r.status === "dismissed").length
      });

    } catch (err) {
      setError(err as Error);
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  }, [options.status]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const updateReportStatus = async (
    reportId: string, 
    status: Report["status"], 
    adminNote?: string
  ) => {
    try {
      const { error } = await supabase
        .from("reports")
        .update({ 
          status, 
          admin_note: adminNote || null,
          updated_at: new Date().toISOString()
        })
        .eq("id", reportId);

      if (error) throw error;

      toast.success("סטטוס הדיווח עודכן");
      fetchReports();
    } catch (err) {
      console.error("Error updating report:", err);
      toast.error("שגיאה בעדכון הדיווח");
    }
  };

  const deleteReport = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from("reports")
        .delete()
        .eq("id", reportId);

      if (error) throw error;

      toast.success("הדיווח נמחק");
      fetchReports();
    } catch (err) {
      console.error("Error deleting report:", err);
      toast.error("שגיאה במחיקת הדיווח");
    }
  };

  return {
    reports,
    loading,
    error,
    stats,
    refetch: fetchReports,
    updateReportStatus,
    deleteReport
  };
}
