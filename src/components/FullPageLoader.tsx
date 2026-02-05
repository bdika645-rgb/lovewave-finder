import { Heart, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface FullPageLoaderProps {
  label?: string;
  className?: string;
  /** Show branded loader with heart animation */
  branded?: boolean;
}

export default function FullPageLoader({
  label = "טוען...",
  className,
  branded = false,
}: FullPageLoaderProps) {
  if (branded) {
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
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative mb-6"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto shadow-xl"
            >
              <Heart className="w-10 h-10 text-primary-foreground fill-current" />
            </motion.div>
            
            {/* Pulsing rings */}
            <motion.div
              animate={{ 
                scale: [1, 1.5],
                opacity: [0.5, 0]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeOut" 
              }}
              className="absolute inset-0 w-20 h-20 rounded-2xl bg-primary/30 mx-auto"
              style={{ transformOrigin: 'center' }}
            />
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground font-medium"
          >
            {label}
          </motion.p>
          
          {/* Loading dots */}
          <div className="flex justify-center gap-1 mt-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1, 0.8]
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-2 h-2 rounded-full bg-primary"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

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
        <div className="relative">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" aria-hidden="true" />
        </div>
        <p className="text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}