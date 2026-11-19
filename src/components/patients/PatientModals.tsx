'use client';

import React, { useState } from 'react';
import { PatientDetailCard } from '@/components/layout/PatientDetailCard';
import { DoctorDetailCard } from '@/components/layout/DoctorDetailCard';
import { PatientFormModal } from '@/components/modals/PatientFormModal';
import { PatientDeleteModal } from '@/components/modals/PatientDeleteModal';
import { ReleasePatientModal } from '@/components/modals/ReleasePatientModal';
import type { Patient, PatientFormData } from '@/types/patient.types';
import type { Doctor } from '@/server/doctor.service';

export interface PatientModalsProps {
  // detail drawer
  selectedPatient: Patient | null;
  isDetailCardOpen: boolean;
  onCloseDetailCard: () => void;
  onAvatarUpdated: (patient: Patient) => void;
  onEditPatient: (patient: Patient) => void;
  onReleasePatient?: (patient: Patient) => void;
  onDeletePatient: (patient: Patient) => void;

  // patient form modal
  isFormModalOpen: boolean;
  onCloseFormModal: () => void;
  editingPatient: Patient | null;
  patientForm: PatientFormData;
  setPatientForm: React.Dispatch<React.SetStateAction<PatientFormData>>;
  doctorsList: Doctor[];
  avatarPreviewUrl: string | null;
  onAvatarChange: (file: File | null) => void;
  onPatientSubmit: (e: React.FormEvent) => void;
  formSubmitting: boolean;

  // patient delete modal
  isDeleteModalOpen: boolean;
  onCloseDeleteModal: () => void;
  patientToDelete: Patient | null;
  onConfirmDeletePatient: () => void;

  // patient release modal
  isReleaseModalOpen?: boolean;
  onCloseReleaseModal?: () => void;
  patientToRelease?: Patient | null;
  onConfirmReleasePatient?: (patientId: string, releaseDate: string, remark: string) => Promise<void> | void;
  releaseSubmitting?: boolean;
}

export const PatientModals: React.FC<PatientModalsProps> = ({
  selectedPatient,
  isDetailCardOpen,
  onCloseDetailCard,
  onAvatarUpdated,
  onEditPatient,
  onReleasePatient,
  onDeletePatient,
  isFormModalOpen,
  onCloseFormModal,
  editingPatient,
  patientForm,
  setPatientForm,
  doctorsList,
  avatarPreviewUrl,
  onAvatarChange,
  onPatientSubmit,
  formSubmitting,
  isDeleteModalOpen,
  onCloseDeleteModal,
  patientToDelete,
  onConfirmDeletePatient,
  isReleaseModalOpen = false,
  onCloseReleaseModal,
  patientToRelease = null,
  onConfirmReleasePatient,
  releaseSubmitting = false,
}) => {
  const [viewingDoctorId, setViewingDoctorId] = useState<string | null>(null);
  const [viewingPatientId, setViewingPatientId] = useState<string | null>(null);

  const activePatientId = viewingPatientId || (isDetailCardOpen ? selectedPatient?._id || null : null);
  const isPatientCardOpen = Boolean(activePatientId);

  return (
    <>
      {/* right slide-in patient details dossier */}
      <PatientDetailCard
        key={activePatientId || 'patient-drawer-none'}
        patientId={activePatientId}
        isOpen={isPatientCardOpen}
        onClose={() => {
          onCloseDetailCard();
          setViewingPatientId(null);
        }}
        onAvatarUpdated={onAvatarUpdated}
        onEdit={(p) => {
          onCloseDetailCard();
          setViewingPatientId(null);
          onEditPatient(p);
        }}
        onRelease={(p) => {
          onReleasePatient?.(p);
        }}
        onDelete={(p) => {
          onCloseDetailCard();
          setViewingPatientId(null);
          onDeletePatient(p);
        }}
        onViewDoctor={(docId) => {
          onCloseDetailCard();
          setViewingPatientId(null);
          setViewingDoctorId(docId);
        }}
      />

      {/* linked doctor details modal */}
      <DoctorDetailCard
        key={viewingDoctorId || 'doctor-drawer-none'}
        doctorId={viewingDoctorId}
        isOpen={Boolean(viewingDoctorId)}
        onClose={() => setViewingDoctorId(null)}
        onViewPatient={(patId) => {
          setViewingDoctorId(null);
          setViewingPatientId(patId);
        }}
      />

      {/* modal: register / edit patient */}
      <PatientFormModal
        isOpen={isFormModalOpen}
        onClose={onCloseFormModal}
        editingPatient={editingPatient}
        patientForm={patientForm}
        setPatientForm={setPatientForm}
        doctorsList={doctorsList}
        avatarPreviewUrl={avatarPreviewUrl}
        onAvatarChange={onAvatarChange}
        onSubmit={onPatientSubmit}
        submitting={formSubmitting}
      />

      {/* modal: release patient confirmation */}
      {onCloseReleaseModal && onConfirmReleasePatient && (
        <ReleasePatientModal
          isOpen={isReleaseModalOpen}
          onClose={onCloseReleaseModal}
          patient={patientToRelease}
          onConfirmRelease={onConfirmReleasePatient}
          loading={releaseSubmitting}
        />
      )}

      {/* modal: delete patient confirmation */}
      <PatientDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={onCloseDeleteModal}
        patient={patientToDelete}
        onConfirm={onConfirmDeletePatient}
      />
    </>
  );
};
