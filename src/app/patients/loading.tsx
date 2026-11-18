import React from 'react';
import { PatientSkeletonGrid } from '@/components/skeletons/PatientCardSkeleton';

// loading fallback for patient directory
export default function PatientsLoading() {
  return (
    <div className="w-full space-y-7 animate-pulse">
      {/* header skeleton */}
      <div className="h-24 rounded-3xl bg-card/60 border border-border/80" />

      {/* filter skeleton */}
      <div className="h-28 rounded-3xl bg-card/60 border border-border/80" />

      {/* card grid skeleton */}
      <PatientSkeletonGrid count={6} />
    </div>
  );
}
