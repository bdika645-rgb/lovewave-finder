import { Check, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReadReceiptProps {
  isRead: boolean;
  readAt?: string | null;
  className?: string;
}

export default function ReadReceipt({ isRead, readAt, className }: ReadReceiptProps) {
  return (
    <span 
      className={cn("inline-flex", className)}
      title={isRead && readAt ? `נקרא ב-${new Date(readAt).toLocaleString('he-IL')}` : 'נשלח'}
      aria-label={isRead ? 'נקרא' : 'נשלח'}
    >
      {isRead ? (
        <CheckCheck className="w-4 h-4 text-primary" />
      ) : (
        <Check className="w-4 h-4 text-muted-foreground" />
      )}
    </span>
  );
}
