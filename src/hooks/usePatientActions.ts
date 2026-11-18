'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PatientService, type Patient } from '@/server/patient.service';
import type { PatientFormData } from '@/types/patient.types';
import type { Doctor } from '@/server/doctor.service';
import { toast } from '@/components/ui';

interface UsePatientActionsProps {
  doctorsList: Doctor[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  refreshPatients: () => void;
  fetchFilterOptions: () => Promise<void>;
}

export function usePatientActions({
  doctorsList,
  setPatients,
  refreshPatients,
  fetchFilterOptions,
}: UsePatientActionsProps) {
  const searchParams = useSearchParams();

  // modal & card states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailCardOpen, setIsDetailCardOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  // form state
  const [patientForm, setPatientForm] = useState<PatientFormData>({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    condition: '',
    doctorId: '',
    admissionDate: new Date().toISOString().split('T')[0],
  });
  const [patientAvatarFile, setPatientAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // open create modal
  const handleOpenCreateModal = useCallback(() => {
    setEditingPatient(null);
    setPatientAvatarFile(null);
    setAvatarPreviewUrl(null);
    setPatientForm({
      name: '',
      age: '',
      gender: 'Male',
      phone: '',
      email: '',
      condition: '',
      doctorId: doctorsList[0]?._id || '',
      admissionDate: new Date().toISOString().split('T')[0],
    });
    setIsFormModalOpen(true);
  }, [doctorsList]);

  // check if action=create was passed in query
  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      const timer = setTimeout(() => {
        handleOpenCreateModal();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [searchParams, handleOpenCreateModal]);

  // open edit modal
  const handleOpenEditModal = (patient: Patient) => {
    setEditingPatient(patient);
    setPatientAvatarFile(null);
    setAvatarPreviewUrl(patient.avatar?.url || null);
    const assignedDocId =
      typeof patient.doctorId === 'object' && patient.doctorId !== null
        ? patient.doctorId._id
        : String(patient.doctorId || '');

    setPatientForm({
      name: patient.name,
      age: String(patient.age),
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email || '',
      condition: patient.condition,
      doctorId: assignedDocId,
      admissionDate: patient.admissionDate
        ? new Date(patient.admissionDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    });
    setIsFormModalOpen(true);
  };

  // handle avatar image selection
  const handleAvatarChange = (file: File | null) => {
    setPatientAvatarFile(file);
    if (file) {
      setAvatarPreviewUrl(URL.createObjectURL(file));
    } else {
      setAvatarPreviewUrl(editingPatient?.avatar?.url || null);
    }
  };

  // submit form (create or edit)
  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !patientForm.name ||
      !patientForm.age ||
      !patientForm.phone ||
      !patientForm.condition ||
      !patientForm.doctorId
    ) {
      toast.error(
        'Missing fields',
        'Please enter patient name, age, phone, condition, and select an attending doctor.'
      );
      return;
    }

    try {
      setFormSubmitting(true);
      const payload = {
        ...patientForm,
        age: Number(patientForm.age),
        admissionDate: new Date(patientForm.admissionDate),
      };

      if (editingPatient) {
        const updated = await PatientService.updatePatient(editingPatient._id, payload);
        if (patientAvatarFile) {
          const avatarRes = await PatientService.updateAvatar(editingPatient._id, patientAvatarFile);
          updated.avatar = avatarRes.avatar;
        }
        toast.success('Patient Updated', `${patientForm.name}'s record has been updated.`);
        setPatients((prev) => prev.map((p) => (p._id === editingPatient._id ? updated : p)));
        if (selectedPatient?._id === editingPatient._id) {
          setSelectedPatient(updated);
        }
      } else {
        const created = await PatientService.createPatient(payload);
        if (patientAvatarFile) {
          try {
            const avatarRes = await PatientService.updateAvatar(created._id, patientAvatarFile);
            created.avatar = avatarRes.avatar;
          } catch (avatarErr) {
            console.error('avatar upload failed after create:', avatarErr);
          }
        }
        toast.success('Patient Registered', `${patientForm.name} has been admitted and assigned.`);
        refreshPatients();
      }

      setIsFormModalOpen(false);
      fetchFilterOptions();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'failed to save patient';
      toast.error('Action Failed', msg);
    } finally {
      setFormSubmitting(false);
    }
  };

  // delete patient
  const handleDeletePatient = async () => {
    if (!patientToDelete) return;

    try {
      await PatientService.deletePatient(patientToDelete._id);
      toast.success('Patient Deleted', `${patientToDelete.name}'s record was removed.`);
      setIsDeleteModalOpen(false);
      const deletedId = patientToDelete._id;
      setPatientToDelete(null);

      // update local list immediately
      setPatients((prev) => prev.filter((p) => p._id !== deletedId));
      if (selectedPatient?._id === deletedId) {
        setIsDetailCardOpen(false);
        setSelectedPatient(null);
      }

      refreshPatients();
      fetchFilterOptions();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'failed to delete patient';
      toast.error('Delete Failed', msg);
    }
  };

  return {
    handleOpenCreateModal,
    handleOpenEditModal,
    handleViewPatientDetails: (patient: Patient) => {
      setSelectedPatient(patient);
      setIsDetailCardOpen(true);
    },
    handleOpenDeleteModal: (patient: Patient) => {
      setPatientToDelete(patient);
      setIsDeleteModalOpen(true);
    },
    modalProps: {
      selectedPatient,
      isDetailCardOpen,
      onCloseDetailCard: () => setIsDetailCardOpen(false),
      onAvatarUpdated: (updatedPat: Patient) => {
        setSelectedPatient(updatedPat);
        setPatients((prev) =>
          prev.map((p) => (p._id === updatedPat._id ? { ...p, avatar: updatedPat.avatar } : p))
        );
      },
      onEditPatient: handleOpenEditModal,
      onDeletePatient: (p: Patient) => {
        setPatientToDelete(p);
        setIsDeleteModalOpen(true);
      },
      isFormModalOpen,
      onCloseFormModal: () => setIsFormModalOpen(false),
      editingPatient,
      patientForm,
      setPatientForm,
      doctorsList,
      avatarPreviewUrl,
      onAvatarChange: handleAvatarChange,
      onPatientSubmit: handlePatientSubmit,
      formSubmitting,
      isDeleteModalOpen,
      onCloseDeleteModal: () => setIsDeleteModalOpen(false),
      patientToDelete,
      onConfirmDeletePatient: handleDeletePatient,
    },
  };
}
