import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, MessageCircle, Users, Settings, Sparkles, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight?: string; // CSS selector to highlight
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'ברוכים הבאים ל-Spark! 🎉',
    description: 'אנחנו שמחים שהצטרפת! בוא נלמד ביחד איך להשתמש באפליקציה כדי למצוא את ההתאמה המושלמת.',
    icon: <Sparkles className="w-8 h-8" />,
  },
  {
    id: 'discover',
    title: 'גלה פרופילים',
    description: 'בדף הגילוי תוכל לגלול בין פרופילים. החלק ימינה ללייק או שמאלה כדי לדלג.',
    icon: <Search className="w-8 h-8" />,
  },
  {
    id: 'likes',
    title: 'שלח לייקים',
    description: 'מצאת מישהו שמעניין אותך? לחץ על כפתור הלב כדי לשלוח לייק. אם גם הוא/היא יעשו לך לייק - תהיה התאמה!',
    icon: <Heart className="w-8 h-8" />,
  },
  {
    id: 'matches',
    title: 'התאמות',
    description: 'כשיש לייק הדדי, נוצרת התאמה! תוכל לראות את כל ההתאמות שלך ולהתחיל לשוחח.',
    icon: <Users className="w-8 h-8" />,
  },
  {
    id: 'messages',
    title: 'הודעות',
    description: 'שלח הודעות להתאמות שלך! יש לנו גם שוברי קרח מובנים שיעזרו לך להתחיל שיחה.',
    icon: <MessageCircle className="w-8 h-8" />,
  },
  {
    id: 'profile',
    title: 'השלם את הפרופיל',
    description: 'פרופיל מלא מקבל יותר צפיות! הוסף תמונות, כתוב ביו מעניין, וסמן את התחביבים שלך.',
    icon: <Settings className="w-8 h-8" />,
  },
];

interface OnboardingTourProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

const OnboardingTour = ({ onComplete, forceShow = false }: OnboardingTourProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const STORAGE_KEY = 'spark_onboarding_complete';

  useEffect(() => {
    if (forceShow) {
      setIsOpen(true);
      return;
    }

    const hasCompleted = localStorage.getItem(STORAGE_KEY);
    if (!hasCompleted) {
      // Wait a bit before showing to let the page load
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [forceShow]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsOpen(false);
    onComplete?.();
  };

  const handleSkip = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const step = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        dir="rtl"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-card rounded-3xl shadow-elevated overflow-hidden"
        >
          {/* Progress bar */}
          <div className="h-1 bg-muted">
            <motion.div
              className="h-full gradient-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Close button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="דלג על המדריך"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Content */}
          <div className="p-8">
            {/* Icon */}
            <motion.div
              key={step.id}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full gradient-primary flex items-center justify-center text-primary-foreground"
            >
              {step.icon}
            </motion.div>

            {/* Text */}
            <motion.div
              key={`text-${step.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-8"
            >
              <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                {step.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>

            {/* Step indicators */}
            <div className="flex justify-center gap-2 mb-6">
              {tourSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    index === currentStep
                      ? "w-8 bg-primary"
                      : index < currentStep
                      ? "bg-primary/50"
                      : "bg-muted"
                  )}
                  aria-label={`שלב ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-3">
              <Button
                variant="ghost"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="gap-1"
              >
                <ChevronRight className="w-4 h-4" />
                הקודם
              </Button>

              <Button
                variant="hero"
                onClick={handleNext}
                className="flex-1 gap-1"
              >
                {currentStep === tourSteps.length - 1 ? (
                  <>
                    בואו נתחיל!
                    <Sparkles className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    הבא
                    <ChevronLeft className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>

            {/* Skip link */}
            {currentStep < tourSteps.length - 1 && (
              <button
                onClick={handleSkip}
                className="block mx-auto mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                דלג על המדריך
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingTour;
