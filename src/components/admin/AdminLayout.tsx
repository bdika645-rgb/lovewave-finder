import { ReactNode, createContext, useContext, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Shared context for sidebar state
interface AdminLayoutContextType {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

const AdminLayoutContext = createContext<AdminLayoutContextType>({
  collapsed: false,
  setCollapsed: () => {},
});

export const useAdminLayoutContext = () => useContext(AdminLayoutContext);

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isAdmin, loading, user } = useAdminAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          </div>
          <p className="text-muted-foreground font-medium">טוען את פאנל הניהול...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
        <div className="text-center max-w-md p-8">
          <div className="w-20 h-20 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">אין גישה</h1>
          <p className="text-muted-foreground mb-6">
            אין לך הרשאות גישה לפאנל הניהול. פנה למנהל המערכת לקבלת הרשאות.
          </p>
          <Button asChild>
            <a href="/">חזרה לדף הבית</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AdminLayoutContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="min-h-screen bg-muted/30" dir="rtl">
        <AdminSidebar />
        <div 
          className={cn(
            "min-h-screen transition-all duration-300",
            collapsed ? "lg:mr-[72px]" : "lg:mr-[280px]"
          )}
        >
          <AdminHeader />
          <main id="admin-main" tabIndex={-1} className="p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminLayoutContext.Provider>
  );
}
