'use client';

import React from 'react';
import { type Patient } from '@/server/patient.service';
import { Button, Badge, SideSheet } from '@/components/ui';
import {
  HeartPulse,
  User,
  Stethoscope,
  Phone,
  Mail,
  Calendar,
  X,
  Edit2,
  Trash2,
  Building2,
  Activity
} from 'lucide-react';

interface PatientDetailCardProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

export const PatientDetailCard: React.FC<PatientDetailCardProps> = ({
  patient,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!patient) return null;

  const attendingDoctor =
    patient.doctorId && typeof patient.doctorId === 'object'
      ? patient.doctorId
      : null;

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
              aria-label="Close patient details"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* patient info */}
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center font-bold text-lg shrink-0">
            <User className="w-7 h-7" />
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
                <div>
                  <p className="text-xs font-black text-foreground">{attendingDoctor.name}</p>
                  <p className="text-[11px] text-primary font-semibold">
                    {attendingDoctor.specialization}
                  </p>
                </div>
                <Badge variant="success" className="text-[10px]">
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
          className="flex-1 rounded-2xl text-xs font-bold cursor-pointer"
        >
          Edit Record
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(patient)}
          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          className="flex-1 rounded-2xl text-xs font-bold text-destructive border-destructive/20 hover:bg-destructive hover:text-destructive-foreground cursor-pointer"
        >
          Delete Record
        </Button>
      </div>
    </SideSheet>
  );
};
