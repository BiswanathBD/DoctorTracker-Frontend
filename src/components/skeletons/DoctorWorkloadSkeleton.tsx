'use client';

import React from 'react';
import { Skeleton } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface DoctorWorkloadSkeletonProps {
  className?: string;
  animated?: boolean;
}

const SKELETON_THEMES = [
  'bg-primary/5 border-primary/20',
  'bg-secondary/5 border-secondary/20',
  'bg-chart-3/5 border-chart-3/20',
  'bg-warning/5 border-warning/20',
  'bg-chart-5/5 border-chart-5/20',
  'bg-accent/5 border-accent/20',
];

export const DoctorWorkloadSkeleton: React.FC<DoctorWorkloadSkeletonProps> = ({
  className,
  animated = true,
}) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 w-full h-full py-0.5 content-between',
        className
      )}
    >
      {[1, 2, 3, 4, 5, 6].map((i, idx) => (
        <div
          key={i}
          className={cn(
            'p-3 sm:p-3.5 rounded-2xl border flex items-stretch justify-between gap-3 shadow-2xs',
            SKELETON_THEMES[idx % SKELETON_THEMES.length]
          )}
        >
          {/* Left Section Skeleton */}
          <div className="flex-1 min-w-0 flex flex-col justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <Skeleton animated={animated} className="w-10 h-10 rounded-2xl shrink-0 bg-muted-foreground/15" />
              <div className="space-y-1.5 min-w-0 flex-1">
                <Skeleton animated={animated} className="h-3.5 w-24 rounded bg-foreground/15" />
                <Skeleton animated={animated} className="h-3 w-16 rounded bg-muted-foreground/15" />
              </div>
            </div>

            <div className="space-y-1.5 pt-1.5 border-t border-border/30">
              <Skeleton animated={animated} className="h-3 w-24 rounded bg-muted-foreground/15" />
              <Skeleton animated={animated} className="h-1 w-full rounded-full bg-muted-foreground/10" />
            </div>
          </div>

          {/* Right Section: Full card height big number skeleton box */}
          <div className="w-16 sm:w-20 rounded-xl border border-border/30 bg-muted/20 flex flex-col items-center justify-center p-2 shrink-0 self-stretch gap-1">
            <Skeleton animated={animated} className="h-7 w-8 rounded-md bg-foreground/15" />
            <Skeleton animated={animated} className="h-2.5 w-12 rounded bg-muted-foreground/15" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DoctorWorkloadSkeleton;
