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
  capsule?: boolean;
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
      capsule = true,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const hasIcon = Boolean(leftIcon || loading);

    // capsule theme styles
    const capsuleTheme = {
      primary: {
        container: 'bg-primary/10 hover:bg-primary/20 text-primary shadow-xl',
        iconBg: 'bg-primary text-primary-foreground',
        bodyText: 'text-foreground font-bold',
      },
      secondary: {
        container: 'bg-secondary/10 hover:bg-secondary/20 text-secondary shadow-xl',
        iconBg: 'bg-secondary text-secondary-foreground',
        bodyText: 'text-foreground font-bold',
      },
      outline: {
        container: 'bg-card hover:bg-muted text-foreground shadow-xl',
        iconBg: 'bg-muted text-muted-foreground',
        bodyText: 'text-foreground font-semibold',
      },
      ghost: {
        container: 'bg-muted/50 hover:bg-muted text-foreground shadow-xl',
        iconBg: 'bg-muted text-foreground',
        bodyText: 'text-foreground font-medium',
      },
      destructive: {
        container: 'bg-destructive/10 hover:bg-destructive/20 text-destructive shadow-xl',
        iconBg: 'bg-destructive text-destructive-foreground',
        bodyText: 'text-destructive font-bold',
      },
    }[variant];

    // standard fallback styles
    const standardVariantStyles = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-xl',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-hover shadow-xl',
      outline: 'bg-card text-foreground hover:bg-muted shadow-xl',
      ghost: 'text-foreground hover:bg-muted shadow-sm',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-xl',
    }[variant];

    // sizing styles
    const sizeStyles = {
      sm: {
        capsuleWrapper: 'h-8 text-xs',
        iconSection: 'h-8 px-2.5',
        textSection: 'h-8 px-3',
        standard: 'px-3.5 py-1.5 text-xs rounded-full gap-1.5',
      },
      md: {
        capsuleWrapper: 'h-10 text-xs sm:text-sm',
        iconSection: 'h-10 px-3',
        textSection: 'h-10 px-4',
        standard: 'px-4.5 py-2.5 text-xs sm:text-sm rounded-full gap-2',
      },
      lg: {
        capsuleWrapper: 'h-12 text-sm sm:text-base',
        iconSection: 'h-12 px-3.5',
        textSection: 'h-12 px-5',
        standard: 'px-6 py-3 text-sm sm:text-base rounded-full gap-2.5',
      },
    }[size];

    // capsule layout with icon badge
    if (capsule && hasIcon) {
      return (
        <motion.button
          ref={ref}
          whileHover={disabled || loading ? undefined : { scale: 1.02 }}
          whileTap={disabled || loading ? undefined : { scale: 0.98 }}
          disabled={disabled || loading}
          className={`group inline-flex items-center rounded-full p-0 border-0 overflow-hidden select-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-all outline-none focus-visible:ring-4 focus-visible:ring-ring/20 ${capsuleTheme.container} ${sizeStyles.capsuleWrapper} ${className}`}
          {...props}
        >
          {/* icon section */}
          <span
            className={`flex items-center justify-center shrink-0 border-0 transition-colors ${capsuleTheme.iconBg} ${sizeStyles.iconSection}`}
          >
            {loading ? (
              <span className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            ) : (
              leftIcon
            )}
          </span>

          {/* text section */}
          <span
            className={`flex items-center gap-1.5 grow border-0 transition-colors ${capsuleTheme.bodyText} ${sizeStyles.textSection}`}
          >
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </span>
        </motion.button>
      );
    }

    // standard button layout
    return (
      <motion.button
        ref={ref}
        whileHover={disabled || loading ? undefined : { scale: 1.02 }}
        whileTap={disabled || loading ? undefined : { scale: 0.98 }}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center font-bold border-0 transition-all outline-none focus-visible:ring-4 focus-visible:ring-ring/20 select-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${standardVariantStyles} ${sizeStyles.standard} ${className}`}
        {...props}
      >
        {loading ? (
          <span className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
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
