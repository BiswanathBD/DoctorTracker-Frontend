import React from 'react';
import { DoctorSkeletonGrid } from '@/components/skeletons/DoctorCardSkeleton';

// loading fallback for doctor directory
export default function DoctorsLoading() {
  return (
    <div className="w-full space-y-7 animate-pulse">
      {/* header skeleton */}
      <div className="h-24 rounded-3xl bg-card/60 border border-border/80" />

      {/* filter skeleton */}
      <div className="h-28 rounded-3xl bg-card/60 border border-border/80" />

      {/* card grid skeleton */}
      <DoctorSkeletonGrid count={6} />
    </div>
  );
}
