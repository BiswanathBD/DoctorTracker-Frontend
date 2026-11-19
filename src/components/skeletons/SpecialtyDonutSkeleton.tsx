'use client';

import React from 'react';
import { Skeleton } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface SpecialtyDonutSkeletonProps {
  className?: string;
  animated?: boolean;
}

export const SpecialtyDonutSkeleton: React.FC<SpecialtyDonutSkeletonProps> = ({
  className,
  animated = true,
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-between gap-5 py-2 w-full h-full', className)}>
      {/* Top: Donut circle skeleton */}
      <div className="relative shrink-0 w-48 h-48 flex items-center justify-center mx-auto">
        <svg
          width={192}
          height={192}
          className={cn('overflow-visible', animated && 'animate-pulse')}
        >
          <circle
            cx={96}
            cy={96}
            r={76}
            fill="none"
            stroke="currentColor"
            strokeWidth={20}
            className="text-muted-foreground/8"
          />
          <circle
            cx={96}
            cy={96}
            r={76}
            fill="none"
            stroke="#198dc7"
            strokeOpacity={0.18}
            strokeWidth={20}
            strokeDasharray="180 477"
            strokeLinecap="round"
            transform="rotate(-90 96 96)"
          />
          <circle
            cx={96}
            cy={96}
            r={76}
            fill="none"
            stroke="#1ac3b5"
            strokeOpacity={0.18}
            strokeWidth={20}
            strokeDasharray="120 477"
            strokeDashoffset="-190"
            strokeLinecap="round"
            transform="rotate(-90 96 96)"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <Skeleton animated={animated} className="h-7 w-14 rounded-lg" />
          <Skeleton animated={animated} className="h-2.5 w-16 rounded mt-1.5" />
        </div>
      </div>

      {/* Bottom: Pills skeleton */}
      <div className="w-full flex flex-wrap items-center justify-center gap-2 pt-3 border-t border-border/40">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="px-3 py-1.5 rounded-full border border-border/30 bg-muted/15 flex items-center gap-2"
          >
            <div className="w-2.5 h-2.5 rounded-full shrink-0 bg-primary/20" />
            <Skeleton animated={animated} className="h-3 w-16 rounded" />
            <Skeleton animated={animated} className="h-3 w-8 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecialtyDonutSkeleton;
