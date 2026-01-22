import { ReactNode } from "react";
import EmptyState from "@/components/EmptyState";

interface AdminEmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  secondaryActionLink?: string;
  tips?: string[];
  className?: string;
}

export default function AdminEmptyState(props: AdminEmptyStateProps) {
  return (
    <div dir="rtl" role="status" aria-live="polite">
      <EmptyState {...props} variant="action" />
    </div>
  );
}
