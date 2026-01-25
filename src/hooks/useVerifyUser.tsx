import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useVerifyUser() {
  const verifyUser = async (profileId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_verified: true })
        .eq("id", profileId);

      if (error) throw error;

      toast.success("המשתמש אומת בהצלחה");
      return true;
    } catch (err) {
      console.error("Error verifying user:", err);
      toast.error("שגיאה באימות המשתמש");
      return false;
    }
  };

  const unverifyUser = async (profileId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_verified: false })
        .eq("id", profileId);

      if (error) throw error;

      toast.success("האימות הוסר בהצלחה");
      return true;
    } catch (err) {
      console.error("Error unverifying user:", err);
      toast.error("שגיאה בהסרת האימות");
      return false;
    }
  };

  return { verifyUser, unverifyUser };
}
