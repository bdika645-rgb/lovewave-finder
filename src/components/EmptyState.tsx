import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

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
}: EmptyStateProps) => {
  return (
    <div className={cn("text-center py-16 px-6 max-w-md mx-auto", className)}>
      <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-primary animate-pulse">
        {icon}
      </div>
      
      <h3 className="font-display text-2xl font-bold text-foreground mb-3">
        {title}
      </h3>
      
      <p className="text-muted-foreground mb-8 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {actionLabel && (actionLink || onAction) && (
          actionLink ? (
            <Link to={actionLink}>
              <Button variant="hero" size="lg" className="gap-2">
                <Sparkles className="w-4 h-4" />
                {actionLabel}
              </Button>
            </Link>
          ) : (
            <Button variant="hero" size="lg" onClick={onAction} className="gap-2">
              <Sparkles className="w-4 h-4" />
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
