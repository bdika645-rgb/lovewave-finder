import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

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
}: EmptyStateProps) => {
  return (
    <div className={cn("text-center py-16 px-6 max-w-md mx-auto", className)}>
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground">
        {icon}
      </div>
      
      <h3 className="font-display text-2xl font-bold text-foreground mb-3">
        {title}
      </h3>
      
      <p className="text-muted-foreground mb-8">
        {description}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {actionLabel && (actionLink || onAction) && (
          actionLink ? (
            <Link to={actionLink}>
              <Button variant="hero" size="lg">
                {actionLabel}
              </Button>
            </Link>
          ) : (
            <Button variant="hero" size="lg" onClick={onAction}>
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
    </div>
  );
};

export default EmptyState;
