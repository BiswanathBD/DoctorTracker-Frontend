'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children?: React.ReactNode;
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'destructive'
    | 'warning'
    | 'light'
    | 'light-primary'
    | 'light-secondary';
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
    const isCapsule = Boolean(capsule && leftIcon);

    // shadow by size helper - ensures small/medium buttons don't have excessive blur that gets clipped
    const shadowBySize = {
      sm: 'shadow-md',
      md: 'shadow-md',
      lg: 'shadow-lg',
    }[size];

    // capsule theme styles
    const capsuleTheme = {
      primary: {
        container: `bg-primary-foreground text-primary ${shadowBySize} shadow-primary/20`,
        bodyText: 'bg-primary text-primary-foreground font-bold',
        iconBg: 'text-primary',
      },
      secondary: {
        container: `bg-secondary-foreground text-secondary ${shadowBySize} shadow-secondary/20`,
        bodyText: 'bg-secondary text-secondary-foreground font-bold',
        iconBg: 'text-secondary',
      },
      outline: {
        container: `bg-muted text-foreground ${shadowBySize}`,
        bodyText: 'bg-card text-card-foreground font-bold',
        iconBg: 'text-muted-foreground',
      },
      ghost: {
        container: `bg-muted/40 text-muted-foreground ${shadowBySize}`,
        bodyText: 'bg-muted text-foreground font-medium',
        iconBg: 'text-foreground',
      },
      warning: {
        container: `bg-warning/15 text-warning ${shadowBySize} shadow-warning/25`,
        bodyText: 'bg-warning text-warning-foreground font-bold',
        iconBg: 'text-warning',
      },
      destructive: {
        container: `bg-destructive/15 text-destructive ${shadowBySize} shadow-destructive/25`,
        bodyText: 'bg-destructive text-destructive-foreground font-bold',
        iconBg: 'text-destructive',
      },
      light: {
        container: `bg-white text-foreground ${shadowBySize} shadow-black/10`,
        bodyText: 'bg-white text-foreground font-bold',
        iconBg: 'text-muted-foreground',
      },
      'light-primary': {
        container: `bg-white text-primary ${shadowBySize} shadow-black/10`,
        bodyText: 'bg-white text-primary font-bold',
        iconBg: 'text-primary',
      },
      'light-secondary': {
        container: `bg-white text-secondary ${shadowBySize} shadow-black/10`,
        bodyText: 'bg-white text-secondary font-bold',
        iconBg: 'text-secondary',
      },
    }[variant];

    // standard fallback styles
    const standardVariantStyles = {
      primary: `bg-primary text-primary-foreground hover:bg-primary-hover ${shadowBySize} shadow-primary/25`,
      secondary: `bg-secondary text-secondary-foreground hover:bg-secondary-hover ${shadowBySize} shadow-secondary/25`,
      outline: `bg-card text-foreground hover:bg-muted ${shadowBySize}`,
      ghost: 'text-foreground hover:bg-muted shadow-sm',
      warning: `bg-warning text-warning-foreground hover:bg-warning/90 ${shadowBySize} shadow-warning/25`,
      destructive: `bg-destructive text-destructive-foreground hover:bg-destructive/90 ${shadowBySize} shadow-destructive/25`,
      light: `bg-white text-foreground hover:bg-slate-50 ${shadowBySize} shadow-black/10`,
      'light-primary': `bg-white text-primary hover:bg-white/95 ${shadowBySize} shadow-black/10`,
      'light-secondary': `bg-white text-secondary hover:bg-white/95 ${shadowBySize} shadow-black/10`,
    }[variant];

    // sizing styles
    const sizeStyles = {
      sm: {
        capsuleWrapper: 'h-8 text-xs',
        iconSection: 'h-8 px-2.5',
        textSection: 'h-8 px-3',
        standard: 'h-8 px-3.5 text-xs rounded-full gap-1.5',
        iconSize: '[&_svg]:w-3.5 [&_svg]:h-3.5',
      },
      md: {
        capsuleWrapper: 'h-10 text-xs sm:text-sm',
        iconSection: 'h-10 px-3',
        textSection: 'h-10 px-4',
        standard: 'h-10 px-4.5 text-xs sm:text-sm rounded-full gap-2',
        iconSize: '[&_svg]:w-4 [&_svg]:h-4',
      },
      lg: {
        capsuleWrapper: 'h-12 text-sm sm:text-base',
        iconSection: 'h-12 px-3.5',
        textSection: 'h-12 px-5',
        standard: 'h-12 px-6 text-sm sm:text-base rounded-full gap-2.5',
        iconSize: '[&_svg]:w-4.5 [&_svg]:h-4.5',
      },
    }[size];

    // capsule layout with icon badge
    if (isCapsule) {
      return (
        <motion.button
          ref={ref}
          whileHover={disabled || loading ? undefined : { scale: 1.02 }}
          whileTap={disabled || loading ? undefined : { scale: 0.98 }}
          disabled={disabled || loading}
          className={cn(
            'group inline-flex items-center rounded-full p-0 border-0 overflow-hidden select-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-all outline-none focus-visible:ring-4 focus-visible:ring-ring/20',
            capsuleTheme.container,
            sizeStyles.capsuleWrapper,
            className
          )}
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
        className={cn(
          'inline-flex items-center justify-center font-bold border-0 transition-all outline-none focus-visible:ring-4 focus-visible:ring-ring/20 select-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed',
          standardVariantStyles,
          sizeStyles.standard,
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin shrink-0" />
        ) : (
          leftIcon && (
            <span className={`inline-flex shrink-0 items-center justify-center ${sizeStyles.iconSize}`}>
              {leftIcon}
            </span>
          )
        )}
        <span className="inline-flex items-center leading-none">{children}</span>
        {!loading && rightIcon && (
          <span className={`inline-flex shrink-0 items-center justify-center ${sizeStyles.iconSize}`}>
            {rightIcon}
          </span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
