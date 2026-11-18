'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { PatientService, type Patient } from '@/server/patient.service';
import { Button, Badge, SideSheet, toast } from '@/components/ui';
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
  Activity,
  Camera,
  Users,
  Clock,
  Sparkles,
} from 'lucide-react';

interface PatientDetailCardProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
  onAvatarUpdated?: (patient: Patient) => void;
}

export const PatientDetailCard: React.FC<PatientDetailCardProps> = ({
  patient,
  isOpen,
  onClose,
  onEdit,
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

  const formattedAdmissionDate = patient.admissionDate
    ? new Date(patient.admissionDate).toLocaleDateString('en-US', {
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
            <h2 className="text-xs font-black uppercase tracking-wider text-foreground">
              Patient Dossier
            </h2>
            <p className="text-[11px] text-muted-foreground">Comprehensive clinical and admission record</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center shadow-xs transition-all cursor-pointer"
          title="Close details"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* scrollable body */}
      <div className="flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-5 space-y-5">
        {/* hero patient card */}
        <div className="relative rounded-3xl bg-gradient-to-br from-secondary/10 via-card to-primary/10 border border-border/80 p-5 space-y-4 shadow-sm overflow-hidden">
          {/* subtle decorative background circles */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-secondary/15 blur-2xl" />
          <div className="pointer-events-none absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-primary/15 blur-2xl" />

          <div className="flex items-start gap-4 relative z-10">
            {/* avatar with update trigger */}
            <div className="relative group shrink-0">
              {patient.avatar?.url ? (
                <div className="relative w-18 h-18 rounded-2xl overflow-hidden border-2 border-secondary/30 shadow-md">
                  <Image
                    src={patient.avatar.url}
                    alt={patient.name}
                    fill
                    sizes="72px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="w-18 h-18 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center font-black text-2xl uppercase border-2 border-secondary/30 shadow-md">
                  {patient.name?.charAt(0) || 'P'}
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
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                  #PAT-{patient._id.slice(-6).toUpperCase()}
                </span>
                <Badge variant="warning" className="text-[10px] font-bold">
                  <HeartPulse className="w-3 h-3 mr-1" />
                  {patient.condition}
                </Badge>
              </div>

              <h3 className="text-lg font-black text-foreground tracking-tight truncate">
                {patient.name}
              </h3>

              <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                <span className="font-semibold text-foreground">{patient.age} years old</span>
                <span>•</span>
                <Badge variant="outline" className="text-[10px] px-2 py-0">
                  {patient.gender}
                </Badge>
                <span>•</span>
                <span className="text-secondary font-medium">Under Clinical Care</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-column clinical & admission metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <HeartPulse className="w-3 h-3 text-secondary" />
              Diagnosis
            </span>
            <p className="text-xs font-bold text-foreground truncate">{patient.condition}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3 text-primary" />
              Admitted
            </span>
            <p className="text-xs font-bold text-foreground truncate">{formattedAdmissionDate}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Activity className="w-3 h-3 text-success" />
              Care Status
            </span>
            <p className="text-xs font-bold text-success flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse inline-block" />
              Active Monitoring
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3 text-muted-foreground" />
              Registered
            </span>
            <p className="text-xs font-semibold text-foreground truncate">
              {new Date(patient.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* attending specialist section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Stethoscope className="w-3.5 h-3.5 text-primary" />
              <span>Attending Specialist</span>
            </div>
            {attendingDoctor && (
              <Badge variant="primary" className="text-[10px] font-semibold">
                Specialist Assigned
              </Badge>
            )}
          </div>

          {attendingDoctor ? (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/5 via-card to-secondary/5 border border-primary/20 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {attendingDoctor.avatar?.url ? (
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-primary/25 shrink-0 shadow-xs">
                      <Image
                        src={attendingDoctor.avatar.url}
                        alt={attendingDoctor.name}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
                      {attendingDoctor.name ? attendingDoctor.name.replace(/^dr\.?\s+/i, '').charAt(0) : 'D'}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-black text-foreground truncate">{attendingDoctor.name}</p>
                    <p className="text-[11px] text-primary font-semibold truncate">
                      {attendingDoctor.specialization}
                    </p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1 truncate mt-0.5">
                      <Building2 className="w-3 h-3 shrink-0" />
                      {attendingDoctor.hospital}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-primary/10 flex items-center justify-between text-[11px] text-muted-foreground">
                <a
                  href={`tel:${attendingDoctor.phone}`}
                  className="flex items-center gap-1 hover:text-primary transition-colors font-mono"
                >
                  <Phone className="w-3 h-3 text-secondary" />
                  {attendingDoctor.phone}
                </a>
                {attendingDoctor.email && (
                  <a
                    href={`mailto:${attendingDoctor.email}`}
                    className="flex items-center gap-1 hover:text-primary transition-colors truncate max-w-[170px]"
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
                size="sm"
                variant="outline"
                onClick={() => onEdit(patient)}
                leftIcon={<Sparkles className="w-3.5 h-3.5 text-primary" />}
                className="rounded-full text-xs font-bold cursor-pointer"
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
                <p className="text-xs font-mono font-semibold text-foreground truncate">{patient.phone}</p>
              </div>
            </a>

            {patient.email ? (
              <a
                href={`mailto:${patient.email}`}
                className="p-3 rounded-2xl bg-card border border-border/70 hover:border-primary/50 hover:bg-primary/5 flex items-center gap-3 transition-colors group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
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
      <div className="p-5 border-t border-border/70 flex items-center gap-3 bg-card/60 backdrop-blur-md shrink-0">
        <Button
          variant="outline"
          size="md"
          onClick={() => onEdit(patient)}
          leftIcon={<Edit2 className="w-3.5 h-3.5" />}
          className="flex-1 rounded-full text-xs font-bold cursor-pointer"
        >
          Edit Record
        </Button>
        <Button
          variant="destructive"
          size="md"
          onClick={() => onDelete(patient)}
          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          className="flex-1 rounded-full text-xs font-bold cursor-pointer"
        >
          Delete Record
        </Button>
      </div>
    </SideSheet>
  );
};
