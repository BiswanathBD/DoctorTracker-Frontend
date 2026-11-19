'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { PatientService, type Patient } from '@/server/patient.service';
import { DoctorService, type Doctor } from '@/server/doctor.service';
import { Button, SideSheet, toast, PageHeader } from '@/components/ui';
import { PatientDetailSkeleton } from '@/components/skeletons/PatientDetailSkeleton';
import { AssignDoctorToPatientModal } from '@/components/modals/AssignDoctorToPatientModal';
import { PatientFormModal } from '@/components/modals/PatientFormModal';
import { ReleasePatientModal } from '@/components/modals/ReleasePatientModal';
import { PatientDeleteModal } from '@/components/modals/PatientDeleteModal';
import type { PatientFormData } from '@/types/patient.types';
import {
  Stethoscope,
  Building2,
  Phone,
  Mail,
  Calendar,
  Edit2,
  Trash2,
  Camera,
  Users,
  Clock,
  FileText,
  UserCheck,
} from 'lucide-react';

const DoctorDetailCard = dynamic(
  () => import('@/components/layout/DoctorDetailCard').then((mod) => mod.DoctorDetailCard),
  { ssr: false }
);

export interface PatientDetailCardProps {
  patientId?: string | null;
  patient?: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (patient: Patient) => void;
  onRelease?: (patient: Patient) => void;
  onDelete?: (patient: Patient) => void;
  onViewDoctor?: (doctorId: string) => void;
  onAvatarUpdated?: (patient: Patient) => void;
}

