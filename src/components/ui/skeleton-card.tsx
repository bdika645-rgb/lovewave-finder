import { cn } from "@/lib/utils";
import { memo, useMemo } from "react";

// Premium shimmer animation class
const shimmerClass = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent";

interface SkeletonCardProps {
  className?: string;
  hasImage?: boolean;
  hasActions?: boolean;
  lines?: number;
  variant?: "default" | "compact" | "featured";
}

export const SkeletonCard = memo(function SkeletonCard({ 
  className, 
  hasImage = true, 
  hasActions = true,
  lines = 3,
  variant = "default"
}: SkeletonCardProps) {
  const aspectRatio = useMemo(() => {
    switch (variant) {
      case "compact": return "aspect-square";
      case "featured": return "aspect-[3/4]";
      default: return "aspect-[4/5]";
    }
  }, [variant]);

  return (
    <div className={cn(
      "bg-card rounded-2xl overflow-hidden border border-border/50",
      "shadow-lg shadow-black/5 dark:shadow-black/20",
      className
    )}>
      {hasImage && (
        <div className={cn(
          aspectRatio,
          "bg-gradient-to-br from-muted via-muted/80 to-muted",
          shimmerClass
        )} />
      )}
      
      <div className={cn(
        "p-4 space-y-3",
        variant === "compact" && "p-3 space-y-2"
      )}>
        <div className="flex items-center justify-between gap-2">
          <div className={cn(
            "h-6 w-32 bg-muted rounded-md",
            shimmerClass
          )} />
          <div className={cn(
            "h-5 w-16 bg-muted rounded-full",
            shimmerClass
          )} />
        </div>
        
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-3.5 bg-muted rounded-md",
                shimmerClass
              )}
              style={{ 
                width: `${95 - i * 15}%`,
                animationDelay: `${i * 100}ms`
              }}
            />
          ))}
        </div>
        
        {hasActions && (
          <div className="flex gap-2 pt-2">
            <div className={cn(
              "h-10 flex-1 bg-muted rounded-xl",
              shimmerClass
            )} />
            <div className={cn(
              "h-10 flex-1 bg-muted rounded-xl",
              shimmerClass
            )} 
            style={{ animationDelay: "150ms" }}
            />
          </div>
        )}
      </div>
    </div>
  );
});

interface SkeletonProfileProps {
  className?: string;
  variant?: "horizontal" | "vertical";
}

