import React from 'react';
import {
  Calendar,
  Users,
  Stethoscope,
  HeartPulse,
  UserCheck,
  TrendingUp,
  Activity,
  ShieldCheck,
} from 'lucide-react';
import type { TodaysReport, DashboardOverview } from '@/types/dashboard.types';
import type { DailyActivityItem } from './DailyActivityChart';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui';

export interface TodaysReportCardProps {
  report?: TodaysReport;
  todayTimelineItem?: DailyActivityItem;
  overview?: DashboardOverview;
  loading?: boolean;
  className?: string;
}

export const TodaysReportCard: React.FC<TodaysReportCardProps> = ({
  report,
  todayTimelineItem,
  overview,
  loading = false,
  className,
}) => {
  // Today's metrics from backend report or fallback to timeline point
  const admissionsToday = report?.newAdmissions ?? todayTimelineItem?.patients ?? 0;
  const doctorsToday = report?.newDoctors ?? todayTimelineItem?.doctors ?? 0;
  const releasedToday = report?.releasedToday ?? 0;
  const activeUnderCare = report?.activeUnderCare ?? overview?.activePatients ?? 0;
  const totalOperationsToday = admissionsToday + doctorsToday + releasedToday;

  // Active care occupancy percentage
  const occupancyPercent =
    report?.occupancyRate ?? overview?.activePatientPercent ?? (overview?.totalPatients ? 100 : 0);

  // Formatted today's date in clean user-friendly format
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  if (loading) {
    return (
      <div
        className={cn(
          'relative overflow-hidden p-5 sm:p-6 rounded-3xl bg-linear-to-b from-primary via-primary-hover to-secondary text-primary-foreground shadow-xl border border-primary-foreground/20 flex flex-col justify-between h-full space-y-4',
          className
        )}
      >
        {/* ambient background glows */}
        <div className="pointer-events-none absolute -top-12 -right-12 w-36 h-36 rounded-full bg-primary-foreground/20 blur-xl" />
        <div className="pointer-events-none absolute -bottom-10 right-0 w-44 h-44 rounded-full bg-secondary/40 blur-2xl" />

        {/* header skeleton */}
        <div className="relative z-10 flex items-center gap-3 pb-3 border-b border-primary-foreground/15">
          <div className="w-9 h-9 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
            <Activity className="w-4.5 h-4.5 text-primary-foreground/40 animate-pulse" />
          </div>
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-4 w-28 rounded bg-primary-foreground/30" />
            <Skeleton className="h-3 w-36 rounded bg-primary-foreground/20" />
          </div>
        </div>

        {/* minimal hero summary skeleton */}
        <div className="relative z-10 p-3 rounded-2xl bg-primary-foreground/15 border border-primary-foreground/20 flex items-center justify-between">
          <Skeleton className="h-4 w-36 rounded bg-primary-foreground/30" />
          <Skeleton className="h-5 w-16 rounded bg-primary-foreground/35" />
        </div>

        {/* 2x2 metric pills skeleton (data left, icon right) */}
        <div className="relative z-10 grid grid-cols-2 gap-2.5 sm:gap-3 flex-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-3 sm:p-3.5 rounded-2xl bg-primary-foreground/12 border border-primary-foreground/15 flex items-center justify-between gap-3"
            >
              <div className="space-y-1 flex-1">
                <Skeleton className="h-5 w-10 rounded bg-primary-foreground/30" />
                <Skeleton className="h-3 w-20 rounded bg-primary-foreground/20" />
              </div>
              <Skeleton className="w-8 h-8 rounded-xl bg-primary-foreground/25 shrink-0" />
            </div>
          ))}
        </div>

        {/* thin bottom telemetry skeleton */}
        <div className="relative z-10 pt-3 border-t border-primary-foreground/15 space-y-2">
          <Skeleton className="h-1.5 w-full rounded-full bg-primary-foreground/20" />
          <div className="flex justify-between">
            <Skeleton className="h-3 w-28 rounded bg-primary-foreground/25" />
            <Skeleton className="h-3 w-20 rounded bg-primary-foreground/25" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden p-5 sm:p-6 rounded-3xl bg-linear-to-b from-primary via-primary-hover to-secondary text-primary-foreground shadow-xl border border-primary-foreground/20 flex flex-col justify-between h-full space-y-4 transition-all',
        className
      )}
    >
      {/* Ambient background glows matching sidebar & hero card */}
      <div className="pointer-events-none absolute -top-12 -right-12 w-36 h-36 rounded-full bg-primary-foreground/20 blur-xl" />
      <div className="pointer-events-none absolute top-1/2 -left-12 w-36 h-36 rounded-full bg-primary-foreground/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 right-0 w-44 h-44 rounded-full bg-secondary/40 blur-2xl" />

      {/* Header: Clean & Minimal */}
      <div className="relative z-10 flex items-center gap-3 pb-3 border-b border-primary-foreground/20">
        <div className="w-9 h-9 rounded-2xl bg-primary-foreground/20 border border-primary-foreground/30 flex items-center justify-center text-primary-foreground shrink-0 shadow-sm backdrop-blur-md">
          <Calendar className="w-4.5 h-4.5" />
        </div>
        <div className="min-w-0 space-y-0.5">
          <h3 className="text-base font-bold text-primary-foreground">
            Today&apos;s Report
          </h3>
          <p className="text-xs font-medium text-primary-foreground/85 truncate">
            {todayFormatted}
          </p>
        </div>
      </div>

      {/* Minimal Hero Summary: Today's Total Operations */}
      <div className="relative z-10 p-3 sm:p-3.5 rounded-2xl bg-primary-foreground/15 hover:bg-primary-foreground/20 border border-primary-foreground/25 backdrop-blur-md shadow-xs flex items-center justify-between gap-3 transition-all">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-primary-foreground/20 flex items-center justify-center text-primary-foreground shrink-0">
            <Activity className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-xs font-semibold text-primary-foreground truncate">
            Today&apos;s Total Operations
          </span>
        </div>

        <span className="text-sm sm:text-base font-bold text-primary-foreground shrink-0">
          {totalOperationsToday} {totalOperationsToday === 1 ? 'Action' : 'Actions'}
        </span>
      </div>

      {/* 2x2 Metric Breakdown Grid: Data on Left, Icon on Right in Same Line */}
      <div className="relative z-10 grid grid-cols-2 gap-2.5 sm:gap-3 flex-1">
        {/* 1. New Admissions Today */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-primary-foreground/12 hover:bg-primary-foreground/20 border border-primary-foreground/20 hover:border-primary-foreground/35 backdrop-blur-md transition-all flex items-center justify-between gap-2.5">
          <div className="min-w-0">
            <span className="text-xl font-bold text-primary-foreground block leading-none">
              {admissionsToday}
            </span>
            <p className="text-xs font-medium text-primary-foreground/85 truncate mt-1">
              Patients Admitted
            </p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-primary-foreground/20 flex items-center justify-center text-primary-foreground shrink-0 shadow-2xs">
            <Users className="w-4 h-4" />
          </div>
        </div>

        {/* 2. Discharged Today */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-primary-foreground/12 hover:bg-primary-foreground/20 border border-primary-foreground/20 hover:border-primary-foreground/35 backdrop-blur-md transition-all flex items-center justify-between gap-2.5">
          <div className="min-w-0">
            <span className="text-xl font-bold text-primary-foreground block leading-none">
              {releasedToday}
            </span>
            <p className="text-xs font-medium text-primary-foreground/85 truncate mt-1">
              Patients Released
            </p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-primary-foreground/20 flex items-center justify-center text-primary-foreground shrink-0 shadow-2xs">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>

        {/* 3. New Doctors Added Today */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-primary-foreground/12 hover:bg-primary-foreground/20 border border-primary-foreground/20 hover:border-primary-foreground/35 backdrop-blur-md transition-all flex items-center justify-between gap-2.5">
          <div className="min-w-0">
            <span className="text-xl font-bold text-primary-foreground block leading-none">
              {doctorsToday}
            </span>
            <p className="text-xs font-medium text-primary-foreground/85 truncate mt-1">
              Doctors Added
            </p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-primary-foreground/20 flex items-center justify-center text-primary-foreground shrink-0 shadow-2xs">
            <Stethoscope className="w-4 h-4" />
          </div>
        </div>

        {/* 4. Active Patients Under Care */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-primary-foreground/12 hover:bg-primary-foreground/20 border border-primary-foreground/20 hover:border-primary-foreground/35 backdrop-blur-md transition-all flex items-center justify-between gap-2.5">
          <div className="min-w-0">
            <span className="text-xl font-bold text-primary-foreground block leading-none">
              {activeUnderCare}
            </span>
            <p className="text-xs font-medium text-primary-foreground/85 truncate mt-1">
              Currently in Care
            </p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-primary-foreground/20 flex items-center justify-center text-primary-foreground shrink-0 shadow-2xs">
            <HeartPulse className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Bottom Capacity & Status Strip: Thin Line & Highly Visible Colors */}
      <div className="relative z-10 pt-3 border-t border-primary-foreground/20 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-primary-foreground flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-primary-foreground" />
            Hospital Care Capacity
          </span>
          <span className="font-bold text-primary-foreground">
            {occupancyPercent}%
          </span>
        </div>

        {/* Thin visual progress line */}
        <div className="w-full h-1.5 rounded-full bg-primary-foreground/20 overflow-hidden">
          <div
            style={{ width: `${Math.min(100, Math.max(5, occupancyPercent))}%` }}
            className="h-full rounded-full bg-primary-foreground transition-all duration-500 shadow-xs"
          />
        </div>

        <div className="flex items-center justify-between text-xs text-primary-foreground/90 pt-0.5">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-primary-foreground" />
            System Active
          </span>
          <span className="font-semibold text-primary-foreground">
            {overview?.ratioText ? `Doctor Ratio: ${overview.ratioText}` : 'Optimal'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TodaysReportCard;
