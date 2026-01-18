import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalMatches: number;
  totalMessages: number;
  totalLikes: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  genderStats: { male: number; female: number; other: number };
  cityStats: { city: string; count: number }[];
  ageStats: { range: string; count: number }[];
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      // Fetch all data in parallel
      const [
        profilesResult,
        matchesResult,
        messagesResult,
        likesResult,
        newTodayResult,
        newWeekResult,
        newMonthResult,
        activeResult
      ] = await Promise.all([
        supabase.from("profiles").select("id, gender, city, age, is_demo").eq("is_demo", false),
        supabase.from("matches").select("id", { count: "exact", head: true }),
        supabase.from("messages").select("id", { count: "exact", head: true }),
        supabase.from("likes").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", todayStart).eq("is_demo", false),
        supabase.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", weekStart).eq("is_demo", false),
        supabase.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", monthStart).eq("is_demo", false),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("is_online", true).eq("is_demo", false)
      ]);

      const profiles = profilesResult.data || [];
      
      // Calculate gender stats
      const genderStats = profiles.reduce(
        (acc, p) => {
          if (p.gender === "male" || p.gender === "גבר") acc.male++;
          else if (p.gender === "female" || p.gender === "אישה") acc.female++;
          else acc.other++;
          return acc;
        },
        { male: 0, female: 0, other: 0 }
      );

      // Calculate city stats
      const cityMap = new Map<string, number>();
      profiles.forEach(p => {
        const count = cityMap.get(p.city) || 0;
        cityMap.set(p.city, count + 1);
      });
      const cityStats = Array.from(cityMap.entries())
        .map(([city, count]) => ({ city, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Calculate age stats
      const ageRanges = [
        { range: "18-24", min: 18, max: 24 },
        { range: "25-34", min: 25, max: 34 },
        { range: "35-44", min: 35, max: 44 },
        { range: "45-54", min: 45, max: 54 },
        { range: "55+", min: 55, max: 150 }
      ];
      const ageStats = ageRanges.map(({ range, min, max }) => ({
        range,
        count: profiles.filter(p => p.age >= min && p.age <= max).length
      }));

      setStats({
        totalUsers: profiles.length,
        activeUsers: activeResult.count || 0,
        totalMatches: matchesResult.count || 0,
        totalMessages: messagesResult.count || 0,
        totalLikes: likesResult.count || 0,
        newUsersToday: newTodayResult.count || 0,
        newUsersThisWeek: newWeekResult.count || 0,
        newUsersThisMonth: newMonthResult.count || 0,
        genderStats,
        cityStats,
        ageStats
      });
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
}
