'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MotionWrapper } from '@/components/common/MotionWrapper';

export interface PageHeaderProps {
  title: string;
  subtitle?: string | React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  backHref?: string;
  className?: string;
}

// extract action buttons for staggered fade up
const extractActionButtons = (actions: React.ReactNode): React.ReactNode[] => {
  if (!actions) return [];
  if (React.isValidElement(actions)) {
    const props = actions.props as { children?: React.ReactNode };
    if (props && props.children) {
      const childArray = React.Children.toArray(props.children);
      if (childArray.length > 1) {
        return childArray;
      }
    }
  }
  return React.Children.toArray(actions);
};

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  badge,
  actions,
  backHref,
  className = '',
}) => {
  const actionList = extractActionButtons(actions);

  return (
    <div className={`mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-4 min-w-0">
        {/* back button */}
        {backHref && (
          <MotionWrapper
            animationType="fadeLeft"
            delay={0.1}
            duration={0.3}
          >
            <Link
              href={backHref}
              className="p-2.5 rounded-2xl bg-card border border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </MotionWrapper>
        )}

        {/* icon and divider */}
        {icon && (
          <div className="flex items-center">
            {/* icon fade left */}
            <MotionWrapper
              animationType="fadeLeft"
              delay={0.3}
              duration={0.3}
              className="w-16 h-16 text-secondary flex items-center justify-center shrink-0"
            >
              {icon}
            </MotionWrapper>

            {/* divider height increase */}
              <MotionWrapper
                animationType="heightIncrease"
                delay={0}
                duration={0.3}
                className="overflow-hidden"
              >
                <div className='h-16 w-px bg-primary/20 shrink-0' />
              </MotionWrapper>
          </div>
        )}

        {/* right section fade right */}
        <MotionWrapper
          animationType="fadeRight"
          delay={0.6}
          duration={0.6}
          className="min-w-0 space-y-0.5"
        >
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
        </MotionWrapper>
      </div>

      {/* action buttons fade up one by one */}
      {actionList.length > 0 && (
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 flex-wrap">
          {actionList.map((action, index) => (
            <MotionWrapper
              key={index}
              animationType="fadeUp"
              delay={0.6 + index * 0.1}
              duration={0.3}
            >
              {action}
            </MotionWrapper>
          ))}
        </div>
      )}
    </div>
  );
};
