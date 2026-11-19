import React from 'react';
import { Card, Skeleton } from '@/components/ui';
import { DoctorSkeletonGrid } from './DoctorCardSkeleton';
import { Stethoscope, SlidersHorizontal, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DoctorsPageSkeletonProps {
  animated?: boolean;
  className?: string;
}

export const DoctorsPageSkeleton: React.FC<DoctorsPageSkeletonProps> = ({
  animated = true,
  className,
}) => {
  return (
    <div
      className={cn(
        'w-full space-y-7 pb-12 transition-opacity duration-300',
        !animated && 'opacity-70',
        className
      )}
    >
      {/* 1. Page Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-3xl bg-card/40 backdrop-blur-md border border-border/50">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Stethoscope
              size={32}
              className={cn('text-primary/60', animated && 'animate-pulse')}
              strokeWidth={1.2}
            />
          </div>
          <div className="space-y-1.5">
            <Skeleton animated={animated} className="h-6 w-48 sm:w-60 rounded-lg" />
            <Skeleton animated={animated} className="h-3.5 w-64 sm:w-96 rounded" />
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="h-10 w-36 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center gap-2 px-3 text-primary/70">
            <Plus className="w-4 h-4" />
            <Skeleton animated={animated} className="h-3.5 w-20 rounded bg-primary/30" />
          </div>
        </div>
      </div>

      {/* 2. Modern Filter & Search Station Skeleton */}
      <Card
        className={cn(
          'p-4 sm:p-5 space-y-4 border border-border/80 bg-card/60 backdrop-blur-xl shadow-xs',
          animated && 'shimmer-active'
        )}
      >
        {/* Header row: title, count and search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary/70 flex items-center justify-center font-bold">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </div>
            <Skeleton animated={animated} className="h-3.5 w-40 rounded" />
            <Skeleton animated={animated} className="h-5 w-24 rounded-full" />
          </div>

          <div className="w-full md:w-80 h-10 rounded-2xl bg-muted/40 border border-border/60 px-3.5 flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-primary/40 shrink-0" />
            <Skeleton animated={animated} className="h-3 w-48 rounded" />
          </div>
        </div>

        {/* Filter dropdowns row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <Skeleton animated={animated} className="h-10 rounded-2xl bg-muted/40" />
          <Skeleton animated={animated} className="h-10 rounded-2xl bg-muted/40" />
          <Skeleton animated={animated} className="h-10 rounded-2xl bg-muted/40" />
          <Skeleton animated={animated} className="h-10 rounded-2xl bg-muted/40" />
        </div>
      </Card>

      {/* 3. Doctors Card Grid Skeleton */}
      <DoctorSkeletonGrid count={6} animated={animated} />
    </div>
  );
};

export default DoctorsPageSkeleton;
