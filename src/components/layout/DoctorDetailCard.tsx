'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { DoctorService, type Doctor, type DoctorPatient } from '@/server/doctor.service';
import { PatientService, type Patient } from '@/server/patient.service';
import { Button, SideSheet, toast, PageHeader } from '@/components/ui';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import { DoctorDetailSkeleton } from '@/components/skeletons/DoctorDetailSkeleton';
import { DoctorPatientRosterSkeleton } from '@/components/skeletons/DoctorPatientRosterSkeleton';
import { AssignExistingPatientModal } from '@/components/modals/AssignExistingPatientModal';
import { DoctorFormModal } from '@/components/modals/DoctorFormModal';
import { DoctorDeleteModal } from '@/components/modals/DoctorDeleteModal';
import { PatientFormModal } from '@/components/modals/PatientFormModal';
import { ReleasePatientModal } from '@/components/modals/ReleasePatientModal';
import { PatientDeleteModal } from '@/components/modals/PatientDeleteModal';
import type { DoctorFormData } from '@/types/doctor.types';
import type { PatientFormData } from '@/types/patient.types';
import {
  Stethoscope,
  Building2,
  Phone,
  Mail,
  Calendar,
  Users,
  Trash2,
  Edit2,
  Camera,
  ShieldCheck,
  FileText,
  UserCheck,
  UserPlus,
} from 'lucide-react';

const PatientDetailCard = dynamic(
  () => import('@/components/layout/PatientDetailCard').then((mod) => mod.PatientDetailCard),
  { ssr: false }
);

export interface DoctorDetailCardProps {
  doctorId?: string | null;
  doctor?: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (doctor: Doctor) => void;
  onDelete?: (doctor: Doctor) => void;
  onAddPatient?: () => void;
  onRemovePatient?: (patientId: string, patientName: string) => void;
  onReleasePatient?: (patient: DoctorPatient | { _id: string; name: string }) => void;
  onViewPatient?: (patientId: string) => void;
  onAvatarUpdated?: (doctor: Doctor) => void;
  loadingPatients?: boolean;
}

