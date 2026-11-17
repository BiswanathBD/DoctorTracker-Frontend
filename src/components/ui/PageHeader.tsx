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
    <div className={`mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-4 min-w-0">
        {/* back button */}
        {backHref && (
          <Link
            href={backHref}
            className="p-2.5 rounded-2xl bg-card border border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
        )}

        {/* icon */}
        {icon && (
          <div className='flex items-center'>
            <div className="w-16 h-16 text-secondary flex items-center justify-center">
              {icon}
            </div>
            {/* divider */}
            <div className="h-16 w-px bg-primary/20 shrink-0 hidden sm:block" />
          </div>
        )}

        {/* titles */}
        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-extrabold text-primary-hover tracking-tight">
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