export const SkeletonProfile = memo(function SkeletonProfile({ 
  className,
  variant = "horizontal" 
}: SkeletonProfileProps) {
  if (variant === "vertical") {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="flex flex-col items-center gap-4">
          <div className={cn(
            "w-28 h-28 rounded-full bg-gradient-to-br from-muted via-muted/80 to-muted",
            shimmerClass
          )} />
          <div className="space-y-2 text-center w-full">
            <div className={cn("h-7 w-40 mx-auto bg-muted rounded-lg", shimmerClass)} />
            <div className={cn("h-4 w-24 mx-auto bg-muted rounded-md", shimmerClass)} />
          </div>
        </div>
        
        <div className="flex justify-center gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div 
              key={i} 
              className={cn("h-7 w-20 bg-muted rounded-full", shimmerClass)}
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
        
        <div className="space-y-2.5 px-4">
          <div className={cn("h-4 bg-muted rounded-md w-full", shimmerClass)} />
          <div className={cn("h-4 bg-muted rounded-md w-4/5", shimmerClass)} style={{ animationDelay: "100ms" }} />
          <div className={cn("h-4 bg-muted rounded-md w-3/5", shimmerClass)} style={{ animationDelay: "200ms" }} />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-start gap-6">
        <div className={cn(
          "w-32 h-32 rounded-full bg-gradient-to-br from-muted via-muted/80 to-muted shrink-0",
          shimmerClass
        )} />
        <div className="flex-1 space-y-3 py-2">
          <div className={cn("h-8 w-48 bg-muted rounded-lg", shimmerClass)} />
          <div className={cn("h-5 w-32 bg-muted rounded-md", shimmerClass)} style={{ animationDelay: "100ms" }} />
          <div className="flex flex-wrap gap-2 pt-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div 
                key={i} 
                className={cn("h-6 bg-muted rounded-full", shimmerClass)}
                style={{ 
                  width: `${60 + Math.random() * 30}px`,
                  animationDelay: `${(i + 2) * 100}ms` 
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="space-y-2.5">
        <div className={cn("h-4 bg-muted rounded-md w-full", shimmerClass)} />
        <div className={cn("h-4 bg-muted rounded-md w-5/6", shimmerClass)} style={{ animationDelay: "100ms" }} />
        <div className={cn("h-4 bg-muted rounded-md w-4/6", shimmerClass)} style={{ animationDelay: "200ms" }} />
      </div>
    </div>
  );
});

interface SkeletonListProps {
  count?: number;
  className?: string;
  variant?: "default" | "chat" | "compact";
}

export const SkeletonList = memo(function SkeletonList({ 
  count = 5, 
  className,
  variant = "default"
}: SkeletonListProps) {
  const items = useMemo(() => Array.from({ length: count }), [count]);

  if (variant === "chat") {
    return (
      <div className={cn("space-y-3", className)}>
        {items.map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "flex items-center gap-3 p-3 bg-card rounded-2xl border border-border/30",
              "shadow-sm"
            )}
          >
            <div className={cn(
              "w-14 h-14 rounded-full bg-gradient-to-br from-muted via-muted/80 to-muted shrink-0",
              shimmerClass
            )} 
            style={{ animationDelay: `${i * 50}ms` }}
            />
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div 
                  className={cn("h-5 w-28 bg-muted rounded-md", shimmerClass)}
                  style={{ animationDelay: `${i * 50 + 50}ms` }}
                />
                <div 
                  className={cn("h-3 w-12 bg-muted rounded-md", shimmerClass)}
                  style={{ animationDelay: `${i * 50 + 100}ms` }}
                />
              </div>
              <div 
                className={cn("h-4 w-3/4 bg-muted rounded-md", shimmerClass)}
                style={{ animationDelay: `${i * 50 + 150}ms` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={cn("space-y-2", className)}>
        {items.map((_, i) => (
          <div 
            key={i} 
            className="flex items-center gap-3 p-2"
          >
            <div 
              className={cn("w-10 h-10 rounded-full bg-muted shrink-0", shimmerClass)}
              style={{ animationDelay: `${i * 50}ms` }}
            />
            <div className="flex-1 space-y-1.5">
              <div 
                className={cn("h-4 w-24 bg-muted rounded-md", shimmerClass)}
                style={{ animationDelay: `${i * 50 + 50}ms` }}
              />
              <div 
                className={cn("h-3 w-16 bg-muted rounded-md", shimmerClass)}
                style={{ animationDelay: `${i * 50 + 100}ms` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((_, i) => (
        <div 
          key={i} 
          className={cn(
            "flex items-center gap-4 p-4 bg-card rounded-xl border border-border/30",
            "shadow-sm"
          )}
        >
          <div 
            className={cn(
              "w-12 h-12 rounded-full bg-gradient-to-br from-muted via-muted/80 to-muted shrink-0",
              shimmerClass
            )}
            style={{ animationDelay: `${i * 50}ms` }}
          />
          <div className="flex-1 space-y-2">
            <div 
              className={cn("h-4 w-32 bg-muted rounded-md", shimmerClass)}
              style={{ animationDelay: `${i * 50 + 50}ms` }}
            />
            <div 
              className={cn("h-3 w-48 bg-muted rounded-md", shimmerClass)}
              style={{ animationDelay: `${i * 50 + 100}ms` }}
            />
          </div>
          <div 
            className={cn("h-4 w-16 bg-muted rounded-md", shimmerClass)}
            style={{ animationDelay: `${i * 50 + 150}ms` }}
          />
        </div>
      ))}
    </div>
  );
});

interface SkeletonGridProps {
  count?: number;
  columns?: 2 | 3 | 4;
  variant?: "default" | "compact" | "featured";
}

export const SkeletonGrid = memo(function SkeletonGrid({ 
  count = 8,
  columns = 4,
  variant = "default"
}: SkeletonGridProps) {
  const items = useMemo(() => Array.from({ length: count }), [count]);
  
  const gridCols = useMemo(() => {
    switch (columns) {
      case 2: return "grid-cols-1 sm:grid-cols-2";
      case 3: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
      default: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
    }
  }, [columns]);

  return (
    <div className={cn("grid gap-4 sm:gap-6", gridCols)}>
      {items.map((_, i) => (
        <SkeletonCard 
          key={i} 
          variant={variant}
          hasActions={variant !== "compact"}
          lines={variant === "compact" ? 2 : 3}
        />
      ))}
    </div>
  );
});

// New: Skeleton for stats/dashboard cards
interface SkeletonStatsProps {
  count?: number;
  className?: string;
}

export const SkeletonStats = memo(function SkeletonStats({
  count = 4,
  className
}: SkeletonStatsProps) {
  const items = useMemo(() => Array.from({ length: count }), [count]);

  return (
    <div className={cn("grid grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {items.map((_, i) => (
        <div 
          key={i}
          className="bg-card rounded-xl border border-border/30 p-5 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div 
              className={cn("h-4 w-20 bg-muted rounded-md", shimmerClass)}
              style={{ animationDelay: `${i * 100}ms` }}
            />
            <div 
              className={cn("w-10 h-10 bg-muted rounded-xl", shimmerClass)}
              style={{ animationDelay: `${i * 100 + 50}ms` }}
            />
          </div>
          <div 
            className={cn("h-8 w-24 bg-muted rounded-lg", shimmerClass)}
            style={{ animationDelay: `${i * 100 + 100}ms` }}
          />
          <div 
            className={cn("h-3 w-16 bg-muted rounded-md", shimmerClass)}
            style={{ animationDelay: `${i * 100 + 150}ms` }}
          />
        </div>
      ))}
    </div>
  );
});

// New: Inline skeleton for text
interface SkeletonTextProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const SkeletonText = memo(function SkeletonText({
  width = "100%",
  height = "1rem",
  className
}: SkeletonTextProps) {
  return (
    <div 
      className={cn("bg-muted rounded-md", shimmerClass, className)}
      style={{ width, height }}
    />
  );
});
