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
    <div className={cn('flex flex-col items-center justify-between gap-4 py-0.5 w-full h-full', className)}>
      {/* Top: Donut circle skeleton */}
      <div className="relative shrink-0 w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center mx-auto my-auto">
        <svg
          width={180}
          height={180}
          className={cn('overflow-visible', animated && 'animate-pulse')}
        >
          <circle
            cx={90}
            cy={90}
            r={72}
            fill="none"
            stroke="currentColor"
            strokeWidth={18}
            className="text-muted-foreground/8"
          />
          <circle
            cx={90}
            cy={90}
            r={72}
            fill="none"
            stroke="#198dc7"
            strokeOpacity={0.18}
            strokeWidth={18}
            strokeDasharray="160 452"
            strokeLinecap="round"
            transform="rotate(-90 90 90)"
          />
          <circle
            cx={90}
            cy={90}
            r={72}
            fill="none"
            stroke="#1ac3b5"
            strokeOpacity={0.18}
            strokeWidth={18}
            strokeDasharray="110 452"
            strokeDashoffset="-170"
            strokeLinecap="round"
            transform="rotate(-90 90 90)"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
          <div className="w-20 h-20 rounded-full bg-card/85 border border-border/40 flex flex-col items-center justify-center shadow-2xs">
            <Skeleton animated={animated} className="h-6 w-12 rounded-md" />
            <Skeleton animated={animated} className="h-2.5 w-14 rounded mt-1.5" />
          </div>
        </div>
      </div>

      {/* Bottom: 2-column grid skeleton */}
      <div className="grid grid-cols-2 gap-2 w-full pt-3 border-t border-border/50">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-2 sm:p-2.5 rounded-xl border border-border/40 bg-muted/15"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-2.5 h-2.5 rounded-full shrink-0 bg-primary/25" />
              <Skeleton animated={animated} className="h-3 w-16 rounded" />
            </div>
            <Skeleton animated={animated} className="h-3 w-8 rounded font-mono" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecialtyDonutSkeleton;
