import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  className?: string;
}

export default function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div 
      className={cn("flex items-center gap-1", className)}
      role="status"
      aria-live="polite"
      aria-label="מקליד/ה..."
    >
      <span className="text-sm text-muted-foreground">מקליד/ה</span>
      <div className="flex gap-1">
        <span 
          className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" 
          style={{ animationDelay: '0ms' }}
        />
        <span 
          className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" 
          style={{ animationDelay: '150ms' }}
        />
        <span 
          className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" 
          style={{ animationDelay: '300ms' }}
        />
      </div>
    </div>
  );
}
