import React from 'react';

export interface AssignListSkeletonProps {
  count?: number;
}

export const AssignListSkeleton: React.FC<AssignListSkeletonProps> = ({ count = 3 }) => {
  return (
    <div className="space-y-2 py-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-3 rounded-2xl bg-muted/30 border border-border/60 animate-pulse flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-muted" />
            <div className="space-y-1.5">
              <div className="w-28 h-3.5 bg-muted rounded-md" />
              <div className="w-20 h-2.5 bg-muted rounded-md" />
            </div>
          </div>
          <div className="w-16 h-6 bg-muted rounded-full" />
        </div>
      ))}
    </div>
  );
};
