import { Loader2 } from "lucide-react";

interface FullPageLoaderProps {
  label?: string;
  className?: string;
}

export default function FullPageLoader({
  label = "טוען...",
  className,
}: FullPageLoaderProps) {
  return (
    <div
      className={
        className ??
        "min-h-screen flex items-center justify-center bg-background"
      }
      role="status"
      aria-live="polite"
      aria-busy="true"
      dir="rtl"
    >
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" aria-hidden="true" />
        <p className="text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
