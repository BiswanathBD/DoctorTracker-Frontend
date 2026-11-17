'use client';

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  capsule?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      capsule = true,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const { disabled } = props;

    // capsule input layout matching button design
    if (capsule && leftIcon) {
      return (
        <div className="w-full space-y-1.5 text-left">
          {label && (
            <label htmlFor={inputId} className="block text-xs font-semibold text-foreground">
              {label}
            </label>
          )}

          <div
            className={`group flex items-stretch w-full rounded-full overflow-hidden border transition-all ${
              disabled
                ? 'opacity-60 cursor-not-allowed bg-muted/20 border-border'
                : error
                ? 'border-destructive'
                : 'border-border focus-within:border-primary'
            }`}
          >
            {/* left icon capsule section */}
            <div
              className={`flex items-center justify-center px-4 bg-muted text-primary shrink-0 transition-colors border-r border-border ${
                !disabled
                  ? 'group-focus-within:bg-primary group-focus-within:text-primary-foreground group-focus-within:border-primary'
                  : ''
              }`}
            >
              {leftIcon}
            </div>

            {/* right input body section */}
            <div className="flex items-center flex-1 bg-card px-4 py-2 text-foreground transition-colors">
              <input
                id={inputId}
                ref={ref}
                className={`w-full text-sm font-medium bg-transparent border-0 outline-none placeholder:text-muted-foreground/50 text-foreground disabled:cursor-not-allowed ${className}`}
                {...props}
              />
              {rightIcon && (
                <div className="ml-2 flex items-center justify-center text-muted-foreground shrink-0">
                  {rightIcon}
                </div>
              )}
            </div>
          </div>

          {error ? (
            <p className="text-xs text-destructive font-medium leading-none">{error}</p>
          ) : helperText ? (
            <p className="text-xs text-muted-foreground leading-none">{helperText}</p>
          ) : null}
        </div>
      );
    }

    // standard input layout
    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-foreground">
            {label}
          </label>
        )}

        <div
          className={`relative flex items-center rounded-full overflow-hidden border transition-all ${
            disabled
              ? 'opacity-60 cursor-not-allowed bg-muted/20 border-border'
              : error
              ? 'border-destructive'
              : 'border-border focus-within:border-primary'
          }`}
        >
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center justify-center text-muted-foreground pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            className={`w-full text-sm rounded-full border-0 bg-card text-foreground placeholder:text-muted-foreground/50 outline-none transition-all disabled:cursor-not-allowed ${
              leftIcon ? 'pl-10' : 'pl-4'
            } ${rightIcon ? 'pr-10' : 'pr-4'} py-2.5 ${className}`}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 flex items-center justify-center text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-xs text-destructive font-medium leading-none">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-muted-foreground leading-none">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
