'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export interface PageHeaderProps {
  title: string;
  subtitle?: string | React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  backHref?: string;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  badge,
  actions,
  backHref,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-4 min-w-0">
        {/* back button */}
        {backHref && (
          <Link
            href={backHref}
            className="p-2.5 rounded-2xl bg-card border border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all shrink-0 cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
        )}

        {/* icon */}
        {icon && (
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 shrink-0 flex items-center justify-center">
            {icon}
          </div>
        )}

        {/* divider */}
        {icon && (
          <div className="h-11 w-px bg-border shrink-0 hidden sm:block" />
        )}

        {/* titles */}
        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {title}
            </h1>
            {badge && <div>{badge}</div>}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* actions */}
      {actions && (
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
};
