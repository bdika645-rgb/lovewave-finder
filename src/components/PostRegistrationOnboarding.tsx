import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Camera, User, Heart, Sparkles, X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: {
    label: string;
    link: string;
  };
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'photo',
    title: 'העלו תמונת פרופיל 📸',
    description: 'פרופילים עם תמונה מקבלים פי 10 יותר לייקים! העלו תמונה ברורה שמראה את הפנים שלכם.',
    icon: <Camera className="w-8 h-8" />,
    action: {
      label: 'לעמוד הפרופיל',
      link: '/profile',
    },
  },
  {
    id: 'profile',
    title: 'השלימו את הפרופיל 📝',
    description: 'הוסיפו ביו קצר, תחומי עניין ופרטים נוספים כדי שאנשים יכירו אתכם טוב יותר.',
    icon: <User className="w-8 h-8" />,
    action: {
      label: 'לעריכת הפרופיל',
      link: '/profile',
    },
  },
  {
    id: 'discover',
    title: 'התחילו לגלות! 🔥',
    description: 'גררו ימינה לאנשים שמוצאים חן בעיניכם, שמאלה לדלג. כשיש לייק הדדי - יש התאמה!',
    icon: <Heart className="w-8 h-8" />,
    action: {
      label: 'לדף הגילוי',
      link: '/discover',
    },
  },
];

interface PostRegistrationOnboardingProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

const STORAGE_KEY = 'spark_post_registration_onboarding';

const PostRegistrationOnboarding = ({ onComplete, forceShow = false }: PostRegistrationOnboardingProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (forceShow) {
      setIsOpen(true);
      return;
    }

    const hasCompleted = localStorage.getItem(STORAGE_KEY);
    if (!hasCompleted) {
      // Small delay to let the page load first
      const timer = setTimeout(() => setIsOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, [forceShow]);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
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
    onComplete?.();
  };

  if (!isOpen) return null;

  const step = onboardingSteps[currentStep];
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
        dir="rtl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-md bg-card rounded-3xl shadow-elevated overflow-hidden"
        >
          {/* Progress Bar */}
          <div className="h-1 bg-muted">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Close Button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted transition-colors focus-ring z-10"
            aria-label="דלג על הדרכה"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Content */}
          <div className="p-8 pt-12">
            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {onboardingSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all focus-ring",
                    index === currentStep 
                      ? "w-8 bg-primary" 
                      : index < currentStep
                        ? "bg-primary/60"
                        : "bg-muted hover:bg-muted-foreground/30"
                  )}
                  aria-label={`שלב ${index + 1} מתוך ${onboardingSteps.length}`}
                  aria-current={index === currentStep ? 'step' : undefined}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="text-center"
              >
                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary">
                  {step.icon}
                </div>

                {/* Title */}
                <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                  {step.title}
                </h2>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {step.description}
                </p>

                {/* Action Button */}
                {step.action && (
                  <Link to={step.action.link} onClick={handleComplete}>
                    <Button variant="hero" size="lg" className="mb-4 w-full gap-2">
                      <Sparkles className="w-4 h-4" />
                      {step.action.label}
                    </Button>
                  </Link>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="gap-1"
              >
                <ChevronRight className="w-4 h-4" />
                הקודם
              </Button>

              <Button
                variant={currentStep === onboardingSteps.length - 1 ? "default" : "outline"}
                size="sm"
                onClick={handleNext}
                className="gap-1"
              >
                {currentStep === onboardingSteps.length - 1 ? (
                  <>
                    <Check className="w-4 h-4" />
                    סיום
                  </>
                ) : (
                  <>
                    הבא
                    <ChevronLeft className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>

            {/* Skip Link */}
            <button
              onClick={handleSkip}
              className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors focus-ring rounded-md py-2"
            >
              דלג, אני מכיר/ה
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PostRegistrationOnboarding;
