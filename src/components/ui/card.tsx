import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-xl border bg-card text-card-foreground transition-all duration-300 ease-out",
  {
    variants: {
      variant: {
        default: [
          "shadow-[0_4px_6px_-1px_hsla(0,0%,0%,0.08),0_10px_40px_-10px_hsla(346,77%,58%,0.12),0_1px_3px_0_hsla(0,0%,0%,0.06)]",
          "hover:shadow-[0_20px_50px_-12px_hsla(346,77%,58%,0.2),0_8px_20px_-8px_hsla(0,0%,0%,0.12)]",
          "hover:border-primary/10",
        ],
        glow: [
          "shadow-card",
          "hover:shadow-[0_20px_50px_-12px_hsla(346,77%,58%,0.28),0_8px_20px_-8px_hsla(0,0%,0%,0.15),0_0_40px_-15px_hsla(346,77%,58%,0.25)]",
          "hover:border-primary/20",
        ],
        elevated: [
          "shadow-elevated",
          "hover:shadow-[0_25px_60px_-12px_hsla(346,77%,58%,0.3),0_12px_25px_-8px_hsla(0,0%,0%,0.18)]",
          "hover:border-primary/15",
          "hover:-translate-y-1",
        ],
        flat: [
          "shadow-sm",
          "hover:shadow-md",
          "hover:border-primary/10",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, className }))}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-bold leading-tight tracking-tight text-foreground", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants };
