'use client';

import React, { useState, useCallback } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { DashboardHeader } from './DashboardHeader';
import { ProfileCard } from './ProfileCard';
import { DoctorDetailCard } from './DoctorDetailCard';
import { PatientDetailCard } from './PatientDetailCard';
import { DoctorFormModal } from '@/components/modals/DoctorFormModal';
import { DoctorDeleteModal } from '@/components/modals/DoctorDeleteModal';
import { PatientFormModal } from '@/components/modals/PatientFormModal';
import { PatientDeleteModal } from '@/components/modals/PatientDeleteModal';
import { ReleasePatientModal } from '@/components/modals/ReleasePatientModal';
import { DoctorService, type Doctor, type DoctorFormData } from '@/server/doctor.service';
import { PatientService, type Patient } from '@/server/patient.service';
import type { PatientFormData } from '@/types/patient.types';
import { Container, toast } from '@/components/ui';
import { useAuth } from '@/providers/AuthProvider';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user: admin } = useAuth();

  // Target IDs for global detail drawers
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [drawerRefreshKey, setDrawerRefreshKey] = useState<number>(0);

  // Doctor modals & form states
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [doctorForm, setDoctorForm] = useState<DoctorFormData>({
    name: '',
    specialization: '',
    hospital: '',
    phone: '',
    email: '',
    note: '',
  });
  const [doctorAvatarFile, setDoctorAvatarFile] = useState<File | null>(null);
  const [doctorAvatarPreviewUrl, setDoctorAvatarPreviewUrl] = useState<string | null>(null);
  const [doctorSubmitting, setDoctorSubmitting] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);
  const [doctorDeleteSubmitting, setDoctorDeleteSubmitting] = useState(false);

  // Patient modals & form states
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
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
  const [patientToDelete, setPatientToDelete] = useState<Patient | { _id?: string; name: string } | null>(null);
  const [patientDeleteSubmitting, setPatientDeleteSubmitting] = useState(false);
  const [patientToRelease, setPatientToRelease] = useState<Patient | null>(null);
  const [releaseSubmitting, setReleaseSubmitting] = useState(false);
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);

  // Fetch doctors list when needed for patient assignment select
  const ensureDoctorsList = useCallback(async () => {
    if (doctorsList.length === 0) {
      try {
        const res = await DoctorService.getAllDoctors({ limit: 100 });
        setDoctorsList(res.data || []);
      } catch (err) {
        console.error('Failed to load doctors list:', err);
      }
    }
  }, [doctorsList.length]);

  // Handle open doctor edit modal
  const handleOpenEditDoctor = useCallback((doc: Doctor) => {
    setEditingDoctor(doc);
    setDoctorAvatarFile(null);
    setDoctorAvatarPreviewUrl(doc.avatar?.url || null);
    setDoctorForm({
      name: doc.name,
      specialization: doc.specialization,
      hospital: doc.hospital,
      phone: doc.phone,
      email: doc.email,
      note: doc.note || '',
    });
  }, []);

  // Submit doctor edit
  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctor) return;

    try {
      setDoctorSubmitting(true);
      await DoctorService.updateDoctor(editingDoctor._id, doctorForm);
      if (doctorAvatarFile) {
        await DoctorService.updateAvatar(editingDoctor._id, doctorAvatarFile);
      }
      toast.success('Doctor Updated', `${doctorForm.name} profile has been updated.`);
      setEditingDoctor(null);
      setDrawerRefreshKey((prev) => prev + 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update doctor.';
      toast.error('Update Failed', msg);
    } finally {
      setDoctorSubmitting(false);
    }
  };

  // Submit doctor deletion
  const handleConfirmDeleteDoctor = async () => {
    if (!doctorToDelete) return;
    try {
      setDoctorDeleteSubmitting(true);
      await DoctorService.deleteDoctor(doctorToDelete._id);
      toast.success('Doctor Deleted', `${doctorToDelete.name} was removed from the system.`);
      setDoctorToDelete(null);
      setSelectedDoctorId(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete doctor.';
      toast.error('Delete Failed', msg);
    } finally {
      setDoctorDeleteSubmitting(false);
    }
  };

  // Handle open add patient modal (e.g. from doctor roster)
  const handleOpenAddPatient = useCallback(() => {
    ensureDoctorsList();
    setEditingPatient(null);
    setPatientAvatarFile(null);
    setPatientAvatarPreviewUrl(null);
    setPatientForm({
      name: '',
      age: '',
      gender: 'Male',
      phone: '',
      email: '',
      condition: '',
      doctorId: selectedDoctorId || '',
      admissionDate: new Date().toISOString().split('T')[0],
      note: '',
    });
    setIsAddPatientModalOpen(true);
  }, [selectedDoctorId, ensureDoctorsList]);

  // Handle open patient edit modal
  const handleOpenEditPatient = useCallback(
    (pat: Patient) => {
      ensureDoctorsList();
      setEditingPatient(pat);
      setPatientAvatarFile(null);
      setPatientAvatarPreviewUrl(pat.avatar?.url || null);
      const assignedDocId =
        typeof pat.doctorId === 'object' && pat.doctorId !== null
          ? pat.doctorId._id
          : String(pat.doctorId || '');

      setPatientForm({
        name: pat.name,
        age: String(pat.age),
        gender: pat.gender,
        phone: pat.phone,
        email: pat.email || '',
        condition: pat.condition,
        doctorId: assignedDocId,
        admissionDate: pat.admissionDate
          ? new Date(pat.admissionDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        note: pat.note || '',
      });
      setIsAddPatientModalOpen(true);
    },
    [ensureDoctorsList]
  );

  // Submit patient (create or edit)
  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientForm.name || !patientForm.age || !patientForm.phone || !patientForm.condition) {
      toast.error('Missing fields', 'Please enter patient name, age, phone, and condition.');
      return;
    }

    try {
      setPatientSubmitting(true);
      const payload = {
        ...patientForm,
        age: Number(patientForm.age),
        admissionDate: new Date(patientForm.admissionDate).toISOString(),
      };

      if (editingPatient) {
        await PatientService.updatePatient(editingPatient._id, payload);
        if (patientAvatarFile) {
          await PatientService.updateAvatar(editingPatient._id, patientAvatarFile);
        }
        toast.success('Patient Updated', `${patientForm.name}'s record has been updated.`);
      } else {
        const created = await PatientService.createPatient(payload);
        if (patientAvatarFile) {
          await PatientService.updateAvatar(created._id, patientAvatarFile);
        }
        toast.success('Patient Registered', `${patientForm.name} was successfully registered.`);
      }

      setIsAddPatientModalOpen(false);
      setEditingPatient(null);
      setDrawerRefreshKey((prev) => prev + 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save patient record.';
      toast.error('Save Failed', msg);
    } finally {
      setPatientSubmitting(false);
    }
  };

  // Submit patient release
  const handleConfirmReleasePatient = async (
    patientId: string,
    releaseDate: string,
    remark: string
  ) => {
    try {
      setReleaseSubmitting(true);
      await PatientService.releasePatient(patientId, releaseDate, remark);
      toast.success('Patient Released', 'Patient care status marked as released.');
      setPatientToRelease(null);
      setDrawerRefreshKey((prev) => prev + 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to release patient.';
      toast.error('Release Failed', msg);
    } finally {
      setReleaseSubmitting(false);
    }
  };

  // Submit patient delete
  const handleConfirmDeletePatient = async () => {
    if (!patientToDelete?._id) return;
    try {
      setPatientDeleteSubmitting(true);
      await PatientService.deletePatient(patientToDelete._id);
      toast.success('Record Removed', 'Patient record was removed.');
      setPatientToDelete(null);
      if (selectedPatientId === patientToDelete._id) {
        setSelectedPatientId(null);
      }
      setDrawerRefreshKey((prev) => prev + 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to remove patient.';
      toast.error('Delete Failed', msg);
    } finally {
      setPatientDeleteSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-x-clip">
      {/* background glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-150 h-150 rounded-full bg-primary/12 blur-[140px]" />
        <div className="absolute top-10 -right-32 w-150 h-150 rounded-full bg-secondary/12 blur-[150px]" />
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-175 h-175 rounded-full bg-primary/5 blur-[180px]" />
        <div className="absolute -bottom-40 left-1/4 w-162.5 h-162.5 rounded-full bg-secondary/8 blur-[160px]" />
      </div>

      {/* header */}
      <div className="sticky top-0 z-40 w-full pt-3 pb-2">
        <Container size="2xl">
          <DashboardHeader
            onMenuToggle={() => setSidebarOpen((prev) => !prev)}
            onProfileToggle={() => setProfileOpen((prev) => !prev)}
            isProfileOpen={profileOpen}
            admin={admin}
            onSelectDoctor={(doc) => {
              setSelectedPatientId(null);
              setSelectedDoctorId(doc._id);
            }}
            onSelectPatient={(pat) => {
              setSelectedDoctorId(null);
              setSelectedPatientId(pat._id);
            }}
          />
        </Container>
      </div>

      {/* main content */}
      <div className="relative flex-1 w-full flex flex-col py-3">
        <Container size="2xl" className="flex-1 flex gap-6 items-start">
          {/* Mobile navigation drawer */}
          <MobileNav
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            admin={admin}
          />

          {/* Large screen desktop sidebar */}
          <Sidebar admin={admin} />

          <main className="flex-1 min-w-0 space-y-8">
            {children}
          </main>

          <ProfileCard
            isOpen={profileOpen}
            onClose={() => setProfileOpen(false)}
            admin={admin}
          />

          {/* Global search quick detail preview drawers (accepts ID, shows skeleton, fetches by ID) */}
          <DoctorDetailCard
            key={`global-doc-${drawerRefreshKey}-${selectedDoctorId || 'none'}`}
            doctorId={selectedDoctorId}
            isOpen={!!selectedDoctorId}
            onClose={() => setSelectedDoctorId(null)}
            onEdit={(doc) => handleOpenEditDoctor(doc)}
            onDelete={(doc) => setDoctorToDelete(doc)}
            onAddPatient={handleOpenAddPatient}
            onRemovePatient={(patId, patName) => setPatientToDelete({ _id: patId, name: patName })}
            onReleasePatient={(pat) => setPatientToRelease(pat as unknown as Patient)}
            onAvatarUpdated={() => setDrawerRefreshKey((prev) => prev + 1)}
          />

          <PatientDetailCard
            key={`global-pat-${drawerRefreshKey}-${selectedPatientId || 'none'}`}
            patientId={selectedPatientId}
            isOpen={!!selectedPatientId}
            onClose={() => setSelectedPatientId(null)}
            onEdit={(pat) => handleOpenEditPatient(pat)}
            onRelease={(pat) => setPatientToRelease(pat)}
            onDelete={(pat) => setPatientToDelete(pat)}
            onAvatarUpdated={() => setDrawerRefreshKey((prev) => prev + 1)}
          />

          {/* Global action modals supporting actions triggered from anywhere */}
          <DoctorFormModal
            isOpen={!!editingDoctor}
            onClose={() => setEditingDoctor(null)}
            editingDoctor={editingDoctor}
            doctorForm={doctorForm}
            setDoctorForm={setDoctorForm}
            avatarPreviewUrl={doctorAvatarPreviewUrl}
            onAvatarChange={(file) => {
              setDoctorAvatarFile(file);
              setDoctorAvatarPreviewUrl(file ? URL.createObjectURL(file) : null);
            }}
            onSubmit={handleDoctorSubmit}
            submitting={doctorSubmitting}
          />

          <DoctorDeleteModal
            isOpen={!!doctorToDelete}
            onClose={() => setDoctorToDelete(null)}
            doctor={doctorToDelete}
            onConfirm={handleConfirmDeleteDoctor}
            loading={doctorDeleteSubmitting}
          />

          <PatientFormModal
            isOpen={isAddPatientModalOpen}
            onClose={() => {
              setIsAddPatientModalOpen(false);
              setEditingPatient(null);
            }}
            editingPatient={editingPatient}
            patientForm={patientForm}
            setPatientForm={setPatientForm}
            doctorsList={doctorsList}
            avatarPreviewUrl={patientAvatarPreviewUrl}
            onAvatarChange={(file) => {
              setPatientAvatarFile(file);
              setPatientAvatarPreviewUrl(file ? URL.createObjectURL(file) : null);
            }}
            onSubmit={handlePatientSubmit}
            submitting={patientSubmitting}
            title={editingPatient ? 'Edit Patient Record' : 'Register New Patient'}
            description={
              editingPatient
                ? 'Update clinical and contact details'
                : 'Add a new patient to clinical tracking'
            }
          />

          <ReleasePatientModal
            isOpen={!!patientToRelease}
            onClose={() => setPatientToRelease(null)}
            patient={patientToRelease}
            onConfirmRelease={handleConfirmReleasePatient}
            loading={releaseSubmitting}
          />

          <PatientDeleteModal
            isOpen={!!patientToDelete}
            onClose={() => setPatientToDelete(null)}
            patient={patientToDelete}
            onConfirm={handleConfirmDeletePatient}
            loading={patientDeleteSubmitting}
          />
        </Container>
      </div>
    </div>
  );
};
