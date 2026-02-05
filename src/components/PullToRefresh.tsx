import { useState, useRef, useCallback, ReactNode } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { RefreshCw, ArrowDown, Check } from "lucide-react";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

const THRESHOLD = 80; // pixels to pull before triggering refresh
const MAX_PULL = 120; // max pull distance

type RefreshState = "idle" | "pulling" | "threshold" | "loading" | "success";

const PullToRefresh = ({ onRefresh, children, className = "", disabled = false }: PullToRefreshProps) => {
  const [state, setState] = useState<RefreshState>("idle");
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const pullDistance = useMotionValue(0);
  
  // Transform pull distance to icon rotation
  const iconRotation = useTransform(pullDistance, [0, THRESHOLD], [0, 180]);
  const iconScale = useTransform(pullDistance, [0, THRESHOLD / 2, THRESHOLD], [0.8, 1, 1.1]);
  const opacity = useTransform(pullDistance, [0, 30], [0, 1]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled || state === "loading") return;
    
    // Only activate if at top of scroll
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setState("pulling");
    }
  }, [disabled, state]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (state !== "pulling" && state !== "threshold") return;
    
    const currentY = e.touches[0].clientY;
    const diff = Math.max(0, Math.min(currentY - startY.current, MAX_PULL));
    
    pullDistance.set(diff);
    
    if (diff >= THRESHOLD && state === "pulling") {
      setState("threshold");
    } else if (diff < THRESHOLD && state === "threshold") {
      setState("pulling");
    }
  }, [state, pullDistance]);

  const handleTouchEnd = useCallback(async () => {
    if (state === "threshold") {
      setState("loading");
      pullDistance.set(60); // Hold at loading position
      
      try {
        await onRefresh();
        setState("success");
        setTimeout(() => {
          pullDistance.set(0);
          setState("idle");
        }, 800);
      } catch {
        pullDistance.set(0);
        setState("idle");
      }
    } else {
      pullDistance.set(0);
      setState("idle");
    }
  }, [state, onRefresh, pullDistance]);

  const indicatorY = useTransform(pullDistance, [0, MAX_PULL], [-60, 40]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-auto ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: state === "pulling" || state === "threshold" ? "none" : "auto" }}
    >
      {/* Pull Indicator */}
      <AnimatePresence>
        {state !== "idle" && (
          <motion.div
            className="absolute left-1/2 z-50 flex items-center justify-center"
            style={{ 
              y: indicatorY,
              x: "-50%",
              opacity 
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <motion.div 
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                state === "success" 
                  ? "bg-success text-success-foreground" 
                  : state === "threshold" || state === "loading"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground border border-border"
              }`}
            >
              {state === "loading" ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : state === "success" ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Check className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div style={{ rotate: iconRotation, scale: iconScale }}>
                  <ArrowDown className="w-5 h-5" />
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content with pull effect */}
      <motion.div style={{ y: useTransform(pullDistance, [0, MAX_PULL], [0, 60]) }}>
        {children}
      </motion.div>
    </div>
  );
};

export default PullToRefresh;
