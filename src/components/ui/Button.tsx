'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // variant styles using global css theme tokens
    const variantStyles = {
      primary:
        'bg-primary text-primary-foreground hover:bg-primary-hover shadow-md shadow-primary/20 active:shadow-none',
      secondary:
        'bg-secondary text-secondary-foreground hover:bg-secondary-hover shadow-md shadow-secondary/20',
      outline:
        'border border-border bg-card text-foreground hover:bg-muted shadow-sm',
      ghost:
        'text-foreground hover:bg-muted',
      destructive:
        'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md shadow-destructive/20',
    }[variant];

    // size styles
    const sizeStyles = {
      sm: 'px-3 py-2 text-xs rounded-xl gap-1.5',
      md: 'px-4 py-3 text-sm rounded-xl gap-2 font-medium',
      lg: 'px-5 py-4 text-base rounded-2xl gap-2.5 font-semibold',
    }[size];

    return (
      <motion.button
        ref={ref}
        whileHover={disabled || loading ? undefined : { scale: 1.015 }}
        whileTap={disabled || loading ? undefined : { scale: 0.985 }}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center transition-all outline-none focus-visible:ring-4 focus-visible:ring-ring/20 select-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${variantStyles} ${sizeStyles} ${className}`}
        {...props}
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
