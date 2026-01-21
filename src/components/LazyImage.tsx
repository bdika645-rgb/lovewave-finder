import { useState, useEffect, useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'auto';
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
  priority?: boolean;
}

// Default fallback - a nice gradient placeholder
const DEFAULT_FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23f3f4f6'/%3E%3Cstop offset='100%25' style='stop-color:%23e5e7eb'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23grad)' width='400' height='400'/%3E%3C/svg%3E";

// Generate srcset for responsive images (Unsplash-specific)
const generateSrcSet = (src: string): string | undefined => {
  if (!src || !src.includes('unsplash.com')) return undefined;
  
  const baseUrl = src.split('?')[0];
  const widths = [320, 480, 640, 768, 1024, 1280];
  
  return widths
    .map(w => `${baseUrl}?w=${w}&q=80&auto=format ${w}w`)
    .join(', ');
};

const LazyImage = ({
  src,
  alt,
  className,
  placeholderClassName,
  aspectRatio = 'auto',
  fallbackSrc = DEFAULT_FALLBACK,
  onLoad,
  onError,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false,
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef<HTMLDivElement>(null);

  const srcSet = useMemo(() => generateSrcSet(src), [src]);

  useEffect(() => {
    // Reset states when src changes
    setIsLoaded(false);
    setError(false);
    setCurrentSrc(src);
  }, [src]);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Increased for earlier loading
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    if (currentSrc !== fallbackSrc) {
      // Try the fallback
      setCurrentSrc(fallbackSrc);
    } else {
      // Even fallback failed
      setError(true);
      onError?.();
    }
  };

  const aspectRatioClass = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-video',
    auto: '',
  }[aspectRatio];

  return (
    <div 
      ref={imgRef} 
      className={cn(
        "relative overflow-hidden bg-muted",
        aspectRatioClass,
        className
      )}
    >
      {/* Placeholder / Loading skeleton */}
      {!isLoaded && !error && (
        <div 
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-muted to-muted/50 animate-pulse",
            placeholderClassName
          )}
        />
      )}

      {/* Error state with icon */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground gap-2">
          <User className="w-12 h-12 opacity-50" />
          <span className="text-xs opacity-50">אין תמונה</span>
        </div>
      )}

      {/* Actual image */}
      {isInView && !error && (
        <img
          src={currentSrc}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
        />
      )}
    </div>
  );
};

export default LazyImage;
