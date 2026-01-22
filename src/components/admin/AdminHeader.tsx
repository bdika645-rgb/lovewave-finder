import { Search, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminNotificationCenter from "./AdminNotificationCenter";
import CommandPalette from "./CommandPalette";
import { ThemeToggle } from "@/components/ThemeToggle";

interface AdminHeaderProps {
  onOpenSearch?: () => void;
}

export default function AdminHeader({ onOpenSearch }: AdminHeaderProps) {
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
      
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between h-16 px-4 lg:px-8">
          {/* Search Bar */}
          <Button
            variant="outline"
            className="w-full max-w-md h-10 justify-start text-muted-foreground gap-2 mr-12 lg:mr-0"
            onClick={handleSearchClick}
          >
            <Search className="w-4 h-4" />
            <span className="text-sm">חיפוש מהיר...</span>
            <div className="mr-auto flex items-center gap-1 text-xs">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <Command className="w-3 h-3" />
              </kbd>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                K
              </kbd>
            </div>
          </Button>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <AdminNotificationCenter />
          </div>
        </div>
      </header>
    </>
  );
}
