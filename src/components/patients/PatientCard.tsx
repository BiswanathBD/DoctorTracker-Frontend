'use client';

import React from 'react';
import Image from 'next/image';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import { Card, Badge, Button } from '@/components/ui';
import type { Patient } from '@/server/patient.service';
import {
  HeartPulse,
  Stethoscope,
  Phone,
  Mail,
  Calendar,
  Edit2,
  Trash2,
  ChevronRight,
} from 'lucide-react';

export interface PatientCardProps {
  patient: Patient;
  index?: number;
  onViewDetails: (patient: Patient) => void;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  index = 0,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const docObj =
    typeof patient.doctorId === 'object' && patient.doctorId !== null
      ? patient.doctorId
      : null;

  return (
    <MotionWrapper
      key={patient._id}
      animationType="fadeUp"
      delay={0.04 * (index % 9)}
      duration={0.3}
    >
      <Card className="relative overflow-hidden group hover:shadow-xl hover:border-secondary/40 transition-all duration-300 p-5 flex flex-col justify-between h-full space-y-4">
        {/* ambient hover glow */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-secondary/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* top section: avatar, name, condition, demographics, actions */}
        <div className="space-y-3 relative z-10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {/* patient avatar */}
              <div className="relative w-12 h-12 rounded-2xl bg-secondary/10 text-secondary overflow-hidden flex items-center justify-center font-bold text-sm shrink-0 border border-secondary/20 shadow-xs group-hover:scale-105 transition-transform duration-300">
                {patient.avatar?.url ? (
                  <Image
                    src={patient.avatar.url}
                    alt={patient.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <span className="text-base font-black uppercase">
                    {patient.name?.charAt(0) || 'P'}
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <h3
                  onClick={() => onViewDetails(patient)}
                  className="font-bold text-foreground group-hover:text-secondary transition-colors text-sm truncate cursor-pointer"
                  title={patient.name}
                >
                  {patient.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <Badge variant="warning" className="text-[10px] font-semibold">
                    <HeartPulse className="w-2.5 h-2.5 mr-1" />
                    {patient.condition}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground font-medium">
                    {patient.age} yrs • {patient.gender}
                  </span>
                </div>
              </div>
            </div>

            {/* card top actions */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => onEdit(patient)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                title="Edit Patient"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(patient)}
                className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                title="Delete Patient"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* attending specialist banner */}
          <div className="p-3 rounded-2xl bg-muted/40 border border-border/70 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground font-semibold flex items-center gap-1">
                <Stethoscope className="w-3 h-3 text-secondary" />
                Attending Doctor
              </span>
              {docObj && (
                <span className="text-[10px] font-mono text-muted-foreground truncate max-w-30">
                  {docObj.hospital}
                </span>
              )}
            </div>

            {docObj ? (
              <div className="flex items-center gap-2">
                {docObj.avatar?.url ? (
                  <div className="relative w-6 h-6 rounded-lg overflow-hidden border border-secondary/20 shrink-0">
                    <Image
                      src={docObj.avatar.url}
                      alt={docObj.name}
                      fill
                      sizes="24px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center font-bold text-[10px] shrink-0">
                    {docObj.name ? docObj.name.replace(/^dr\.?\s+/i, '').charAt(0) : 'D'}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-foreground truncate">
                    {docObj.name}
                  </p>
                  <p className="text-[10px] text-secondary font-medium truncate">
                    {docObj.specialization}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No doctor assigned yet
              </p>
            )}
          </div>

          {/* quick contact channels */}
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-secondary shrink-0" />
              <a
                href={`tel:${patient.phone}`}
                className="hover:text-secondary transition-colors font-mono truncate"
              >
                {patient.phone}
              </a>
            </div>
            {patient.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                <a
                  href={`mailto:${patient.email}`}
                  className="hover:text-primary transition-colors truncate"
                >
                  {patient.email}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* bottom footer */}
        <div className="pt-3 border-t border-border flex items-center justify-between gap-2 relative z-10">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 text-secondary shrink-0" />
            <span>Admitted {new Date(patient.admissionDate).toLocaleDateString()}</span>
          </div>

          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => onViewDetails(patient)}
            rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
          >
            Details
          </Button>
        </div>
      </Card>
    </MotionWrapper>
  );
};
