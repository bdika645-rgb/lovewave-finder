import { motion, useReducedMotion } from "framer-motion";
import { ReactNode, useMemo } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

const AnimatedSection = ({ 
  children, 
  className = "", 
  delay = 0,
  direction = "up" 
}: AnimatedSectionProps) => {
  const reducedMotion = useReducedMotion();

  const shouldAnimate = useMemo(() => {
    if (reducedMotion) return false;
    if (typeof window === "undefined") return false;
    return "IntersectionObserver" in window;
  }, [reducedMotion]);

  const getInitialPosition = () => {
    switch (direction) {
      case "up": return { y: 60, x: 0 };
      case "down": return { y: -60, x: 0 };
      case "left": return { x: 60, y: 0 };
      case "right": return { x: -60, y: 0 };
      default: return { y: 60, x: 0 };
    }
  };

  const initial = shouldAnimate
    ? { opacity: 0, ...getInitialPosition() }
    : { opacity: 1, x: 0, y: 0 };

  return (
    <motion.div
      initial={initial}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
