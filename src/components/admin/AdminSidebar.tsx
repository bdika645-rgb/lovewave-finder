import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Heart,
  MessageCircle,
  Settings,
  BarChart3,
  Shield,
  LogOut,
  Home,
  Flag,
  Activity,
  Image,
  Bell,
  UserX,
  Lightbulb,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "לוח בקרה", path: "/admin" },
  { icon: Users, label: "משתמשים", path: "/admin/users" },
  { icon: Heart, label: "מאצ'ים ולייקים", path: "/admin/matches" },
  { icon: MessageCircle, label: "הודעות", path: "/admin/messages" },
  { icon: Flag, label: "דיווחים", path: "/admin/reports" },
  { icon: UserX, label: "משתמשים חסומים", path: "/admin/blocked" },
  { icon: Image, label: "ניהול תוכן", path: "/admin/content" },
  { icon: Lightbulb, label: "טיפים", path: "/admin/tips" },
  { icon: Bell, label: "התראות", path: "/admin/notifications" },
  { icon: Activity, label: "יומן פעילות", path: "/admin/activity" },
  { icon: BarChart3, label: "סטטיסטיקות", path: "/admin/analytics" },
  { icon: Shield, label: "תפקידים והרשאות", path: "/admin/roles" },
  { icon: Settings, label: "הגדרות", path: "/admin/settings" },
];

export default function AdminSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileOpen(false);

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 right-4 z-[60] lg:hidden bg-card shadow-lg"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed right-0 top-0 h-full w-64 bg-card border-l border-border shadow-lg z-50 transition-transform duration-300",
          "lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold bg-gradient-to-l from-primary to-pink-400 bg-clip-text text-transparent">
            ניהול Spark
          </h1>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 right-0 left-0 p-4 border-t border-border space-y-2 bg-card">
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">חזרה לאתר</span>
          </Link>
          <button
            onClick={() => {
              signOut();
              closeMobileMenu();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">התנתקות</span>
          </button>
        </div>
      </aside>
    </>
  );
}
