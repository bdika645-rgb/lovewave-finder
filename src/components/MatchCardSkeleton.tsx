import { Skeleton } from "@/components/ui/skeleton";

interface MatchCardSkeletonProps {
  count?: number;
}

export function MatchCardSkeleton({ count = 4 }: MatchCardSkeletonProps) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-card rounded-3xl overflow-hidden shadow-card animate-pulse"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          {/* Image skeleton */}
          <div className="aspect-[4/5] relative bg-muted">
            <Skeleton className="absolute inset-0" />
            
            {/* Gradient overlay placeholder */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            
            {/* Badge placeholder */}
            <div className="absolute top-3 right-3">
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
            
            {/* Match percentage placeholder */}
            <div className="absolute top-3 left-3">
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            
            {/* Name and location placeholder */}
            <div className="absolute bottom-4 right-4 left-4 space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>

          {/* Content skeleton */}
          <div className="p-4 space-y-3">
            {/* Bio placeholder */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Quick hint placeholder */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-3.5 rounded-full" />
              <Skeleton className="h-3 w-28" />
            </div>

            {/* Button placeholder */}
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default MatchCardSkeleton;