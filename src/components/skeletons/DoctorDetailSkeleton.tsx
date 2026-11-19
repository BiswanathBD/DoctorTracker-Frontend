import React from 'react';
import { Stethoscope, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export const DoctorDetailSkeleton: React.FC<{ animated?: boolean }> = ({ animated = true }) => {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* scrollable body */}
      <div className="flex-1 overflow-y-auto no-scrollbar scrollbar-none p-6 space-y-5">
        {/* full colored gradient top card */}
        <div
          className={cn(
            'relative rounded-3xl bg-linear-to-br from-primary/80 to-primary-hover p-5 space-y-4 shadow-xl overflow-hidden text-primary-foreground',
            animated && 'animate-pulse'
          )}
        >
          <div className="flex items-start gap-4">
            {/* avatar skeleton */}
            <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center shrink-0">
              <Stethoscope className="w-9 h-9 text-white/50" />
            </div>

            {/* details */}
            <div className="space-y-2 flex-1 min-w-0 pt-1">
              <div className="h-5 bg-white/30 rounded-md w-44" />
              <div className="h-4 bg-white/20 rounded-full w-28" />
              <div className="h-3 bg-white/20 rounded-md w-36" />
            </div>
          </div>

          {/* capacity stat banner */}
          <div className="p-3 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-between">
            <div className="h-4 bg-white/20 rounded-md w-32" />
            <div className="h-5 bg-white/25 rounded-full w-16" />
          </div>
        </div>

        {/* direct contact channels card */}
        <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-3">
          <div className="h-3.5 bg-foreground/15 rounded-md w-32" />
          <div className="space-y-2.5">
            <div className="flex items-center justify-between py-1 border-b border-border/40">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-secondary/10" />
                <div className="h-3 bg-foreground/15 rounded-md w-28" />
              </div>
              <div className="h-3 bg-secondary/20 rounded-md w-10" />
            </div>
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10" />
                <div className="h-3 bg-foreground/15 rounded-md w-36" />
              </div>
              <div className="h-3 bg-primary/20 rounded-md w-12" />
            </div>
          </div>
        </div>

        {/* clinical notes card */}
        <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/80 space-y-2">
          <div className="h-3.5 bg-foreground/15 rounded-md w-40" />
          <div className="h-3 bg-muted-foreground/20 rounded-md w-full" />
          <div className="h-3 bg-muted-foreground/20 rounded-md w-3/4" />
        </div>

        {/* patient roster card */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-foreground/20 rounded-md w-32" />
            <div className="h-7 bg-muted/60 border border-border/60 rounded-xl w-24" />
          </div>

          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-card border border-border/70 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-xl bg-secondary/15 flex items-center justify-center shrink-0">
                    <Users className="w-3.5 h-3.5 text-secondary/40" />
                  </div>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="h-3.5 bg-foreground/15 rounded-md w-24" />
                    <div className="h-2.5 bg-muted-foreground/20 rounded-md w-32" />
                  </div>
                </div>
                <div className="w-16 h-7 rounded-xl bg-secondary/10 border border-secondary/20" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* fixed footer */}
      <div className="shrink-0 p-4 sm:p-5 px-5 sm:px-6 border-t border-border/80 flex items-center justify-end gap-2.5 bg-card/90">
        <div className="h-9 w-16 bg-muted/60 border border-border/80 rounded-2xl" />
        <div className="h-9 w-20 bg-destructive/15 border border-destructive/25 rounded-2xl" />
      </div>
    </div>
  );
};
