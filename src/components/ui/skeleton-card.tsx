import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
  hasImage?: boolean;
  hasActions?: boolean;
  lines?: number;
}

export function SkeletonCard({ 
  className, 
  hasImage = true, 
  hasActions = true,
  lines = 3 
}: SkeletonCardProps) {
  return (
    <div className={cn(
      "bg-card rounded-2xl overflow-hidden shadow-card border border-border animate-pulse",
      className
    )}>
      {hasImage && (
        <div className="aspect-[4/5] bg-muted" />
      )}
      
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 bg-muted rounded" />
          <div className="h-5 w-16 bg-muted rounded-full" />
        </div>
        
        {Array.from({ length: lines }).map((_, i) => (
          <div 
            key={i} 
            className="h-4 bg-muted rounded" 
            style={{ width: `${100 - i * 20}%` }}
          />
        ))}
        
        {hasActions && (
          <div className="flex gap-2 pt-2">
            <div className="h-10 flex-1 bg-muted rounded-lg" />
            <div className="h-10 flex-1 bg-muted rounded-lg" />
          </div>
        )}
      </div>
    </div>
  );
}

interface SkeletonProfileProps {
  className?: string;
}

export function SkeletonProfile({ className }: SkeletonProfileProps) {
  return (
    <div className={cn("space-y-6 animate-pulse", className)}>
      <div className="flex items-start gap-6">
        <div className="w-32 h-32 rounded-full bg-muted" />
        <div className="flex-1 space-y-3">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-5 w-32 bg-muted rounded" />
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-muted rounded-full" />
            <div className="h-6 w-20 bg-muted rounded-full" />
            <div className="h-6 w-14 bg-muted rounded-full" />
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-5/6" />
        <div className="h-4 bg-muted rounded w-4/6" />
      </div>
    </div>
  );
}

interface SkeletonListProps {
  count?: number;
  className?: string;
}

export function SkeletonList({ count = 5, className }: SkeletonListProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-card rounded-xl animate-pulse">
          <div className="w-12 h-12 rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-3 w-48 bg-muted rounded" />
          </div>
          <div className="h-4 w-16 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
