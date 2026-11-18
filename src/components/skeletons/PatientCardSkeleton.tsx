'use client';

import React from 'react';
import { Card } from '@/components/ui';
import {
  Users,
  HeartPulse,
  Stethoscope,
  Phone,
  Calendar,
  Eye,
  Edit2,
  Trash2,
} from 'lucide-react';

export interface PatientCardSkeletonProps {
  count?: number;
}

export const PatientCardSkeleton: React.FC = () => {
  return (
    <Card className="relative overflow-hidden p-5 flex flex-col justify-between h-full space-y-4 border border-secondary/25 bg-gradient-to-br from-secondary/5 via-card to-primary/5 animate-pulse shadow-sm">
      {/* ambient colorful glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-secondary/15 blur-2xl" />

      {/* top section: avatar, name, condition, demographics */}
      <div className="space-y-3 relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* colorful patient avatar */}
            <div className="w-12 h-12 rounded-2xl bg-secondary/15 border-2 border-secondary/30 flex items-center justify-center text-secondary/50 shrink-0 shadow-xs">
              <Users className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              {/* patient name bar */}
              <div className="h-4 bg-secondary/25 rounded-md w-36" />
              {/* condition & age chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <div className="h-4.5 w-24 bg-warning/20 border border-warning/30 rounded-full flex items-center gap-1 px-2 text-warning/60">
                  <HeartPulse className="w-2.5 h-2.5" />
                  <div className="h-2 bg-warning/40 rounded-full w-12" />
                </div>
                <div className="h-4 w-16 bg-muted/60 rounded-md" />
              </div>
            </div>
          </div>
        </div>

        {/* attending specialist banner */}
        <div className="p-3 rounded-2xl bg-muted/40 border border-primary/20 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-primary/70 font-semibold flex items-center gap-1">
              <Stethoscope className="w-3 h-3 text-primary" />
              Attending Doctor
            </span>
            <div className="h-2.5 bg-muted rounded w-20" />
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary/15 border border-primary/25 shrink-0 flex items-center justify-center text-primary text-[10px] font-bold">
              Dr
            </div>
            <div className="space-y-1 flex-1 min-w-0">
              <div className="h-3 bg-primary/20 rounded w-28" />
              <div className="h-2 bg-primary/15 rounded w-20" />
            </div>
          </div>
        </div>

        {/* contact and admission date */}
        <div className="space-y-1.5 pt-1 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-secondary shrink-0" />
              <div className="h-2.5 bg-secondary/20 rounded w-28" />
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-muted-foreground/60" />
              <div className="h-2.5 bg-muted rounded w-16" />
            </div>
          </div>
        </div>
      </div>

      {/* bottom action station */}
      <div className="pt-3 border-t border-border/80 flex items-center justify-between gap-2 relative">
        <div className="inline-flex items-center gap-1 text-xs text-secondary/70 font-bold">
          <Eye className="w-3.5 h-3.5" />
          <div className="h-2.5 bg-secondary/25 rounded w-18" />
        </div>

        <div className="flex items-center gap-1 opacity-40">
          <div className="p-1.5 rounded-lg bg-muted text-muted-foreground">
            <Edit2 className="w-3.5 h-3.5" />
          </div>
          <div className="p-1.5 rounded-lg bg-destructive/10 text-destructive">
            <Trash2 className="w-3.5 h-3.5" />
          </div>
        </div>
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
