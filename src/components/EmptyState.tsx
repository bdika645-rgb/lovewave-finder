import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Sparkles, ArrowLeft } from 'lucide-react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  secondaryActionLink?: string;
  className?: string;
  showInvite?: boolean;
  /** Shows a more prominent, action-oriented CTA */
  variant?: 'default' | 'action';
  /** Additional tips or hints */
  tips?: string[];
}

const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  actionLink,
  onAction,
  secondaryActionLabel,
  secondaryActionLink,
  className,
  showInvite = false,
  variant = 'default',
  tips,
}: EmptyStateProps) => {
  const isActionVariant = variant === 'action';

  return (
    <div 
      className={cn(
        "text-center py-16 px-6 max-w-md mx-auto",
        isActionVariant && "py-20",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div 
        className={cn(
          "w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-primary",
          isActionVariant ? "animate-pulse-soft" : "animate-pulse"
        )}
        aria-hidden="true"
      >
        {icon}
      </div>
      
      <h2 className="font-display text-2xl font-bold text-foreground mb-3">
        {title}
      </h2>
      
      <p className="text-muted-foreground mb-8 leading-relaxed">
        {description}
      </p>

      {/* Tips Section */}
      {tips && tips.length > 0 && (
        <div className="mb-8 p-4 bg-muted/50 rounded-xl text-right" dir="rtl">
          <p className="text-sm font-medium text-foreground mb-2">💡 טיפים:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <ArrowLeft className="w-3 h-3 mt-1 flex-shrink-0 text-primary" aria-hidden="true" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {actionLabel && (actionLink || onAction) && (
          actionLink ? (
            <Link to={actionLink}>
              <Button 
                variant="hero" 
                size="lg" 
                className={cn("gap-2", isActionVariant && "text-lg px-8")}
              >
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                {actionLabel}
              </Button>
            </Link>
          ) : (
            <Button 
              variant="hero" 
              size="lg" 
              onClick={onAction} 
              className={cn("gap-2", isActionVariant && "text-lg px-8")}
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              {actionLabel}
            </Button>
          )
        )}
        
        {secondaryActionLabel && secondaryActionLink && (
          <Link to={secondaryActionLink}>
            <Button variant="outline" size="lg">
              {secondaryActionLabel}
            </Button>
          </Link>
        )}
      </div>

      {showInvite && (
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            🌟 יש לך חברים שמחפשים אהבה?
          </p>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            הזמן חברים ל-Spark
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
