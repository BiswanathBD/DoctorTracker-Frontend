'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import { Button, Card, toast, PageHeader } from '@/components/ui';
import { DoctorDetailCard } from '@/components/layout/DoctorDetailCard';
import { DoctorCard } from '@/components/doctors/DoctorCard';
import { DoctorFilters } from '@/components/doctors/DoctorFilters';
import { DoctorSkeletonGrid } from '@/components/skeletons/DoctorCardSkeleton';
import { DoctorFormModal } from '@/components/modals/DoctorFormModal';
import { DoctorDeleteModal } from '@/components/modals/DoctorDeleteModal';
import { PatientDeleteModal } from '@/components/modals/PatientDeleteModal';
import { PatientFormModal } from '@/components/modals/PatientFormModal';
import { DoctorDetailModal } from '@/components/modals/DoctorDetailModal';
import { DoctorService, type Doctor, type DoctorFormData } from '@/server/doctor.service';
import { PatientService } from '@/server/patient.service';
import type { PatientFormData } from '@/types/patient.types';
import {
  Stethoscope,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

function DoctorsContent() {
  const searchParams = useSearchParams();

  // state for list, pagination & filters
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const limit = 9;

  // filter states
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const isDebouncing = searchInput !== debouncedSearch;
  const [specialization, setSpecialization] = useState('');
  const [hospital, setHospital] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortValue, setSortValue] = useState('createdAt-desc');

  // filter options fetched from database
  const [specializationsList, setSpecializationsList] = useState<string[]>([]);
  const [hospitalsList, setHospitalsList] = useState<string[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(false);

  // modal & card states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
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

  // form states
  const [doctorForm, setDoctorForm] = useState<DoctorFormData>({
    name: '',
    specialization: '',
    hospital: '',
    phone: '',
    email: '',
  });
  const [doctorAvatarFile, setDoctorAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // handle avatar file selection
  const handleAvatarChange = useCallback((file: File | null) => {
    setDoctorAvatarFile(file);
    if (file) {
      setAvatarPreviewUrl(URL.createObjectURL(file));
    } else {
      setAvatarPreviewUrl(editingDoctor?.avatar?.url || null);
    }
  }, [editingDoctor]);

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
  });
  const [patientAvatarFile, setPatientAvatarFile] = useState<File | null>(null);
  const [patientAvatarPreviewUrl, setPatientAvatarPreviewUrl] = useState<string | null>(null);
  const [patientSubmitting, setPatientSubmitting] = useState(false);

  // open assign patient modal for doctor
  const handleOpenAddPatientModal = useCallback((doc?: Doctor | null) => {
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
    });
    setIsAddPatientModalOpen(true);
  }, [selectedDoctor]);

  // open create modal
  const handleOpenCreateModal = useCallback(() => {
    setEditingDoctor(null);
    setDoctorAvatarFile(null);
    setAvatarPreviewUrl(null);
    setDoctorForm({
      name: '',
      specialization: '',
      hospital: '',
      phone: '',
      email: '',
    });
    setIsFormModalOpen(true);
  }, []);

  // typing delay debounce for database search (350ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 350);

    return () => clearTimeout(handler);
  }, [searchInput]);

  // fetch distinct filter options directly from entire database
  const fetchFilterOptions = useCallback(async () => {
    try {
      setLoadingFilters(true);
      const [specs, hosps] = await Promise.all([
        DoctorService.getSpecializations(),
        DoctorService.getHospitals(),
      ]);
      setSpecializationsList(specs);
      setHospitalsList(hosps);
    } catch (err) {
      console.error('failed to fetch filter options from database:', err);
    } finally {
      setLoadingFilters(false);
    }
  }, []);

  // load filter options from database on mount
  useEffect(() => {
    let isMounted = true;
    Promise.all([DoctorService.getSpecializations(), DoctorService.getHospitals()])
      .then(([specs, hosps]) => {
        if (!isMounted) return;
        setSpecializationsList(specs);
        setHospitalsList(hosps);
      })
      .catch((err) => console.error('initial filter load failed:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  // fetch doctors list with database search, filters & pagination
  const refreshDoctors = useCallback(() => {
    const [sortBy, sortOrder] = (sortValue.split('-') || ['createdAt', 'desc']) as [
      string,
      'asc' | 'desc'
    ];

    DoctorService.getAllDoctors({
      page,
      limit,
      searchTerm: debouncedSearch.trim() || undefined,
      specialization: specialization || undefined,
      hospital: hospital || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      sortBy,
      sortOrder,
    })
      .then((res) => {
        setDoctors(res.data);
        setTotal(res.meta.total);
        setTotalPages(res.meta.totalPages || 1);
      })
      .catch((err) => {
        console.error('failed to fetch doctors:', err);
        toast.error('Network Error', 'Could not load doctors list.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, limit, debouncedSearch, specialization, hospital, startDate, endDate, sortValue]);

  useEffect(() => {
    let isMounted = true;
    const [sortBy, sortOrder] = (sortValue.split('-') || ['createdAt', 'desc']) as [
      string,
      'asc' | 'desc'
    ];

    DoctorService.getAllDoctors({
      page,
      limit,
      searchTerm: debouncedSearch.trim() || undefined,
      specialization: specialization || undefined,
      hospital: hospital || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      sortBy,
      sortOrder,
    })
      .then((res) => {
        if (!isMounted) return;
        setDoctors(res.data);
        setTotal(res.meta.total);
        setTotalPages(res.meta.totalPages || 1);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('failed to fetch doctors:', err);
        toast.error('Network Error', 'Could not load doctors list.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [page, limit, debouncedSearch, specialization, hospital, startDate, endDate, sortValue]);

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
    setDoctorForm({
      name: doctor.name,
      specialization: doctor.specialization,
      hospital: doctor.hospital,
      phone: doctor.phone,
      email: doctor.email,
    });
    setIsFormModalOpen(true);
  };

  // handle submit create/edit doctor
  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorForm.name || !doctorForm.specialization || !doctorForm.hospital || !doctorForm.phone || !doctorForm.email) {
      toast.error('Validation Error', 'Please fill out all required fields.');
      return;
    }

    try {
      setFormSubmitting(true);
      if (editingDoctor) {
        // update existing doctor details
        const updated = await DoctorService.updateDoctor(editingDoctor._id, doctorForm);

        // if a new avatar file was chosen, upload it
        if (doctorAvatarFile) {
          const avatarRes = await DoctorService.updateAvatar(editingDoctor._id, doctorAvatarFile);
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

        // upload avatar if chosen
        if (doctorAvatarFile) {
          try {
            const avatarRes = await DoctorService.updateAvatar(created._id, doctorAvatarFile);
            created.avatar = avatarRes.avatar;
          } catch (avatarErr) {
            console.error('avatar upload failed after create:', avatarErr);
            toast.error('Avatar Notice', 'Doctor created, but avatar upload failed. You can re-upload anytime.');
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
      const docName = doctorToDelete.name.startsWith('Dr.') ? doctorToDelete.name : `Dr. ${doctorToDelete.name}`;
      toast.success('Doctor Deleted', `${docName} has been removed.`);
      setIsDeleteModalOpen(false);
      setDoctorToDelete(null);
      if (selectedDoctor?._id === doctorToDelete._id) {
        setIsDetailModalOpen(false);
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

      const doctorTitle = selectedDoctor.name.startsWith('Dr.') ? selectedDoctor.name : `Dr. ${selectedDoctor.name}`;
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
  const handleRemovePatient = (patientId: string, patientName: string) => {
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
      refreshDoctors();
    } catch (err: unknown) {
      console.error('remove patient error:', err);
      const message = err instanceof Error ? err.message : 'Could not remove patient.';
      toast.error('Removal Failed', message);
    } finally {
      setPatientRemoveSubmitting(false);
    }
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setSpecialization('');
    setHospital('');
    setStartDate('');
    setEndDate('');
    setSortValue('createdAt-desc');
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    debouncedSearch ||
      specialization ||
      hospital ||
      startDate ||
      endDate ||
      sortValue !== 'createdAt-desc'
  );

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
                onClick={handleOpenCreateModal}
                variant="primary"
                size="md"
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add New Doctor
              </Button>
            }
          />
        </MotionWrapper>

        {/* modern redesigned filter & search station */}
        <MotionWrapper delay={0.1} direction="up" className="relative z-30">
          <DoctorFilters
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            debouncedSearch={debouncedSearch}
            isDebouncing={isDebouncing}
            specialization={specialization}
            setSpecialization={setSpecialization}
            specializationsList={specializationsList}
            hospital={hospital}
            setHospital={setHospital}
            hospitalsList={hospitalsList}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            sortValue={sortValue}
            setSortValue={setSortValue}
            total={total}
            loading={loading}
            loadingFilters={loadingFilters}
            onResetFilters={handleResetFilters}
            setPage={setPage}
          />
        </MotionWrapper>

        {/* doctors list cards grid */}
        {loading ? (
          <DoctorSkeletonGrid count={6} />
        ) : doctors.length === 0 ? (
          <Card className="py-16 text-center space-y-4 px-4">
            <div className="w-14 h-14 rounded-2xl bg-accent text-accent-foreground mx-auto flex items-center justify-center">
              <Stethoscope className="w-7 h-7 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-foreground text-base">No doctors found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {hasActiveFilters
                  ? 'No doctors match your selected filters. Try adjusting your query or clear all filters.'
                  : 'Get started by creating your first doctor profile.'}
              </p>
            </div>
            {hasActiveFilters ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                leftIcon={<X className="w-3.5 h-3.5" />}
                className="mx-auto"
              >
                Reset All Filters
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenCreateModal}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                className="mx-auto"
              >
                Create First Doctor
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {doctors.map((doctor, idx) => (
                <DoctorCard
                  key={doctor._id}
                  doctor={doctor}
                  index={idx}
                  onViewDetails={handleViewDoctorDetails}
                  onEdit={handleOpenEditModal}
                  onDelete={(doc) => {
                    setDoctorToDelete(doc);
                    setIsDeleteModalOpen(true);
                  }}
                />
              ))}
            </div>

            {/* pagination controls */}
            {totalPages > 1 && (
              <Card className="p-3.5 sm:p-4.5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground bg-card/85 backdrop-blur-xl border border-border/80 shadow-md rounded-3xl">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <p className="font-medium text-muted-foreground">
                    Showing <strong className="text-foreground font-bold">{(page - 1) * limit + 1}</strong> to{' '}
                    <strong className="text-foreground font-bold">{Math.min(page * limit, total)}</strong> of{' '}
                    <strong className="text-foreground font-bold">{total}</strong> doctors
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  {/* first page jump */}
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage(1)}
                    className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                    title="First page"
                  >
                    <ChevronsLeft className="w-3.5 h-3.5" />
                  </button>

                  {/* previous page */}
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border/70 hover:border-primary/50 text-foreground hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-xs transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Prev</span>
                  </button>

                  {/* page number buttons */}
                  <div className="flex items-center gap-1">
                    {(() => {
                      const pages: (number | string)[] = [];
                      if (totalPages <= 5) {
                        for (let i = 1; i <= totalPages; i++) pages.push(i);
                      } else {
                        if (page <= 3) {
                          pages.push(1, 2, 3, '…', totalPages);
                        } else if (page >= totalPages - 2) {
                          pages.push(1, '…', totalPages - 2, totalPages - 1, totalPages);
                        } else {
                          pages.push(1, '…', page - 1, page, page + 1, '…', totalPages);
                        }
                      }

                      return pages.map((p, idx) =>
                        typeof p === 'number' ? (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setPage(p)}
                            className={`min-w-8 h-8 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              p === page
                                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-105'
                                : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {p}
                          </button>
                        ) : (
                          <span key={idx} className="px-1 text-xs text-muted-foreground select-none">
                            {p}
                          </span>
                        )
                      );
                    })()}
                  </div>

                  {/* next page */}
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border/70 hover:border-primary/50 text-foreground hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-xs transition-all cursor-pointer"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {/* last page jump */}
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage(totalPages)}
                    className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                    title="Last page"
                  >
                    <ChevronsRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* side slide-in sheet for detailed doctor information */}
      <DoctorDetailCard
        doctor={selectedDoctor}
        isOpen={isDetailCardOpen}
        loadingPatients={loadingDoctorDetails}
        onClose={() => setIsDetailCardOpen(false)}
        onAvatarUpdated={(updatedDoc) => {
          setSelectedDoctor(updatedDoc);
          setDoctors((prev) =>
            prev.map((d) => (d._id === updatedDoc._id ? { ...d, avatar: updatedDoc.avatar } : d))
          );
        }}
        onEdit={(doc) => {
          setIsDetailCardOpen(false);
          handleOpenEditModal(doc);
        }}
        onDelete={(doc) => {
          setDoctorToDelete(doc);
          setIsDeleteModalOpen(true);
        }}
        onAddPatient={() => handleOpenAddPatientModal(selectedDoctor)}
        onRemovePatient={handleRemovePatient}
      />

      {/* modal: create / edit doctor */}
      <DoctorFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        editingDoctor={editingDoctor}
        doctorForm={doctorForm}
        setDoctorForm={setDoctorForm}
        avatarPreviewUrl={avatarPreviewUrl}
        onAvatarChange={handleAvatarChange}
        onSubmit={handleDoctorSubmit}
        submitting={formSubmitting}
      />

      {/* modal: view doctor details & corresponding patients */}
      <DoctorDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        doctor={selectedDoctor}
        onAddPatient={() => handleOpenAddPatientModal(selectedDoctor)}
        onRemovePatient={handleRemovePatient}
      />

      {/* modal: add patient directly under selected doctor */}
      <PatientFormModal
        isOpen={isAddPatientModalOpen}
        onClose={() => setIsAddPatientModalOpen(false)}
        editingPatient={null}
        patientForm={patientForm}
        setPatientForm={setPatientForm}
        doctorsList={selectedDoctor ? [selectedDoctor] : doctors}
        avatarPreviewUrl={patientAvatarPreviewUrl}
        onAvatarChange={(file) => {
          setPatientAvatarFile(file);
          setPatientAvatarPreviewUrl(file ? URL.createObjectURL(file) : null);
        }}
        onSubmit={handleAddPatientSubmit}
        submitting={patientSubmitting}
        disableDoctorSelect={true}
        title={`Add Patient under ${selectedDoctor ? (selectedDoctor.name.startsWith('Dr.') ? selectedDoctor.name : `Dr. ${selectedDoctor.name}`) : 'Doctor'}`}
        description="Create and assign a patient directly to this specialist."
      />

      {/* modal: delete doctor confirmation */}
      <DoctorDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        doctor={doctorToDelete}
        onConfirm={handleDeleteDoctor}
      />

      {/* modal: confirm remove patient from doctor */}
      <PatientDeleteModal
        isOpen={isPatientDeleteModalOpen}
        onClose={() => {
          setIsPatientDeleteModalOpen(false);
          setPatientToRemove(null);
        }}
        patient={patientToRemove ? { name: patientToRemove.name, _id: patientToRemove.id } : null}
        onConfirm={handleConfirmRemovePatient}
        loading={patientRemoveSubmitting}
        title="Delete Patient Record"
        description="Are you sure you want to permanently delete this patient record?"
        confirmLabel="Delete Patient"
        warningText={
          <p>
            Deleting <strong>{patientToRemove?.name}</strong> will permanently remove their record and admission history from{' '}
            {selectedDoctor?.name.startsWith('Dr.') ? selectedDoctor.name : `Dr. ${selectedDoctor?.name || 'Doctor'}`}{' '}
            and the patient directory. This action cannot be reversed.
          </p>
        }
      />
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
