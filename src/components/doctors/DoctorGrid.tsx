'use client';

import React from 'react';
import { DoctorCard } from './DoctorCard';
import { DoctorEmptyState } from './DoctorEmptyState';
import { DoctorSkeletonGrid } from '@/components/skeletons/DoctorCardSkeleton';
import { Pagination } from '@/components/common/Pagination';
import type { Doctor } from '@/server/doctor.service';

export interface DoctorGridProps {
  doctors: Doctor[];
  loading: boolean;
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  hasActiveFilters: boolean;
  onPageChange: (page: number) => void;
  onResetFilters: () => void;
  onCreateDoctor: () => void;
  onViewDetails: (doctor: Doctor) => void;
  onEditDoctor: (doctor: Doctor) => void;
  onDeleteDoctor: (doctor: Doctor) => void;
}

export const DoctorGrid: React.FC<DoctorGridProps> = ({
  doctors,
  loading,
  total,
  page,
  totalPages,
  limit,
  hasActiveFilters,
  onPageChange,
  onResetFilters,
  onCreateDoctor,
  onViewDetails,
  onEditDoctor,
  onDeleteDoctor,
}) => {
  // loading skeleton
  if (loading) {
    return <DoctorSkeletonGrid count={6} />;
  }

  // empty states
  if (doctors.length === 0) {
    return (
      <DoctorEmptyState
        hasActiveFilters={hasActiveFilters}
        onResetFilters={onResetFilters}
        onCreateDoctor={onCreateDoctor}
      />
    );
  }

  // grid with doctor cards and pagination
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {doctors.map((doctor, idx) => (
          <DoctorCard
            key={doctor._id}
            doctor={doctor}
            index={idx}
            onViewDetails={onViewDetails}
            onEdit={onEditDoctor}
            onDelete={onDeleteDoctor}
          />
        ))}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        totalItems={total}
        pageSize={limit}
        itemName="doctors"
        variant="primary"
      />
    </div>
  );
};
