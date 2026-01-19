import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface DatingTip {
  id: string;
  title: string;
  content: string;
  category: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useDatingTips() {
  const [tips, setTips] = useState<DatingTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTips = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error: fetchError } = await supabase
        .from("dating_tips")
        .select("*")
        .order("order_index", { ascending: true });

      if (fetchError) throw fetchError;

      setTips((data || []) as DatingTip[]);
    } catch (err) {
      // If table doesn't exist, return empty array
      console.log("Dating tips table may not exist yet:", err);
      setTips([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTips();
  }, [fetchTips]);

  const createTip = async (tip: Omit<DatingTip, "id" | "created_at" | "updated_at">) => {
    try {
      const { error } = await supabase
        .from("dating_tips")
        .insert(tip);

      if (error) throw error;

      toast.success("הטיפ נוסף בהצלחה");
      fetchTips();
      return { error: null };
    } catch (err) {
      console.error("Error creating tip:", err);
      toast.error("שגיאה בהוספת הטיפ");
      return { error: err };
    }
  };

  const updateTip = async (id: string, updates: Partial<DatingTip>) => {
    try {
      const { error } = await supabase
        .from("dating_tips")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      toast.success("הטיפ עודכן בהצלחה");
      fetchTips();
      return { error: null };
    } catch (err) {
      console.error("Error updating tip:", err);
      toast.error("שגיאה בעדכון הטיפ");
      return { error: err };
    }
  };

  const deleteTip = async (id: string) => {
    try {
      const { error } = await supabase
        .from("dating_tips")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("הטיפ נמחק בהצלחה");
      fetchTips();
      return { error: null };
    } catch (err) {
      console.error("Error deleting tip:", err);
      toast.error("שגיאה במחיקת הטיפ");
      return { error: err };
    }
  };

  const reorderTips = async (tipId: string, newIndex: number) => {
    try {
      const { error } = await supabase
        .from("dating_tips")
        .update({ order_index: newIndex, updated_at: new Date().toISOString() })
        .eq("id", tipId);

      if (error) throw error;

      toast.success("סדר הטיפים עודכן");
      fetchTips();
    } catch (err) {
      console.error("Error reordering tips:", err);
      toast.error("שגיאה בעדכון הסדר");
    }
  };

  return {
    tips,
    loading,
    error,
    refetch: fetchTips,
    createTip,
    updateTip,
    deleteTip,
    reorderTips
  };
}
