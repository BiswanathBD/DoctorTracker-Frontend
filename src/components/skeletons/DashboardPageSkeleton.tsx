'use client';

import React from 'react';
import { Card, Skeleton } from '@/components/ui';
import { CircleStatCardSkeleton } from './CircleStatCardSkeleton';
import { DailyActivityChartSkeleton } from './DailyActivityChartSkeleton';
import { DoctorWorkloadSkeleton } from './DoctorWorkloadSkeleton';
import { SpecialtyDonutSkeleton } from './SpecialtyDonutSkeleton';
import {
  Stethoscope,
  Users,
  Activity,
  UserRoundShield,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DashboardPageSkeletonProps {
  animated?: boolean;
  showHeader?: boolean;
  className?: string;
}

export const DashboardPageSkeleton: React.FC<DashboardPageSkeletonProps> = ({
  animated = true,
  showHeader = true,
  className,
}) => {
  return (
    <div
      className={cn(
        'w-full space-y-8 pb-12 transition-opacity duration-300',
        !animated && 'opacity-70',
        className
      )}
    >
      {/* 1. Page Header Skeleton */}
      {showHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-3xl bg-card/40 backdrop-blur-md border border-border/50">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <UserRoundShield
                size={32}
                className={cn('text-primary/60', animated && 'animate-pulse')}
                strokeWidth={1.2}
              />
            </div>
            <div className="space-y-1.5">
              <Skeleton animated={animated} className="h-6 w-48 sm:w-64 rounded-lg" />
              <Skeleton animated={animated} className="h-3.5 w-64 sm:w-96 rounded" />
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Skeleton animated={animated} className="h-10 w-28 rounded-xl" />
            <Skeleton animated={animated} className="h-10 w-32 rounded-xl" />
          </div>
        </div>
      )}

      {/* 2. Top Metric Cards (4 Circular Stat Skeletons) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <CircleStatCardSkeleton
          animated={animated}
          activeColor="#198dc7"
          icon={<Stethoscope className="w-3.5 h-3.5 text-primary/70" />}
        />
        <CircleStatCardSkeleton
          animated={animated}
          activeColor="#1ac3b5"
          icon={<Users className="w-3.5 h-3.5 text-secondary/70" />}
        />
        <CircleStatCardSkeleton
          animated={animated}
          activeColor="#10b981"
          icon={<Activity className="w-3.5 h-3.5 text-emerald-500/70" />}
        />
        <CircleStatCardSkeleton
          animated={animated}
          activeColor="#6366f1"
          icon={<Activity className="w-3.5 h-3.5 text-indigo-500/70" />}
        />
      </div>

      {/* 3. Daily Operations & Activity Timeline Skeleton Card */}
      <Card
        className={cn(
          'p-5 sm:p-6 space-y-6 border border-primary/15 bg-card/50 backdrop-blur-md shadow-xs',
          animated && 'shimmer-active'
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Activity className="w-4.5 h-4.5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Skeleton animated={animated} className="h-4 w-40 rounded" />
                <span className="w-2 h-2 rounded-full bg-accent/80 animate-ping" />
              </div>
              <Skeleton animated={animated} className="h-3 w-56 rounded bg-muted-foreground/20" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/40 border border-border/40">
              <div className="px-3 py-1 rounded-lg bg-card text-xs">
                <Skeleton animated={animated} className="h-3 w-10 rounded" />
              </div>
              <div className="px-3 py-1 rounded-lg text-xs">
                <Skeleton animated={animated} className="h-3 w-10 rounded" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <DailyActivityChartSkeleton animated={animated} />
        </div>
      </Card>

      {/* 4. Bottom Grid: Specialty Donut & Doctor Workload Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5">
          <SpecialtyDonutSkeleton animated={animated} />
        </div>
        <div className="lg:col-span-7">
          <DoctorWorkloadSkeleton animated={animated} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPageSkeleton;
