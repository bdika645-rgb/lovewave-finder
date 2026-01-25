import { Search, Command, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminNotificationCenter from "./AdminNotificationCenter";
import CommandPalette from "./CommandPalette";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLocation, Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminHeaderProps {
  onOpenSearch?: () => void;
}

// Page title mapping
const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  "/admin": { title: "לוח בקרה", subtitle: "סקירה כללית של האפליקציה" },
  "/admin/users": { title: "ניהול משתמשים", subtitle: "צפייה ועריכת פרופילים" },
  "/admin/matches": { title: "מאצ'ים ולייקים", subtitle: "ניהול התאמות" },
  "/admin/messages": { title: "הודעות", subtitle: "צפייה בהודעות המערכת" },
  "/admin/reports": { title: "דיווחים", subtitle: "טיפול בדיווחי משתמשים" },
  "/admin/support": { title: "פניות תמיכה", subtitle: "מענה לפניות" },
  "/admin/blocked": { title: "משתמשים חסומים", subtitle: "ניהול חסימות" },
  "/admin/content": { title: "גלריית תמונות", subtitle: "צפייה וניהול תמונות משתמשים" },
  "/admin/landing-editor": { title: "עורך דף נחיתה", subtitle: "עריכת תוכן דף הבית" },
  "/admin/tips": { title: "טיפים", subtitle: "ניהול טיפים למשתמשים" },
  "/admin/notifications": { title: "התראות", subtitle: "שליחת התראות" },
  "/admin/activity": { title: "יומן פעילות", subtitle: "מעקב אחר פעולות" },
  "/admin/analytics": { title: "סטטיסטיקות", subtitle: "נתונים ותובנות" },
  "/admin/roles": { title: "תפקידים והרשאות", subtitle: "ניהול הרשאות" },
  "/admin/settings": { title: "הגדרות", subtitle: "הגדרות המערכת" },
};

export default function AdminHeader({ onOpenSearch }: AdminHeaderProps) {
  const location = useLocation();
  const { signOut } = useAuth();
  const { profile } = useCurrentProfile();
  
  const currentPage = pageTitles[location.pathname] || { title: "ניהול", subtitle: "" };

  const handleSearchClick = () => {
    // Trigger CMD+K
    const event = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      ctrlKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  return (
    <>
      <CommandPalette />
      
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border">
        <a href="#admin-main" className="skip-link">דלג לתוכן הניהול</a>
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Page Title & Breadcrumb */}
          <div className="flex items-center gap-4 mr-14 lg:mr-0">
            {location.pathname !== "/admin" && (
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="shrink-0 hidden sm:flex focus-ring"
              >
                <Link to="/admin" aria-label="חזרה ללוח הבקרה">
                  <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                </Link>
              </Button>
            )}
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-foreground truncate">{currentPage.title}</h1>
              {currentPage.subtitle && (
                <p className="text-xs text-muted-foreground truncate hidden sm:block">
                  {currentPage.subtitle}
                </p>
              )}

              {location.pathname !== "/admin" && (
                <Breadcrumb className="hidden sm:block mt-1">
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link to="/admin">לוח בקרה</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{currentPage.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              )}
            </div>
          </div>

          {/* Center - Search */}
          <Button
            variant="outline"
            className="hidden md:flex w-full max-w-sm h-9 justify-start text-muted-foreground gap-2 mx-4"
            onClick={handleSearchClick}
            aria-label="חיפוש מהיר (קיצור: Ctrl/⌘ + K)"
          >
            <Search className="w-4 h-4" />
            <span className="text-sm">חיפוש מהיר...</span>
            <div className="mr-auto flex items-center gap-1 text-xs">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <Command className="w-3 h-3" />
              </kbd>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                K
              </kbd>
            </div>
          </Button>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={handleSearchClick}
              aria-label="פתח חיפוש מהיר"
            >
              <Search className="w-5 h-5" />
            </Button>
            
            <ThemeToggle />
            <AdminNotificationCenter />
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full focus-ring" aria-label="תפריט משתמש">
                  <Avatar className="h-9 w-9 border-2 border-primary/20">
                    <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.name || "Admin"} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {profile?.name?.[0] || "A"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.name || "אדמין"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      מנהל מערכת
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">הפרופיל שלי</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/settings">הגדרות</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={() => signOut()}
                >
                  התנתקות
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  );
}
