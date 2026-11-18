'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { DoctorService, type Doctor, type DoctorPatient } from '@/server/doctor.service';
import { Button, Badge, SideSheet, toast } from '@/components/ui';
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
  onAddPatient: () => void;
  onRemovePatient: (patientId: string, patientName: string) => void;
  onAvatarUpdated?: (doctor: Doctor) => void;
}

export const DoctorDetailCard: React.FC<DoctorDetailCardProps> = ({
  doctor,
  isOpen,
  onClose,
  onEdit,
  onAddPatient,
  onRemovePatient,
  onAvatarUpdated,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!doctor) return null;

  const assignedPatients: DoctorPatient[] = doctor.assignedPatients || doctor.patients || [];

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
      toast.success('Avatar Updated', `Avatar updated for Dr. ${doctor.name}.`);
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
        {/* hero doctor card */}
        <div className="relative rounded-3xl bg-gradient-to-br from-primary/10 via-card to-secondary/10 border border-border/80 p-5 space-y-4 shadow-sm overflow-hidden">
          {/* subtle decorative background circles */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/15 blur-2xl" />
          <div className="pointer-events-none absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-secondary/15 blur-2xl" />

          <div className="flex items-start gap-4 relative z-10">
            {/* avatar with update trigger */}
            <div className="relative group shrink-0">
              {doctor.avatar?.url ? (
                <div className="relative w-18 h-18 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-md">
                  <Image
                    src={doctor.avatar.url}
                    alt={doctor.name}
                    fill
                    sizes="72px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="w-18 h-18 rounded-2xl bg-primary/15 text-primary flex items-center justify-center font-black text-2xl uppercase border-2 border-primary/30 shadow-md">
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
              <div className="flex items-center gap-1.5">
                <Badge variant="primary" className="text-[10px] font-bold">
                  {doctor.specialization}
                </Badge>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </span>
              </div>

              <h3 className="font-black text-foreground text-lg tracking-tight truncate">
                {doctor.name}
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate font-medium">{doctor.hospital}</span>
              </div>
            </div>
          </div>
        </div>

        {/* metric cards grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-medium">Assigned Patients</span>
              <Users className="w-3.5 h-3.5 text-secondary" />
            </div>
            <p className="text-xl font-black text-foreground tracking-tight">
              {assignedPatients.length}
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

        {/* direct contact cards */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">Direct Contact Information</span>
          </div>

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

        {/* assigned patients roster */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-bold text-foreground">
                Patient Roster ({assignedPatients.length})
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={onAddPatient}
              leftIcon={<UserPlus className="w-3.5 h-3.5 text-primary" />}
              className="text-[11px] py-1 px-2.5 h-auto rounded-xl border-dashed cursor-pointer"
            >
              Assign Patient
            </Button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-0.5">
            {assignedPatients.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-border rounded-2xl bg-muted/20 p-4 space-y-2">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                  <Users className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-muted-foreground">No patients assigned yet</p>
                <p className="text-[11px] text-muted-foreground/70 max-w-xs mx-auto">
                  Assign a patient directly to Dr. {doctor.name} to start tracking consultations.
                </p>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={onAddPatient}
                  leftIcon={<UserPlus className="w-3.5 h-3.5" />}
                  className="mt-2 text-xs font-bold"
                >
                  Assign First Patient
                </Button>
              </div>
            ) : (
              assignedPatients.map((p) => {
                const patientId = typeof p === 'string' ? p : p._id;
                const patientName = typeof p === 'string' ? 'Patient record' : p.name;
                const patientCondition = typeof p === 'string' ? '' : p.condition;
                const patientPhone = typeof p === 'string' ? '' : p.phone;

                return (
                  <div
                    key={patientId}
                    className="p-3 rounded-2xl bg-card border border-border/80 hover:border-primary/40 flex items-center justify-between gap-3 transition-all shadow-xs group"
                  >
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

                    <button
                      type="button"
                      onClick={() => onRemovePatient(patientId, patientName)}
                      className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors shrink-0 cursor-pointer"
                      title={`Remove ${patientName}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* action footer */}
      <div className="p-4 border-t border-border/70 flex items-center gap-2.5 bg-card/60 backdrop-blur-md shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(doctor)}
          leftIcon={<Edit2 className="w-3.5 h-3.5" />}
          className="flex-1 text-xs font-bold cursor-pointer"
        >
          Edit Doctor
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={onAddPatient}
          leftIcon={<UserPlus className="w-3.5 h-3.5" />}
          className="flex-1 text-xs font-bold cursor-pointer"
        >
          Assign Patient
        </Button>
      </div>
    </SideSheet>
  );
};
