import { ReactNode } from "react";
import AdminSidebar, { useSidebarContext } from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isAdmin, loading, user } = useAdminAuth();

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
    <div className="min-h-screen bg-muted/30" dir="rtl">
      <AdminSidebar />
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </div>
  );
}

function AdminLayoutContent({ children }: { children: ReactNode }) {
  // This component reads the sidebar context to adjust margins
  // Default to non-collapsed for server-side rendering
  return (
    <div className="lg:mr-[280px] min-h-screen transition-all duration-300">
      <AdminHeader />
      <main id="admin-main" tabIndex={-1} className="p-4 lg:p-6">
        {children}
      </main>
    </div>
  );
}
