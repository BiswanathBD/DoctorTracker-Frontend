'use client';

import React from 'react';
import { PatientDetailCard } from '@/components/layout/PatientDetailCard';
import { PatientFormModal } from '@/components/modals/PatientFormModal';
import { PatientDeleteModal } from '@/components/modals/PatientDeleteModal';
import type { Patient, PatientFormData } from '@/types/patient.types';
import type { Doctor } from '@/server/doctor.service';

export interface PatientModalsProps {
  // detail drawer
  selectedPatient: Patient | null;
  isDetailCardOpen: boolean;
  onCloseDetailCard: () => void;
  onAvatarUpdated: (patient: Patient) => void;
  onEditPatient: (patient: Patient) => void;
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
}

export const PatientModals: React.FC<PatientModalsProps> = ({
  selectedPatient,
  isDetailCardOpen,
  onCloseDetailCard,
  onAvatarUpdated,
  onEditPatient,
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
}) => {
  return (
    <>
      {/* right slide-in patient details dossier */}
      <PatientDetailCard
        patient={selectedPatient}
        isOpen={isDetailCardOpen}
        onClose={onCloseDetailCard}
        onAvatarUpdated={onAvatarUpdated}
        onEdit={(p) => {
          onCloseDetailCard();
          onEditPatient(p);
        }}
        onDelete={(p) => {
          onCloseDetailCard();
          onDeletePatient(p);
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
