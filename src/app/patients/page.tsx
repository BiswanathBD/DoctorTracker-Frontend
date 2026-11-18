'use client';

import React, { Suspense } from 'react';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import { Button, PageHeader } from '@/components/ui';
import { PatientFilters } from '@/components/patients/PatientFilters';
import { PatientGrid } from '@/components/patients/PatientGrid';
import { PatientModals } from '@/components/patients/PatientModals';
import { PatientSkeletonGrid } from '@/components/skeletons/PatientCardSkeleton';
import { usePatients } from '@/hooks/usePatients';
import { usePatientActions } from '@/hooks/usePatientActions';
import { Users, Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

function PatientsContent() {
  const patientsState = usePatients();
  const patientActions = usePatientActions({
    doctorsList: patientsState.doctorsList,
    setPatients: patientsState.setPatients,
    refreshPatients: patientsState.refreshPatients,
    fetchFilterOptions: patientsState.fetchFilterOptions,
  });

  return (
    <div className="w-full flex gap-6 items-start">
      <div className="flex-1 min-w-0 space-y-7">
        {/* page header with quick create action */}
        <MotionWrapper delay={0.05} direction="down">
          <PageHeader
            size="md"
            icon={<Users size={42} strokeWidth={1.2} />}
            title="Patient Directory"
            subtitle="Track clinical admissions, monitor medical conditions, and assign specialist doctors."
            actions={
              <Button
                onClick={patientActions.handleOpenCreateModal}
                variant="secondary"
                size="md"
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Register Patient
              </Button>
            }
          />
        </MotionWrapper>

        {/* modern directory filter station */}
        <MotionWrapper delay={0.1} direction="up" className="relative z-10">
          <PatientFilters {...patientsState.filterProps} />
        </MotionWrapper>

        {/* patients grid, empty state, and pagination */}
        <PatientGrid
          patients={patientsState.patients}
          loading={patientsState.loading}
          total={patientsState.total}
          page={patientsState.page}
          totalPages={patientsState.totalPages}
          limit={patientsState.limit}
          hasActiveFilters={patientsState.hasActiveFilters}
          onPageChange={patientsState.setPage}
          onResetFilters={patientsState.handleResetFilters}
          onCreatePatient={patientActions.handleOpenCreateModal}
          onViewDetails={patientActions.handleViewPatientDetails}
          onEditPatient={patientActions.handleOpenEditModal}
          onReleasePatient={patientActions.handleOpenReleaseModal}
          onDeletePatient={patientActions.handleOpenDeleteModal}
        />
      </div>

      {/* all slide-in sheets and dialog modals */}
      <PatientModals {...patientActions.modalProps} />
    </div>
  );
}

export default function PatientsPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full space-y-7 animate-pulse">
          <div className="h-24 rounded-3xl bg-card/60 border border-border/80" />
          <div className="h-28 rounded-3xl bg-card/60 border border-border/80" />
          <PatientSkeletonGrid count={6} />
        </div>
      }
    >
      <PatientsContent />
    </Suspense>
  );
}
