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
  Camera
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

  return (
    <SideSheet isOpen={isOpen} onClose={onClose} width="lg">
      <div className="space-y-4">
        {/* header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/70">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-secondary" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Patient Record
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="warning" className="font-semibold text-[10px]">
              {patient.condition}
            </Badge>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/70 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* patient info & avatar */}
        <div className="flex items-center gap-3.5">
          <div className="relative group shrink-0">
            {patient.avatar?.url ? (
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-secondary/25 shadow-md">
                <Image
                  src={patient.avatar.url}
                  alt={patient.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center font-black text-xl uppercase border border-secondary/20 shadow-xs">
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
            >
              <Camera className="w-4 h-4 mb-0.5" />
              <span className="text-[9px] font-bold">
                {isUploading ? '...' : 'Photo'}
              </span>
            </button>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-extrabold text-foreground text-base tracking-tight truncate">
              {patient.name}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-2 truncate mt-0.5">
              <span>{patient.age} years old</span>
              <span>&bull;</span>
              <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                {patient.gender}
              </Badge>
            </p>
          </div>
        </div>

        {/* contacts */}
        <div className="p-3.5 rounded-2xl bg-muted/40 backdrop-blur-md border border-border/70 space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-secondary shrink-0" />
            <span className="truncate">{patient.phone}</span>
          </div>
          {patient.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">{patient.email}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span>
              Admitted:{' '}
              {patient.admissionDate
                ? new Date(patient.admissionDate).toLocaleDateString()
                : 'N/A'}
            </span>
          </div>
        </div>

        {/* attending physician */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <Stethoscope className="w-3.5 h-3.5 text-primary" />
            <span>Attending Specialist</span>
          </div>

          {attendingDoctor ? (
            <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  {attendingDoctor.avatar?.url ? (
                    <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-primary/20 shrink-0">
                      <Image
                        src={attendingDoctor.avatar.url}
                        alt={attendingDoctor.name}
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                      {attendingDoctor.name ? attendingDoctor.name.replace(/^dr\.?\s+/i, '').charAt(0) : 'D'}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-black text-foreground truncate">{attendingDoctor.name}</p>
                    <p className="text-[11px] text-primary font-semibold truncate">
                      {attendingDoctor.specialization}
                    </p>
                  </div>
                </div>
                <Badge variant="success" className="text-[10px] shrink-0">
                  Assigned
                </Badge>
              </div>

              <div className="pt-2 border-t border-primary/10 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1 truncate">
                  <Building2 className="w-3 h-3 text-muted-foreground" />
                  {attendingDoctor.hospital}
                </span>
                <span className="font-mono">{attendingDoctor.phone}</span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-muted/30 border border-dashed border-border text-center">
              <p className="text-xs text-muted-foreground">No doctor assigned yet</p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(patient)}
                className="mt-1 text-xs text-primary font-bold cursor-pointer"
              >
                Assign a Doctor
              </Button>
            </div>
          )}
        </div>

        {/* status indicators */}
        <div className="p-3 rounded-2xl bg-muted/20 border border-border/60 flex items-center justify-between text-xs">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-success" />
            Clinical Monitoring
          </span>
          <span className="font-bold text-success text-[11px]">Under Care</span>
        </div>
      </div>

      {/* action footer */}
      <div className="pt-4 border-t border-border/70 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(patient)}
          leftIcon={<Edit2 className="w-3.5 h-3.5" />}
          className="flex-1 text-xs font-bold cursor-pointer"
        >
          Edit Record
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(patient)}
          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          className="flex-1 text-xs font-bold cursor-pointer"
        >
          Delete Record
        </Button>
      </div>
    </SideSheet>
  );
};
