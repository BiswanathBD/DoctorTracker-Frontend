'use client';

import React from 'react';
import { Card, Skeleton } from '@/components/ui';
import {
  Stethoscope,
  Building2,
  Phone,
  Mail,
  Calendar,
  Users,
  ChevronRight,
  Edit2,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DoctorCardSkeletonProps {
  count?: number;
  animated?: boolean;
}

export const DoctorCardSkeleton: React.FC<{ animated?: boolean }> = ({ animated = true }) => {
  return (
    <Card
      className={cn(
        'relative overflow-hidden p-5 flex flex-col justify-between h-full space-y-4 border border-primary/20 bg-card/60 backdrop-blur-md shadow-xs transition-opacity duration-300',
        animated && 'shimmer-active',
        !animated && 'opacity-70'
      )}
    >
      {/* background soft glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />

      {/* header & specialist identity */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-primary/12 border border-primary/25 flex items-center justify-center text-primary/60 shrink-0 shadow-2xs">
              <Stethoscope className={cn('w-6 h-6', animated && 'animate-pulse text-primary/70')} />
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <Skeleton animated={animated} className="h-4 w-36 rounded-md bg-foreground/15" />
              <div className="h-5 w-24 bg-primary/10 border border-primary/20 rounded-full flex items-center px-2">
                <Skeleton animated={animated} className="h-2 w-14 rounded-full bg-primary/30" />
              </div>
            </div>
          </div>

          {/* actions */}
          <div className="flex items-center gap-1 shrink-0">
            <div className="p-1.5 rounded-lg bg-muted/40 text-muted-foreground/40">
              <Edit2 className="w-3.5 h-3.5" />
            </div>
            <div className="p-1.5 rounded-lg bg-destructive/10 text-destructive/50">
              <Trash2 className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* hospital */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/30 border border-border/50">
          <Building2 className="w-3.5 h-3.5 text-primary/70 shrink-0" />
          <Skeleton animated={animated} className="h-3 w-40 rounded bg-muted-foreground/20" />
        </div>

        {/* contact info */}
        <div className="space-y-2 pt-1 text-xs">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-secondary/70 shrink-0" />
            <Skeleton animated={animated} className="h-2.5 w-28 rounded bg-muted-foreground/20" />
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-primary/70 shrink-0" />
            <Skeleton animated={animated} className="h-2.5 w-36 rounded bg-muted-foreground/20" />
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <Calendar className="w-3 h-3 text-muted-foreground/50 shrink-0" />
            <Skeleton animated={animated} className="h-2 w-24 rounded bg-muted-foreground/15" />
          </div>
        </div>
      </div>

      {/* footer */}
      <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs">
          <Users className="w-3.5 h-3.5 text-secondary/70" />
          <Skeleton animated={animated} className="h-2.5 w-14 rounded bg-secondary/30" />
        </div>

        <div className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-primary/15 border border-primary/25 text-primary text-xs">
          <Skeleton animated={animated} className="h-2.5 w-12 rounded bg-primary/35" />
          <ChevronRight className="w-3 h-3 text-primary/60" />
        </div>
      </div>
    </Card>
  );
};

export const DoctorSkeletonGrid: React.FC<DoctorCardSkeletonProps> = ({
  count = 6,
  animated = true,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <DoctorCardSkeleton key={i} animated={animated} />
      ))}
    </div>
  );
};
