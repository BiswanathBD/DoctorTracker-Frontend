'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import { Button, Input, Card, Badge, Modal, toast, PageHeader, Select } from '@/components/ui';
import { DoctorDetailCard } from '@/components/layout/DoctorDetailCard';
import { DoctorService, type Doctor } from '@/server/doctor.service';
import {
  Stethoscope,
  Plus,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit2,
  Trash2,
  Building2,
  Phone,
  Mail,
  Users,
  Calendar,
  UserPlus,
  HeartPulse,
  AlertCircle,
  Camera,
  Check,
  Loader2,
  RotateCcw,
  SlidersHorizontal
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

  // filter options fetched from database
  const [specializationsList, setSpecializationsList] = useState<string[]>([]);
  const [hospitalsList, setHospitalsList] = useState<string[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(false);

  // modal & card states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDetailCardOpen, setIsDetailCardOpen] = useState(false);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // active targets for modals
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);

  // form states
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    specialization: '',
    hospital: '',
    phone: '',
    email: '',
  });
  const [doctorAvatarFile, setDoctorAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const avatarInputRef = React.useRef<HTMLInputElement>(null);
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
  const [patientForm, setPatientForm] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    condition: '',
  });
  const [patientSubmitting, setPatientSubmitting] = useState(false);

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
      .catch((err) => console.error('failed to fetch filter options:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  // fetch doctors list with database search, filters & pagination
  const refreshDoctors = useCallback(() => {
    DoctorService.getAllDoctors({
      page,
      limit,
      searchTerm: debouncedSearch.trim() || undefined,
      specialization: specialization || undefined,
      hospital: hospital || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    })
      .then((res) => {
        setDoctors(res.data);
        setTotal(res.meta.total);
        setTotalPages(res.meta.totalPages);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'failed to load doctors';
        toast.error('Error loading doctors', msg);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, limit, debouncedSearch, specialization, hospital, startDate, endDate]);

  useEffect(() => {
    let isMounted = true;
    DoctorService.getAllDoctors({
      page,
      limit,
      searchTerm: debouncedSearch.trim() || undefined,
      specialization: specialization || undefined,
      hospital: hospital || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    })
      .then((res) => {
        if (!isMounted) return;
        setDoctors(res.data);
        setTotal(res.meta.total);
        setTotalPages(res.meta.totalPages);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : 'failed to load doctors';
        toast.error('Error loading doctors', msg);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [page, limit, debouncedSearch, specialization, hospital, startDate, endDate]);

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

  // view doctor details & patients in right slide-in card
  const handleViewDetails = async (doctorId: string) => {
    try {
      const detail = await DoctorService.getDoctorById(doctorId);
      setSelectedDoctor(detail);
      setIsDetailCardOpen(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'failed to load doctor details';
      toast.error('Error', msg);
    }
  };

  // submit doctor form (create or update)
  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorForm.name || !doctorForm.specialization || !doctorForm.hospital || !doctorForm.phone || !doctorForm.email) {
      toast.error('Missing fields', 'Please fill out all required doctor fields.');
      return;
    }

    try {
      setFormSubmitting(true);
      if (editingDoctor) {
        await DoctorService.updateDoctor(editingDoctor._id, doctorForm);
        if (doctorAvatarFile) {
          await DoctorService.updateAvatar(editingDoctor._id, doctorAvatarFile);
        }
        toast.success('Doctor Updated', `${doctorForm.name}'s profile was updated.`);
      } else {
        const created = await DoctorService.createDoctor(doctorForm);
        if (doctorAvatarFile) {
          await DoctorService.updateAvatar(created._id, doctorAvatarFile);
        }
        toast.success('Doctor Created', `${doctorForm.name} was added to the directory.`);
      }

      setIsFormModalOpen(false);
      refreshDoctors();
      fetchFilterOptions();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'operation failed';
      toast.error('Action Failed', msg);
    } finally {
      setFormSubmitting(false);
    }
  };

  // confirm delete doctor
  const handleDeleteDoctor = async () => {
    if (!doctorToDelete) return;
    try {
      await DoctorService.deleteDoctor(doctorToDelete._id);
      toast.success('Doctor Deleted', `${doctorToDelete.name} and assigned records removed.`);
      setIsDeleteModalOpen(false);
      setDoctorToDelete(null);
      refreshDoctors();
      fetchFilterOptions();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'failed to delete doctor';
      toast.error('Delete Failed', msg);
    }
  };

  // add patient under selected doctor
  const handleAddPatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) return;

    if (!patientForm.name || !patientForm.age || !patientForm.phone || !patientForm.condition) {
      toast.error('Missing fields', 'Please enter patient name, age, phone, and condition.');
      return;
    }

    try {
      setPatientSubmitting(true);
      await DoctorService.addPatientToDoctor(selectedDoctor._id, {
        ...patientForm,
        age: Number(patientForm.age),
      });

      toast.success('Patient Added', `${patientForm.name} assigned to Dr. ${selectedDoctor.name}.`);
      setIsAddPatientModalOpen(false);
      setPatientForm({
        name: '',
        age: '',
        gender: 'Male',
        phone: '',
        email: '',
        condition: '',
      });

      // refresh doctor detail and list
      const refreshedDoc = await DoctorService.getDoctorById(selectedDoctor._id);
      setSelectedDoctor(refreshedDoc);
      refreshDoctors();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'failed to add patient';
      toast.error('Action Failed', msg);
    } finally {
      setPatientSubmitting(false);
    }
  };

  // remove patient from selected doctor's list
  const handleRemovePatient = async (patientId: string, patientName: string) => {
    if (!selectedDoctor) return;
    if (!confirm(`Are you sure you want to remove ${patientName} from this doctor's list?`)) return;

    try {
      await DoctorService.removePatientFromDoctor(selectedDoctor._id, patientId);
      toast.success('Patient Removed', `${patientName} was removed from the list.`);

      // refresh selected doctor
      const refreshedDoc = await DoctorService.getDoctorById(selectedDoctor._id);
      setSelectedDoctor(refreshedDoc);
      refreshDoctors();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'failed to remove patient';
      toast.error('Action Failed', msg);
    }
  };

  // reset all filters
  const handleResetFilters = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setSpecialization('');
    setHospital('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    debouncedSearch || specialization || hospital || startDate || endDate
  );

  return (
    <div className="w-full flex gap-6 items-start">
      <div className="flex-1 min-w-0 space-y-7">
        {/* header */}
        <MotionWrapper direction="up">
          <PageHeader
            icon={<Stethoscope size={42} strokeWidth={1.2} />}
            title="Doctor Management"
            subtitle="Register medical specialists, filter hospital directories, and manage patient assignments."
            actions={
              <Button
                onClick={handleOpenCreateModal}
                variant="primary"
                size="md"
                leftIcon={<Plus className="w-4 h-4" />}
                className="shadow-lg shadow-primary/25 cursor-pointer"
              >
                Add New Doctor
              </Button>
            }
          />
        </MotionWrapper>

        {/* modern redesigned filter & search station */}
        <MotionWrapper delay={0.1} direction="up" className="relative z-30">
          <Card className="p-4 sm:p-5 space-y-4 overflow-visible relative z-30 shadow-lg border border-border/80 bg-card/85 backdrop-blur-xl">
            {/* ambient top-right subtle glow */}
            <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary/10 blur-2xl" />

            {/* top title & status bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1 border-b border-border/50">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-foreground">Directory Search & Filters</span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground font-semibold">
                  {loading ? 'Searching...' : `${total} ${total === 1 ? 'Doctor' : 'Doctors'} Found`}
                </span>
                {loadingFilters && (
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin text-primary" />
                    Syncing database...
                  </span>
                )}
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-bold transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All Filters</span>
                </button>
              )}
            </div>

            {/* main filter controls grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
              {/* search input with typing delay */}
              <div className="lg:col-span-5 relative">
                <div className="relative flex items-center w-full rounded-xl border border-input bg-card transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-ring/15">
                  <div className="pl-3.5 pr-2 flex items-center justify-center text-muted-foreground pointer-events-none">
                    {isDebouncing ? (
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search by name, specialization, hospital, email..."
                    className="w-full py-2.5 pr-8 text-xs bg-transparent text-foreground placeholder:text-muted-foreground/60 outline-none"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => setSearchInput('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground rounded-md transition-colors cursor-pointer"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* specialization select */}
              <div className="lg:col-span-3">
                <Select
                  value={specialization}
                  onChange={(val) => {
                    setSpecialization(val);
                    setPage(1);
                  }}
                  options={[
                    { label: 'All Specializations', value: '' },
                    ...specializationsList.map((spec) => ({
                      label: spec,
                      value: spec,
                      icon: <HeartPulse className="w-3 h-3 text-primary" />,
                    })),
                  ]}
                  placeholder={
                    specializationsList.length > 0
                      ? `Specialization (${specializationsList.length})`
                      : 'All Specializations'
                  }
                  icon={<HeartPulse className="w-3.5 h-3.5 text-primary" />}
                  clearable
                />
              </div>

              {/* hospital select */}
              <div className="lg:col-span-2">
                <Select
                  value={hospital}
                  onChange={(val) => {
                    setHospital(val);
                    setPage(1);
                  }}
                  options={[
                    { label: 'All Hospitals', value: '' },
                    ...hospitalsList.map((hosp) => ({
                      label: hosp,
                      value: hosp,
                      icon: <Building2 className="w-3.5 h-3.5 text-primary" />,
                    })),
                  ]}
                  placeholder={
                    hospitalsList.length > 0
                      ? `Hospital (${hospitalsList.length})`
                      : 'All Hospitals'
                  }
                  icon={<Building2 className="w-3.5 h-3.5 text-primary" />}
                  clearable
                />
              </div>

              {/* date range filter */}
              <div className="lg:col-span-2">
                <div className="flex items-center w-full rounded-xl border border-input bg-card px-2.5 py-1.5 focus-within:border-primary focus-within:ring-4 focus-within:ring-ring/15 transition-all text-xs">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0 mr-1.5" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setPage(1);
                    }}
                    title="Start Date"
                    className="w-1/2 text-[11px] bg-transparent text-foreground outline-none cursor-pointer"
                  />
                  <span className="text-muted-foreground/50 px-1">→</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setPage(1);
                    }}
                    title="End Date"
                    className="w-1/2 text-[11px] bg-transparent text-foreground outline-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* active filter chips bar */}
            {hasActiveFilters && (
              <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-semibold text-muted-foreground mr-1 flex items-center gap-1">
                    <Filter className="w-3 h-3 text-primary" />
                    Filters:
                  </span>

                  {debouncedSearch && (
                    <button
                      type="button"
                      onClick={() => setSearchInput('')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium text-[11px] transition-colors cursor-pointer group"
                    >
                      <span>Search: &ldquo;{debouncedSearch}&rdquo;</span>
                      <X className="w-3 h-3 group-hover:scale-110" />
                    </button>
                  )}

                  {specialization && (
                    <button
                      type="button"
                      onClick={() => setSpecialization('')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary font-medium text-[11px] transition-colors cursor-pointer group"
                    >
                      <span>Spec: {specialization}</span>
                      <X className="w-3 h-3 group-hover:scale-110" />
                    </button>
                  )}

                  {hospital && (
                    <button
                      type="button"
                      onClick={() => setHospital('')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-medium text-[11px] transition-colors cursor-pointer group border border-border"
                    >
                      <span>Hosp: {hospital}</span>
                      <X className="w-3 h-3 group-hover:scale-110" />
                    </button>
                  )}

                  {(startDate || endDate) && (
                    <button
                      type="button"
                      onClick={() => {
                        setStartDate('');
                        setEndDate('');
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-medium text-[11px] transition-colors cursor-pointer group border border-border"
                    >
                      <span>{startDate || 'Any'} → {endDate || 'Now'}</span>
                      <X className="w-3 h-3 group-hover:scale-110" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-primary hover:underline font-bold text-xs cursor-pointer ml-auto shrink-0"
                >
                  Clear all
                </button>
              </div>
            )}
          </Card>
        </MotionWrapper>

        {/* doctors list cards grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-5 space-y-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-muted shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded-md w-3/4" />
                    <div className="h-3 bg-muted rounded-md w-1/2" />
                  </div>
                </div>
                <div className="h-9 bg-muted/60 rounded-xl" />
                <div className="space-y-2 pt-2">
                  <div className="h-3 bg-muted rounded w-2/3" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
                <div className="pt-3 border-t border-border flex justify-between items-center">
                  <div className="h-6 w-16 bg-muted rounded-full" />
                  <div className="h-7 w-20 bg-muted rounded-xl" />
                </div>
              </Card>
            ))}
          </div>
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
              >
                Clear Filters
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenCreateModal}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Add First Doctor
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {doctors.map((doctor, idx) => (
                <MotionWrapper
                  key={doctor._id}
                  animationType="fadeUp"
                  delay={0.04 * (idx % 9)}
                  duration={0.3}
                >
                  <Card className="relative overflow-hidden group hover:shadow-xl hover:border-primary/40 transition-all duration-300 p-5 flex flex-col justify-between h-full space-y-4">
                    {/* ambient hover glow */}
                    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* top section: avatar, name, specialization, actions */}
                    <div className="space-y-3 relative">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* doctor avatar */}
                          <div className="relative w-12 h-12 rounded-2xl bg-primary/10 text-primary overflow-hidden flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20 shadow-xs group-hover:scale-105 transition-transform duration-300">
                            {doctor.avatar?.url ? (
                              <Image
                                src={doctor.avatar.url}
                                alt={doctor.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            ) : (
                              <Stethoscope className="w-6 h-6" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <h3
                              onClick={() => handleViewDetails(doctor._id)}
                              className="font-bold text-foreground group-hover:text-primary transition-colors text-sm truncate cursor-pointer"
                              title={doctor.name}
                            >
                              {doctor.name}
                            </h3>
                            <Badge variant="primary" className="mt-1 text-[10px] font-semibold">
                              {doctor.specialization}
                            </Badge>
                          </div>
                        </div>

                        {/* quick action icons */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleViewDetails(doctor._id)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(doctor)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                            title="Edit Doctor"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDoctorToDelete(doctor);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                            title="Delete Doctor"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* hospital badge box */}
                      <div className="flex items-center gap-2 text-xs font-medium text-foreground bg-muted/40 px-3 py-2 rounded-xl border border-border/50">
                        <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate">{doctor.hospital}</span>
                      </div>

                      {/* contact info */}
                      <div className="space-y-1.5 pt-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-secondary shrink-0" />
                          <span className="truncate font-medium">{doctor.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="truncate">{doctor.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground/70 pt-0.5">
                          <Calendar className="w-3 h-3 shrink-0" />
                          <span>Added {new Date(doctor.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* bottom footer: patient count & view details button */}
                    <div className="pt-3 border-t border-border flex items-center justify-between gap-2 relative">
                      <button
                        type="button"
                        onClick={() => handleViewDetails(doctor._id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 hover:bg-secondary/20 text-secondary font-bold text-xs transition-colors cursor-pointer"
                        title="View assigned patients"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{doctor.patientCount || 0} Patients</span>
                      </button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(doctor._id)}
                        rightIcon={<ChevronRight className="w-3 h-3" />}
                        className="text-xs"
                      >
                        Details
                      </Button>
                    </div>
                  </Card>
                </MotionWrapper>
              ))}
            </div>

            {/* pagination bar */}
            {total > 0 && (
              <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
                <p>
                  Showing <strong className="text-foreground">{(page - 1) * limit + 1}</strong> to{' '}
                  <strong className="text-foreground">{Math.min(page * limit, total)}</strong> of{' '}
                  <strong className="text-foreground">{total}</strong> registered doctors
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
                  >
                    Previous
                  </Button>

                  <div className="px-3 py-1 font-bold text-foreground">
                    Page {page} of {totalPages}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                  >
                    Next
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* right slide-in doctor details card matching profile card style */}
      <DoctorDetailCard
        doctor={selectedDoctor}
        isOpen={isDetailCardOpen}
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
        onAddPatient={() => {
          setIsAddPatientModalOpen(true);
        }}
        onRemovePatient={handleRemovePatient}
      />

      {/* modal: create / edit doctor */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingDoctor ? 'Edit Doctor' : 'Add Doctor'}
        description={
          editingDoctor
            ? 'Update doctor credentials and affiliation'
            : 'Register a new doctor to the directory'
        }
        icon={<Stethoscope className="w-5 h-5" />}
        maxWidth="xl"
      >
        <form onSubmit={handleDoctorSubmit} className="space-y-4">
          {/* row 1: profile photo on left, name & specialization stacked on right */}
          <div className="flex flex-col sm:flex-row gap-3.5 items-stretch">
            {/* profile avatar upload */}
            <MotionWrapper
              animationType="scale"
              delay={0.1}
              duration={0.3}
              className="shrink-0 w-full sm:w-36 md:w-40 aspect-square sm:aspect-auto self-stretch flex flex-col"
            >
              <div className="relative group w-full h-full min-h-35 flex-1 flex flex-col">
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleAvatarChange(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <div
                  onClick={() => !formSubmitting && avatarInputRef.current?.click()}
                  className={`relative w-full h-full min-h-[140px] flex-1 rounded-3xl bg-muted/40 border border-border overflow-hidden flex flex-col items-center justify-center transition-all duration-200 group ${
                    formSubmitting
                      ? 'opacity-60 cursor-not-allowed pointer-events-none'
                      : 'hover:bg-muted/70 hover:border-primary cursor-pointer'
                  }`}
                >
                  {avatarPreviewUrl ? (
                    <Image
                      src={avatarPreviewUrl}
                      alt={doctorForm.name || 'Doctor Profile'}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-3 text-center text-muted-foreground group-hover:text-primary transition-colors">
                      <div className="w-11 h-11 rounded-full bg-card shadow-sm flex items-center justify-center text-primary mb-1.5 group-hover:scale-110 transition-transform">
                        <Camera className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-foreground">Profile</span>
                      <span className="text-[10px] text-muted-foreground mt-0.5">Click to upload</span>
                    </div>
                  )}

                  {/* hover overlay */}
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200">
                    <Camera className="w-5 h-5 mb-1" />
                    <span className="text-[11px] font-bold">
                      {avatarPreviewUrl ? 'Change Photo' : 'Upload Photo'}
                    </span>
                  </div>
                </div>

                {/* remove photo trigger */}
                {avatarPreviewUrl && !formSubmitting && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAvatarChange(null);
                      if (avatarInputRef.current) avatarInputRef.current.value = '';
                    }}
                    className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </MotionWrapper>

            {/* name and specialization stacked */}
            <div className="flex-1 flex flex-col justify-between gap-3.5">
              <MotionWrapper animationType="fadeRight" delay={0.15} duration={0.3}>
                <Input
                  label="Name"
                  placeholder="Dr. Alexander Wright, MD"
                  required
                  disabled={formSubmitting}
                  value={doctorForm.name}
                  onFocus={() => {
                    if (!doctorForm.name) {
                      setDoctorForm((prev) => ({ ...prev, name: 'Dr. ' }));
                    }
                  }}
                  onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                  leftIcon={<Stethoscope className="w-4 h-4" />}
                />
              </MotionWrapper>

              <MotionWrapper animationType="fadeRight" delay={0.22} duration={0.3}>
                <Input
                  label="Specialization"
                  placeholder="e.g. Cardiology, Neurology"
                  required
                  disabled={formSubmitting}
                  value={doctorForm.specialization}
                  onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                  leftIcon={<HeartPulse className="w-4 h-4" />}
                />
              </MotionWrapper>
            </div>
          </div>

          {/* row 2: primary affiliated hospital (full width) */}
          <MotionWrapper animationType="fadeUp" delay={0.3} duration={0.3}>
            <Input
              label="Primary Affiliated Hospital"
              placeholder="e.g. Metro General Hospital"
              required
              disabled={formSubmitting}
              value={doctorForm.hospital}
              onChange={(e) => setDoctorForm({ ...doctorForm, hospital: e.target.value })}
              leftIcon={<Building2 className="w-4 h-4" />}
            />
          </MotionWrapper>

          {/* row 3: direct contact & communication */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <MotionWrapper animationType="fadeUp" delay={0.38} duration={0.3}>
              <Input
                label="Phone"
                placeholder="+880 1712-345678"
                required
                disabled={formSubmitting}
                value={doctorForm.phone}
                onChange={(e) => setDoctorForm({ ...doctorForm, phone: e.target.value })}
                leftIcon={<Phone className="w-4 h-4" />}
              />
            </MotionWrapper>

            <MotionWrapper animationType="fadeUp" delay={0.44} duration={0.3}>
              <Input
                label="Email"
                type="email"
                placeholder="doctor@hospital.org"
                required
                disabled={formSubmitting}
                value={doctorForm.email}
                onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                leftIcon={<Mail className="w-4 h-4" />}
              />
            </MotionWrapper>
          </div>

          {/* modal footer */}
          <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
            <MotionWrapper animationType="fadeUp" delay={0.5} duration={0.3}>
              <Button
                type="button"
                variant="destructive"
                disabled={formSubmitting}
                onClick={() => setIsFormModalOpen(false)}
                leftIcon={<X className="w-4 h-4" />}
              >
                Cancel
              </Button>
            </MotionWrapper>
            <MotionWrapper animationType="fadeUp" delay={0.56} duration={0.3}>
              <Button
                type="submit"
                variant="primary"
                loading={formSubmitting}
                leftIcon={editingDoctor ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              >
                {editingDoctor ? 'Save Changes' : 'Register Doctor'}
              </Button>
            </MotionWrapper>
          </div>
        </form>
      </Modal>

      {/* modal: view doctor details & corresponding patients */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedDoctor?.name || 'Doctor Details'}
        description={`Specialist profile and corresponding patient list (${selectedDoctor?.patientCount || 0} assigned)`}
        maxWidth="lg"
      >
        {selectedDoctor && (
          <div className="space-y-6">
            {/* doctor summary card */}
            <div className="p-4 rounded-2xl bg-muted/40 border border-border grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <p className="text-muted-foreground font-semibold">Specialization</p>
                <Badge variant="primary" className="mt-1">
                  {selectedDoctor.specialization}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground font-semibold">Hospital</p>
                <p className="font-bold text-foreground mt-1 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                  {selectedDoctor.hospital}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground font-semibold">Contact Info</p>
                <p className="text-foreground font-medium mt-1">{selectedDoctor.phone}</p>
                <p className="text-muted-foreground text-[11px] truncate">{selectedDoctor.email}</p>
              </div>
            </div>

            {/* assigned patients section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-foreground">Corresponding Patients</h4>
                  <p className="text-[11px] text-muted-foreground">
                    Patients receiving care under Dr. {selectedDoctor.name}
                  </p>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<UserPlus className="w-3.5 h-3.5" />}
                  onClick={() => setIsAddPatientModalOpen(true)}
                >
                  Add Patient Under Doctor
                </Button>
              </div>

              {selectedDoctor.patients && selectedDoctor.patients.length > 0 ? (
                <div className="border border-border rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-[10px] uppercase font-bold text-muted-foreground">
                        <th className="py-2.5 px-3">Patient Name</th>
                        <th className="py-2.5 px-3">Age / Gender</th>
                        <th className="py-2.5 px-3">Condition</th>
                        <th className="py-2.5 px-3">Phone</th>
                        <th className="py-2.5 px-3 text-right">Remove</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {selectedDoctor.patients.map((patient) => (
                        <tr key={patient._id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-foreground">{patient.name}</td>
                          <td className="py-2.5 px-3 text-muted-foreground">
                            {patient.age} yrs • {patient.gender}
                          </td>
                          <td className="py-2.5 px-3">
                            <Badge variant="warning">{patient.condition}</Badge>
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground">{patient.phone}</td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => handleRemovePatient(patient._id, patient.name)}
                              className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-muted/30 border border-dashed border-border text-center space-y-2">
                  <Users className="w-6 h-6 text-muted-foreground mx-auto" />
                  <p className="text-xs font-bold text-foreground">No patients assigned yet</p>
                  <p className="text-[11px] text-muted-foreground">
                    Click &ldquo;Add Patient Under Doctor&rdquo; above to assign a patient record.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-border flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setIsDetailModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* modal: add patient directly under selected doctor */}
      <Modal
        isOpen={isAddPatientModalOpen}
        onClose={() => setIsAddPatientModalOpen(false)}
        title={`Add Patient under Dr. ${selectedDoctor?.name}`}
        description="Create and assign a patient directly to this doctor."
        maxWidth="md"
      >
        <form onSubmit={handleAddPatientSubmit} className="space-y-4">
          <Input
            label="Patient Name"
            placeholder="John Doe"
            required
            disabled={patientSubmitting}
            value={patientForm.name}
            onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
            leftIcon={<Users className="w-4 h-4" />}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Age"
              type="number"
              placeholder="42"
              required
              disabled={patientSubmitting}
              value={patientForm.age}
              onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })}
            />

            <div className="w-full space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-foreground">Gender</label>
              <select
                disabled={patientSubmitting}
                value={patientForm.gender}
                onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-input bg-card text-foreground outline-none focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Medical Condition"
              placeholder="e.g. Hypertension, Arrhythmia"
              required
              disabled={patientSubmitting}
              value={patientForm.condition}
              onChange={(e) => setPatientForm({ ...patientForm, condition: e.target.value })}
              leftIcon={<HeartPulse className="w-4 h-4" />}
            />

            <Input
              label="Phone Number"
              placeholder="+880 1712-345678"
              required
              disabled={patientSubmitting}
              value={patientForm.phone}
              onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
              leftIcon={<Phone className="w-4 h-4" />}
            />
          </div>

          <Input
            label="Email Address (Optional)"
            type="email"
            placeholder="patient@gmail.com"
            disabled={patientSubmitting}
            value={patientForm.email}
            onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              disabled={patientSubmitting}
              onClick={() => setIsAddPatientModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="secondary" loading={patientSubmitting}>
              Add Patient
            </Button>
          </div>
        </form>
      </Modal>

      {/* modal: delete doctor confirmation */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Doctor Deletion"
        description="Are you sure you want to remove this doctor from the portal?"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-start gap-3 text-xs text-destructive">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Deleting <strong>{doctorToDelete?.name}</strong> will also automatically remove or cascade their assigned patient records. This action cannot be undone.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteDoctor}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function DoctorsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-muted-foreground">Loading doctor directory...</div>}>
      <DoctorsContent />
    </Suspense>
  );
}
