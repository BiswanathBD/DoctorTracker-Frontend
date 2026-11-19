import React from 'react';
import { Users } from 'lucide-react';

export interface DoctorPatientRosterSkeletonProps {
  count?: number;
}

export const DoctorPatientRosterSkeleton: React.FC<DoctorPatientRosterSkeletonProps> = ({
  count = 2,
}) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: Math.max(1, Math.min(3, count)) }).map((_, i) => (
        <div
          key={i}
          className="p-2.5 sm:p-3 rounded-2xl bg-secondary/30 border border-secondary/25 shadow-xs animate-pulse"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-white/50" />
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="h-4 bg-white/30 rounded-md w-28" />
                <div className="flex items-center gap-2">
                  <div className="w-16 h-4 bg-warning/40 rounded-md" />
                  <div className="h-3 bg-white/20 rounded-md w-16" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="w-16 h-7 rounded-xl bg-white/30" />
              <div className="w-7 h-7 rounded-full bg-destructive/30" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
