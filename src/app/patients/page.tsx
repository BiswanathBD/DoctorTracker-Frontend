'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import { Button, Input, Card, Badge, Modal, toast, PageHeader } from '@/components/ui';
import { PatientDetailCard } from '@/components/layout/PatientDetailCard';
import { PatientService, type Patient } from '@/server/patient.service';
import { DoctorService, type Doctor } from '@/server/doctor.service';
import {
  Users,
  Plus,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  Stethoscope,
  Phone,
  Mail,
  Calendar,
  HeartPulse,
  RefreshCw,
  AlertCircle,
  Eye
} from 'lucide-react';

function PatientsContent() {
  const searchParams = useSearchParams();

  // state for patients list & pagination
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const limit = 8;

  // filters
  const [searchTerm, setSearchTerm] = useState('');
  const [condition, setCondition] = useState('');
  const [gender, setGender] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // filter options
  const [conditionsList, setConditionsList] = useState<string[]>([]);
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);

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
  const [submitting, setSubmitting] = useState(false);

  // open create modal
  const handleOpenCreateModal = useCallback(() => {
    setEditingPatient(null);
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

  // fetch conditions & doctors for dropdowns
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

  // refresh patients
  const refreshPatients = useCallback(() => {
    PatientService.getAllPatients({
      page,
      limit,
      searchTerm: searchTerm.trim() || undefined,
      condition: condition || undefined,
      gender: gender || undefined,
      doctorId: doctorId || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    })
      .then((res) => {
        setPatients(res.data);
        setTotal(res.meta.total);
        setTotalPages(res.meta.totalPages);
        setLoading(false);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'failed to load patients';
        toast.error('Error loading patients', msg);
        setLoading(false);
      });
  }, [page, limit, searchTerm, condition, gender, doctorId, startDate, endDate]);

  // fetch patients on change
  useEffect(() => {
    let isMounted = true;
    PatientService.getAllPatients({
      page,
      limit,
      searchTerm: searchTerm.trim() || undefined,
      condition: condition || undefined,
      gender: gender || undefined,
      doctorId: doctorId || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    })
      .then((res) => {
        if (!isMounted) return;
        setPatients(res.data);
        setTotal(res.meta.total);
        setTotalPages(res.meta.totalPages);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : 'failed to load patients';
        toast.error('Error loading patients', msg);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [page, limit, searchTerm, condition, gender, doctorId, startDate, endDate]);

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

  // submit form (create or edit)
  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientForm.name || !patientForm.age || !patientForm.phone || !patientForm.condition || !patientForm.doctorId) {
      toast.error('Missing fields', 'Please enter patient name, age, phone, condition, and select a doctor.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...patientForm,
        age: Number(patientForm.age),
        admissionDate: new Date(patientForm.admissionDate),
      };

      if (editingPatient) {
        await PatientService.updatePatient(editingPatient._id, payload);
        toast.success('Patient Updated', `${patientForm.name}'s record has been updated.`);
      } else {
        await PatientService.createPatient(payload);
        toast.success('Patient Registered', `${patientForm.name} has been admitted and assigned.`);
      }

      setIsFormModalOpen(false);
      refreshPatients();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'failed to save patient';
      toast.error('Action Failed', msg);
    } finally {
      setSubmitting(false);
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'failed to delete patient';
      toast.error('Delete Failed', msg);
    }
  };

  // reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setCondition('');
    setGender('');
    setDoctorId('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    searchTerm || condition || gender || doctorId || startDate || endDate
  );

  return (
    <div className="w-full flex gap-6 items-start">
      <div className="flex-1 min-w-0 space-y-7">
      {/* header */}
      <MotionWrapper direction="up">
        <PageHeader
          icon={<Users className="w-6 h-6" />}
          title="Patient Management"
          subtitle="Track patient admissions, manage medical conditions, and assign specialized doctors."
          actions={
            <Button
              onClick={handleOpenCreateModal}
              variant="secondary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              className="shadow-lg shadow-secondary/25 cursor-pointer"
            >
              Register Patient
            </Button>
          }
        />
      </MotionWrapper>

      {/* filter toolbar */}
      <MotionWrapper delay={0.1} direction="up">
        <Card className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
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
                placeholder="Search by patient name, phone, condition..."
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:border-secondary focus:ring-4 focus:ring-secondary/15 outline-none transition-all"
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

            {/* condition filter */}
            <div>
              <select
                value={condition}
                onChange={(e) => {
                  setCondition(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-input bg-card text-foreground focus:border-secondary focus:ring-4 focus:ring-secondary/15 outline-none transition-all cursor-pointer"
              >
                <option value="">All Conditions</option>
                {conditionsList.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>

            {/* assigned doctor filter */}
            <div>
              <select
                value={doctorId}
                onChange={(e) => {
                  setDoctorId(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-input bg-card text-foreground focus:border-secondary focus:ring-4 focus:ring-secondary/15 outline-none transition-all cursor-pointer"
              >
                <option value="">All Assigned Doctors</option>
                {doctorsList.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.name} ({doc.specialization})
                  </option>
                ))}
              </select>
            </div>

            {/* gender filter */}
            <div>
              <select
                value={gender}
                onChange={(e) => {
                  setGender(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-input bg-card text-foreground focus:border-secondary focus:ring-4 focus:ring-secondary/15 outline-none transition-all cursor-pointer"
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* date range start & end */}
            <div className="flex items-center gap-1.5">
              <input
                type="date"
                title="Start Date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(1);
                }}
                className="w-1/2 px-2 py-2 text-xs rounded-xl border border-input bg-card text-foreground outline-none focus:border-secondary"
              />
              <input
                type="date"
                title="End Date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(1);
                }}
                className="w-1/2 px-2 py-2 text-xs rounded-xl border border-input bg-card text-foreground outline-none focus:border-secondary"
              />
            </div>
          </div>

          {/* active filter pills & clear */}
          {hasActiveFilters && (
            <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-muted-foreground flex-wrap">
                <Filter className="w-3.5 h-3.5 text-secondary" />
                <span>Active filters:</span>
                {searchTerm && <Badge variant="secondary">Search: {searchTerm}</Badge>}
                {condition && <Badge variant="warning">{condition}</Badge>}
                {gender && <Badge variant="outline">{gender}</Badge>}
                {doctorId && <Badge variant="primary">Specific Doctor</Badge>}
                {(startDate || endDate) && (
                  <Badge variant="muted">
                    {startDate || 'Start'} → {endDate || 'End'}
                  </Badge>
                )}
              </div>
              <button
                onClick={handleResetFilters}
                className="text-secondary hover:underline font-bold text-xs cursor-pointer ml-auto"
              >
                Clear all filters
              </button>
            </div>
          )}
        </Card>
      </MotionWrapper>

      {/* patients table card */}
      <MotionWrapper delay={0.2} direction="up">
        <Card className="overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-8 h-8 text-secondary animate-spin" />
              <p className="text-xs font-semibold text-muted-foreground">Loading patient records...</p>
            </div>
          ) : patients.length === 0 ? (
            <div className="py-16 text-center space-y-4 px-4">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary mx-auto flex items-center justify-center">
                <Users className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-foreground text-base">No patients found</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  {hasActiveFilters
                    ? 'No patients match your selected query and filters.'
                    : 'Admit and register your first patient record.'}
                </p>
              </div>
              {hasActiveFilters ? (
                <Button variant="outline" size="sm" onClick={handleResetFilters}>
                  Clear Filters
                </Button>
              ) : (
                <Button variant="secondary" size="sm" onClick={handleOpenCreateModal}>
                  Register First Patient
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-[11px] font-bold uppercase tracking-wider text-muted-foreground select-none">
                    <th className="py-3.5 px-5">Patient Name</th>
                    <th className="py-3.5 px-4">Demographics</th>
                    <th className="py-3.5 px-4">Medical Condition</th>
                    <th className="py-3.5 px-4">Assigned Doctor</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Admission</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs">
                  {patients.map((patient) => {
                    const docObj = typeof patient.doctorId === 'object' && patient.doctorId !== null ? patient.doctorId : null;

                    return (
                      <tr key={patient._id} className="hover:bg-muted/40 transition-colors group">
                        {/* patient name */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center font-bold text-sm flex-shrink-0 group-hover:bg-secondary group-hover:text-secondary-foreground transition-all">
                              <Users className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-foreground group-hover:text-secondary transition-colors text-sm">
                                {patient.name}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                ID: #{patient._id.slice(-6).toUpperCase()}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* demographics */}
                        <td className="py-4 px-4 text-foreground font-medium">
                          {patient.age} yrs • {patient.gender}
                        </td>

                        {/* condition badge */}
                        <td className="py-4 px-4">
                          <Badge variant="warning" className="font-semibold">
                            <HeartPulse className="w-3 h-3 mr-1" />
                            {patient.condition}
                          </Badge>
                        </td>

                        {/* assigned doctor */}
                        <td className="py-4 px-4">
                          {docObj ? (
                            <div className="space-y-0.5">
                              <p className="font-bold text-foreground text-xs flex items-center gap-1.5">
                                <Stethoscope className="w-3.5 h-3.5 text-primary" />
                                {docObj.name}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                {docObj.specialization} • {docObj.hospital}
                              </p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic text-xs">Unassigned</span>
                          )}
                        </td>

                        {/* contact */}
                        <td className="py-4 px-4 space-y-1">
                          <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                            <Phone className="w-3 h-3 text-secondary" />
                            <span>{patient.phone}</span>
                          </div>
                          {patient.email && (
                            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] truncate max-w-[160px]">
                              <Mail className="w-3 h-3 text-primary" />
                              <span>{patient.email}</span>
                            </div>
                          )}
                        </td>

                        {/* admission date */}
                        <td className="py-4 px-4 text-muted-foreground text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />
                            <span>{new Date(patient.admissionDate).toLocaleDateString()}</span>
                          </div>
                        </td>

                        {/* actions */}
                        <td className="py-4 px-5 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedPatient(patient);
                                setIsDetailCardOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-colors cursor-pointer"
                              title="View Patient Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEditModal(patient)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                              title="Edit Patient"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setPatientToDelete(patient);
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                              title="Delete Patient"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
                <strong className="text-foreground">{total}</strong> admitted patients
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

      {/* right slide-in patient details card matching profile card style */}
      <PatientDetailCard
        patient={selectedPatient}
        isOpen={isDetailCardOpen}
        onClose={() => setIsDetailCardOpen(false)}
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
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingPatient ? 'Edit Patient Record' : 'Register New Patient'}
        description={
          editingPatient
            ? 'Update medical status, assigned specialist, or contact information.'
            : 'Admit a new patient and associate them with a registered doctor.'
        }
        maxWidth="md"
      >
        <form onSubmit={handlePatientSubmit} className="space-y-4">
          <Input
            label="Patient Full Name"
            placeholder="Jane Doe"
            required
            value={patientForm.name}
            onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
            leftIcon={<Users className="w-4 h-4" />}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Age"
              type="number"
              placeholder="38"
              required
              value={patientForm.age}
              onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })}
            />

            <div className="w-full space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-foreground">Gender</label>
              <select
                value={patientForm.gender}
                onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-input bg-card text-foreground outline-none focus:border-secondary"
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
              placeholder="e.g. Hypertension, Diabetes"
              required
              value={patientForm.condition}
              onChange={(e) => setPatientForm({ ...patientForm, condition: e.target.value })}
              leftIcon={<HeartPulse className="w-4 h-4" />}
            />

            <Input
              label="Phone Number"
              placeholder="+1 (555) 432-1098"
              required
              value={patientForm.phone}
              onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
              leftIcon={<Phone className="w-4 h-4" />}
            />
          </div>

          {/* assigned doctor select */}
          <div className="w-full space-y-1.5 text-left">
            <label className="block text-xs font-semibold text-foreground">Assigned Doctor</label>
            <select
              value={patientForm.doctorId}
              onChange={(e) => setPatientForm({ ...patientForm, doctorId: e.target.value })}
              required
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-input bg-card text-foreground outline-none focus:border-secondary"
            >
              <option value="">Select a Specialist</option>
              {doctorsList.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name} — {doc.specialization} ({doc.hospital})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Email Address (Optional)"
              type="email"
              placeholder="jane@example.com"
              value={patientForm.email}
              onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Admission Date"
              type="date"
              required
              value={patientForm.admissionDate}
              onChange={(e) => setPatientForm({ ...patientForm, admissionDate: e.target.value })}
              leftIcon={<Calendar className="w-4 h-4" />}
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
            <Button type="submit" variant="secondary" loading={submitting}>
              {editingPatient ? 'Save Changes' : 'Register Patient'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* modal: delete patient confirmation */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Patient Deletion"
        description="Are you sure you want to remove this patient record?"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-start gap-3 text-xs text-destructive">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Deleting <strong>{patientToDelete?.name}</strong> will remove their medical and admission history from the system. This cannot be undone.
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
              onClick={handleDeletePatient}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function PatientsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-muted-foreground">Loading patient directory...</div>}>
      <PatientsContent />
    </Suspense>
  );
}
