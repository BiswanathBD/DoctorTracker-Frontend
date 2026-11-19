import React from 'react';
import { Card, Skeleton } from '@/components/ui';
import { Users, HeartPulse, Stethoscope, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PatientCardSkeletonProps {
  count?: number;
  animated?: boolean;
}

export const PatientCardSkeleton: React.FC<{ animated?: boolean }> = ({ animated = true }) => {
  return (
    <Card
      className={cn(
        'relative overflow-hidden p-5 flex flex-col justify-between h-full space-y-4 border border-secondary/20 bg-card/60 backdrop-blur-md shadow-xs transition-opacity duration-300',
        animated && 'shimmer-active',
        !animated && 'opacity-70'
      )}
    >
      {/* ambient colorful soft glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-secondary/10 blur-2xl" />

      {/* top section: avatar, name, condition, demographics, top actions */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* patient avatar skeleton */}
            <div className="w-12 h-12 rounded-2xl bg-secondary/12 border border-secondary/25 flex items-center justify-center text-secondary/60 shrink-0 shadow-2xs">
              <Users className={cn('w-6 h-6', animated && 'animate-pulse text-secondary/70')} />
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <Skeleton animated={animated} className="h-4 w-36 rounded-md bg-foreground/15" />
              <div className="flex items-center gap-1.5 flex-wrap">
                <div className="h-5 w-24 bg-warning/10 border border-warning/20 rounded-full flex items-center gap-1 px-2 text-warning/60">
                  <HeartPulse className="w-2.5 h-2.5" />
                  <Skeleton animated={animated} className="h-2 w-12 rounded-full bg-warning/30" />
                </div>
                <Skeleton animated={animated} className="h-4 w-14 rounded-md bg-muted-foreground/15" />
              </div>
            </div>
          </div>

          {/* top actions placeholder */}
          <div className="flex items-center gap-1 shrink-0">
            <div className="w-6 h-6 rounded-lg bg-muted/30" />
            <div className="w-6 h-6 rounded-lg bg-destructive/10" />
          </div>
        </div>

        {/* attending specialist banner */}
        <div className="p-3 rounded-2xl bg-muted/30 border border-border/50 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-secondary/70 font-semibold flex items-center gap-1">
              <Stethoscope className="w-3 h-3 text-secondary/70" />
              Attending Doctor
            </span>
            <Skeleton animated={animated} className="h-2.5 w-18 rounded bg-muted-foreground/15" />
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-secondary/12 border border-secondary/20 shrink-0 flex items-center justify-center text-secondary/80 text-[10px] font-bold">
              Dr
            </div>
            <div className="space-y-1 flex-1 min-w-0">
              <Skeleton animated={animated} className="h-3 w-28 rounded bg-secondary/25" />
              <Skeleton animated={animated} className="h-2 w-20 rounded bg-muted-foreground/15" />
            </div>
          </div>
        </div>

        {/* contact details */}
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-secondary/70 shrink-0" />
            <Skeleton animated={animated} className="h-2.5 w-28 rounded bg-muted-foreground/20" />
          </div>
        </div>
      </div>

      {/* bottom footer */}
      <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2 relative z-10">
        <Skeleton animated={animated} className="h-3 w-24 rounded bg-muted-foreground/20" />
        <Skeleton animated={animated} className="h-6 w-20 rounded-full bg-secondary/15" />
      </div>
    </Card>
  );
};

export const PatientSkeletonGrid: React.FC<PatientCardSkeletonProps> = ({
  count = 6,
  animated = true,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <PatientCardSkeleton key={i} animated={animated} />
      ))}
    </div>
  );
};
