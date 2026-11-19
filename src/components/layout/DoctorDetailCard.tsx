'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { DoctorService, type Doctor, type DoctorPatient } from '@/server/doctor.service';
import { Button, SideSheet, toast, PageHeader } from '@/components/ui';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import { DoctorDetailSkeleton } from '@/components/skeletons/DoctorDetailSkeleton';
import { AssignExistingPatientModal } from '@/components/modals/AssignExistingPatientModal';
import {
  Stethoscope,
  Building2,
  Phone,
  Mail,
  Calendar,
  Users,
  UserPlus,
  Trash2,
  Edit2,
  Camera,
  ShieldCheck,
  FileText,
  UserCheck,
} from 'lucide-react';

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
  onAvatarUpdated,
  loadingPatients = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fetchedDoctor, setFetchedDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(() => Boolean(!initialDoctor && Boolean(doctorId)));
  const [isAssignModalOpen, setIsAssignModalOpen] = useState<boolean>(false);

  const targetId = doctorId || initialDoctor?._id;

  // fetch doctor details on open
  useEffect(() => {
    if (!isOpen || !targetId) return;

    let isMounted = true;

    DoctorService.getDoctorById(targetId)
      .then((data) => {
        if (isMounted) {
          setFetchedDoctor(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Failed to fetch doctor details:', err);
          toast.error('Load Failed', 'Could not fetch doctor details.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, targetId]);

  const activeDoctor = initialDoctor || fetchedDoctor;

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

  // refresh doctor details after assigning existing patient
  const handlePatientAssigned = async () => {
    if (!targetId) return;
    try {
      const refreshed = await DoctorService.getDoctorById(targetId);
      setFetchedDoctor(refreshed);
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
      setFetchedDoctor(updated);
      onAvatarUpdated?.(updated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'failed to upload avatar';
      toast.error('Upload Failed', msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
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
                    {new Date(activeDoctor.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
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
                      variant="outline"
                      onClick={() => setIsAssignModalOpen(true)}
                      leftIcon={<Users className="w-3.5 h-3.5 text-secondary" />}
                    >
                      Assign
                    </Button>
                    {onAddPatient && (
                      <Button
                        type="button"
                        size="sm"
                        variant="primary"
                        onClick={onAddPatient}
                        leftIcon={<UserPlus className="w-3.5 h-3.5" />}
                      >
                        Admit
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-0.5">
                  {loadingPatients ? (
                    <div className="space-y-2">
                      {Array.from({ length: Math.max(1, Math.min(3, displayPatientCount || 2)) }).map((_, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-2xl bg-linear-to-r from-primary/10 via-card to-secondary/10 border border-primary/25 flex items-center justify-between gap-3 animate-pulse shadow-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <div className="w-8 h-8 rounded-xl bg-secondary/20 border border-secondary/30 text-secondary flex items-center justify-center font-bold text-xs shrink-0">
                              <Users className="w-3.5 h-3.5 opacity-50" />
                            </div>
                            <div className="space-y-1.5 flex-1 min-w-0">
                              <div className="h-3.5 bg-primary/25 border border-primary/20 rounded-md w-28" />
                              <div className="flex items-center gap-2">
                                <div className="h-2.5 bg-secondary/25 rounded-md w-16" />
                                <div className="h-2 bg-primary/15 rounded-md w-20" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
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
                          leftIcon={<Users className="w-3.5 h-3.5 text-secondary" />}
                        >
                          Assign Patient
                        </Button>
                        {onAddPatient && (
                          <Button
                            type="button"
                            size="sm"
                            variant="primary"
                            onClick={onAddPatient}
                            leftIcon={<UserPlus className="w-3.5 h-3.5" />}
                          >
                            Admit Patient
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    assignedPatients.map((p, idx) => {
                      const patientId = typeof p === 'string' ? p : p._id;
                      const patientName = typeof p === 'string' ? `Patient ${idx + 1}` : p.name;
                      const patientCondition = typeof p === 'object' ? p.condition : undefined;
                      const patientPhone = typeof p === 'object' ? p.phone : undefined;

                      return (
                        <MotionWrapper key={patientId} delay={idx * 0.04} animationType="fade">
                          <div className="p-3 rounded-2xl bg-card border border-border/70 hover:border-secondary/30 transition-all flex items-center justify-between gap-3 text-xs shadow-2xs group">
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <div className="w-8 h-8 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary flex items-center justify-center font-bold text-xs shrink-0">
                                {patientName.charAt(0)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-bold text-foreground truncate group-hover:text-secondary transition-colors">
                                  {patientName}
                                </p>
                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                  {patientCondition && (
                                    <span className="text-warning font-semibold truncate">
                                      {patientCondition}
                                    </span>
                                  )}
                                  {patientPhone && (
                                    <span className="truncate">{patientPhone}</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {onReleasePatient && (
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  capsule={false}
                                  onClick={() =>
                                    onReleasePatient(typeof p === 'string' ? { _id: p, name: patientName } : p)
                                  }
                                  title={`Release ${patientName}`}
                                  className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary-hover shrink-0 font-semibold h-8 px-3 text-xs shadow-xs"
                                >
                                  <UserCheck className="w-3.5 h-3.5 mr-1 text-secondary-foreground" />
                                  Release
                                </Button>
                              )}

                              {onRemovePatient && (
                                <button
                                  type="button"
                                  onClick={() => onRemovePatient(patientId, patientName)}
                                  title={`Delete ${patientName} from doctor's list`}
                                  className="w-8 h-8 rounded-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground border border-destructive/25 flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-xs active:scale-95"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </MotionWrapper>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* fixed footer matching Profile Drawer 1:1 */}
            <div className="shrink-0 p-4 sm:p-5 px-5 sm:px-6 border-t border-border/80 flex items-center justify-end gap-2 sm:gap-2.5 bg-card/90">
              {onEdit && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(activeDoctor)}
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
                  onClick={() => onDelete(activeDoctor)}
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

      {/* modal to select and assign an unassigned patient to this doctor */}
      <AssignExistingPatientModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        doctor={activeDoctor || null}
        onSuccess={handlePatientAssigned}
        onOpenAdmitModal={onAddPatient}
      />
    </>
  );
};
