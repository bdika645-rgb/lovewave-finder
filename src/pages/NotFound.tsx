import { Link } from "react-router-dom";
import { Heart, Home, Search, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-6" dir="rtl">
      <SEOHead 
        title="הדף לא נמצא - 404"
        description="מצטערים, הדף שחיפשתם לא נמצא. חזרו לדף הבית או גלו פרופילים חדשים."
      />
      
      <div className="text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <Heart className="w-12 h-12 text-primary-foreground fill-current" />
            <span className="font-display text-4xl font-bold text-primary-foreground">Spark</span>
          </Link>
        </motion.div>

        {/* 404 Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-3xl p-12 shadow-elevated max-w-md mx-auto"
        >
          {/* Animated 404 */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <h1 className="font-display text-8xl font-bold text-primary mb-4 relative">
              <span className="relative z-10">404</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-2xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="font-display text-2xl font-bold text-foreground">
                אופס! הלכתם לאיבוד
              </h2>
            </div>
            <p className="text-muted-foreground mb-8">
              הדף שחיפשתם לא נמצא... אבל אל דאגה, יש המון מקומות מעניינים אחרים לגלות!
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/">
              <Button variant="hero" size="lg" className="w-full sm:w-auto gap-2">
                <Home className="w-5 h-5" />
                חזרה לבית
              </Button>
            </Link>
            <Link to="/discover">
              <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 group">
                <Search className="w-5 h-5" />
                גלו פרופילים
                <ArrowRight className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </Button>
            </Link>
          </motion.div>

          {/* Fun suggestion */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xs text-muted-foreground mt-8 flex items-center justify-center gap-1"
          >
            <Heart className="w-3 h-3 text-primary fill-current" />
            אולי ההתאמה המושלמת מחכה לכם דווקא במקום אחר?
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
