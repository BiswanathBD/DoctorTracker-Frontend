'use client';

import React from 'react';
import { type Doctor, type DoctorPatient } from '@/server/doctor.service';
import { Button, Badge, SideSheet } from '@/components/ui';
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
  Edit2
} from 'lucide-react';

interface DoctorDetailCardProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (doctor: Doctor) => void;
  onAddPatient: () => void;
  onRemovePatient: (patientId: string, patientName: string) => void;
}

export const DoctorDetailCard: React.FC<DoctorDetailCardProps> = ({
  doctor,
  isOpen,
  onClose,
  onEdit,
  onAddPatient,
  onRemovePatient,
}) => {
  if (!doctor) return null;

  const assignedPatients: DoctorPatient[] = doctor.assignedPatients || doctor.patients || [];

  return (
    <SideSheet isOpen={isOpen} onClose={onClose} width="lg">
      <div className="space-y-4">
        {/* header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/70">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Doctor Details
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="primary" className="font-semibold text-[10px]">
              {doctor.specialization}
            </Badge>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/70 cursor-pointer transition-colors"
              aria-label="Close doctor details"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* doctor basic info */}
        <div className="space-y-1">
          <h3 className="font-extrabold text-foreground text-lg tracking-tight">
            {doctor.name}
          </h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>{doctor.hospital}</span>
          </p>
        </div>

        {/* contacts */}
        <div className="p-3.5 rounded-2xl bg-muted/40 backdrop-blur-md border border-border/70 space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate">{doctor.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-secondary shrink-0" />
            <span className="truncate">{doctor.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span>
              Registered:{' '}
              {doctor.createdAt
                ? new Date(doctor.createdAt).toLocaleDateString()
                : 'Recent'}
            </span>
          </div>
        </div>

        {/* assigned patients list */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-bold text-foreground">
                Assigned Patients ({assignedPatients.length})
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={onAddPatient}
              leftIcon={<UserPlus className="w-3.5 h-3.5 text-primary" />}
              className="text-[11px] py-1 px-2.5 h-auto rounded-xl border-dashed cursor-pointer"
            >
              Assign
            </Button>
          </div>

          <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
            {assignedPatients.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-border rounded-2xl bg-muted/20">
                <p className="text-xs text-muted-foreground">No patients currently assigned</p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onAddPatient}
                  className="mt-1 text-xs text-primary font-bold cursor-pointer"
                >
                  + Add first patient
                </Button>
              </div>
            ) : (
              assignedPatients.map((p) => {
                const patientId = typeof p === 'string' ? p : p._id;
                const patientName = typeof p === 'string' ? 'Patient record' : p.name;
                const patientCondition = typeof p === 'string' ? '' : p.condition;

                return (
                  <div
                    key={patientId}
                    className="p-2.5 rounded-xl bg-card border border-border/80 hover:border-primary/40 flex items-center justify-between gap-2 transition-all shadow-xs"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{patientName}</p>
                      {patientCondition && (
                        <p className="text-[10px] text-muted-foreground truncate">
                          {patientCondition}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemovePatient(patientId, patientName)}
                      className="p-1 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors shrink-0 cursor-pointer"
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
      <div className="pt-4 border-t border-border/70 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(doctor)}
          leftIcon={<Edit2 className="w-3.5 h-3.5" />}
          className="flex-1 rounded-2xl text-xs font-bold cursor-pointer"
        >
          Edit Profile
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={onAddPatient}
          leftIcon={<UserPlus className="w-3.5 h-3.5" />}
          className="flex-1 rounded-2xl text-xs font-bold shadow-md shadow-primary/20 cursor-pointer"
        >
          Add Patient
        </Button>
      </div>
    </SideSheet>
  );
};
