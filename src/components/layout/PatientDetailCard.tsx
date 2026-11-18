'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { PatientService, type Patient } from '@/server/patient.service';
import { Button, SideSheet, toast } from '@/components/ui';
import {
  HeartPulse,
  Stethoscope,
  Phone,
  Mail,
  Calendar,
  X,
  Edit2,
  Trash2,
  Building2,
  Camera,
  Users,
  Clock,
  Sparkles,
  FileText,
  UserCheck,
} from 'lucide-react';

interface PatientDetailCardProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (patient: Patient) => void;
  onRelease?: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
  onAvatarUpdated?: (patient: Patient) => void;
}

export const PatientDetailCard: React.FC<PatientDetailCardProps> = ({
  patient,
  isOpen,
  onClose,
  onEdit,
  onRelease,
  onDelete,
  onAvatarUpdated,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!patient) return null;

  const attendingDoctor =
    patient.doctorId && typeof patient.doctorId === 'object'
      ? patient.doctorId
      : null;

  // upload patient avatar
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file', 'Please select an image file (PNG, JPG, WEBP).');
      return;
    }

    try {
      setIsUploading(true);
      const updated = await PatientService.updateAvatar(patient._id, file);
      toast.success('Avatar Updated', `Avatar updated for ${patient.name}.`);
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
  const formattedAdmissionDate = patient.admissionDate
    ? new Date(patient.admissionDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'N/A';

  // format registered date
  const formattedRegisteredDate = patient.createdAt
    ? new Date(patient.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'N/A';

  return (
    <SideSheet isOpen={isOpen} onClose={onClose} width="xl">
      {/* drawer header */}
      <div className="p-5 pb-3 border-b border-border/70 flex items-center justify-between shrink-0 bg-card/60 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center font-bold">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Patient Dossier
            </h2>
            <p className="text-xs text-muted-foreground font-medium">Clinical and specialist care record</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          title="Close details"
          className="w-8 aspect-square flex items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors duration-200 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* scrollable body */}
      <div className="flex-1 overflow-y-auto scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-5 space-y-5">
        {/* full colored gradient top card */}
        <div className="relative rounded-3xl bg-linear-to-br from-secondary to-secondary-hover p-5 space-y-4 shadow-xl overflow-hidden text-white">
          {/* background glows */}
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

          <div className="flex items-start gap-4 relative z-10">
            {/* avatar with update trigger */}
            <div className="relative group shrink-0">
              {patient.avatar?.url ? (
                <div className="relative w-18 h-18 rounded-2xl overflow-hidden border-2 border-white/40 shadow-lg bg-white/10">
                  <Image
                    src={patient.avatar.url}
                    alt={patient.name}
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

            {/* details & badge */}
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center text-[10px] font-bold bg-white/20 text-white border border-white/30 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                  {patient.gender}
                </span>
                <span className="inline-flex items-center text-[10px] font-bold bg-white/20 text-white border border-white/30 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                  {patient.age} Years Old
                </span>
                {patient.isReleased ? (
                  <span className="inline-flex items-center text-[10px] font-bold bg-amber-400/90 text-amber-950 border border-amber-300 px-2.5 py-0.5 rounded-full shadow-xs">
                    Discharged / Released
                  </span>
                ) : (
                  <span className="inline-flex items-center text-[10px] font-bold bg-emerald-400/90 text-emerald-950 border border-emerald-300 px-2.5 py-0.5 rounded-full shadow-xs">
                    Under Active Care
                  </span>
                )}
              </div>

              <h3 className="font-semibold text-white text-xl tracking-tight truncate drop-shadow-xs">
                {patient.name}
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-white/90">
                <HeartPulse className="w-3.5 h-3.5 text-white/90 shrink-0" />
                <span className="truncate font-medium">{patient.condition}</span>
              </div>
            </div>
          </div>
        </div>

        {/* real metrics grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3 text-secondary" />
              Admission Date
            </span>
            <p className="text-xs font-bold text-foreground truncate">{formattedAdmissionDate}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Users className="w-3 h-3 text-primary" />
              Demographics
            </span>
            <p className="text-xs font-bold text-foreground truncate">
              {patient.age} yrs • {patient.gender}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Phone className="w-3 h-3 text-secondary" />
              Contact Phone
            </span>
            <a
              href={`tel:${patient.phone}`}
              className="text-xs font-mono font-bold text-foreground truncate block hover:text-secondary transition-colors"
            >
              {patient.phone}
            </a>
          </div>

          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3 text-muted-foreground" />
              Registered On
            </span>
            <p className="text-xs font-bold text-foreground truncate">{formattedRegisteredDate}</p>
          </div>
        </div>

        {/* medical notes / remarks */}
        {patient.note && (
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <FileText className="w-3.5 h-3.5 text-secondary" />
              <span>Medical Notes / Remarks</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {patient.note}
            </p>
          </div>
        )}

        {/* attending specialist section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Stethoscope className="w-3.5 h-3.5 text-secondary" />
              <span>Attending Specialist</span>
            </div>
            {attendingDoctor && (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                Specialist Assigned
              </span>
            )}
          </div>

          {attendingDoctor ? (
            <div className="p-4 rounded-2xl bg-linear-to-br from-secondary/5 via-card to-primary/5 border border-secondary/20 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {attendingDoctor.avatar?.url ? (
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-secondary/25 shrink-0 shadow-xs">
                      <Image
                        src={attendingDoctor.avatar.url}
                        alt={attendingDoctor.name}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0 border border-secondary/20">
                      <Stethoscope className="w-5 h-5 text-secondary" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {attendingDoctor.name}
                    </p>
                    <p className="text-xs text-secondary font-medium truncate">
                      {attendingDoctor.specialization}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 truncate mt-0.5">
                      <Building2 className="w-3 h-3 shrink-0" />
                      {attendingDoctor.hospital}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-secondary/10 flex items-center justify-between text-[11px] text-muted-foreground">
                <a
                  href={`tel:${attendingDoctor.phone}`}
                  className="flex items-center gap-1 hover:text-secondary transition-colors font-mono"
                >
                  <Phone className="w-3 h-3 text-secondary" />
                  {attendingDoctor.phone}
                </a>
                {attendingDoctor.email && (
                  <a
                    href={`mailto:${attendingDoctor.email}`}
                    className="flex items-center gap-1 hover:text-secondary transition-colors truncate max-w-42.5"
                  >
                    <Mail className="w-3 h-3 text-primary" />
                    {attendingDoctor.email}
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-muted/20 border border-dashed border-border text-center space-y-2">
              <p className="text-xs text-muted-foreground">No attending specialist assigned yet</p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onEdit(patient)}
                leftIcon={<Sparkles className="w-3.5 h-3.5 text-secondary" />}
              >
                Assign Specialist
              </Button>
            </div>
          )}
        </div>

        {/* patient contact channels */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold text-foreground">Direct Contact Channels</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href={`tel:${patient.phone}`}
              className="p-3 rounded-2xl bg-card border border-border/70 hover:border-secondary/50 hover:bg-secondary/5 flex items-center gap-3 transition-colors group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Phone className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Phone</p>
                <p className="text-xs font-mono font-semibold text-foreground truncate">
                  {patient.phone}
                </p>
              </div>
            </a>

            {patient.email ? (
              <a
                href={`mailto:${patient.email}`}
                className="p-3 rounded-2xl bg-card border border-border/70 hover:border-secondary/50 hover:bg-secondary/5 flex items-center gap-3 transition-colors group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Email</p>
                  <p className="text-xs font-semibold text-foreground truncate">{patient.email}</p>
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
      </div>

      {/* action footer */}
      <div className="p-4 border-t border-border/70 flex items-center justify-end gap-2.5 bg-card/60 backdrop-blur-md shrink-0">
        {!patient.isReleased && onRelease && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onRelease(patient)}
            leftIcon={<UserCheck className="w-3.5 h-3.5" />}
          >
            Release Patient
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onEdit(patient)}
          leftIcon={<Edit2 className="w-3.5 h-3.5" />}
        >
          Edit Patient
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => onDelete(patient)}
          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
        >
          Delete Patient
        </Button>
      </div>
    </SideSheet>
  );
};
