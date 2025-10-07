import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:scale-105 active:scale-95';
    
    const variants = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-lg',
      outline: 'border-2 border-input hover:bg-accent hover:text-accent-foreground hover:border-accent',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-md hover:shadow-lg',
      ghost: 'hover:bg-accent/50 hover:text-accent-foreground',
      link: 'underline-offset-4 hover:underline text-primary',
    };

    const sizes = {
      default: 'h-11 py-2 px-5',
      sm: 'h-9 px-4 rounded-lg text-xs',
      lg: 'h-12 px-8 rounded-xl text-base',
      icon: 'h-10 w-10',
    };

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="mr-2 animate-spin">⏳</span>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

