'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import { Button, Card, Badge, toast, PageHeader } from '@/components/ui';
import { Select } from '@/components/ui/Select';
import { DateRangeFilter } from '@/components/common/DateRangeFilter';
import { PatientDetailCard } from '@/components/layout/PatientDetailCard';
import { PatientSkeletonGrid } from '@/components/skeletons/PatientCardSkeleton';
import { PatientFormModal } from '@/components/modals/PatientFormModal';
import { PatientDeleteModal } from '@/components/modals/PatientDeleteModal';
import { Pagination } from '@/components/common/Pagination';
import { PatientService, type Patient } from '@/server/patient.service';
import { DoctorService, type Doctor } from '@/server/doctor.service';
import {
  Users,
  Plus,
  Search,
  Filter,
  X,
  Edit2,
  Trash2,
  Stethoscope,
  Phone,
  Calendar,
  HeartPulse,
  Eye,
  ArrowUpDown,
  Loader2,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';

function PatientsContent() {
  const searchParams = useSearchParams();

  // state for patients list & pagination
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const limit = 9;

  // filters and search state
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const isDebouncing = searchInput !== debouncedSearch;

  const [condition, setCondition] = useState('');
  const [gender, setGender] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortValue, setSortValue] = useState('createdAt-desc');

  // filter options fetched directly from database
  const [conditionsList, setConditionsList] = useState<string[]>([]);
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(false);

  // modal & card states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailCardOpen, setIsDetailCardOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  // form state
  const [patientForm, setPatientForm] = useState({
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
      const [conds, docsRes] = await Promise.all([
        PatientService.getConditions(),
        DoctorService.getAllDoctors({ page: 1, limit: 100 }),
      ]);
      setConditionsList(conds);
      setDoctorsList(docsRes.data);
    } catch (err) {
      console.error('failed to fetch filter options from database:', err);
    } finally {
      setLoadingFilters(false);
    }
  }, []);

  // load filter options from database on mount
  useEffect(() => {
    let isMounted = true;
    Promise.all([
      PatientService.getConditions(),
      DoctorService.getAllDoctors({ page: 1, limit: 100 }),
    ])
      .then(([conds, docsRes]) => {
        if (!isMounted) return;
        setConditionsList(conds);
        setDoctorsList(docsRes.data);
      })
      .catch((err) => console.error('failed to fetch filter options:', err));

    return () => {
      isMounted = false;
    };
  }, []);

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

  // refresh patients list
  const refreshPatients = useCallback(() => {
    const [sortBy, sortOrder] = (sortValue.split('-') || ['createdAt', 'desc']) as [
      string,
      'asc' | 'desc'
    ];

    PatientService.getAllPatients({
      page,
      limit,
      searchTerm: debouncedSearch.trim() || undefined,
      condition: condition || undefined,
      gender: gender || undefined,
      doctorId: doctorId || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      sortBy,
      sortOrder,
    })
      .then((res) => {
        setPatients(res.data);
        setTotal(res.meta.total);
        setTotalPages(res.meta.totalPages);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'failed to load patients';
        toast.error('Error loading patients', msg);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, limit, debouncedSearch, condition, gender, doctorId, startDate, endDate, sortValue]);

  // fetch patients on filter changes
  useEffect(() => {
    let isMounted = true;
    const [sortBy, sortOrder] = (sortValue.split('-') || ['createdAt', 'desc']) as [
      string,
      'asc' | 'desc'
    ];

    PatientService.getAllPatients({
      page,
      limit,
      searchTerm: debouncedSearch.trim() || undefined,
      condition: condition || undefined,
      gender: gender || undefined,
      doctorId: doctorId || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      sortBy,
      sortOrder,
    })
      .then((res) => {
        if (!isMounted) return;
        setPatients(res.data);
        setTotal(res.meta.total);
        setTotalPages(res.meta.totalPages);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : 'failed to load patients';
        toast.error('Error loading patients', msg);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [page, limit, debouncedSearch, condition, gender, doctorId, startDate, endDate, sortValue]);

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
      const url = URL.createObjectURL(file);
      setAvatarPreviewUrl(url);
    } else {
      setAvatarPreviewUrl(editingPatient?.avatar?.url || null);
    }
  };

  // submit form (create or edit)
  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientForm.name || !patientForm.age || !patientForm.phone || !patientForm.condition || !patientForm.doctorId) {
      toast.error('Missing fields', 'Please enter patient name, age, phone, condition, and select an attending doctor.');
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
        toast.success('Patient Registered', `${patientForm.name} has been admitted and assigned.`);
      }

      setIsFormModalOpen(false);
      refreshPatients();
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
      setPatientToDelete(null);
      refreshPatients();
      fetchFilterOptions();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'failed to delete patient';
      toast.error('Delete Failed', msg);
    }
  };

  // reset all filters
  const handleResetFilters = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setCondition('');
    setGender('');
    setDoctorId('');
    setStartDate('');
    setEndDate('');
    setSortValue('createdAt-desc');
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    debouncedSearch ||
      condition ||
      gender ||
      doctorId ||
      startDate ||
      endDate ||
      sortValue !== 'createdAt-desc'
  );

  return (
    <div className="w-full flex gap-6 items-start">
      <div className="flex-1 min-w-0 space-y-7">
        {/* page header */}
        <PageHeader
          icon={<Users size={42} strokeWidth={1.2} />}
          title="Patient Directory"
          subtitle="Track clinical admissions, monitor medical conditions, and assign specialist doctors."
          actions={
            <Button
              onClick={handleOpenCreateModal}
              variant="secondary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Register Patient
            </Button>
          }
        />

        {/* modern directory filter station */}
        <MotionWrapper delay={0.1} direction="up">
          <Card className="p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <span className="font-bold text-foreground">Directory Search & Filters</span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground font-semibold">
                  {loading ? 'Searching...' : `${total} ${total === 1 ? 'Patient' : 'Patients'} Found`}
                </span>
                {loadingFilters && (
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin text-secondary" />
                    Syncing database...
                  </span>
                )}
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-secondary/80 font-bold transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All Filters</span>
                </button>
              )}
            </div>

            {/* filter controls grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
              {/* search input */}
              <div className="lg:col-span-3 relative">
                <div className="relative flex items-center w-full h-10 rounded-2xl border border-border/80 bg-card transition-all hover:border-secondary/50 focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/15">
                  <div className="pl-3.5 pr-2 flex items-center justify-center text-muted-foreground pointer-events-none">
                    {isDebouncing ? (
                      <Loader2 className="w-3.5 h-3.5 text-secondary animate-spin" />
                    ) : (
                      <Search className="w-3.5 h-3.5 text-secondary" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search by patient name, condition, phone, email..."
                    className="w-full h-full pr-8 text-xs bg-transparent text-foreground placeholder:text-muted-foreground/60 outline-none font-medium"
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

              {/* condition select */}
              <div className="lg:col-span-2">
                <Select
                  value={condition}
                  onChange={(val) => {
                    setCondition(val);
                    setPage(1);
                  }}
                  options={[
                    { label: 'All Conditions', value: '' },
                    ...conditionsList.map((cond) => ({
                      label: cond,
                      value: cond,
                      icon: <HeartPulse className="w-3.5 h-3.5 text-secondary" />,
                    })),
                  ]}
                  placeholder={
                    conditionsList.length > 0
                      ? `Condition (${conditionsList.length})`
                      : 'All Conditions'
                  }
                  icon={<HeartPulse className="w-3.5 h-3.5 text-secondary" />}
                  clearable
                />
              </div>

              {/* attending doctor select */}
              <div className="lg:col-span-2">
                <Select
                  value={doctorId}
                  onChange={(val) => {
                    setDoctorId(val);
                    setPage(1);
                  }}
                  options={[
                    { label: 'All Doctors', value: '' },
                    ...doctorsList.map((doc) => ({
                      label: `${doc.name} (${doc.specialization})`,
                      value: doc._id,
                      icon: <Stethoscope className="w-3.5 h-3.5 text-primary" />,
                    })),
                  ]}
                  placeholder={
                    doctorsList.length > 0
                      ? `Doctor (${doctorsList.length})`
                      : 'All Doctors'
                  }
                  icon={<Stethoscope className="w-3.5 h-3.5 text-primary" />}
                  clearable
                />
              </div>

              {/* admission date range filter */}
              <div className="lg:col-span-2">
                <DateRangeFilter
                  startDate={startDate}
                  endDate={endDate}
                  label="Admission Date"
                  onChange={(start, end) => {
                    setStartDate(start);
                    setEndDate(end);
                    setPage(1);
                  }}
                />
              </div>

              {/* gender select */}
              <div className="lg:col-span-1">
                <Select
                  value={gender}
                  onChange={(val) => {
                    setGender(val);
                    setPage(1);
                  }}
                  options={[
                    { label: 'All', value: '' },
                    { label: 'Male', value: 'Male' },
                    { label: 'Female', value: 'Female' },
                    { label: 'Other', value: 'Other' },
                  ]}
                  placeholder="Gender"
                  icon={<Users className="w-3.5 h-3.5 text-muted-foreground" />}
                  clearable
                />
              </div>

              {/* sort by select */}
              <div className="lg:col-span-2">
                <Select
                  value={sortValue}
                  onChange={(val) => {
                    setSortValue(val || 'createdAt-desc');
                    setPage(1);
                  }}
                  options={[
                    { label: 'Newest Admitted', value: 'createdAt-desc' },
                    { label: 'Oldest Admitted', value: 'createdAt-asc' },
                    { label: 'Name (A → Z)', value: 'name-asc' },
                    { label: 'Name (Z → A)', value: 'name-desc' },
                    { label: 'Age (Youngest)', value: 'age-asc' },
                    { label: 'Age (Oldest)', value: 'age-desc' },
                    { label: 'Admission (Recent)', value: 'admissionDate-desc' },
                    { label: 'Admission (Oldest)', value: 'admissionDate-asc' },
                  ]}
                  placeholder="Sort By..."
                  icon={<ArrowUpDown className="w-3.5 h-3.5 text-secondary" />}
                />
              </div>
            </div>

            {/* active filter chips */}
            {hasActiveFilters && (
              <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-semibold text-muted-foreground mr-1 flex items-center gap-1">
                    <Filter className="w-3 h-3 text-secondary" />
                    Filters:
                  </span>

                  {debouncedSearch && (
                    <button
                      type="button"
                      onClick={() => setSearchInput('')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary font-medium text-[11px] transition-colors cursor-pointer group"
                    >
                      <span>Search: &ldquo;{debouncedSearch}&rdquo;</span>
                      <X className="w-3 h-3 group-hover:scale-110" />
                    </button>
                  )}

                  {condition && (
                    <button
                      type="button"
                      onClick={() => setCondition('')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-medium text-[11px] transition-colors cursor-pointer group"
                    >
                      <HeartPulse className="w-3 h-3 text-secondary" />
                      <span>{condition}</span>
                      <X className="w-3 h-3 group-hover:scale-110" />
                    </button>
                  )}

                  {doctorId && (
                    <button
                      type="button"
                      onClick={() => setDoctorId('')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium text-[11px] transition-colors cursor-pointer group"
                    >
                      <Stethoscope className="w-3 h-3" />
                      <span>
                        {doctorsList.find((d) => d._id === doctorId)?.name || 'Specific Doctor'}
                      </span>
                      <X className="w-3 h-3 group-hover:scale-110" />
                    </button>
                  )}

                  {gender && (
                    <button
                      type="button"
                      onClick={() => setGender('')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-medium text-[11px] transition-colors cursor-pointer group"
                    >
                      <span>{gender}</span>
                      <X className="w-3 h-3 group-hover:scale-110" />
                    </button>
                  )}

                  {(startDate || endDate) && (
                    <button
                      type="button"
                      onClick={() => {
                        setStartDate('');
                        setEndDate('');
                        setPage(1);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary font-medium text-[11px] transition-colors cursor-pointer group border border-secondary/20"
                    >
                      <Calendar className="w-3 h-3 text-secondary" />
                      <span>
                        Date:{' '}
                        {startDate && endDate
                          ? startDate === endDate
                            ? startDate
                            : `${startDate} → ${endDate}`
                          : startDate
                          ? `From ${startDate}`
                          : `Until ${endDate}`}
                      </span>
                      <X className="w-3 h-3 group-hover:scale-110" />
                    </button>
                  )}

                  {sortValue !== 'createdAt-desc' && (
                    <button
                      type="button"
                      onClick={() => setSortValue('createdAt-desc')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground font-medium text-[11px] transition-colors cursor-pointer group"
                    >
                      <ArrowUpDown className="w-3 h-3 text-secondary" />
                      <span>
                        Sorted
                      </span>
                      <X className="w-3 h-3 group-hover:scale-110" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-secondary hover:underline font-bold text-xs cursor-pointer ml-auto shrink-0"
                >
                  Clear all
                </button>
              </div>
            )}
          </Card>
        </MotionWrapper>

        {/* patients directory card grid (NOT a table!) */}
        {loading ? (
          <PatientSkeletonGrid count={6} />
        ) : patients.length === 0 ? (
          <Card className="py-16 text-center space-y-4 px-4">
            <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary mx-auto flex items-center justify-center">
              <Users className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-foreground text-base">No patients found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {hasActiveFilters
                  ? 'No patients match your selected query and filters. Try adjusting your search or clear filters.'
                  : 'Get started by admitting and registering your first patient record.'}
              </p>
            </div>
            {hasActiveFilters ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                leftIcon={<X className="w-3.5 h-3.5" />}
                className="rounded-full"
              >
                Clear Filters
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleOpenCreateModal}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                className="rounded-full"
              >
                Register First Patient
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {patients.map((patient, idx) => {
                const docObj =
                  typeof patient.doctorId === 'object' && patient.doctorId !== null
                    ? patient.doctorId
                    : null;

                return (
                  <MotionWrapper
                    key={patient._id}
                    animationType="fadeUp"
                    delay={0.04 * (idx % 9)}
                    duration={0.3}
                  >
                    <Card className="relative overflow-hidden group hover:shadow-xl hover:border-secondary/40 transition-all duration-300 p-5 flex flex-col justify-between h-full space-y-4">
                      {/* ambient hover glow */}
                      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-secondary/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* top section: avatar, name, condition, demographics */}
                      <div className="space-y-3 relative">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            {/* patient avatar */}
                            <div className="relative w-12 h-12 rounded-2xl bg-secondary/10 text-secondary overflow-hidden flex items-center justify-center font-bold text-sm shrink-0 border border-secondary/20 shadow-xs group-hover:scale-105 transition-transform duration-300">
                              {patient.avatar?.url ? (
                                <Image
                                  src={patient.avatar.url}
                                  alt={patient.name}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              ) : (
                                <span className="text-base font-black uppercase">
                                  {patient.name?.charAt(0) || 'P'}
                                </span>
                              )}
                            </div>

                            <div className="min-w-0">
                              <h3
                                onClick={() => {
                                  setSelectedPatient(patient);
                                  setIsDetailCardOpen(true);
                                }}
                                className="font-bold text-foreground group-hover:text-secondary transition-colors text-sm truncate cursor-pointer"
                                title={patient.name}
                              >
                                {patient.name}
                              </h3>
                              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                <Badge variant="warning" className="text-[10px] font-semibold">
                                  <HeartPulse className="w-2.5 h-2.5 mr-1" />
                                  {patient.condition}
                                </Badge>
                                <span className="text-[11px] text-muted-foreground font-medium">
                                  {patient.age} yrs • {patient.gender}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* attending specialist banner */}
                        <div className="p-3 rounded-2xl bg-muted/40 border border-border/70 space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-muted-foreground font-semibold flex items-center gap-1">
                              <Stethoscope className="w-3 h-3 text-primary" />
                              Attending Doctor
                            </span>
                            {docObj ? (
                              <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[120px]">
                                {docObj.hospital}
                              </span>
                            ) : null}
                          </div>

                          {docObj ? (
                            <div className="flex items-center gap-2">
                              {docObj.avatar?.url ? (
                                <div className="relative w-6 h-6 rounded-lg overflow-hidden border border-primary/20 shrink-0">
                                  <Image
                                    src={docObj.avatar.url}
                                    alt={docObj.name}
                                    fill
                                    sizes="24px"
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] shrink-0">
                                  {docObj.name ? docObj.name.replace(/^dr\.?\s+/i, '').charAt(0) : 'D'}
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-foreground truncate">
                                  {docObj.name}
                                </p>
                                <p className="text-[10px] text-primary font-medium truncate">
                                  {docObj.specialization}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground italic">
                              No doctor assigned yet
                            </p>
                          )}
                        </div>

                        {/* quick info pills: phone and admission */}
                        <div className="space-y-1.5 pt-1 text-xs text-muted-foreground">
                          <div className="flex items-center justify-between">
                            <a
                              href={`tel:${patient.phone}`}
                              className="flex items-center gap-1.5 hover:text-secondary transition-colors font-mono text-[11px]"
                            >
                              <Phone className="w-3 h-3 text-secondary shrink-0" />
                              <span className="truncate">{patient.phone}</span>
                            </a>
                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground/80">
                              <Calendar className="w-3 h-3" />
                              {new Date(patient.admissionDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* bottom action station */}
                      <div className="pt-3 border-t border-border flex items-center justify-between gap-2 relative z-10">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPatient(patient);
                            setIsDetailCardOpen(true);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-secondary hover:text-secondary/80 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Dossier</span>
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(patient)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                            title="Edit patient"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPatientToDelete(patient);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                            title="Delete patient"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  </MotionWrapper>
                );
              })}
            </div>

            {/* modern pagination station */}
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              totalItems={total}
              pageSize={limit}
              itemName="admitted patients"
              variant="secondary"
            />
          </div>
        )}
      </div>

      {/* right slide-in patient details dossier */}
      <PatientDetailCard
        patient={selectedPatient}
        isOpen={isDetailCardOpen}
        onClose={() => setIsDetailCardOpen(false)}
        onAvatarUpdated={(updatedPat) => {
          setSelectedPatient(updatedPat);
          setPatients((prev) =>
            prev.map((p) => (p._id === updatedPat._id ? { ...p, avatar: updatedPat.avatar } : p))
          );
        }}
        onEdit={(p) => {
          setIsDetailCardOpen(false);
          handleOpenEditModal(p);
        }}
        onDelete={(p) => {
          setIsDetailCardOpen(false);
          setPatientToDelete(p);
          setIsDeleteModalOpen(true);
        }}
      />

      {/* modal: register / edit patient */}
      <PatientFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        editingPatient={editingPatient}
        patientForm={patientForm}
        setPatientForm={setPatientForm}
        doctorsList={doctorsList}
        avatarPreviewUrl={avatarPreviewUrl}
        onAvatarChange={handleAvatarChange}
        onSubmit={handlePatientSubmit}
        submitting={formSubmitting}
      />

      {/* modal: delete patient confirmation */}
      <PatientDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        patient={patientToDelete}
        onConfirm={handleDeletePatient}
      />
    </div>
  );
}

export default function PatientsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-secondary" />
          <span>Loading patient directory...</span>
        </div>
      }
    >
      <PatientsContent />
    </Suspense>
  );
}
