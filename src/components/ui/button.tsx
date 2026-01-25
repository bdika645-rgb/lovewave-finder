import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-body active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[0_4px_14px_-3px_hsla(346,77%,58%,0.4)] hover:bg-primary/90 hover:shadow-[0_6px_20px_-3px_hsla(346,77%,58%,0.5)] hover:-translate-y-0.5",
        destructive: "bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 hover:shadow-lg hover:-translate-y-0.5",
        outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:-translate-y-0.5",
        secondary: "bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/80 hover:shadow-lg hover:-translate-y-0.5",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-gradient-to-r from-primary to-secondary text-white shadow-[0_8px_30px_-6px_hsla(346,77%,58%,0.5)] hover:shadow-[0_12px_40px_-6px_hsla(346,77%,58%,0.6)] hover:-translate-y-1 hover:brightness-110 font-bold",
        "hero-outline": "border-2 border-primary/30 bg-background/80 backdrop-blur-sm text-foreground shadow-lg hover:bg-primary/10 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1",
        action: "bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground hover:shadow-md hover:-translate-y-0.5",
        like: "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-full shadow-sm hover:shadow-lg hover:scale-105",
        pass: "bg-muted text-muted-foreground hover:bg-destructive hover:text-destructive-foreground rounded-full shadow-sm hover:shadow-lg hover:scale-105",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-4",
        lg: "h-14 rounded-xl px-10 text-base",
        xl: "h-16 rounded-2xl px-12 text-lg font-bold",
        icon: "h-11 w-11",
        "icon-lg": "h-14 w-14 rounded-full",
        "icon-xl": "h-16 w-16 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