export const PatientDetailCard: React.FC<PatientDetailCardProps> = ({
  patientId,
  patient: initialPatient,
  isOpen,
  onClose,
  onEdit,
  onRelease,
  onDelete,
  onViewDoctor,
  onAvatarUpdated,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [isAssignDoctorModalOpen, setIsAssignDoctorModalOpen] = useState(false);

  // internal autonomous modals state
  const [isInternalReleaseOpen, setIsInternalReleaseOpen] = useState(false);
  const [internalReleaseSubmitting, setInternalReleaseSubmitting] = useState(false);

  const [isInternalEditOpen, setIsInternalEditOpen] = useState(false);
  const [internalPatientForm, setInternalPatientForm] = useState<PatientFormData>({
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
  const [internalAvatarFile, setInternalAvatarFile] = useState<File | null>(null);
  const [internalAvatarPreview, setInternalAvatarPreview] = useState<string | null>(null);
  const [internalEditSubmitting, setInternalEditSubmitting] = useState(false);
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);

  const [isInternalDeleteOpen, setIsInternalDeleteOpen] = useState(false);
  const [internalDeleteSubmitting, setInternalDeleteSubmitting] = useState(false);

  const [internalViewingDoctorId, setInternalViewingDoctorId] = useState<string | null>(null);

  const targetId = patientId || initialPatient?._id;
  const isLoading = Boolean(!isOpen || !targetId || !patient || loadedId !== targetId);

  // fetch fresh patient details from api every time drawer opens or targetId changes
  useEffect(() => {
    if (!isOpen || !targetId) return;

    let isMounted = true;

    PatientService.getPatientById(targetId)
      .then((data) => {
        if (isMounted) {
          setPatient(data);
          setLoadedId(targetId);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Failed to fetch patient details:', err);
          toast.error('Load Failed', 'Could not fetch patient details.');
          setLoadedId(targetId);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, targetId]);

  const activePatient = patient && loadedId === targetId ? patient : null;

  if (!isOpen && !activePatient && !targetId) return null;

  const attendingDoctor =
    activePatient?.doctorId && typeof activePatient.doctorId === 'object'
      ? activePatient.doctorId
      : null;

  const doctorDisplayName = attendingDoctor
    ? attendingDoctor.name.startsWith('Dr.')
      ? attendingDoctor.name
      : `Dr. ${attendingDoctor.name}`
    : 'Doctor';

  // upload patient avatar
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activePatient) return;
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file', 'Please select an image file (PNG, JPG, WEBP).');
      return;
    }

    try {
      setIsUploading(true);
      const updated = await PatientService.updateAvatar(activePatient._id, file);
      toast.success('Avatar Updated', `Avatar updated for ${activePatient.name}.`);
      setPatient(updated);
      onAvatarUpdated?.(updated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'failed to upload avatar';
      toast.error('Upload Failed', msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // autonomous release handler
  const handleTriggerRelease = () => {
    if (onRelease && activePatient) {
      onRelease(activePatient);
    } else if (activePatient) {
      setIsInternalReleaseOpen(true);
    }
  };

  const handleConfirmInternalRelease = async (patientId: string, releaseDate: string, remark: string) => {
    try {
      setInternalReleaseSubmitting(true);
      const updated = await PatientService.releasePatient(patientId, releaseDate, remark);
      toast.success('Patient Released', `${updated.name || 'Patient'} has been released.`);
      setPatient(updated);
      onAvatarUpdated?.(updated);
      setIsInternalReleaseOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'failed to release patient';
      toast.error('Release Failed', msg);
    } finally {
      setInternalReleaseSubmitting(false);
    }
  };

  // autonomous edit handler
  const handleTriggerEdit = () => {
    if (onEdit && activePatient) {
      onEdit(activePatient);
    } else if (activePatient) {
      setInternalPatientForm({
        name: activePatient.name,
        age: String(activePatient.age),
        gender: activePatient.gender,
        phone: activePatient.phone,
        email: activePatient.email || '',
        condition: activePatient.condition,
        doctorId:
          typeof activePatient.doctorId === 'object' && activePatient.doctorId
            ? activePatient.doctorId._id
            : (activePatient.doctorId as string) || '',
        admissionDate: activePatient.admissionDate
          ? activePatient.admissionDate.split('T')[0]
          : new Date().toISOString().split('T')[0],
        note: activePatient.note || '',
      });
      setInternalAvatarFile(null);
      setInternalAvatarPreview(activePatient.avatar?.url || null);
      if (doctorsList.length === 0) {
        DoctorService.getAllDoctors({ limit: 100 })
          .then((res) => setDoctorsList(res.data || []))
          .catch(() => {});
      }
      setIsInternalEditOpen(true);
    }
  };

  const handleSubmitInternalEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient) return;
    try {
      setInternalEditSubmitting(true);
      const payload = {
        name: internalPatientForm.name,
        age: Number(internalPatientForm.age),
        gender: internalPatientForm.gender,
        phone: internalPatientForm.phone,
        email: internalPatientForm.email || undefined,
        condition: internalPatientForm.condition,
        doctorId: internalPatientForm.doctorId || undefined,
        admissionDate: internalPatientForm.admissionDate,
        note: internalPatientForm.note || undefined,
      };
      const updated = await PatientService.updatePatient(activePatient._id, payload);
      if (internalAvatarFile) {
        try {
          const avRes = await PatientService.updateAvatar(activePatient._id, internalAvatarFile);
          updated.avatar = avRes.avatar;
        } catch (avErr) {
          console.error('Avatar update failed:', avErr);
        }
      }
      toast.success('Patient Updated', `${updated.name} profile saved.`);
      setPatient(updated);
      onAvatarUpdated?.(updated);
      setIsInternalEditOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'failed to update patient';
      toast.error('Update Failed', msg);
    } finally {
      setInternalEditSubmitting(false);
    }
  };

  // autonomous delete handler
  const handleTriggerDelete = () => {
    if (onDelete && activePatient) {
      onDelete(activePatient);
    } else if (activePatient) {
      setIsInternalDeleteOpen(true);
    }
  };

  const handleConfirmInternalDelete = async () => {
    if (!activePatient) return;
    try {
      setInternalDeleteSubmitting(true);
      await PatientService.deletePatient(activePatient._id);
      toast.success('Patient Deleted', `${activePatient.name}'s record was removed.`);
      setIsInternalDeleteOpen(false);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'failed to delete patient';
      toast.error('Delete Failed', msg);
    } finally {
      setInternalDeleteSubmitting(false);
    }
  };

  // autonomous view doctor handler
  const handleTriggerViewDoctor = (docId: string) => {
    if (!docId) return;
    if (onViewDoctor) {
      onClose();
      onViewDoctor(docId);
    } else {
      setInternalViewingDoctorId(docId);
    }
  };

  // format admission date safely
  const formattedAdmissionDate = (() => {
    if (!activePatient?.admissionDate) return 'N/A';
    const parsed = new Date(activePatient.admissionDate);
    if (isNaN(parsed.getTime())) return 'N/A';
    return parsed.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  })();

  // format registered date safely
  const formattedRegisteredDate = (() => {
    if (!activePatient?.createdAt) return 'N/A';
    const parsed = new Date(activePatient.createdAt);
    if (isNaN(parsed.getTime())) return 'N/A';
    return parsed.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  })();

  return (
    <>
      <SideSheet isOpen={isOpen} onClose={onClose} width="lg" className="p-0">
        {/* drawer header using PageHeader size="sm" */}
        <PageHeader
          size="sm"
          title="Patient Dossier"
          subtitle={
            isLoading
              ? 'Loading clinical record...'
              : activePatient?.condition || 'Clinical and specialist care record'
          }
          icon={<Users className="w-4 h-4 text-secondary" />}
          onClose={onClose}
          className="shrink-0 px-6 py-4 border-b border-border/80 bg-card/90 relative z-10"
        />

        {/* When loading or data not ready, show skeleton */}
        {isLoading || !activePatient ? (
          <PatientDetailSkeleton animated={true} />
        ) : (
          <div className="flex flex-col flex-1 min-h-0">
            {/* scrollable body matching Profile Drawer 1:1 */}
            <div className="flex-1 overflow-y-auto no-scrollbar scrollbar-none p-6 space-y-5">
              {/* full colored gradient top card */}
              <div className="relative rounded-3xl bg-linear-to-br from-secondary to-secondary-hover p-5 space-y-4 shadow-xl overflow-hidden text-white">
                {/* background glows */}
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                <div className="pointer-events-none absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

                <div className="flex items-start gap-4 relative z-10">
                  {/* avatar with update trigger */}
                  <div className="relative group shrink-0">
                    {activePatient.avatar?.url ? (
                      <div className="relative w-18 h-18 rounded-2xl overflow-hidden border-2 border-white/40 shadow-lg bg-white/10">
                        <Image
                          src={activePatient.avatar.url}
                          alt={activePatient.name}
                          fill
                          sizes="72px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-18 h-18 rounded-2xl bg-white/20 text-white flex items-center justify-center border-2 border-white/40 shadow-lg backdrop-blur-sm">
                        <Users className="w-8 h-8 text-white" />
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
                      title="Change patient photo"
                    >
                      <Camera className="w-4 h-4 mb-0.5" />
                      <span className="text-[9px] font-bold">
                        {isUploading ? 'Uploading...' : 'Update'}
                      </span>
                    </button>
                  </div>

                  {/* patient identity info */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <span className="text-base font-bold  truncate block">
                      {activePatient.name}
                    </span>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 border border-white/20 backdrop-blur-xs">
                        {activePatient.age} Yrs
                      </span>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 border border-white/20 backdrop-blur-xs">
                        {activePatient.gender}
                      </span>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 border border-white/20 backdrop-blur-xs">
                        {activePatient.condition}
                      </span>
                    </div>
                  </div>
                </div>

                {/* status banner */}
                <div className="p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-medium">
                    <Clock className="w-3.5 h-3.5 opacity-80" />
                    <span>Clinical Care Status</span>
                  </div>
                  <span className="font-bold flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        activePatient.isReleased ? 'bg-muted-foreground' : 'bg-emerald-300 animate-pulse'
                      }`}
                    />
                    {activePatient.isReleased ? 'Discharged / Released' : 'Admitted & Under Care'}
                  </span>
                </div>
              </div>

              {/* attending specialist section */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-foreground">Attending Specialist</span>
                {attendingDoctor ? (
                  <div
                    onClick={() => {
                      if (attendingDoctor._id) {
                        handleTriggerViewDoctor(attendingDoctor._id);
                      }
                    }}
                    className="relative overflow-hidden group transition-all duration-300 p-3 sm:p-3.5 rounded-2xl bg-primary text-primary-foreground hover:bg-primary-hover/90 cursor-pointer shadow-md shadow-primary/20 hover:shadow-lg space-y-2.5"
                  >
                    {/* doctor main info row */}
                    <div className="flex items-center justify-between gap-3 relative z-10">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* doctor avatar with border and shadow */}
                        <div className="relative w-12 h-12 sm:w-13 sm:h-13 rounded-xl bg-primary-foreground/90 border-2 border-white/80 overflow-hidden flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300">
                          {attendingDoctor.avatar?.url ? (
                            <Image
                              src={attendingDoctor.avatar.url}
                              alt={attendingDoctor.name}
                              fill
                              sizes="52px"
                              className="object-cover"
                            />
                          ) : (
                            <Stethoscope className="w-6 h-6 text-primary" />
                          )}
                        </div>

                        {/* doctor name, specialty & hospital (hospital on next line) */}
                        <div className="min-w-0 flex-1 space-y-1">
                          <h4
                            className="font-semibold text-white text-sm sm:text-base truncate leading-tight drop-shadow-xs"
                            title={doctorDisplayName}
                          >
                            {doctorDisplayName}
                          </h4>
                          <div>
                            <span className="inline-block text-white px-2 py-0.5 rounded-md bg-warning font-bold truncate max-w-full shadow-xs text-[11px]">
                              {attendingDoctor.specialization}
                            </span>
                          </div>
                          {attendingDoctor.hospital && (
                            <p
                              className="text-[11px] text-white/90 font-medium flex items-center gap-1.5 truncate"
                              title={attendingDoctor.hospital}
                            >
                              <Building2 className="w-3.5 h-3.5 shrink-0 opacity-85" />
                              <span className="truncate">{attendingDoctor.hospital}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* change specialist action button */}
                      <div className="shrink-0">
                        <Button
                          type="button"
                          variant="light-primary"
                          size="sm"
                          capsule={false}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsAssignDoctorModalOpen(true);
                          }}
                          className="h-7 px-2.5 text-xs font-bold rounded-xl border-0"
                          leftIcon={<Stethoscope className="w-3.5 h-3.5" />}
                        >
                          Change Specialist
                        </Button>
                      </div>
                    </div>

                    {/* contact channels for detailed doctor card */}
                    {(attendingDoctor.phone || attendingDoctor.email) && (
                      <div className="pt-2 border-t border-white/20 flex items-center gap-3 text-xs text-white/90 font-medium flex-wrap relative z-10">
                        {attendingDoctor.phone && (
                          <a
                            href={`tel:${attendingDoctor.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 hover:underline hover:text-white"
                            title={`Call ${doctorDisplayName}`}
                          >
                            <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center shrink-0">
                              <Phone className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span>{attendingDoctor.phone}</span>
                          </a>
                        )}
                        {attendingDoctor.email && (
                          <a
                            href={`mailto:${attendingDoctor.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 hover:underline hover:text-white truncate max-w-50 sm:max-w-65"
                            title={`Email ${doctorDisplayName}`}
                          >
                            <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center shrink-0">
                              <Mail className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="truncate">{attendingDoctor.email}</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-muted/20 border border-dashed border-border text-center space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-foreground">No attending specialist assigned yet</p>
                      <p className="text-[11px] text-muted-foreground">Assign a specialist to oversee consultations and clinical care.</p>
                    </div>
                    <div className="pt-1 flex justify-center">
                      <Button
                        type="button"
                        size="sm"
                        variant="primary"
                        onClick={() => setIsAssignDoctorModalOpen(true)}
                        leftIcon={<Stethoscope className="w-3.5 h-3.5" />}
                      >
                        Assign Specialist
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* patient contact channels */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-foreground">Direct Contact Channels</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a
                    href={`tel:${activePatient.phone}`}
                    className="p-3 rounded-2xl bg-card border border-border/70 hover:border-secondary/50 hover:bg-secondary/5 flex items-center gap-3 transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0 group-hover:bg-secondary group-hover:text-white transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Phone</p>
                      <p className="text-xs font-semibold text-foreground truncate">{activePatient.phone}</p>
                    </div>
                  </a>

                  {activePatient.email ? (
                    <a
                      href={`mailto:${activePatient.email}`}
                      className="p-3 rounded-2xl bg-card border border-border/70 hover:border-primary/50 hover:bg-primary/5 flex items-center gap-3 transition-colors group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Email</p>
                        <p className="text-xs font-semibold text-foreground truncate">{activePatient.email}</p>
                      </div>
                    </a>
                  ) : (
                    <div className="p-3 rounded-2xl bg-muted/20 border border-border/40 flex items-center gap-3 opacity-60">
                      <div className="w-8 h-8 rounded-xl bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Email</p>
                        <p className="text-xs text-muted-foreground italic truncate">Not provided</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* admission and discharge dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-secondary" />
                    Admission Date
                  </span>
                  <p className="text-xs font-bold text-foreground">{formattedAdmissionDate}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    Registered In System
                  </span>
                  <p className="text-xs font-bold text-foreground">{formattedRegisteredDate}</p>
                </div>
              </div>

              {/* clinical notes */}
              {activePatient.note && (
                <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/80 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <FileText className="w-3.5 h-3.5 text-secondary" />
                    <span>Clinical Observations & Notes</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {activePatient.note}
                  </p>
                </div>
              )}
            </div>

            {/* fixed action footer matching Profile Drawer 1:1 - always visible */}
            <div className="shrink-0 p-4 sm:p-5 px-5 sm:px-6 border-t border-border/80 flex items-center justify-end gap-2 sm:gap-2.5 bg-card/90">
              {!activePatient.isReleased && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleTriggerRelease}
                  leftIcon={<UserCheck className="w-3.5 h-3.5" />}
                  className="whitespace-nowrap"
                >
                  Release
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleTriggerEdit}
                leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                className="whitespace-nowrap"
              >
                Edit
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleTriggerDelete}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                className="whitespace-nowrap"
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </SideSheet>

      {/* modal to assign an attending specialist to this unassigned patient */}
      <AssignDoctorToPatientModal
        isOpen={isAssignDoctorModalOpen}
        onClose={() => setIsAssignDoctorModalOpen(false)}
        patient={activePatient}
        onSuccess={(updated) => {
          setPatient(updated);
          onAvatarUpdated?.(updated);
        }}
      />

      {/* autonomous modal: edit patient */}
      <PatientFormModal
        isOpen={isInternalEditOpen}
        onClose={() => setIsInternalEditOpen(false)}
        editingPatient={activePatient}
        patientForm={internalPatientForm}
        setPatientForm={setInternalPatientForm}
        doctorsList={doctorsList}
        avatarPreviewUrl={internalAvatarPreview}
        onAvatarChange={(file) => {
          setInternalAvatarFile(file);
          if (file) {
            const url = URL.createObjectURL(file);
            setInternalAvatarPreview(url);
          } else {
            setInternalAvatarPreview(null);
          }
        }}
        onSubmit={handleSubmitInternalEdit}
        submitting={internalEditSubmitting}
      />

      {/* autonomous modal: release patient */}
      <ReleasePatientModal
        isOpen={isInternalReleaseOpen}
        onClose={() => setIsInternalReleaseOpen(false)}
        patient={activePatient}
        loading={internalReleaseSubmitting}
        onConfirmRelease={handleConfirmInternalRelease}
      />

      {/* autonomous modal: delete patient */}
      <PatientDeleteModal
        isOpen={isInternalDeleteOpen}
        onClose={() => setIsInternalDeleteOpen(false)}
        patient={activePatient}
        loading={internalDeleteSubmitting}
        onConfirm={handleConfirmInternalDelete}
      />

      {/* autonomous sub-drawer: view doctor details when no onViewDoctor is passed */}
      {internalViewingDoctorId && (
        <DoctorDetailCard
          doctorId={internalViewingDoctorId}
          isOpen={Boolean(internalViewingDoctorId)}
          onClose={() => setInternalViewingDoctorId(null)}
          onViewPatient={(patId) => {
            setInternalViewingDoctorId(null);
            if (patId !== targetId) {
              PatientService.getPatientById(patId).then((p) => setPatient(p));
            }
          }}
        />
      )}
    </>
  );
};