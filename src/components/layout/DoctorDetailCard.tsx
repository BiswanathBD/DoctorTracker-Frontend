'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { DoctorService, type Doctor, type DoctorPatient } from '@/server/doctor.service';
import { Button, SideSheet, toast } from '@/components/ui';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import {
  Stethoscope,
  Building2,
  Phone,
  Mail,
  Calendar,
  Users,
  UserPlus,
  Trash2,
  X,
  Edit2,
  Camera,
  ShieldCheck,
} from 'lucide-react';

interface DoctorDetailCardProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (doctor: Doctor) => void;
  onDelete?: (doctor: Doctor) => void;
  onAddPatient: () => void;
  onRemovePatient: (patientId: string, patientName: string) => void;
  onAvatarUpdated?: (doctor: Doctor) => void;
  loadingPatients?: boolean;
}

export const DoctorDetailCard: React.FC<DoctorDetailCardProps> = ({
  doctor,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onAddPatient,
  onRemovePatient,
  onAvatarUpdated,
  loadingPatients = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!doctor) return null;

  const assignedPatients: DoctorPatient[] = doctor.assignedPatients || doctor.patients || [];
  const displayPatientCount =
    doctor.patientCount !== undefined ? doctor.patientCount : assignedPatients.length;
  const doctorDisplayName = doctor.name.startsWith('Dr.') ? doctor.name : `Dr. ${doctor.name}`;

  // upload doctor avatar
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file', 'Please select an image file (PNG, JPG, WEBP).');
      return;
    }

    try {
      setIsUploading(true);
      const updated = await DoctorService.updateAvatar(doctor._id, file);
      toast.success('Avatar Updated', `Avatar updated for ${doctorDisplayName}.`);
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
    <SideSheet isOpen={isOpen} onClose={onClose} width="xl">
      {/* drawer header */}
      <div className="p-5 pb-3 border-b border-border/70 flex items-center justify-between shrink-0 bg-card/60 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-foreground">
              Doctor Dossier
            </h2>
            <p className="text-[11px] text-muted-foreground">Comprehensive specialist profile</p>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          title="Close details"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* body */}
      <div className="flex-1 overflow-y-auto scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-5 space-y-5">
        {/* full colored gradient top card */}
        <div className="relative rounded-3xl bg-linear-to-br from-primary via-primary-hover to-primary p-5 space-y-4 shadow-xl border border-white/20 text-white overflow-hidden">
          {/* background glows */}
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

          <div className="flex items-start gap-4 relative z-10">
            {/* avatar */}
            <div className="relative group shrink-0">
              {doctor.avatar?.url ? (
                <div className="relative w-18 h-18 rounded-2xl overflow-hidden border-2 border-white/40 shadow-lg bg-white/10">
                  <Image
                    src={doctor.avatar.url}
                    alt={doctor.name}
                    fill
                    sizes="72px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="w-18 h-18 rounded-2xl bg-white/20 text-white flex items-center justify-center font-black text-2xl uppercase border-2 border-white/40 shadow-lg backdrop-blur-sm">
                  {doctor.name ? doctor.name.replace(/^dr\.?\s+/i, '').charAt(0) : 'D'}
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

            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center text-[10px] font-bold bg-white/20 text-white border border-white/30 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                  {doctor.specialization}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-white bg-white/20 border border-white/30 backdrop-blur-md px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-white" />
                  Verified Specialist
                </span>
              </div>

              <h3 className="font-black text-white text-xl tracking-tight truncate drop-shadow-xs">
                {doctor.name}
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-white/90">
                <Building2 className="w-3.5 h-3.5 text-white/90 shrink-0" />
                <span className="truncate font-medium">{doctor.hospital}</span>
              </div>
            </div>
          </div>
        </div>

        {/* metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-medium">Assigned Patients</span>
              <Users className="w-3.5 h-3.5 text-secondary" />
            </div>
            <p className="text-xl font-black text-foreground tracking-tight">
              {displayPatientCount}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-medium">Registered Date</span>
              <Calendar className="w-3.5 h-3.5 text-primary" />
            </div>
            <p className="text-xs font-bold text-foreground mt-1 truncate">
              {doctor.createdAt ? new Date(doctor.createdAt).toLocaleDateString() : 'Active'}
            </p>
          </div>
        </div>

        {/* contact info */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-foreground block">
            Direct Contact Information
          </span>

          <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/70 space-y-2.5 text-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <span className="truncate text-foreground font-medium">{doctor.phone}</span>
              </div>
              <a
                href={`tel:${doctor.phone}`}
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
                <span className="truncate text-foreground font-medium">{doctor.email}</span>
              </div>
              <a
                href={`mailto:${doctor.email}`}
                className="text-[11px] font-bold text-primary hover:underline shrink-0"
              >
                Email
              </a>
            </div>
          </div>
        </div>

        {/* patient roster */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-bold text-foreground">
                Patient Roster ({displayPatientCount})
              </span>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onAddPatient}
              leftIcon={<UserPlus className="w-3.5 h-3.5 text-primary" />}
            >
              Assign Patient
            </Button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-0.5">
            {loadingPatients || (assignedPatients.length === 0 && displayPatientCount > 0) ? (
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
                    <div className="w-7 h-7 rounded-xl bg-destructive/15 border border-destructive/20 text-destructive/40 flex items-center justify-center shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
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
                  Assign a patient directly to {doctorDisplayName} to start tracking consultations.
                </p>
                <div className="pt-2 flex justify-center">
                  <Button
                    type="button"
                    size="sm"
                    variant="primary"
                    onClick={onAddPatient}
                    leftIcon={<UserPlus className="w-3.5 h-3.5" />}
                  >
                    Assign First Patient
                  </Button>
                </div>
              </div>
            ) : (
              assignedPatients.map((p, idx) => {
                const patientId = typeof p === 'string' ? p : p._id;
                const patientName = typeof p === 'string' ? 'Patient record' : p.name;
                const patientCondition = typeof p === 'string' ? '' : p.condition;
                const patientPhone = typeof p === 'string' ? '' : p.phone;

                return (
                  <MotionWrapper
                    key={patientId}
                    animationType="fade"
                    delay={idx * 0.1}
                    duration={0.3}
                  >
                    <div className="p-3 rounded-2xl bg-card border border-border/80 hover:border-primary/40 flex items-center justify-between gap-3 transition-all shadow-xs group">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xs shrink-0">
                          {patientName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                            {patientName}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                            {patientCondition && (
                              <span className="font-medium text-secondary truncate">
                                {patientCondition}
                              </span>
                            )}
                            {patientPhone && (
                              <span className="truncate">{patientPhone}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        capsule={false}
                        onClick={() => onRemovePatient(patientId, patientName)}
                        title={`Delete ${patientName}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </MotionWrapper>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* footer */}
      <div className="p-4 border-t border-border/70 flex items-center justify-end gap-2.5 bg-card/60 backdrop-blur-md shrink-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onEdit(doctor)}
          leftIcon={<Edit2 className="w-3.5 h-3.5" />}
        >
          Edit Doctor
        </Button>
        
        {onDelete && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => onDelete(doctor)}
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Delete Doctor
          </Button>
        )}
      </div>
    </SideSheet>
  );
};