export const DoctorDetailCard: React.FC<DoctorDetailCardProps> = ({
  doctorId,
  doctor: initialDoctor,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onAddPatient,
  onRemovePatient,
  onReleasePatient,
  onViewPatient,
  onAvatarUpdated,
  loadingPatients = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState<boolean>(false);

  // internal modal states for autonomous/reusable usage anywhere
  const [isInternalEditOpen, setIsInternalEditOpen] = useState(false);
  const [internalDoctorForm, setInternalDoctorForm] = useState<DoctorFormData>({
    name: '',
    specialization: '',
    hospital: '',
    phone: '',
    email: '',
    note: '',
  });
  const [internalDoctorAvatarFile, setInternalDoctorAvatarFile] = useState<File | null>(null);
  const [internalDoctorAvatarPreview, setInternalDoctorAvatarPreview] = useState<string | null>(null);
  const [internalDoctorSubmitting, setInternalDoctorSubmitting] = useState(false);

  const [isInternalDeleteOpen, setIsInternalDeleteOpen] = useState(false);
  const [internalDeleteSubmitting, setInternalDeleteSubmitting] = useState(false);

  const [isInternalAdmitOpen, setIsInternalAdmitOpen] = useState(false);
  const [internalAdmitForm, setInternalAdmitForm] = useState<PatientFormData>({
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
  const [internalAdmitAvatarFile, setInternalAdmitAvatarFile] = useState<File | null>(null);
  const [internalAdmitAvatarPreview, setInternalAdmitAvatarPreview] = useState<string | null>(null);
  const [internalAdmitSubmitting, setInternalAdmitSubmitting] = useState(false);

  const [isInternalReleaseOpen, setIsInternalReleaseOpen] = useState(false);
  const [internalPatientToRelease, setInternalPatientToRelease] = useState<Patient | null>(null);
  const [internalReleaseSubmitting, setInternalReleaseSubmitting] = useState(false);

  const [isInternalRemoveOpen, setIsInternalRemoveOpen] = useState(false);
  const [internalPatientToRemove, setInternalPatientToRemove] = useState<{ id: string; name: string } | null>(null);
  const [internalRemoveSubmitting, setInternalRemoveSubmitting] = useState(false);

  const [internalViewingPatientId, setInternalViewingPatientId] = useState<string | null>(null);

  const targetId = doctorId || initialDoctor?._id;
  const isLoading = Boolean(!isOpen || !targetId || !doctor || loadedId !== targetId);

  // fetch fresh doctor details from api every time drawer opens or targetId changes
  useEffect(() => {
    if (!isOpen || !targetId) return;

    let isMounted = true;

    DoctorService.getDoctorById(targetId)
      .then((data) => {
        if (isMounted) {
          setDoctor(data);
          setLoadedId(targetId);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Failed to fetch doctor details:', err);
          toast.error('Load Failed', 'Could not fetch doctor details.');
          setLoadedId(targetId);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, targetId]);

  const activeDoctor = doctor && loadedId === targetId ? doctor : null;

  if (!isOpen && !activeDoctor && !targetId) return null;

  const assignedPatients: DoctorPatient[] =
    activeDoctor?.assignedPatients || activeDoctor?.patients || [];
  const displayPatientCount =
    activeDoctor?.patientCount !== undefined
      ? activeDoctor.patientCount
      : assignedPatients.length;
  const doctorDisplayName = activeDoctor
    ? activeDoctor.name.startsWith('Dr.')
      ? activeDoctor.name
      : `Dr. ${activeDoctor.name}`
    : 'Doctor';

  // safely format consulting date (prevents "Invalid Date")
  const formattedConsultingDate = (() => {
    if (!activeDoctor?.createdAt) return 'Registered Specialist';
    const parsed = new Date(activeDoctor.createdAt);
    if (isNaN(parsed.getTime())) return 'Registered Specialist';
    return parsed.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  })();

  // refresh doctor details after assigning existing patient
  const handlePatientAssigned = async () => {
    if (!targetId) return;
    try {
      const refreshed = await DoctorService.getDoctorById(targetId);
      setDoctor(refreshed);
      if (refreshed) {
        onAvatarUpdated?.(refreshed);
      }
    } catch (err) {
      console.error('Failed to refresh doctor roster:', err);
    }
  };

  // upload doctor avatar
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeDoctor) return;
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file', 'Please select an image file (PNG, JPG, WEBP).');
      return;
    }

    try {
      setIsUploading(true);
      const updated = await DoctorService.updateAvatar(activeDoctor._id, file);
      toast.success('Avatar Updated', `Avatar updated for ${doctorDisplayName}.`);
      setDoctor(updated);
      onAvatarUpdated?.(updated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'failed to upload avatar';
      toast.error('Upload Failed', msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // autonomous action handlers
  const handleTriggerEditDoctor = () => {
    if (onEdit && activeDoctor) {
      onEdit(activeDoctor);
    } else if (activeDoctor) {
      setInternalDoctorForm({
        name: activeDoctor.name,
        specialization: activeDoctor.specialization,
        hospital: activeDoctor.hospital,
        phone: activeDoctor.phone,
        email: activeDoctor.email,
        note: activeDoctor.note || '',
      });
      setInternalDoctorAvatarFile(null);
      setInternalDoctorAvatarPreview(activeDoctor.avatar?.url || null);
      setIsInternalEditOpen(true);
    }
  };

  const handleSubmitInternalEditDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDoctor) return;
    try {
      setInternalDoctorSubmitting(true);
      const updated = await DoctorService.updateDoctor(activeDoctor._id, internalDoctorForm);
      if (internalDoctorAvatarFile) {
        try {
          const avRes = await DoctorService.updateAvatar(activeDoctor._id, internalDoctorAvatarFile);
          updated.avatar = avRes.avatar;
        } catch (avErr) {
          console.error('Avatar upload failed:', avErr);
        }
      }
      setDoctor(updated);
      onAvatarUpdated?.(updated);
      toast.success('Doctor Updated', 'Specialist profile saved.');
      setIsInternalEditOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'failed to update doctor';
      toast.error('Update Failed', msg);
    } finally {
      setInternalDoctorSubmitting(false);
    }
  };

  const handleTriggerDeleteDoctor = () => {
    if (onDelete && activeDoctor) {
      onDelete(activeDoctor);
    } else if (activeDoctor) {
      setIsInternalDeleteOpen(true);
    }
  };

  const handleConfirmInternalDeleteDoctor = async () => {
    if (!activeDoctor) return;
    try {
      setInternalDeleteSubmitting(true);
      await DoctorService.deleteDoctor(activeDoctor._id);
      toast.success('Doctor Deleted', `${doctorDisplayName} has been removed.`);
      setIsInternalDeleteOpen(false);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'failed to delete doctor';
      toast.error('Delete Failed', msg);
    } finally {
      setInternalDeleteSubmitting(false);
    }
  };

  const handleTriggerAdmitPatient = () => {
    if (onAddPatient) {
      onAddPatient();
    } else if (activeDoctor) {
      setInternalAdmitForm({
        name: '',
        age: '',
        gender: 'Male',
        phone: '',
        email: '',
        condition: '',
        doctorId: activeDoctor._id,
        admissionDate: new Date().toISOString().split('T')[0],
        note: '',
      });
      setInternalAdmitAvatarFile(null);
      setInternalAdmitAvatarPreview(null);
      setIsInternalAdmitOpen(true);
    }
  };

  const handleSubmitInternalAdmitPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDoctor) return;
    try {
      setInternalAdmitSubmitting(true);
      const payload = {
        name: internalAdmitForm.name,
        age: Number(internalAdmitForm.age),
        gender: internalAdmitForm.gender,
        phone: internalAdmitForm.phone,
        email: internalAdmitForm.email || undefined,
        condition: internalAdmitForm.condition,
        doctorId: activeDoctor._id,
        admissionDate: internalAdmitForm.admissionDate,
        note: internalAdmitForm.note || undefined,
      };
      const created = await PatientService.createPatient(payload);
      if (internalAdmitAvatarFile && created._id) {
        try {
          await PatientService.updateAvatar(created._id, internalAdmitAvatarFile);
        } catch (avErr) {
          console.error('Avatar upload failed for new patient:', avErr);
        }
      }
      toast.success('Patient Admitted', `${internalAdmitForm.name} admitted successfully.`);
      setIsInternalAdmitOpen(false);
      // refresh doctor details
      const refreshed = await DoctorService.getDoctorById(activeDoctor._id);
      setDoctor(refreshed);
      if (refreshed) onAvatarUpdated?.(refreshed);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'failed to admit patient';
      toast.error('Admit Failed', msg);
    } finally {
      setInternalAdmitSubmitting(false);
    }
  };

  const handleTriggerReleasePatient = (p: DoctorPatient | { _id: string; name: string }) => {
    if (onReleasePatient) {
      onReleasePatient(p);
    } else {
      setInternalPatientToRelease(p as Patient);
      setIsInternalReleaseOpen(true);
    }
  };

  const handleConfirmInternalReleasePatient = async (patientId: string, releaseDate: string, remark: string) => {
    try {
      setInternalReleaseSubmitting(true);
      await PatientService.releasePatient(patientId, releaseDate, remark);
      toast.success('Patient Released', 'Patient successfully released.');
      setIsInternalReleaseOpen(false);
      setInternalPatientToRelease(null);
      if (activeDoctor) {
        const refreshed = await DoctorService.getDoctorById(activeDoctor._id);
        setDoctor(refreshed);
        if (refreshed) onAvatarUpdated?.(refreshed);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'failed to release patient';
      toast.error('Release Failed', msg);
    } finally {
      setInternalReleaseSubmitting(false);
    }
  };

  const handleTriggerRemovePatient = (patientId: string, patientName: string) => {
    if (onRemovePatient) {
      onRemovePatient(patientId, patientName);
    } else {
      setInternalPatientToRemove({ id: patientId, name: patientName });
      setIsInternalRemoveOpen(true);
    }
  };

  const handleConfirmInternalRemovePatient = async () => {
    if (!activeDoctor || !internalPatientToRemove) return;
    try {
      setInternalRemoveSubmitting(true);
      await DoctorService.removePatientFromDoctor(activeDoctor._id, internalPatientToRemove.id);
      toast.success('Patient Removed', `${internalPatientToRemove.name} unassigned from doctor.`);
      setIsInternalRemoveOpen(false);
      setInternalPatientToRemove(null);
      const refreshed = await DoctorService.getDoctorById(activeDoctor._id);
      setDoctor(refreshed);
      if (refreshed) onAvatarUpdated?.(refreshed);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'failed to unassign patient';
      toast.error('Unassign Failed', msg);
    } finally {
      setInternalRemoveSubmitting(false);
    }
  };

  const handleTriggerViewPatient = (patientId: string) => {
    if (!patientId) return;
    if (onViewPatient) {
      onClose();
      onViewPatient(patientId);
    } else {
      setInternalViewingPatientId(patientId);
    }
  };

  return (
    <>
      <SideSheet isOpen={isOpen} onClose={onClose} width="lg" className="p-0">
        {/* drawer header using PageHeader size="sm" */}
        <PageHeader
          size="sm"
          title="Doctor Dossier"
          subtitle={
            isLoading
              ? 'Loading specialist profile...'
              : activeDoctor?.specialization || 'Comprehensive specialist profile'
          }
          icon={<Stethoscope className="w-4 h-4" />}
          onClose={onClose}
          className="shrink-0 px-6 py-4 border-b border-border/80 bg-card/90 relative z-10"
        />

        {/* When loading or data not ready, show skeleton */}
        {isLoading || !activeDoctor ? (
          <DoctorDetailSkeleton animated={true} />
        ) : (
          <div className="flex flex-col flex-1 min-h-0">
            {/* scrollable body matching Profile Drawer 1:1 */}
            <div className="flex-1 overflow-y-auto no-scrollbar scrollbar-none p-6 space-y-5">
              {/* full colored gradient top card */}
              <div className="relative rounded-3xl bg-linear-to-br from-primary to-primary-hover p-5 space-y-4 shadow-xl overflow-hidden">
                {/* background glows */}
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                <div className="pointer-events-none absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

                <div className="flex items-start gap-4 relative z-10">
                  {/* avatar */}
                  <div className="relative group shrink-0">
                    {activeDoctor.avatar?.url ? (
                      <div className="relative w-18 h-18 rounded-2xl overflow-hidden border-2 border-white/40 shadow-lg bg-white/10">
                        <Image
                          src={activeDoctor.avatar.url}
                          alt={activeDoctor.name}
                          fill
                          sizes="72px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-18 h-18 rounded-2xl bg-white/20 text-white flex items-center justify-center border-2 border-white/40 shadow-lg backdrop-blur-sm">
                        <Stethoscope className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="absolute inset-0 rounded-2xl bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:opacity-50"
                      title="Change doctor photo"
                    >
                      <Camera className="w-4 h-4 mb-0.5" />
                      <span className="text-[9px] font-bold">
                        {isUploading ? 'Uploading...' : 'Update'}
                      </span>
                    </button>
                  </div>

                  {/* doctor identity */}
                  <div className="space-y-1.5 flex-1 min-w-0 text-primary-foreground">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold  truncate">
                        {doctorDisplayName}
                      </span>
                      <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 border border-white/20 backdrop-blur-xs shrink-0">
                        {activeDoctor.specialization}
                      </span>
                      <span
                        className="text-[11px] font-semibold inline-flex items-center gap-1.5 text-primary-foreground/95 bg-black/15 px-2.5 py-0.5 rounded-full border border-white/10 backdrop-blur-xs max-w-full"
                        title={activeDoctor.hospital}
                      >
                        <Building2 className="w-3 h-3 shrink-0 opacity-80" />
                        <span className="leading-snug wrap-break-word">{activeDoctor.hospital}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* capacity stat banner */}
                <div className="p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs flex items-center justify-between text-xs text-primary-foreground">
                  <div className="flex items-center gap-2 font-medium">
                    <Calendar className="w-3.5 h-3.5 opacity-80" />
                    <span>Consulting Since</span>
                  </div>
                  <span className="font-bold">
                    {formattedConsultingDate}
                  </span>
                </div>
              </div>

              {/* direct contact channels card */}
              <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3">
                <span className="text-xs font-bold text-foreground">Direct Contact Channels</span>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2 py-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate text-foreground font-medium">{activeDoctor.phone}</span>
                    </div>
                    <a
                      href={`tel:${activeDoctor.phone}`}
                      className="text-[11px] font-bold text-secondary hover:underline shrink-0"
                    >
                      Call
                    </a>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate text-foreground font-medium">{activeDoctor.email}</span>
                    </div>
                    <a
                      href={`mailto:${activeDoctor.email}`}
                      className="text-[11px] font-bold text-primary hover:underline shrink-0"
                    >
                      Email
                    </a>
                  </div>
                </div>
              </div>

              {/* clinical notes */}
              {activeDoctor.note && (
                <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/80 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <FileText className="w-3.5 h-3.5 text-primary" />
                    <span>Clinical / Professional Notes</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {activeDoctor.note}
                  </p>
                </div>
              )}

              {/* patient roster */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-bold text-foreground">
                      Patient Roster ({displayPatientCount})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      leftIcon={<UserCheck className="w-3.5 h-3.5" />}
                      onClick={() => setIsAssignModalOpen(true)}
                    >
                      Assign
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="primary"
                      leftIcon={<UserPlus className="w-3.5 h-3.5" />}
                      onClick={handleTriggerAdmitPatient}
                    >
                      Admit
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-0.5">
                  {loadingPatients ? (
                    <DoctorPatientRosterSkeleton count={displayPatientCount} />
                  ) : assignedPatients.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-border rounded-2xl bg-muted/20 p-4 space-y-2">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                        <Users className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-semibold text-muted-foreground">No patients assigned yet</p>
                      <p className="text-[11px] text-muted-foreground/70 max-w-xs mx-auto">
                        Assign an existing patient or admit a new patient directly under {doctorDisplayName}.
                      </p>
                      <div className="pt-2 flex items-center justify-center gap-2 flex-wrap">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setIsAssignModalOpen(true)}
                        >
                          Assign Patient
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="primary"
                          onClick={handleTriggerAdmitPatient}
                        >
                          Admit Patient
                        </Button>
                      </div>
                    </div>
                  ) : (
                    assignedPatients.map((p, idx) => {
                      const patientId = typeof p === 'string' ? p : p._id;
                      const patientName = typeof p === 'string' ? `Patient ${idx + 1}` : p.name;
                      const patientCondition = typeof p === 'object' ? p.condition : undefined;
                      const patientPhone = typeof p === 'object' ? p.phone : undefined;
                      const patientAge = typeof p === 'object' ? p.age : undefined;
                      const patientGender = typeof p === 'object' ? p.gender : undefined;
                      const patientAvatar = typeof p === 'object' && p.avatar?.url ? p.avatar.url : undefined;
                      const isReleased = typeof p === 'object' && (p as unknown as { isReleased?: boolean }).isReleased;

                      return (
                        <MotionWrapper key={patientId} delay={idx * 0.04} animationType="fade">
                          <div
                            onClick={() => handleTriggerViewPatient(patientId)}
                            className="relative overflow-hidden group transition-all duration-300 p-2.5 sm:p-3 rounded-2xl bg-secondary text-secondary-foreground hover:bg-secondary-hover/90 cursor-pointer shadow-md shadow-secondary/20 hover:shadow-lg"
                          >
                            <div className="flex items-center justify-between gap-3 relative z-10">
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                {/* reduced avatar size with border and shadow */}
                                <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-secondary-foreground/90 border-2 border-white/80 overflow-hidden flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300">
                                  {patientAvatar ? (
                                    <Image
                                      src={patientAvatar}
                                      alt={patientName}
                                      fill
                                      sizes="44px"
                                      className="object-cover"
                                    />
                                  ) : (
                                    <Users className="w-5 h-5 text-secondary" />
                                  )}
                                </div>

                                {/* name and (condition, age and gender in same line) */}
                                <div className="min-w-0 flex-1 space-y-1">
                                  <h4
                                    className="font-semibold text-white text-sm sm:text-base truncate leading-tight drop-shadow-xs"
                                    title={patientName}
                                  >
                                    {patientName}
                                  </h4>
                                  <div className="flex items-center gap-2 truncate text-[11px] font-medium">
                                    {patientCondition && (
                                      <span className="text-white px-2 py-0.5 rounded-md bg-warning font-bold truncate max-w-38 shadow-xs">
                                        <span className="truncate">{patientCondition}</span>
                                      </span>
                                    )}
                                    <span className="truncate text-white/90">
                                      {patientAge ? `${patientAge} yrs` : ''}
                                      {patientAge && (patientGender || patientPhone) ? ' • ' : ''}
                                      {patientGender || patientPhone || ''}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* delete and release same line */}
                              <div className="flex items-center gap-1.5 shrink-0">
                                {!isReleased && (
                                  <Button
                                    type="button"
                                    variant="light-secondary"
                                    size="sm"
                                    capsule={false}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleTriggerReleasePatient(typeof p === 'string' ? { _id: p, name: patientName } : p);
                                    }}
                                    title={`Release ${patientName}`}
                                    className="h-7 px-2.5 text-xs font-bold rounded-xl border-0"
                                    leftIcon={<UserCheck className="w-3.5 h-3.5" />}
                                  >
                                    Release
                                  </Button>
                                )}

                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  capsule={false}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTriggerRemovePatient(patientId, patientName);
                                  }}
                                  className="h-7! w-7! p-0 rounded-full flex items-center justify-center shrink-0 shadow-xs"
                                  title={`Unassign ${patientName} from doctor's list`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </MotionWrapper>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* fixed footer matching Profile Drawer 1:1 - always visible */}
            <div className="shrink-0 p-4 sm:p-5 px-5 sm:px-6 border-t border-border/80 flex items-center justify-end gap-2 sm:gap-2.5 bg-card/90">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleTriggerEditDoctor}
                leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                className="whitespace-nowrap"
              >
                Edit Doctor
              </Button>

              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleTriggerDeleteDoctor}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                className="whitespace-nowrap"
              >
                Delete Doctor
              </Button>
            </div>
          </div>
        )}
      </SideSheet>

      {/* modal to select and assign an unassigned patient to this doctor */}
      <AssignExistingPatientModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        doctor={activeDoctor || null}
        onSuccess={handlePatientAssigned}
        onOpenAdmitModal={handleTriggerAdmitPatient}
      />

      {/* autonomous modal: edit doctor */}
      <DoctorFormModal
        isOpen={isInternalEditOpen}
        onClose={() => setIsInternalEditOpen(false)}
        editingDoctor={activeDoctor}
        doctorForm={internalDoctorForm}
        setDoctorForm={setInternalDoctorForm}
        avatarPreviewUrl={internalDoctorAvatarPreview}
        onAvatarChange={(file) => {
          setInternalDoctorAvatarFile(file);
          if (file) {
            const url = URL.createObjectURL(file);
            setInternalDoctorAvatarPreview(url);
          } else {
            setInternalDoctorAvatarPreview(null);
          }
        }}
        onSubmit={handleSubmitInternalEditDoctor}
        submitting={internalDoctorSubmitting}
      />

      {/* autonomous modal: delete doctor */}
      <DoctorDeleteModal
        isOpen={isInternalDeleteOpen}
        onClose={() => setIsInternalDeleteOpen(false)}
        doctor={activeDoctor}
        loading={internalDeleteSubmitting}
        onConfirm={handleConfirmInternalDeleteDoctor}
      />

      {/* autonomous modal: admit patient under this doctor */}
      <PatientFormModal
        isOpen={isInternalAdmitOpen}
        onClose={() => setIsInternalAdmitOpen(false)}
        editingPatient={null}
        patientForm={internalAdmitForm}
        setPatientForm={setInternalAdmitForm}
        doctorsList={activeDoctor ? [activeDoctor] : []}
        avatarPreviewUrl={internalAdmitAvatarPreview}
        onAvatarChange={(file) => {
          setInternalAdmitAvatarFile(file);
          if (file) {
            const url = URL.createObjectURL(file);
            setInternalAdmitAvatarPreview(url);
          } else {
            setInternalAdmitAvatarPreview(null);
          }
        }}
        onSubmit={handleSubmitInternalAdmitPatient}
        submitting={internalAdmitSubmitting}
        disableDoctorSelect={true}
        title={`Add Patient under ${doctorDisplayName}`}
        description="Create and assign a patient directly to this specialist."
      />

      {/* autonomous modal: release patient from roster */}
      <ReleasePatientModal
        isOpen={isInternalReleaseOpen}
        onClose={() => {
          setIsInternalReleaseOpen(false);
          setInternalPatientToRelease(null);
        }}
        patient={internalPatientToRelease}
        loading={internalReleaseSubmitting}
        onConfirmRelease={handleConfirmInternalReleasePatient}
      />

      {/* autonomous modal: unassign patient from doctor */}
      <PatientDeleteModal
        isOpen={isInternalRemoveOpen}
        onClose={() => {
          setIsInternalRemoveOpen(false);
          setInternalPatientToRemove(null);
        }}
        patient={internalPatientToRemove}
        title="Unassign Patient"
        description="Are you sure you want to remove this patient from the doctor?"
        confirmLabel="Unassign"
        warningText={
          <p>
            Unassigning <strong>{internalPatientToRemove?.name}</strong> will remove them from{' '}
            {doctorDisplayName}&apos;s patient roster.
          </p>
        }
        loading={internalRemoveSubmitting}
        onConfirm={handleConfirmInternalRemovePatient}
      />

      {/* autonomous sub-drawer: view patient details when no onViewPatient is passed */}
      {internalViewingPatientId && (
        <PatientDetailCard
          patientId={internalViewingPatientId}
          isOpen={Boolean(internalViewingPatientId)}
          onClose={() => setInternalViewingPatientId(null)}
          onViewDoctor={(docId) => {
            setInternalViewingPatientId(null);
            // if clicking back to another doctor
            if (docId !== targetId) {
              DoctorService.getDoctorById(docId).then((d) => setDoctor(d));
            }
          }}
        />
      )}
    </>
  );
};
