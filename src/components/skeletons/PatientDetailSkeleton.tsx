import React from 'react';
import { HeartPulse, Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';

export const PatientDetailSkeleton: React.FC<{ animated?: boolean }> = ({ animated = true }) => {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* scrollable body */}
      <div className="flex-1 overflow-y-auto no-scrollbar scrollbar-none p-6 space-y-5">
        {/* full colored gradient top card */}
        <div
          className={cn(
            'relative rounded-3xl bg-linear-to-br from-secondary/80 to-secondary-hover p-5 space-y-4 shadow-xl overflow-hidden text-secondary-foreground',
            animated && 'animate-pulse'
          )}
        >
          <div className="flex items-start gap-4">
            {/* avatar skeleton */}
            <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center shrink-0">
              <HeartPulse className="w-9 h-9 text-white/50" />
            </div>

            {/* details */}
            <div className="space-y-2 flex-1 min-w-0 pt-1">
              <div className="h-5 bg-white/30 rounded-md w-40" />
              <div className="flex items-center gap-1.5 flex-wrap">
                <div className="h-4 bg-white/20 rounded-full w-14" />
                <div className="h-4 bg-white/20 rounded-full w-16" />
                <div className="h-4 bg-white/20 rounded-full w-20" />
              </div>
            </div>
          </div>

          {/* status banner */}
          <div className="p-3 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-between">
            <div className="h-4 bg-white/20 rounded-md w-28" />
            <div className="h-5 bg-white/25 rounded-full w-20" />
          </div>
        </div>

        {/* attending specialist card */}
        <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-2.5">
          <div className="h-3.5 bg-foreground/15 rounded-md w-36" />
          <div className="p-3 rounded-2xl bg-primary/5 border border-primary/15 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
              <Stethoscope className="w-5 h-5 text-primary/40" />
            </div>
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="h-3.5 bg-foreground/15 rounded-md w-36" />
              <div className="h-2.5 bg-muted-foreground/20 rounded-md w-28" />
            </div>
          </div>
        </div>

        {/* contact channels */}
        <div className="space-y-2.5">
          <div className="h-3.5 bg-foreground/15 rounded-md w-36" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-card border border-border/70 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-secondary/10" />
              <div className="h-3 bg-foreground/15 rounded-md w-24" />
            </div>
            <div className="p-3 rounded-2xl bg-card border border-border/70 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10" />
              <div className="h-3 bg-foreground/15 rounded-md w-28" />
            </div>
          </div>
        </div>

        {/* admission & discharge timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/80 space-y-1.5">
            <div className="h-3 bg-muted-foreground/20 rounded-md w-20" />
            <div className="h-4 bg-foreground/20 rounded-md w-28" />
          </div>
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/80 space-y-1.5">
            <div className="h-3 bg-muted-foreground/20 rounded-md w-20" />
            <div className="h-4 bg-foreground/20 rounded-md w-28" />
          </div>
        </div>

        {/* clinical observations notes */}
        <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/80 space-y-2">
          <div className="h-3.5 bg-foreground/15 rounded-md w-32" />
          <div className="h-3 bg-muted-foreground/20 rounded-md w-full" />
        </div>
      </div>

      {/* fixed footer */}
      <div className="shrink-0 p-4 sm:p-5 px-5 sm:px-6 border-t border-border/80 flex items-center justify-end gap-2.5 bg-card/90">
        <div className="h-9 w-20 bg-secondary/15 border border-secondary/25 rounded-2xl" />
        <div className="h-9 w-16 bg-muted/60 border border-border/80 rounded-2xl" />
        <div className="h-9 w-20 bg-destructive/15 border border-destructive/25 rounded-2xl" />
      </div>
    </div>
  );
};
