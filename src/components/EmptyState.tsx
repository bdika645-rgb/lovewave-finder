import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Sparkles, ArrowLeft, Share2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

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
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      toast.success("הקישור הועתק!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("לא ניתן להעתיק");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Spark - מצאו את האהבה',
          text: 'הצטרפו אליי ל-Spark ומצאו את האהבה! 💕',
          url: window.location.origin,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "text-center py-12 px-6 max-w-md mx-auto",
        isActionVariant && "py-16",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <motion.div 
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className={cn(
          "w-20 h-20 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary shadow-lg",
          isActionVariant ? "w-24 h-24 animate-pulse-soft" : ""
        )}
        aria-hidden="true"
      >
        {icon}
      </motion.div>
      
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-display text-2xl font-bold text-foreground mb-3"
      >
        {title}
      </motion.h2>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-muted-foreground mb-6 leading-relaxed"
      >
        {description}
      </motion.p>

      {/* Tips Section - Enhanced */}
      {tips && tips.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6 p-4 bg-muted/50 rounded-xl border border-border text-right" 
          dir="rtl"
        >
          <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              💡
            </span>
            טיפים מהירים:
          </p>
          <ul className="text-sm text-muted-foreground space-y-2">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary font-bold shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-3 justify-center"
      >
        {actionLabel && (actionLink || onAction) && (
          actionLink ? (
            <Link to={actionLink}>
              <Button 
                variant="hero" 
                size="lg" 
                className={cn("gap-2 shadow-lg", isActionVariant && "text-lg px-8")}
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
              className={cn("gap-2 shadow-lg", isActionVariant && "text-lg px-8")}
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
      </motion.div>

      {showInvite && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 pt-6 border-t border-border"
        >
          <p className="text-sm text-muted-foreground mb-4">
            🌟 יש לך חברים שמחפשים אהבה?
          </p>
          <div className="flex gap-2 justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
              שתף
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2"
              onClick={handleCopyLink}
            >
              {copied ? (
                <Check className="w-4 h-4 text-success" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? "הועתק!" : "העתק קישור"}
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;