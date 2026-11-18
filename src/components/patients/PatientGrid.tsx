'use client';

import React from 'react';
import { PatientCard } from './PatientCard';
import { PatientEmptyState } from './PatientEmptyState';
import { PatientSkeletonGrid } from '@/components/skeletons/PatientCardSkeleton';
import { Pagination } from '@/components/common/Pagination';
import type { Patient } from '@/server/patient.service';

export interface PatientGridProps {
  patients: Patient[];
  loading: boolean;
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  hasActiveFilters: boolean;
  onPageChange: (page: number) => void;
  onResetFilters: () => void;
  onCreatePatient: () => void;
  onViewDetails: (patient: Patient) => void;
  onEditPatient: (patient: Patient) => void;
  onDeletePatient: (patient: Patient) => void;
}

export const PatientGrid: React.FC<PatientGridProps> = ({
  patients,
  loading,
  total,
  page,
  totalPages,
  limit,
  hasActiveFilters,
  onPageChange,
  onResetFilters,
  onCreatePatient,
  onViewDetails,
  onEditPatient,
  onDeletePatient,
}) => {
  // loading skeleton
  if (loading) {
    return <PatientSkeletonGrid count={6} />;
  }

  // empty states
  if (patients.length === 0) {
    return (
      <PatientEmptyState
        hasActiveFilters={hasActiveFilters}
        onResetFilters={onResetFilters}
        onCreatePatient={onCreatePatient}
      />
    );
  }

  // grid with patient cards and pagination
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {patients.map((patient, idx) => (
          <PatientCard
            key={patient._id}
            patient={patient}
            index={idx}
            onViewDetails={onViewDetails}
            onEdit={onEditPatient}
            onDelete={onDeletePatient}
          />
        ))}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        totalItems={total}
        pageSize={limit}
        itemName="admitted patients"
        variant="secondary"
      />
    </div>
  );
};
