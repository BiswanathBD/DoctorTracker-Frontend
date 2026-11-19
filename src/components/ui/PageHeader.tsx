'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, X } from 'lucide-react';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import { cn } from '@/lib/utils';

export interface PageHeaderProps {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  backHref?: string;
  onClose?: () => void;
  size?: 'sm' | 'md' | 'lg';
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
  onClose,
  size = 'md',
  className = '',
}) => {
  const actionList = extractActionButtons(actions);

  // size variants configuration
  const sizeConfig = {
    sm: {
      container: 'flex flex-row items-start mt-2 justify-between gap-4 w-full',
      contentGap: 'gap-4',
      iconBox:
        'w-12 h-12 text-secondary flex items-center justify-center shrink-0 [&_svg]:w-8 [&_svg]:h-8',
      divider: 'h-14 w-px bg-primary/20 shrink-0',
      title: 'text-lg sm:text-xl font-bold text-foreground leading-tight',
      subtitle: 'text-xs sm:text-sm text-muted-foreground leading-snug',
      backButton:
        'p-1.5 rounded-xl bg-card border border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all shrink-0 cursor-pointer',
      backIcon: 'w-3.5 h-3.5',
      actionsGap: 'gap-2.5',
      closeBtn: 'w-8 h-8',
      closeIcon: 'w-4 h-4',
    },
    md: {
      container:
        'mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full',
      contentGap: 'gap-4',
      iconBox:
        'w-16 h-16 text-secondary flex items-center justify-center shrink-0 [&_svg]:w-10 [&_svg]:h-10',
      divider: 'h-16 w-px bg-primary/20 shrink-0',
      title: 'text-xl sm:text-2xl font-bold text-foreground leading-tight',
      subtitle: 'text-xs sm:text-sm text-muted-foreground leading-relaxed',
      backButton:
        'p-2.5 rounded-2xl bg-card border border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all shrink-0 cursor-pointer',
      backIcon: 'w-4 h-4',
      actionsGap: 'gap-2.5 sm:gap-3',
      closeBtn: 'w-8 h-8',
      closeIcon: 'w-4 h-4',
    },
    lg: {
      container:
        'mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 w-full',
      contentGap: 'gap-5',
      iconBox:
        'w-20 h-20 text-secondary flex items-center justify-center shrink-0 [&_svg]:w-12 [&_svg]:h-12',
      divider: 'h-20 w-px bg-primary/20 shrink-0',
      title: 'text-2xl sm:text-3xl font-bold text-foreground leading-tight',
      subtitle: 'text-sm sm:text-base text-muted-foreground leading-relaxed',
      backButton:
        'p-3 rounded-2xl bg-card border border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all shrink-0 cursor-pointer',
      backIcon: 'w-5 h-5',
      actionsGap: 'gap-3 sm:gap-3.5',
      closeBtn: 'w-9 h-9',
      closeIcon: 'w-4.5 h-4.5',
    },
  }[size];

  return (
    <div className={cn(sizeConfig.container, className)}>
      <div className={cn('flex items-center min-w-0', sizeConfig.contentGap)}>
        {/* back button */}
        {backHref && (
          <MotionWrapper animationType="fadeLeft" delay={0.1} duration={0.3}>
            <Link href={backHref} className={sizeConfig.backButton}>
              <ArrowLeft className={sizeConfig.backIcon} />
            </Link>
          </MotionWrapper>
        )}

        {/* icon and vertical divider */}
        {icon && (
          <div className="flex items-center">
            {/* icon fade left */}
            <MotionWrapper
              animationType="fadeLeft"
              delay={0.2}
              duration={0.3}
              className={sizeConfig.iconBox}
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
              <div className={sizeConfig.divider} />
            </MotionWrapper>
          </div>
        )}

        {/* right section fade right */}
        <MotionWrapper
          animationType="fadeRight"
          delay={0.3}
          duration={0.4}
          className="min-w-0 space-y-0.5"
        >
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className={sizeConfig.title}>{title}</h1>
            {badge && <div>{badge}</div>}
          </div>
          {subtitle && <div className={sizeConfig.subtitle}>{subtitle}</div>}
        </MotionWrapper>
      </div>

      {/* action buttons and/or close button with staggered fade up */}
      {(actionList.length > 0 || onClose) && (
        <div className={cn('flex items-start shrink-0 flex-wrap', sizeConfig.actionsGap)}>
          {actionList.map((action, index) => (
            <MotionWrapper
              key={index}
              animationType="fadeUp"
              delay={0.3 + index * 0.1}
              duration={0.3}
            >
              {action}
            </MotionWrapper>
          ))}
          {onClose && (
            <MotionWrapper
              animationType="fadeUp"
              delay={0.3 + actionList.length * 0.1}
              duration={0.3}
            >
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  'aspect-square flex items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors duration-200 cursor-pointer outline-none shrink-0',
                  sizeConfig.closeBtn
                )}
                title="Close"
              >
                <X className={sizeConfig.closeIcon} />
              </button>
            </MotionWrapper>
          )}
        </div>
      )}
    </div>
  );
};
