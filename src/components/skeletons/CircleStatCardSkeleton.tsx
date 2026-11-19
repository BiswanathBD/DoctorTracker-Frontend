'use client';

import React from 'react';
import { Card, Badge, Skeleton } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface CircleStatCardSkeletonProps {
  title?: string;
  icon?: React.ReactNode;
  activeColor?: string;
  sublabel?: string;
  badgeText?: string;
  badgeVariant?: 'primary' | 'secondary' | 'success' | 'warning' | 'outline';
  className?: string;
}

export const CircleStatCardSkeleton: React.FC<CircleStatCardSkeletonProps> = ({
  title = 'METRIC',
  icon,
  activeColor = '#198dc7',
  sublabel = 'ACTIVE',
  badgeText = 'Active',
  badgeVariant = 'primary',
  className,
}) => {
  return (
    <Card
      className={cn(
        'relative overflow-hidden p-5 flex flex-col justify-between h-full border-border/70',
        className
      )}
    >
      {/* subtle ambient background glow matching card color */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 w-28 h-28 rounded-full blur-2xl opacity-20"
        style={{ backgroundColor: activeColor }}
      />

      {/* card top section */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${activeColor}15` }}
            >
              {icon || <Skeleton className="w-3.5 h-3.5 rounded" />}
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {title}
            </span>
          </div>

          <div className="pt-1 flex items-baseline gap-2">
            <div
              className="h-8 w-20 rounded-lg animate-pulse"
              style={{ backgroundColor: `${activeColor}20` }}
            />
          </div>
        </div>

        {/* circle progress / colored donut skeleton matching exact view */}
        <div className="relative shrink-0 w-17 h-17 flex items-center justify-center">
          <svg width={68} height={68} className="overflow-visible animate-pulse">
            <circle
              cx={34}
              cy={34}
              r={29}
              fill="none"
              stroke={activeColor}
              strokeOpacity={0.15}
              strokeWidth={5}
            />
            <circle
              cx={34}
              cy={34}
              r={29}
              fill="none"
              stroke={activeColor}
              strokeWidth={5.5}
              strokeDasharray="135 185"
              strokeLinecap="round"
              transform="rotate(-90 34 34)"
            />
          </svg>

          {/* inner circle center content with real contextual sublabel & colored percent placeholder */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <div
              className="h-3 w-7 rounded animate-pulse"
              style={{ backgroundColor: `${activeColor}30` }}
            />
            <span
              className="text-[7px] font-bold uppercase tracking-wider leading-none mt-1"
              style={{ color: activeColor }}
            >
              {sublabel}
            </span>
          </div>
        </div>
      </div>

      {/* middle sparkline & insight */}
      <div className="py-2.5 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <div
            className="h-3.5 w-3/4 rounded animate-pulse"
            style={{ backgroundColor: `${activeColor}15` }}
          />
        </div>

        {/* 7-day mini sparkline visual with the exact activeColor */}
        <div className="shrink-0 flex items-center">
          <svg
            width={72}
            height={26}
            viewBox="0 0 72 26"
            className="overflow-visible opacity-75 animate-pulse"
          >
            <path
              d="M 2 20 C 14 20, 20 8, 36 12 C 52 16, 58 4, 70 8"
              fill="none"
              stroke={activeColor}
              strokeWidth={1.75}
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* card bottom section */}
      <div className="pt-2.5 border-t border-border/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <div
            className="h-3 w-24 rounded animate-pulse"
            style={{ backgroundColor: `${activeColor}18` }}
          />
        </div>

        <Badge
          variant={badgeVariant}
          className="text-[10px] py-0.5 px-2 font-semibold shrink-0 whitespace-nowrap opacity-75"
        >
          {badgeText}
        </Badge>
      </div>
    </Card>
  );
};

export default CircleStatCardSkeleton;
