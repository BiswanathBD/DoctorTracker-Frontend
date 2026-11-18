'use client';

import React, { Suspense } from 'react';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import { Button, PageHeader } from '@/components/ui';
import { DoctorFilters } from '@/components/doctors/DoctorFilters';
import { DoctorGrid } from '@/components/doctors/DoctorGrid';
import { DoctorModals } from '@/components/doctors/DoctorModals';
import { DoctorSkeletonGrid } from '@/components/skeletons/DoctorCardSkeleton';
import { useDoctors } from '@/hooks/useDoctors';
import { useDoctorActions } from '@/hooks/useDoctorActions';
import { Stethoscope, Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

function DoctorsContent() {
  const doctorsState = useDoctors();
  const doctorActions = useDoctorActions({
    doctors: doctorsState.doctors,
    setDoctors: doctorsState.setDoctors,
    refreshDoctors: doctorsState.refreshDoctors,
    fetchFilterOptions: doctorsState.fetchFilterOptions,
  });

  return (
    <div className="w-full flex gap-6 items-start">
      <div className="flex-1 min-w-0 space-y-7">
        {/* page header with quick create action */}
        <MotionWrapper delay={0.05} direction="down">
          <PageHeader
            title="Doctors Directory"
            subtitle="Manage and oversee active hospital specialists, assigned clinics, and patient capacities."
            icon={<Stethoscope size={42} strokeWidth={1.2} />}
            badge="Medical Faculty"
            actions={
              <Button
                onClick={doctorActions.handleOpenCreateModal}
                variant="primary"
                size="md"
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add New Doctor
              </Button>
            }
          />
        </MotionWrapper>

        {/* modern filter & search station */}
        <MotionWrapper delay={0.1} direction="up" className="relative z-10">
          <DoctorFilters {...doctorsState.filterProps} />
        </MotionWrapper>

        {/* doctors grid, empty state, and pagination */}
        <DoctorGrid
          doctors={doctorsState.doctors}
          loading={doctorsState.loading}
          total={doctorsState.total}
          page={doctorsState.page}
          totalPages={doctorsState.totalPages}
          limit={doctorsState.limit}
          hasActiveFilters={doctorsState.hasActiveFilters}
          onPageChange={doctorsState.setPage}
          onResetFilters={doctorsState.handleResetFilters}
          onCreateDoctor={doctorActions.handleOpenCreateModal}
          onViewDetails={doctorActions.handleViewDoctorDetails}
          onEditDoctor={doctorActions.handleOpenEditModal}
          onDeleteDoctor={doctorActions.handleOpenDeleteModal}
        />
      </div>

      {/* all slide-in sheets and dialog modals */}
      <DoctorModals {...doctorActions.modalProps} />
    </div>
  );
}

export default function DoctorsPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full space-y-7 animate-pulse">
          <div className="h-24 rounded-3xl bg-card/60 border border-border/80" />
          <div className="h-28 rounded-3xl bg-card/60 border border-border/80" />
          <DoctorSkeletonGrid count={6} />
        </div>
      }
    >
      <DoctorsContent />
    </Suspense>
  );
}
