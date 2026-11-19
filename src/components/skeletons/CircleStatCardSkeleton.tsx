'use client';

import React from 'react';
import { Card, Skeleton } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface CircleStatCardSkeletonProps {
  title?: string;
  sublabel?: string;
  badgeText?: string;
  badgeVariant?: 'primary' | 'secondary' | 'success' | 'warning' | 'outline';
  icon?: React.ReactNode;
  activeColor?: string;
  animated?: boolean;
  className?: string;
}

export const CircleStatCardSkeleton: React.FC<CircleStatCardSkeletonProps> = ({
  icon,
  activeColor = '#198dc7',
  animated = true,
  className,
}) => {
  return (
    <Card
      className={cn(
        'relative overflow-hidden p-5 flex flex-col justify-between h-full border-border/50 bg-card/60 backdrop-blur-md',
        animated ? 'shimmer-active' : 'opacity-70',
        className
      )}
    >
      {/* soft ambient background glow matching card color (reduced opacity) */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 w-28 h-28 rounded-full blur-2xl opacity-10"
        style={{ backgroundColor: activeColor }}
      />

      {/* card top section */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 opacity-75"
              style={{ backgroundColor: `${activeColor}15` }}
            >
              {icon || <Skeleton animated={animated} className="w-3.5 h-3.5 rounded" />}
            </div>
            <Skeleton animated={animated} className="h-3 w-20 rounded" />
          </div>

          <div className="pt-1 flex items-baseline gap-2">
            <div
              className={cn(
                'h-8 w-20 rounded-lg',
                animated ? 'animate-pulse' : 'opacity-60'
              )}
              style={{ backgroundColor: `${activeColor}15` }}
            />
          </div>
        </div>

        {/* circle progress / colored donut skeleton */}
        <div className="relative shrink-0 w-17 h-17 flex items-center justify-center">
          <svg
            width={68}
            height={68}
            className={cn('overflow-visible', animated && 'animate-pulse')}
          >
            <circle
              cx={34}
              cy={34}
              r={29}
              fill="none"
              stroke={activeColor}
              strokeOpacity={0.1}
              strokeWidth={4.5}
            />
            <circle
              cx={34}
              cy={34}
              r={29}
              fill="none"
              stroke={activeColor}
              strokeOpacity={0.3}
              strokeWidth={5}
              strokeDasharray="130 185"
              strokeLinecap="round"
              transform="rotate(-90 34 34)"
            />
          </svg>

          {/* inner circle center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <div
              className={cn(
                'h-2.5 w-6 rounded',
                animated ? 'animate-pulse' : 'opacity-60'
              )}
              style={{ backgroundColor: `${activeColor}20` }}
            />
            <div
              className={cn(
                'h-1.5 w-4 rounded mt-1',
                animated ? 'animate-pulse' : 'opacity-50'
              )}
              style={{ backgroundColor: `${activeColor}15` }}
            />
          </div>
        </div>
      </div>

      {/* middle sparkline & insight */}
      <div className="py-2.5 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <div
            className={cn(
              'h-3.5 w-3/4 rounded',
              animated ? 'animate-pulse' : 'opacity-50'
            )}
            style={{ backgroundColor: `${activeColor}12` }}
          />
        </div>

        {/* 7-day mini sparkline visual */}
        <div className="shrink-0 flex items-center">
          <svg
            width={72}
            height={26}
            viewBox="0 0 72 26"
            className={cn(
              'overflow-visible opacity-50',
              animated && 'animate-pulse'
            )}
          >
            <path
              d="M 2 20 C 14 20, 20 8, 36 12 C 52 16, 58 4, 70 8"
              fill="none"
              stroke={activeColor}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* card bottom section */}
      <div className="pt-2.5 border-t border-border/40 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <div
            className={cn(
              'h-3 w-24 rounded',
              animated ? 'animate-pulse' : 'opacity-50'
            )}
            style={{ backgroundColor: `${activeColor}12` }}
          />
        </div>

        <Skeleton animated={animated} className="h-4 w-14 rounded-full" />
      </div>
    </Card>
  );
};

export default CircleStatCardSkeleton;
