'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import { Button, Input, Card, Badge, Modal, toast, PageHeader } from '@/components/ui';
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
  RefreshCw,
  AlertCircle
} from 'lucide-react';

function DoctorsContent() {
  const searchParams = useSearchParams();

  // state for list, pagination & filters
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const limit = 8;

  // filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [hospital, setHospital] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // filter options
  const [specializationsList, setSpecializationsList] = useState<string[]>([]);
  const [hospitalsList, setHospitalsList] = useState<string[]>([]);

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
  const [formSubmitting, setFormSubmitting] = useState(false);

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
    setDoctorForm({
      name: '',
      specialization: '',
      hospital: '',
      phone: '',
      email: '',
    });
    setIsFormModalOpen(true);
  }, []);

  // fetch filter lists
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

  // fetch doctors list
  const refreshDoctors = useCallback(() => {
    DoctorService.getAllDoctors({
      page,
      limit,
      searchTerm: searchTerm.trim() || undefined,
      specialization: specialization || undefined,
      hospital: hospital || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    })
      .then((res) => {
        setDoctors(res.data);
        setTotal(res.meta.total);
        setTotalPages(res.meta.totalPages);
        setLoading(false);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'failed to load doctors';
        toast.error('Error loading doctors', msg);
        setLoading(false);
      });
  }, [page, limit, searchTerm, specialization, hospital, startDate, endDate]);

  useEffect(() => {
    let isMounted = true;
    DoctorService.getAllDoctors({
      page,
      limit,
      searchTerm: searchTerm.trim() || undefined,
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
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : 'failed to load doctors';
        toast.error('Error loading doctors', msg);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [page, limit, searchTerm, specialization, hospital, startDate, endDate]);

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
        toast.success('Doctor Updated', `${doctorForm.name}'s profile was updated.`);
      } else {
        await DoctorService.createDoctor(doctorForm);
        toast.success('Doctor Created', `${doctorForm.name} was added to the directory.`);
      }

      setIsFormModalOpen(false);
      refreshDoctors();
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
    setSearchTerm('');
    setSpecialization('');
    setHospital('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    searchTerm || specialization || hospital || startDate || endDate
  );

  return (
    <div className="w-full flex gap-6 items-start">
      <div className="flex-1 min-w-0 space-y-7">
      {/* header */}
      <MotionWrapper direction="up">
        <PageHeader
          icon={<Stethoscope className="w-6 h-6" />}
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

      {/* filter & search toolbar */}
      <MotionWrapper delay={0.1} direction="up">
        <Card className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* search input */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by name, specialization, email..."
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-ring/15 outline-none transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* specialization select */}
            <div>
              <select
                value={specialization}
                onChange={(e) => {
                  setSpecialization(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-input bg-card text-foreground focus:border-primary focus:ring-4 focus:ring-ring/15 outline-none transition-all cursor-pointer"
              >
                <option value="">All Specializations</option>
                {specializationsList.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* hospital select */}
            <div>
              <select
                value={hospital}
                onChange={(e) => {
                  setHospital(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-input bg-card text-foreground focus:border-primary focus:ring-4 focus:ring-ring/15 outline-none transition-all cursor-pointer"
              >
                <option value="">All Hospitals</option>
                {hospitalsList.map((hosp) => (
                  <option key={hosp} value={hosp}>
                    {hosp}
                  </option>
                ))}
              </select>
            </div>

            {/* date range start & end */}
            <div className="flex items-center gap-2">
              <input
                type="date"
                title="Start Date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(1);
                }}
                className="w-1/2 px-2.5 py-2 text-xs rounded-xl border border-input bg-card text-foreground outline-none focus:border-primary"
              />
              <input
                type="date"
                title="End Date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(1);
                }}
                className="w-1/2 px-2.5 py-2 text-xs rounded-xl border border-input bg-card text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* active filter pills & reset button */}
          {hasActiveFilters && (
            <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-muted-foreground flex-wrap">
                <Filter className="w-3.5 h-3.5 text-primary" />
                <span>Active filters:</span>
                {searchTerm && <Badge variant="primary">Search: {searchTerm}</Badge>}
                {specialization && <Badge variant="secondary">{specialization}</Badge>}
                {hospital && <Badge variant="outline">{hospital}</Badge>}
                {(startDate || endDate) && (
                  <Badge variant="muted">
                    {startDate || 'Start'} → {endDate || 'End'}
                  </Badge>
                )}
              </div>
              <button
                onClick={handleResetFilters}
                className="text-primary hover:underline font-bold text-xs cursor-pointer ml-auto"
              >
                Clear all filters
              </button>
            </div>
          )}
        </Card>
      </MotionWrapper>

      {/* doctors list table card */}
      <MotionWrapper delay={0.2} direction="up">
        <Card className="overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-8 h-8 text-primary animate-spin" />
              <p className="text-xs font-semibold text-muted-foreground">Loading doctor records...</p>
            </div>
          ) : doctors.length === 0 ? (
            <div className="py-16 text-center space-y-4 px-4">
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
                <Button variant="outline" size="sm" onClick={handleResetFilters}>
                  Clear Filters
                </Button>
              ) : (
                <Button variant="primary" size="sm" onClick={handleOpenCreateModal}>
                  Add First Doctor
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-[11px] font-bold uppercase tracking-wider text-muted-foreground select-none">
                    <th className="py-3.5 px-5">Doctor Info</th>
                    <th className="py-3.5 px-4">Specialization</th>
                    <th className="py-3.5 px-4">Hospital</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4 text-center">Patients</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs">
                  {doctors.map((doctor) => (
                    <tr
                      key={doctor._id}
                      className="hover:bg-muted/40 transition-colors group"
                    >
                      {/* doctor name & avatar icon */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                            <Stethoscope className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-foreground group-hover:text-primary transition-colors text-sm">
                              {doctor.name}
                            </p>
                            <p className="text-muted-foreground text-[11px] truncate flex items-center gap-1.5 mt-0.5">
                              <Calendar className="w-3 h-3 text-muted-foreground/70" />
                              Added {new Date(doctor.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* specialization badge */}
                      <td className="py-4 px-4">
                        <Badge variant="primary" className="font-medium">
                          {doctor.specialization}
                        </Badge>
                      </td>

                      {/* hospital */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-foreground font-medium">
                          <Building2 className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                          <span className="truncate max-w-[180px]">{doctor.hospital}</span>
                        </div>
                      </td>

                      {/* contact phone & email */}
                      <td className="py-4 px-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                          <Phone className="w-3 h-3 text-secondary" />
                          <span>{doctor.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] truncate max-w-[180px]">
                          <Mail className="w-3 h-3 text-primary" />
                          <span>{doctor.email}</span>
                        </div>
                      </td>

                      {/* assigned patients count pill */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleViewDetails(doctor._id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 hover:bg-secondary/20 text-secondary font-bold text-xs transition-colors cursor-pointer"
                          title="Click to view assigned patients"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>{doctor.patientCount || 0}</span>
                        </button>
                      </td>

                      {/* action buttons */}
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleViewDetails(doctor._id)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                            title="View Doctor & Patients"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(doctor)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                            title="Edit Doctor"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setDoctorToDelete(doctor);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                            title="Delete Doctor"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* pagination bar */}
          {total > 0 && (
            <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground bg-card">
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
            </div>
          )}
        </Card>
      </MotionWrapper>
      </div>

      {/* right slide-in doctor details card matching profile card style */}
      <DoctorDetailCard
        doctor={selectedDoctor}
        isOpen={isDetailCardOpen}
        onClose={() => setIsDetailCardOpen(false)}
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
        title={editingDoctor ? 'Edit Doctor Profile' : 'Add New Doctor'}
        description={
          editingDoctor
            ? 'Update the medical specialist contact and hospital credentials.'
            : 'Register a new doctor to the medical tracking directory.'
        }
        maxWidth="md"
      >
        <form onSubmit={handleDoctorSubmit} className="space-y-4">
          <Input
            label="Doctor Full Name"
            placeholder="Dr. Alexander Wright, MD"
            required
            value={doctorForm.name}
            onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
            leftIcon={<Stethoscope className="w-4 h-4" />}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Specialization"
              placeholder="e.g. Cardiology, Neurology"
              required
              value={doctorForm.specialization}
              onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
              leftIcon={<HeartPulse className="w-4 h-4" />}
            />

            <Input
              label="Hospital / Clinic"
              placeholder="e.g. Metro General Hospital"
              required
              value={doctorForm.hospital}
              onChange={(e) => setDoctorForm({ ...doctorForm, hospital: e.target.value })}
              leftIcon={<Building2 className="w-4 h-4" />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Phone Number"
              placeholder="+1 (555) 234-5678"
              required
              value={doctorForm.phone}
              onChange={(e) => setDoctorForm({ ...doctorForm, phone: e.target.value })}
              leftIcon={<Phone className="w-4 h-4" />}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="doctor@hospital.org"
              required
              value={doctorForm.email}
              onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
              leftIcon={<Mail className="w-4 h-4" />}
            />
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsFormModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={formSubmitting}>
              {editingDoctor ? 'Save Changes' : 'Create Doctor'}
            </Button>
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
                              title="Remove from doctor list"
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
              value={patientForm.age}
              onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })}
            />

            <div className="w-full space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-foreground">Gender</label>
              <select
                value={patientForm.gender}
                onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-input bg-card text-foreground outline-none focus:border-primary"
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
              value={patientForm.condition}
              onChange={(e) => setPatientForm({ ...patientForm, condition: e.target.value })}
              leftIcon={<HeartPulse className="w-4 h-4" />}
            />

            <Input
              label="Phone Number"
              placeholder="+1 (555) 789-0123"
              required
              value={patientForm.phone}
              onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
              leftIcon={<Phone className="w-4 h-4" />}
            />
          </div>

          <Input
            label="Email Address (Optional)"
            type="email"
            placeholder="patient@gmail.com"
            value={patientForm.email}
            onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
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
