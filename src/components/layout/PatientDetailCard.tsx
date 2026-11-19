'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { PatientService, type Patient } from '@/server/patient.service';
import { Button, SideSheet, toast, PageHeader } from '@/components/ui';
import { PatientDetailSkeleton } from '@/components/skeletons/PatientDetailSkeleton';
import { AssignDoctorToPatientModal } from '@/components/modals/AssignDoctorToPatientModal';
import {
  Stethoscope,
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

export interface PatientDetailCardProps {
  patientId?: string | null;
  patient?: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (patient: Patient) => void;
  onRelease?: (patient: Patient) => void;
  onDelete?: (patient: Patient) => void;
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
  onAvatarUpdated,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fetchedPatient, setFetchedPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(() => Boolean(!initialPatient && Boolean(patientId)));
  const [isAssignDoctorModalOpen, setIsAssignDoctorModalOpen] = useState(false);

  const targetId = patientId || initialPatient?._id;

  // Whenever drawer opens or targetId changes, fetch fresh data by ID
  useEffect(() => {
    if (!isOpen || !targetId) return;

    let isMounted = true;

    PatientService.getPatientById(targetId)
      .then((data) => {
        if (isMounted) {
          setFetchedPatient(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Failed to fetch patient details:', err);
          toast.error('Load Failed', 'Could not fetch patient details.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, targetId]);

  const activePatient = initialPatient || fetchedPatient;

  if (!isOpen && !activePatient && !targetId) return null;

  const attendingDoctor =
    activePatient?.doctorId && typeof activePatient.doctorId === 'object'
      ? activePatient.doctorId
      : null;

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
      setFetchedPatient(updated);
      onAvatarUpdated?.(updated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'failed to upload avatar';
      toast.error('Upload Failed', msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // format admission date
  const formattedAdmissionDate = activePatient?.admissionDate
    ? new Date(activePatient.admissionDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    : 'N/A';

  // format registered date
  const formattedRegisteredDate = activePatient?.createdAt
    ? new Date(activePatient.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    : 'N/A';

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
                    className={`w-2 h-2 rounded-full ${activePatient.isReleased ? 'bg-muted-foreground' : 'bg-emerald-300 animate-pulse'
                      }`}
                  />
                  {activePatient.isReleased ? 'Discharged / Released' : 'Admitted & Under Care'}
                </span>
              </div>
            </div>

            {/* attending specialist section */}
            <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Attending Specialist</span>
                {attendingDoctor && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setIsAssignDoctorModalOpen(true)}
                    className="h-7 px-2.5 text-[11px] text-primary"
                    leftIcon={<Stethoscope className="w-3 h-3 text-primary" />}
                  >
                    Change Specialist
                  </Button>
                )}
              </div>
              {attendingDoctor ? (
                <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20 flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-primary/10 border border-primary/25 shrink-0 flex items-center justify-center text-primary">
                    {attendingDoctor.avatar?.url ? (
                      <Image
                        src={attendingDoctor.avatar.url}
                        alt={attendingDoctor.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <Stethoscope className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-foreground truncate">
                      {attendingDoctor.name.startsWith('Dr.')
                        ? attendingDoctor.name
                        : `Dr. ${attendingDoctor.name}`}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="text-primary font-semibold truncate">
                        {attendingDoctor.specialization}
                      </span>
                      {attendingDoctor.hospital && (
                        <span className="truncate opacity-75">({attendingDoctor.hospital})</span>
                      )}
                    </div>
                  </div>
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

          {/* fixed action footer matching Profile Drawer 1:1 */}
          <div className="shrink-0 p-4 sm:p-5 px-5 sm:px-6 border-t border-border/80 flex items-center justify-end gap-2 sm:gap-2.5 bg-card/90">
            {!activePatient.isReleased && onRelease && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => onRelease(activePatient)}
                leftIcon={<UserCheck className="w-3.5 h-3.5" />}
                className="whitespace-nowrap"
              >
                Release
              </Button>
            )}
            {onEdit && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onEdit(activePatient)}
                leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                className="whitespace-nowrap"
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => onDelete(activePatient)}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                className="whitespace-nowrap"
              >
                Delete
              </Button>
            )}
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
        setFetchedPatient(updated);
        onAvatarUpdated?.(updated);
      }}
    />
  </>
);
};
