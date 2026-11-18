'use client';

import React from 'react';
import { Card } from '@/components/ui';
import { Users, HeartPulse, Stethoscope, Phone } from 'lucide-react';

export interface PatientCardSkeletonProps {
  count?: number;
}

export const PatientCardSkeleton: React.FC = () => {
  return (
    <Card className="relative overflow-hidden p-5 flex flex-col justify-between h-full space-y-4 border border-secondary/25 bg-linear-to-br from-secondary/5 via-card to-primary/5 animate-pulse shadow-sm">
      {/* ambient colorful glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-secondary/15 blur-2xl" />

      {/* top section: avatar, name, condition, demographics, top actions */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* patient avatar skeleton */}
            <div className="w-12 h-12 rounded-2xl bg-secondary/15 border-2 border-secondary/30 flex items-center justify-center text-secondary/50 shrink-0 shadow-xs">
              <Users className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="h-4 bg-secondary/25 rounded-md w-36" />
              <div className="flex items-center gap-1.5 flex-wrap">
                <div className="h-4.5 w-24 bg-warning/20 border border-warning/30 rounded-full flex items-center gap-1 px-2 text-warning/60">
                  <HeartPulse className="w-2.5 h-2.5" />
                  <div className="h-2 bg-warning/40 rounded-full w-12" />
                </div>
                <div className="h-4 w-16 bg-muted/60 rounded-md" />
              </div>
            </div>
          </div>

          {/* top actions placeholder */}
          <div className="flex items-center gap-1 shrink-0">
            <div className="w-6 h-6 rounded-lg bg-muted/60" />
            <div className="w-6 h-6 rounded-lg bg-destructive/10" />
          </div>
        </div>

        {/* attending specialist banner */}
        <div className="p-3 rounded-2xl bg-muted/40 border border-border/70 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-secondary/70 font-semibold flex items-center gap-1">
              <Stethoscope className="w-3 h-3 text-secondary" />
              Attending Doctor
            </span>
            <div className="h-2.5 bg-muted rounded w-20" />
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-secondary/15 border border-secondary/25 shrink-0 flex items-center justify-center text-secondary text-[10px] font-bold">
              Dr
            </div>
            <div className="space-y-1 flex-1 min-w-0">
              <div className="h-3 bg-secondary/20 rounded w-28" />
              <div className="h-2 bg-secondary/15 rounded w-20" />
            </div>
          </div>
        </div>

        {/* contact details */}
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-secondary shrink-0" />
            <div className="h-2.5 bg-secondary/20 rounded w-28" />
          </div>
        </div>
      </div>

      {/* bottom footer */}
      <div className="pt-3 border-t border-border flex items-center justify-between gap-2 relative z-10">
        <div className="h-3 bg-muted/60 rounded w-28" />
        <div className="h-7 w-20 rounded-full bg-secondary/20" />
      </div>
    </Card>
  );
};

export const PatientSkeletonGrid: React.FC<PatientCardSkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <PatientCardSkeleton key={i} />
      ))}
    </div>
  );
};
