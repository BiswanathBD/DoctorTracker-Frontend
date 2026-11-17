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
        container: 'bg-primary-foreground text-primary shadow-xl',
        bodyText: 'bg-primary text-primary-foreground font-bold',
        iconBg: 'text-primary',
      },
      secondary: {
        container: 'bg-secondary-foreground text-secondary shadow-xl',
        bodyText: 'bg-secondary text-secondary-foreground font-bold',
        iconBg: 'text-secondary',
      },
      outline: {
        container: 'bg-muted text-foreground shadow-xl',
        bodyText: 'bg-card text-card-foreground font-bold',
        iconBg: 'text-muted-foreground',
      },
      ghost: {
        container: 'bg-muted/40 text-muted-foreground shadow-xl',
        bodyText: 'bg-muted text-foreground font-medium',
        iconBg: 'text-foreground',
      },
      destructive: {
        container: 'bg-destructive-foreground text-destructive shadow-xl',
        bodyText: 'bg-destructive text-destructive-foreground font-bold',
        iconBg: 'text-destructive',
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
