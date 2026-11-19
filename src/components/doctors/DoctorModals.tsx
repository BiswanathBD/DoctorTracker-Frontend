'use client';

import React from 'react';
import { DoctorDetailCard } from '@/components/layout/DoctorDetailCard';
import { DoctorFormModal } from '@/components/modals/DoctorFormModal';
import { PatientFormModal } from '@/components/modals/PatientFormModal';
import { DoctorDeleteModal } from '@/components/modals/DoctorDeleteModal';
import { PatientDeleteModal } from '@/components/modals/PatientDeleteModal';
import { ReleasePatientModal } from '@/components/modals/ReleasePatientModal';
import type { Doctor, DoctorFormData, DoctorPatient } from '@/server/doctor.service';
import type { PatientFormData, Patient } from '@/types/patient.types';

export interface DoctorModalsProps {
  // detail drawer
  selectedDoctor: Doctor | null;
  isDetailCardOpen: boolean;
  loadingDoctorDetails: boolean;
  onCloseDetailCard: () => void;
  onAvatarUpdated: (doctor: Doctor) => void;
  onEditDoctor: (doctor: Doctor) => void;
  onDeleteDoctor: (doctor: Doctor) => void;
  onOpenAddPatient: () => void;
  onRequestRemovePatient: (patientId: string, patientName: string) => void;
  onReleasePatient?: (patient: DoctorPatient | { _id: string; name: string }) => void;

  // doctor create / edit modal
  isFormModalOpen: boolean;
  onCloseFormModal: () => void;
  editingDoctor: Doctor | null;
  doctorForm: DoctorFormData;
  setDoctorForm: React.Dispatch<React.SetStateAction<DoctorFormData>>;
  avatarPreviewUrl: string | null;
  onAvatarChange: (file: File | null) => void;
  onDoctorSubmit: (e: React.FormEvent) => void;
  formSubmitting: boolean;

  // add patient modal
  isAddPatientModalOpen: boolean;
  onCloseAddPatientModal: () => void;
  patientForm: PatientFormData;
  setPatientForm: React.Dispatch<React.SetStateAction<PatientFormData>>;
  doctorsList: Doctor[];
  patientAvatarPreviewUrl: string | null;
  onPatientAvatarChange: (file: File | null) => void;
  onAddPatientSubmit: (e: React.FormEvent) => void;
  patientSubmitting: boolean;

  // doctor delete modal
  isDeleteModalOpen: boolean;
  onCloseDeleteModal: () => void;
  doctorToDelete: Doctor | null;
  onConfirmDeleteDoctor: () => void;

  // patient delete modal
  isPatientDeleteModalOpen: boolean;
  onClosePatientDeleteModal: () => void;
  patientToRemove: { id: string; name: string } | null;
  onConfirmRemovePatient: () => void;
  patientRemoveSubmitting: boolean;

  // patient release modal
  isReleaseModalOpen?: boolean;
  onCloseReleaseModal?: () => void;
  patientToRelease?: Patient | null;
  onConfirmReleasePatient?: (patientId: string, releaseDate: string, remark: string) => Promise<void> | void;
  releaseSubmitting?: boolean;
}

