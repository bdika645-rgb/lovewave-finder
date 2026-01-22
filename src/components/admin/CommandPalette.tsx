import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Users,
  Heart,
  MessageCircle,
  Settings,
  BarChart3,
  Shield,
  Flag,
  Activity,
  Image,
  Bell,
  UserX,
  Lightbulb,
  HelpCircle,
  Search,
  Home,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface SearchResult {
  id: string;
  type: "user" | "report" | "ticket";
  title: string;
  subtitle?: string;
  avatar?: string;
  status?: string;
}

const navigationItems = [
  { icon: LayoutDashboard, label: "לוח בקרה", path: "/admin", keywords: ["dashboard", "home", "בית"] },
  { icon: Users, label: "משתמשים", path: "/admin/users", keywords: ["users", "משתמש", "חברים"] },
  { icon: Heart, label: "מאצ'ים ולייקים", path: "/admin/matches", keywords: ["matches", "likes", "התאמות"] },
  { icon: MessageCircle, label: "הודעות", path: "/admin/messages", keywords: ["messages", "chat", "צ'אט"] },
  { icon: Flag, label: "דיווחים", path: "/admin/reports", keywords: ["reports", "דיווח", "תלונות"] },
  { icon: HelpCircle, label: "פניות תמיכה", path: "/admin/support", keywords: ["support", "תמיכה", "עזרה"] },
  { icon: UserX, label: "משתמשים חסומים", path: "/admin/blocked", keywords: ["blocked", "חסום", "באן"] },
  { icon: Image, label: "ניהול תוכן", path: "/admin/content", keywords: ["content", "תוכן", "תמונות"] },
  { icon: Lightbulb, label: "טיפים", path: "/admin/tips", keywords: ["tips", "טיפ", "עצות"] },
  { icon: Bell, label: "התראות", path: "/admin/notifications", keywords: ["notifications", "התראה", "הודעות"] },
  { icon: Activity, label: "יומן פעילות", path: "/admin/activity", keywords: ["activity", "log", "יומן"] },
  { icon: BarChart3, label: "סטטיסטיקות", path: "/admin/analytics", keywords: ["analytics", "stats", "סטטיסטיקה"] },
  { icon: Shield, label: "תפקידים והרשאות", path: "/admin/roles", keywords: ["roles", "permissions", "הרשאות"] },
  { icon: Settings, label: "הגדרות", path: "/admin/settings", keywords: ["settings", "הגדרה", "קונפיגורציה"] },
  { icon: Home, label: "חזרה לאתר", path: "/", keywords: ["site", "אתר", "ראשי"] },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Listen for CMD+K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K" || e.key === "ק") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Search for users, reports, tickets
  const searchDatabase = useCallback(async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const [usersRes, reportsRes, ticketsRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, name, avatar_url, city, is_online")
          .or(`name.ilike.%${query}%,city.ilike.%${query}%`)
          .limit(5),
        supabase
          .from("reports")
          .select("id, reason, status, description")
          .or(`reason.ilike.%${query}%,description.ilike.%${query}%`)
          .limit(3),
        supabase
          .from("support_tickets")
          .select("id, name, subject, status")
          .or(`name.ilike.%${query}%,subject.ilike.%${query}%`)
          .limit(3),
      ]);

      const searchResults: SearchResult[] = [];

      if (usersRes.data) {
        usersRes.data.forEach((user) => {
          searchResults.push({
            id: user.id,
            type: "user",
            title: user.name,
            subtitle: user.city,
            avatar: user.avatar_url || undefined,
            status: user.is_online ? "online" : "offline",
          });
        });
      }

      if (reportsRes.data) {
        reportsRes.data.forEach((report) => {
          searchResults.push({
            id: report.id,
            type: "report",
            title: report.reason,
            subtitle: report.description?.slice(0, 50) || undefined,
            status: report.status,
          });
        });
      }

      if (ticketsRes.data) {
        ticketsRes.data.forEach((ticket) => {
          searchResults.push({
            id: ticket.id,
            type: "ticket",
            title: ticket.subject || ticket.name,
            subtitle: ticket.name,
            status: ticket.status,
          });
        });
      }

      setResults(searchResults);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      searchDatabase(search);
    }, 300);

    return () => clearTimeout(debounce);
  }, [search, searchDatabase]);

  const handleSelect = (path: string) => {
    setOpen(false);
    setSearch("");
    navigate(path);
  };

  const handleResultSelect = (result: SearchResult) => {
    setOpen(false);
    setSearch("");
    
    switch (result.type) {
      case "user":
        navigate(`/admin/users?search=${result.title}`);
        break;
      case "report":
        navigate(`/admin/reports`);
        break;
      case "ticket":
        navigate(`/admin/support`);
        break;
    }
  };

  const filteredNavigation = navigationItems.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.label.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="חפש משתמשים, דיווחים, פניות או עמודים..."
        value={search}
        onValueChange={setSearch}
        className="text-right"
        dir="rtl"
      />
      <CommandList dir="rtl">
        <CommandEmpty>
          {loading ? "מחפש..." : "לא נמצאו תוצאות"}
        </CommandEmpty>

        {/* Database Results */}
        {results.length > 0 && (
          <CommandGroup heading="תוצאות חיפוש">
            {results.map((result) => (
              <CommandItem
                key={`${result.type}-${result.id}`}
                onSelect={() => handleResultSelect(result)}
                className="flex items-center gap-3 cursor-pointer"
              >
                {result.type === "user" && (
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={result.avatar} />
                    <AvatarFallback>{result.title[0]}</AvatarFallback>
                  </Avatar>
                )}
                {result.type === "report" && (
                  <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                    <Flag className="w-4 h-4 text-destructive" />
                  </div>
                )}
                {result.type === "ticket" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <HelpCircle className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{result.title}</p>
                  {result.subtitle && (
                    <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                  )}
                </div>
                {result.status && (
                  <Badge variant={result.status === "online" || result.status === "resolved" ? "default" : "secondary"} className="text-xs">
                    {result.status === "online" ? "מחובר" : 
                     result.status === "offline" ? "לא מחובר" :
                     result.status === "pending" ? "ממתין" :
                     result.status === "resolved" ? "טופל" :
                     result.status === "open" ? "פתוח" : result.status}
                  </Badge>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {results.length > 0 && filteredNavigation.length > 0 && <CommandSeparator />}

        {/* Navigation */}
        <CommandGroup heading="ניווט">
          {filteredNavigation.map((item) => (
            <CommandItem
              key={item.path}
              onSelect={() => handleSelect(item.path)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <item.icon className="w-4 h-4" />
              </div>
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
