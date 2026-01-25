import { motion, useReducedMotion } from "framer-motion";
import { ReactNode, useMemo } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  index?: number;
}

const AnimatedCard = ({ 
  children, 
  className = "", 
  index = 0 
}: AnimatedCardProps) => {
  const reducedMotion = useReducedMotion();

  const shouldAnimate = useMemo(() => {
    if (reducedMotion) return false;
    if (typeof window === "undefined") return false;
    return "IntersectionObserver" in window;
  }, [reducedMotion]);

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 30 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "100px" }}
      transition={{ 
        duration: 0.4, 
        delay: Math.min(index * 0.08, 0.3),
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -6,
        transition: { duration: 0.2 },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
