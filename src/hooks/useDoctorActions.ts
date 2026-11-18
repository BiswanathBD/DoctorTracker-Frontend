'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { DoctorService, type Doctor, type DoctorFormData, type DoctorPatient } from '@/server/doctor.service';
import { PatientService } from '@/server/patient.service';
import type { PatientFormData, Patient } from '@/types/patient.types';
import { toast } from '@/components/ui';

interface UseDoctorActionsProps {
  doctors: Doctor[];
  setDoctors: React.Dispatch<React.SetStateAction<Doctor[]>>;
  refreshDoctors: () => void;
  fetchFilterOptions: () => Promise<void>;
}

export function useDoctorActions({
  doctors,
  setDoctors,
  refreshDoctors,
  fetchFilterOptions,
}: UseDoctorActionsProps) {
  const searchParams = useSearchParams();

  // modal & card states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailCardOpen, setIsDetailCardOpen] = useState(false);
  const [loadingDoctorDetails, setLoadingDoctorDetails] = useState(false);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPatientDeleteModalOpen, setIsPatientDeleteModalOpen] = useState(false);

  // active targets for modals
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);
  const [patientToRemove, setPatientToRemove] = useState<{ id: string; name: string } | null>(null);
  const [patientRemoveSubmitting, setPatientRemoveSubmitting] = useState(false);
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);
  const [patientToRelease, setPatientToRelease] = useState<Patient | null>(null);
  const [releaseSubmitting, setReleaseSubmitting] = useState(false);

  // form states
  const [doctorForm, setDoctorForm] = useState<DoctorFormData>({
    name: '',
    specialization: '',
    hospital: '',
    phone: '',
    email: '',
    note: '',
  });
  const [doctorAvatarFile, setDoctorAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [avatarDeleted, setAvatarDeleted] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // handle avatar file selection / deletion
  const handleAvatarChange = useCallback((file: File | null) => {
    setDoctorAvatarFile(file);
    if (file) {
      setAvatarPreviewUrl(URL.createObjectURL(file));
      setAvatarDeleted(false);
    } else {
      setAvatarPreviewUrl(null);
      setAvatarDeleted(true);
    }
  }, []);

  // nested patient form states
  const [patientForm, setPatientForm] = useState<PatientFormData>({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    condition: '',
    doctorId: '',
    admissionDate: new Date().toISOString().split('T')[0],
    note: '',
  });
  const [patientAvatarFile, setPatientAvatarFile] = useState<File | null>(null);
  const [patientAvatarPreviewUrl, setPatientAvatarPreviewUrl] = useState<string | null>(null);
  const [patientSubmitting, setPatientSubmitting] = useState(false);

  // open assign patient modal for doctor
  const handleOpenAddPatientModal = useCallback(
    (doc?: Doctor | null) => {
      const targetDoc = doc || selectedDoctor;
      if (!targetDoc) return;
      setPatientAvatarFile(null);
      setPatientAvatarPreviewUrl(null);
      setPatientForm({
        name: '',
        age: '',
        gender: 'Male',
        phone: '',
        email: '',
        condition: '',
        doctorId: targetDoc._id,
        admissionDate: new Date().toISOString().split('T')[0],
        note: '',
      });
      setIsAddPatientModalOpen(true);
    },
    [selectedDoctor]
  );

  // open create modal
  const handleOpenCreateModal = useCallback(() => {
    setEditingDoctor(null);
    setDoctorAvatarFile(null);
    setAvatarPreviewUrl(null);
    setAvatarDeleted(false);
    setDoctorForm({
      name: '',
      specialization: '',
      hospital: '',
      phone: '',
      email: '',
      note: '',
    });
    setIsFormModalOpen(true);
  }, []);

  // check if action=create was passed in query
  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      const timer = setTimeout(() => {
        handleOpenCreateModal();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [searchParams, handleOpenCreateModal]);

  // view doctor details and fetch complete patient roster
  const handleViewDoctorDetails = async (doc: Doctor) => {
    setSelectedDoctor(doc);
    setIsDetailCardOpen(true);
    try {
      setLoadingDoctorDetails(true);
      const fullDoc = await DoctorService.getDoctorById(doc._id);
      setSelectedDoctor(fullDoc);
      // keep background doctor card count synchronized
      if (typeof fullDoc.patientCount === 'number') {
        setDoctors((prev) =>
          prev.map((d) =>
            d._id === fullDoc._id ? { ...d, patientCount: fullDoc.patientCount } : d
          )
        );
      }
    } catch (err) {
      console.error('failed to fetch doctor details:', err);
    } finally {
      setLoadingDoctorDetails(false);
    }
  };

  // handle open edit modal
  const handleOpenEditModal = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setDoctorAvatarFile(null);
    setAvatarPreviewUrl(doctor.avatar?.url || null);
    setAvatarDeleted(false);
    setDoctorForm({
      name: doctor.name,
      specialization: doctor.specialization,
      hospital: doctor.hospital,
      phone: doctor.phone,
      email: doctor.email,
      note: doctor.note || '',
    });
    setIsFormModalOpen(true);
  };

  // handle submit create/edit doctor
  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !doctorForm.name ||
      !doctorForm.specialization ||
      !doctorForm.hospital ||
      !doctorForm.phone ||
      !doctorForm.email
    ) {
      toast.error('Validation Error', 'Please fill out all required fields.');
      return;
    }

    try {
      setFormSubmitting(true);
      if (editingDoctor) {
        // update existing doctor details
        const updated = await DoctorService.updateDoctor(editingDoctor._id, doctorForm);

        if (doctorAvatarFile) {
          const avatarRes = await DoctorService.updateAvatar(editingDoctor._id, doctorAvatarFile);
          updated.avatar = avatarRes.avatar;
        } else if (avatarDeleted && editingDoctor.avatar?.url) {
          const avatarRes = await DoctorService.deleteAvatar(editingDoctor._id);
          updated.avatar = avatarRes.avatar;
        }

        const docName = doctorForm.name.startsWith('Dr.') ? doctorForm.name : `Dr. ${doctorForm.name}`;
        toast.success('Doctor Updated', `${docName} profile has been saved.`);
        setDoctors((prev) => prev.map((doc) => (doc._id === editingDoctor._id ? updated : doc)));
        if (selectedDoctor?._id === editingDoctor._id) {
          setSelectedDoctor(updated);
        }
      } else {
        // create new doctor
        const created = await DoctorService.createDoctor(doctorForm);

        if (doctorAvatarFile) {
          try {
            const avatarRes = await DoctorService.updateAvatar(created._id, doctorAvatarFile);
            created.avatar = avatarRes.avatar;
          } catch (avatarErr) {
            console.error('avatar upload failed after create:', avatarErr);
            toast.error(
              'Avatar Notice',
              'Doctor created, but avatar upload failed. You can re-upload anytime.'
            );
          }
        }

        const docName = doctorForm.name.startsWith('Dr.') ? doctorForm.name : `Dr. ${doctorForm.name}`;
        toast.success('Doctor Registered', `${docName} has been added.`);
        refreshDoctors();
      }

      setIsFormModalOpen(false);
      fetchFilterOptions();
    } catch (err: unknown) {
      console.error('save doctor failed:', err);
      const message = err instanceof Error ? err.message : 'Could not save doctor.';
      toast.error('Save Failed', message);
    } finally {
      setFormSubmitting(false);
    }
  };

  // handle delete doctor
  const handleDeleteDoctor = async () => {
    if (!doctorToDelete) return;
    try {
      await DoctorService.deleteDoctor(doctorToDelete._id);
      const docName = doctorToDelete.name.startsWith('Dr.')
        ? doctorToDelete.name
        : `Dr. ${doctorToDelete.name}`;
      toast.success('Doctor Deleted', `${docName} has been removed.`);
      setIsDeleteModalOpen(false);
      setDoctorToDelete(null);
      if (selectedDoctor?._id === doctorToDelete._id) {
        setIsDetailCardOpen(false);
        setSelectedDoctor(null);
      }
      refreshDoctors();
      fetchFilterOptions();
    } catch (err: unknown) {
      console.error('delete failed:', err);
      const message = err instanceof Error ? err.message : 'Could not delete doctor.';
      toast.error('Delete Failed', message);
    }
  };

  // handle add patient directly under doctor
  const handleAddPatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) return;
    if (!patientForm.name || !patientForm.age || !patientForm.phone || !patientForm.condition) {
      toast.error('Missing fields', 'Please enter patient name, age, phone, and condition.');
      return;
    }

    try {
      setPatientSubmitting(true);
      const payload = {
        name: patientForm.name,
        age: Number(patientForm.age),
        gender: patientForm.gender as 'Male' | 'Female' | 'Other',
        phone: patientForm.phone,
        email: patientForm.email || undefined,
        condition: patientForm.condition,
        doctorId: selectedDoctor._id,
        admissionDate: new Date(patientForm.admissionDate),
      };

      const created = await PatientService.createPatient(payload);
      if (patientAvatarFile) {
        try {
          await PatientService.updateAvatar(created._id, patientAvatarFile);
        } catch (avatarErr) {
          console.error('avatar upload failed:', avatarErr);
        }
      }

      const doctorTitle = selectedDoctor.name.startsWith('Dr.')
        ? selectedDoctor.name
        : `Dr. ${selectedDoctor.name}`;
      toast.success('Patient Assigned', `${patientForm.name} is now under ${doctorTitle}.`);
      setIsAddPatientModalOpen(false);
      setPatientAvatarFile(null);
      setPatientAvatarPreviewUrl(null);

      // update doctor card in list immediately
      setDoctors((prev) =>
        prev.map((doc) =>
          doc._id === selectedDoctor._id
            ? { ...doc, patientCount: (doc.patientCount || 0) + 1 }
            : doc
        )
      );

      // reload doctor details to reflect new patient
      const refreshedDoc = await DoctorService.getDoctorById(selectedDoctor._id);
      setSelectedDoctor(refreshedDoc);
      if (typeof refreshedDoc.patientCount === 'number') {
        setDoctors((prev) =>
          prev.map((d) =>
            d._id === refreshedDoc._id ? { ...d, patientCount: refreshedDoc.patientCount } : d
          )
        );
      }
      refreshDoctors();
    } catch (err: unknown) {
      console.error('add patient error:', err);
      const message = err instanceof Error ? err.message : 'Could not add patient.';
      toast.error('Failed to Add Patient', message);
    } finally {
      setPatientSubmitting(false);
    }
  };

  // request remove patient from doctor
  const handleRequestRemovePatient = (patientId: string, patientName: string) => {
    if (!selectedDoctor) return;
    setPatientToRemove({ id: patientId, name: patientName });
    setIsPatientDeleteModalOpen(true);
  };

  // confirm remove patient from doctor
  const handleConfirmRemovePatient = async () => {
    if (!selectedDoctor || !patientToRemove) return;

    try {
      setPatientRemoveSubmitting(true);
      await DoctorService.removePatientFromDoctor(selectedDoctor._id, patientToRemove.id);
      toast.success('Patient Deleted', `${patientToRemove.name}'s record has been removed.`);
      setIsPatientDeleteModalOpen(false);
      const removedId = patientToRemove.id;
      setPatientToRemove(null);

      // update selected doctor drawer immediately
      setSelectedDoctor((prev) => {
        if (!prev) return prev;
        const currentPatients = prev.assignedPatients || prev.patients || [];
        const nextPatients = currentPatients.filter((p) => {
          const id = typeof p === 'string' ? p : p._id;
          return id !== removedId;
        });
        return {
          ...prev,
          patientCount: Math.max(0, (prev.patientCount ?? currentPatients.length) - 1),
          patients: nextPatients,
          assignedPatients: nextPatients,
        };
      });

      // update doctor card in background list immediately
      setDoctors((prev) =>
        prev.map((doc) =>
          doc._id === selectedDoctor._id
            ? { ...doc, patientCount: Math.max(0, (doc.patientCount || 1) - 1) }
            : doc
        )
      );

      const refreshedDoc = await DoctorService.getDoctorById(selectedDoctor._id);
      setSelectedDoctor(refreshedDoc);
      if (typeof refreshedDoc.patientCount === 'number') {
        setDoctors((prev) =>
          prev.map((d) =>
            d._id === refreshedDoc._id ? { ...d, patientCount: refreshedDoc.patientCount } : d
          )
        );
      }
      refreshDoctors();
    } catch (err: unknown) {
      console.error('remove patient error:', err);
      const message = err instanceof Error ? err.message : 'Could not remove patient.';
      toast.error('Removal Failed', message);
    } finally {
      setPatientRemoveSubmitting(false);
    }
  };

  // release patient from doctor
  const handleOpenReleaseModal = (
    patient:
      | DoctorPatient
      | Patient
      | {
          _id: string;
          name: string;
          age?: number;
          gender?: 'Male' | 'Female' | 'Other';
          phone?: string;
          condition?: string;
          admissionDate?: string | Date;
          note?: string;
        }
  ) => {
    if (!patient) return;
    const patObj: Patient = {
      _id: patient._id,
      name: patient.name,
      age: patient.age ?? 0,
      gender: (patient.gender as 'Male' | 'Female' | 'Other') || 'Male',
      phone: patient.phone ?? '',
      condition: patient.condition ?? 'General Care',
      doctorId: selectedDoctor || null,
      admissionDate: patient.admissionDate
        ? new Date(patient.admissionDate).toISOString()
        : new Date().toISOString(),
      note: 'note' in patient && typeof patient.note === 'string' ? patient.note : '',
      isReleased: false,
      createdAt: 'createdAt' in patient && typeof patient.createdAt === 'string' ? patient.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPatientToRelease(patObj);
    setIsReleaseModalOpen(true);
  };

  const handleConfirmReleasePatient = async (
    patientId: string,
    releaseDate: string,
    remark: string
  ) => {
    try {
      setReleaseSubmitting(true);
      await PatientService.releasePatient(patientId, releaseDate, remark);
      toast.success(
        'Patient Released',
        `${patientToRelease?.name || 'Patient'} has been discharged from active care.`
      );
      setIsReleaseModalOpen(false);
      setPatientToRelease(null);

      // update selected doctor drawer immediately
      setSelectedDoctor((prev) => {
        if (!prev) return prev;
        const currentPatients = prev.assignedPatients || prev.patients || [];
        const nextPatients = currentPatients.filter((p) => {
          const id = typeof p === 'string' ? p : p._id;
          return id !== patientId;
        });
        return {
          ...prev,
          patientCount: Math.max(0, (prev.patientCount ?? currentPatients.length) - 1),
          patients: nextPatients,
          assignedPatients: nextPatients,
        };
      });

      // update doctor card in background list immediately
      setDoctors((prev) =>
        prev.map((doc) =>
          doc._id === selectedDoctor?._id
            ? { ...doc, patientCount: Math.max(0, (doc.patientCount || 1) - 1) }
            : doc
        )
      );

      if (selectedDoctor?._id) {
        const refreshedDoc = await DoctorService.getDoctorById(selectedDoctor._id);
        setSelectedDoctor(refreshedDoc);
        if (typeof refreshedDoc.patientCount === 'number') {
          setDoctors((prev) =>
            prev.map((d) =>
              d._id === refreshedDoc._id ? { ...d, patientCount: refreshedDoc.patientCount } : d
            )
          );
        }
      }

      refreshDoctors();
      fetchFilterOptions();
    } catch (err: unknown) {
      console.error('release patient error:', err);
      const message = err instanceof Error ? err.message : 'Could not release patient.';
      toast.error('Release Failed', message);
    } finally {
      setReleaseSubmitting(false);
    }
  };

  return {
    handleOpenCreateModal,
    handleOpenEditModal,
    handleViewDoctorDetails,
    handleOpenReleaseModal,
    handleOpenDeleteModal: (doc: Doctor) => {
      setDoctorToDelete(doc);
      setIsDeleteModalOpen(true);
    },
    modalProps: {
      selectedDoctor,
      isDetailCardOpen,
      loadingDoctorDetails,
      onCloseDetailCard: () => setIsDetailCardOpen(false),
      onAvatarUpdated: (updatedDoc: Doctor) => {
        setSelectedDoctor(updatedDoc);
        setDoctors((prev) =>
          prev.map((d) => (d._id === updatedDoc._id ? { ...d, avatar: updatedDoc.avatar } : d))
        );
      },
      onEditDoctor: handleOpenEditModal,
      onDeleteDoctor: (doc: Doctor) => {
        setDoctorToDelete(doc);
        setIsDeleteModalOpen(true);
      },
      onOpenAddPatient: () => handleOpenAddPatientModal(selectedDoctor),
      onRequestRemovePatient: handleRequestRemovePatient,
      onReleasePatient: handleOpenReleaseModal,
      isFormModalOpen,
      onCloseFormModal: () => setIsFormModalOpen(false),
      editingDoctor,
      doctorForm,
      setDoctorForm,
      avatarPreviewUrl,
      onAvatarChange: handleAvatarChange,
      onDoctorSubmit: handleDoctorSubmit,
      formSubmitting,
      isAddPatientModalOpen,
      onCloseAddPatientModal: () => setIsAddPatientModalOpen(false),
      patientForm,
      setPatientForm,
      doctorsList: doctors,
      patientAvatarPreviewUrl,
      onPatientAvatarChange: (file: File | null) => {
        setPatientAvatarFile(file);
        setPatientAvatarPreviewUrl(file ? URL.createObjectURL(file) : null);
      },
      onAddPatientSubmit: handleAddPatientSubmit,
      patientSubmitting,
      isDeleteModalOpen,
      onCloseDeleteModal: () => setIsDeleteModalOpen(false),
      doctorToDelete,
      onConfirmDeleteDoctor: handleDeleteDoctor,
      isPatientDeleteModalOpen,
      onClosePatientDeleteModal: () => {
        setIsPatientDeleteModalOpen(false);
        setPatientToRemove(null);
      },
      patientToRemove,
      onConfirmRemovePatient: handleConfirmRemovePatient,
      patientRemoveSubmitting,
      isReleaseModalOpen,
      onCloseReleaseModal: () => {
        setIsReleaseModalOpen(false);
        setPatientToRelease(null);
      },
      patientToRelease,
      onConfirmReleasePatient: handleConfirmReleasePatient,
      releaseSubmitting,
    },
  };
}
