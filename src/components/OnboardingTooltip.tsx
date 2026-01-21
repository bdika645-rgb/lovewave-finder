import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TooltipStep {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface OnboardingTooltipProps {
  steps: TooltipStep[];
  storageKey: string;
  className?: string;
  onComplete?: () => void;
}

const OnboardingTooltip = ({
  steps,
  storageKey,
  className,
  onComplete,
}: OnboardingTooltipProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem(storageKey);
    if (!hasSeenOnboarding) {
      setIsVisible(true);
    }
  }, [storageKey]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleClose = () => {
    localStorage.setItem(storageKey, 'true');
    setIsVisible(false);
    onComplete?.();
  };

  if (!isVisible) return null;

  const step = steps[currentStep];

  return (
    <div 
      className={cn(
        "fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:w-96",
        "bg-card border border-border rounded-2xl shadow-elevated p-6 z-50",
        "animate-slide-up",
        className
      )}
      dir="rtl"
    >
      <button
        onClick={handleClose}
        className="absolute top-4 left-4 p-1 rounded-full hover:bg-muted transition-colors"
        aria-label="סגור"
      >
        <X className="w-4 h-4 text-muted-foreground" />
      </button>

      {step.icon && (
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
          {step.icon}
        </div>
      )}

      <h4 className="font-display text-lg font-bold text-foreground mb-2">
        {step.title}
      </h4>
      
      <p className="text-muted-foreground text-sm mb-6">
        {step.description}
      </p>

      {/* Progress dots */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentStep 
                  ? "bg-primary w-6" 
                  : "bg-muted hover:bg-muted-foreground/30"
              )}
              aria-label={`שלב ${index + 1}`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          {currentStep > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handlePrev}
              className="gap-1"
            >
              <ChevronRight className="w-4 h-4" />
              הקודם
            </Button>
          )}
          <Button 
            variant="hero" 
            size="sm" 
            onClick={handleNext}
            className="gap-1"
          >
            {currentStep === steps.length - 1 ? 'הבנתי!' : 'הבא'}
            {currentStep < steps.length - 1 && <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTooltip;