export const DoctorModals: React.FC<DoctorModalsProps> = ({
  selectedDoctor,
  isDetailCardOpen,
  loadingDoctorDetails,
  onCloseDetailCard,
  onAvatarUpdated,
  onEditDoctor,
  onDeleteDoctor,
  onOpenAddPatient,
  onRequestRemovePatient,
  onReleasePatient,
  isFormModalOpen,
  onCloseFormModal,
  editingDoctor,
  doctorForm,
  setDoctorForm,
  avatarPreviewUrl,
  onAvatarChange,
  onDoctorSubmit,
  formSubmitting,
  isAddPatientModalOpen,
  onCloseAddPatientModal,
  patientForm,
  setPatientForm,
  doctorsList,
  patientAvatarPreviewUrl,
  onPatientAvatarChange,
  onAddPatientSubmit,
  patientSubmitting,
  isDeleteModalOpen,
  onCloseDeleteModal,
  doctorToDelete,
  onConfirmDeleteDoctor,
  isPatientDeleteModalOpen,
  onClosePatientDeleteModal,
  patientToRemove,
  onConfirmRemovePatient,
  patientRemoveSubmitting,
  isReleaseModalOpen = false,
  onCloseReleaseModal,
  patientToRelease = null,
  onConfirmReleasePatient,
  releaseSubmitting = false,
}) => {
  const doctorDisplayName = selectedDoctor
    ? selectedDoctor.name.startsWith('Dr.')
      ? selectedDoctor.name
      : `Dr. ${selectedDoctor.name}`
    : 'Doctor';

  return (
    <>
      {/* side slide-in sheet for detailed doctor information */}
      <DoctorDetailCard
        doctor={selectedDoctor}
        isOpen={isDetailCardOpen}
        loadingPatients={loadingDoctorDetails}
        onClose={onCloseDetailCard}
        onAvatarUpdated={onAvatarUpdated}
        onEdit={(doc) => {
          onCloseDetailCard();
          onEditDoctor(doc);
        }}
        onDelete={(doc) => {
          onDeleteDoctor(doc);
        }}
        onAddPatient={onOpenAddPatient}
        onRemovePatient={onRequestRemovePatient}
        onReleasePatient={onReleasePatient}
      />

      {/* modal: create / edit doctor */}
      <DoctorFormModal
        isOpen={isFormModalOpen}
        onClose={onCloseFormModal}
        editingDoctor={editingDoctor}
        doctorForm={doctorForm}
        setDoctorForm={setDoctorForm}
        avatarPreviewUrl={avatarPreviewUrl}
        onAvatarChange={onAvatarChange}
        onSubmit={onDoctorSubmit}
        submitting={formSubmitting}
      />

      {/* modal: add patient directly under selected doctor */}
      <PatientFormModal
        isOpen={isAddPatientModalOpen}
        onClose={onCloseAddPatientModal}
        editingPatient={null}
        patientForm={patientForm}
        setPatientForm={setPatientForm}
        doctorsList={selectedDoctor ? [selectedDoctor] : doctorsList}
        avatarPreviewUrl={patientAvatarPreviewUrl}
        onAvatarChange={onPatientAvatarChange}
        onSubmit={onAddPatientSubmit}
        submitting={patientSubmitting}
        disableDoctorSelect={true}
        title={`Add Patient under ${doctorDisplayName}`}
        description="Create and assign a patient directly to this specialist."
      />

      {/* modal: release patient from doctor */}
      {onCloseReleaseModal && onConfirmReleasePatient && (
        <ReleasePatientModal
          isOpen={isReleaseModalOpen}
          onClose={onCloseReleaseModal}
          patient={patientToRelease}
          onConfirmRelease={onConfirmReleasePatient}
          loading={releaseSubmitting}
        />
      )}

      {/* modal: delete doctor confirmation */}
      <DoctorDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={onCloseDeleteModal}
        doctor={doctorToDelete}
        onConfirm={onConfirmDeleteDoctor}
      />

      {/* modal: confirm remove patient from doctor */}
      <PatientDeleteModal
        isOpen={isPatientDeleteModalOpen}
        onClose={onClosePatientDeleteModal}
        patient={patientToRemove ? { name: patientToRemove.name, _id: patientToRemove.id } : null}
        onConfirm={onConfirmRemovePatient}
        loading={patientRemoveSubmitting}
        title="Unassign Patient"
        description="Are you sure you want to unassign this patient from the doctor?"
        confirmLabel="Unassign Patient"
        warningText={
          <p>
            Unassigning <strong>{patientToRemove?.name}</strong> will remove them from{' '}
            {doctorDisplayName}&apos;s patient roster. Their medical profile and history will remain safe in the directory as an unassigned patient.
          </p>
        }
      />
    </>
  );
};
