import { useEffect, useRef, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface InfiniteScrollProps {
  children: ReactNode;
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  threshold?: number;
  className?: string;
}

const InfiniteScroll = ({
  children,
  onLoadMore,
  hasMore,
  loading,
  threshold = 200,
  className,
}: InfiniteScrollProps) => {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      {
        rootMargin: `${threshold}px`,
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [onLoadMore, hasMore, loading, threshold]);

  return (
    <div className={className}>
      {children}
      
      <div ref={observerRef} className="h-1" />
      
      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      )}
      
      {!hasMore && !loading && (
        <div className="text-center py-8 text-muted-foreground">
          <p>זה הכל! אין עוד תוצאות</p>
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll;
