'use client';

import React from 'react';
import { Skeleton } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface DoctorWorkloadSkeletonProps {
  className?: string;
  animated?: boolean;
}

export const DoctorWorkloadSkeleton: React.FC<DoctorWorkloadSkeletonProps> = ({
  className,
  animated = true,
}) => {
  return (
    <div className={cn('space-y-2.5 w-full h-full flex flex-col justify-between py-1', className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="p-3.5 rounded-2xl border border-border/30 bg-card/40 flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Avatar circle */}
            <Skeleton animated={animated} className="w-9 h-9 rounded-full shrink-0" />
            {/* Name & Specialization / Hospital */}
            <div className="space-y-1.5 min-w-0 flex-1">
              <Skeleton animated={animated} className="h-4 w-36 rounded" />
              <Skeleton animated={animated} className="h-3 w-28 rounded" />
            </div>
          </div>

          {/* Large patient count skeleton */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            <Skeleton animated={animated} className="h-7 w-10 rounded-lg" />
            <Skeleton animated={animated} className="h-2.5 w-12 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DoctorWorkloadSkeleton;
