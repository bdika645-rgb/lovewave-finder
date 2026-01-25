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
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Sparkles,
  ChevronDown,
  MousePointer2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAdminLayoutContext } from "./AdminLayout";

interface MenuItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
  children?: { label: string; path: string }[];
}

const menuGroups = [
  {
    title: "ראשי",
    items: [
      { icon: LayoutDashboard, label: "לוח בקרה", path: "/admin" },
      { icon: BarChart3, label: "סטטיסטיקות", path: "/admin/analytics" },
    ],
  },
  {
    title: "ניהול משתמשים",
    items: [
      { icon: Users, label: "משתמשים", path: "/admin/users" },
      { icon: Heart, label: "מאצ'ים ולייקים", path: "/admin/matches" },
      { icon: MessageCircle, label: "הודעות", path: "/admin/messages" },
      { icon: UserX, label: "משתמשים חסומים", path: "/admin/blocked" },
    ],
  },
  {
    title: "תמיכה ודיווחים",
    items: [
      { icon: Flag, label: "דיווחים", path: "/admin/reports" },
      { icon: HelpCircle, label: "פניות תמיכה", path: "/admin/support" },
    ],
  },
  {
    title: "תוכן והגדרות",
    items: [
      { icon: Image, label: "גלריית תמונות", path: "/admin/content" },
      { icon: MousePointer2, label: "עורך דף נחיתה", path: "/admin/landing-editor" },
      { icon: Lightbulb, label: "טיפים", path: "/admin/tips" },
      { icon: Bell, label: "התראות", path: "/admin/notifications" },
    ],
  },
  {
    title: "מערכת",
    items: [
      { icon: Activity, label: "יומן פעילות", path: "/admin/activity" },
      { icon: Shield, label: "תפקידים והרשאות", path: "/admin/roles" },
      { icon: Settings, label: "הגדרות", path: "/admin/settings" },
    ],
  },
];

export default function AdminSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();
  // Try to use shared context from AdminLayout, fallback to local state
  let layoutContext: { collapsed: boolean; setCollapsed: (v: boolean) => void } | null = null;
  try {
    layoutContext = useAdminLayoutContext();
  } catch {
    // Not wrapped in AdminLayout, will use local state
  }
  
  const [localCollapsed, setLocalCollapsed] = useState(false);
  const collapsed = layoutContext?.collapsed ?? localCollapsed;
  const setCollapsed = layoutContext?.setCollapsed ?? setLocalCollapsed;
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>(["ראשי", "ניהול משתמשים"]);
  const firstNavLinkRef = useRef<HTMLAnchorElement | null>(null);

  const toggleGroup = (title: string) => {
    setOpenGroups(prev => 
      prev.includes(title) 
        ? prev.filter(g => g !== title) 
        : [...prev, title]
    );
  };

  const closeMobileMenu = () => setMobileOpen(false);

  useEffect(() => {
    if (!mobileOpen) return;

    const t = window.setTimeout(() => {
      firstNavLinkRef.current?.focus();
    }, 0);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMobileMenu();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo Header */}
      <div className={cn(
        "flex items-center gap-3 p-4 border-b border-sidebar-border",
        collapsed ? "justify-center" : "px-5"
      )}>
        <Link 
          to="/admin" 
          className="flex items-center gap-3 focus-ring rounded-xl"
          aria-label="לוח בקרה - Spark"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sidebar-foreground text-lg">Spark</span>
              <span className="text-xs text-sidebar-foreground/60">ניהול מערכת</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        <TooltipProvider delayDuration={0}>
          {menuGroups.map((group) => (
            <div key={group.title}>
              {!collapsed && (
                <Collapsible 
                  open={openGroups.includes(group.title)} 
                  onOpenChange={() => toggleGroup(group.title)}
                >
                    <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-1.5 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider hover:text-sidebar-foreground/70 transition-colors focus-ring rounded-md">
                    <span>{group.title}</span>
                    <ChevronDown className={cn(
                      "w-3 h-3 transition-transform",
                      openGroups.includes(group.title) ? "rotate-180" : ""
                    )} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-0.5 mt-1">
                    {group.items.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={closeMobileMenu}
                          className={cn(
                              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group focus-ring",
                            isActive
                              ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-primary/20"
                              : "text-sidebar-foreground/70 hover:bg-sidebar-hover hover:text-sidebar-foreground"
                          )}
                            aria-current={isActive ? "page" : undefined}
                            ref={group.title === menuGroups[0].title && item.path === menuGroups[0].items[0].path ? firstNavLinkRef : undefined}
                        >
                          <item.icon className={cn(
                            "w-5 h-5 shrink-0 transition-transform group-hover:scale-110",
                            isActive ? "text-sidebar-primary-foreground" : ""
                          )} />
                          <span className="font-medium text-sm">{item.label}</span>
                            {isActive && <span className="sr-only">(נוכחי)</span>}
                        </Link>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              )}

              {collapsed && (
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Tooltip key={item.path}>
                        <TooltipTrigger asChild>
                          <Link
                            to={item.path}
                            onClick={closeMobileMenu}
                            className={cn(
                              "flex items-center justify-center p-3 rounded-lg transition-all duration-200 focus-ring",
                              isActive
                                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-primary/20"
                                : "text-sidebar-foreground/70 hover:bg-sidebar-hover hover:text-sidebar-foreground"
                            )}
                            aria-current={isActive ? "page" : undefined}
                            aria-label={item.label}
                          >
                            <item.icon className="w-5 h-5" />
                            {isActive && <span className="sr-only">(נוכחי)</span>}
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="font-medium">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </TooltipProvider>
      </nav>

      {/* Footer Actions */}
      <div className={cn(
        "border-t border-sidebar-border p-3 space-y-1",
        collapsed ? "items-center" : ""
      )}>
        <TooltipProvider delayDuration={0}>
          {collapsed ? (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/"
                    className="flex items-center justify-center p-3 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-hover hover:text-sidebar-foreground transition-all focus-ring"
                    aria-label="חזרה לאתר"
                  >
                    <Home className="w-5 h-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="left">חזרה לאתר</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={signOut}
                    className="w-full flex items-center justify-center p-3 rounded-lg text-destructive hover:bg-destructive/10 transition-all focus-ring"
                    aria-label="התנתקות"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left">התנתקות</TooltipContent>
              </Tooltip>
            </>
          ) : (
            <>
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-hover hover:text-sidebar-foreground transition-all focus-ring"
              >
                <Home className="w-5 h-5" />
                <span className="font-medium text-sm">חזרה לאתר</span>
              </Link>
              <button
                onClick={() => {
                  signOut();
                  closeMobileMenu();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-destructive hover:bg-destructive/10 transition-all focus-ring"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium text-sm">התנתקות</span>
              </button>
            </>
          )}
        </TooltipProvider>
      </div>

      {/* Collapse Toggle - Desktop Only */}
      <div className="hidden lg:block border-t border-sidebar-border p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-center text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-hover focus-ring"
          aria-label={collapsed ? "הרחב תפריט" : "כווץ תפריט"}
        >
          {/* In RTL, "expand" points inward (right) and "collapse" points outward (left) */}
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 right-4 z-[60] lg:hidden bg-card shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "סגור תפריט" : "פתח תפריט"}
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed right-0 top-0 h-full bg-sidebar z-50 transition-all duration-300 shadow-2xl",
          collapsed ? "w-[var(--admin-sidebar-collapsed,72px)]" : "w-[var(--admin-sidebar-width,280px)]",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
