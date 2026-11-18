'use client';

import React from 'react';
import { Card } from '@/components/ui';
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

export interface DoctorCardSkeletonProps {
  count?: number;
}

export const DoctorCardSkeleton: React.FC = () => {
  return (
    <Card className="relative overflow-hidden p-5 flex flex-col justify-between h-full space-y-4 border border-primary/25 bg-gradient-to-br from-primary/5 via-card to-secondary/5 animate-pulse shadow-sm">
      {/* background glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/15 blur-2xl" />

      {/* header */}
      <div className="space-y-3 relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-primary/15 border-2 border-primary/30 flex items-center justify-center text-primary/50 shrink-0 shadow-xs">
              <Stethoscope className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="h-4 bg-primary/25 rounded-md w-36" />
              <div className="h-4.5 w-24 bg-primary/15 border border-primary/25 rounded-full flex items-center px-2">
                <div className="h-2 bg-primary/35 rounded-full w-14" />
              </div>
            </div>
          </div>

          {/* actions */}
          <div className="flex items-center gap-1 shrink-0">
            <div className="p-1.5 rounded-lg bg-muted/60 text-muted-foreground/60">
              <Edit2 className="w-3.5 h-3.5" />
            </div>
            <div className="p-1.5 rounded-lg bg-destructive/15 text-destructive">
              <Trash2 className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* hospital */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/40 border border-primary/20">
          <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
          <div className="h-3 bg-primary/20 rounded w-44" />
        </div>

        {/* contact info */}
        <div className="space-y-2 pt-1 text-xs">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-secondary shrink-0" />
            <div className="h-3 bg-secondary/20 rounded w-32" />
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
            <div className="h-3 bg-primary/20 rounded w-40" />
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <Calendar className="w-3 h-3 text-muted-foreground/70 shrink-0" />
            <div className="h-2.5 bg-muted-foreground/20 rounded w-28" />
          </div>
        </div>
      </div>

      {/* footer */}
      <div className="pt-3 border-t border-border/80 flex items-center justify-between gap-2 relative">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/15 border border-secondary/25 text-secondary text-xs">
          <Users className="w-3.5 h-3.5" />
          <div className="h-2.5 bg-secondary/35 rounded w-16" />
        </div>

        <div className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs">
          <div className="h-2.5 bg-primary/40 rounded w-12" />
          <ChevronRight className="w-3 h-3" />
        </div>
      </div>
    </Card>
  );
};

export const DoctorSkeletonGrid: React.FC<DoctorCardSkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <DoctorCardSkeleton key={i} />
      ))}
    </div>
  );
};
