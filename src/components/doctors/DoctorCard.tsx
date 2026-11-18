'use client';

import React from 'react';
import Image from 'next/image';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import { Card, Badge, Button } from '@/components/ui';
import { type Doctor } from '@/server/doctor.service';
import {
  Stethoscope,
  Building2,
  Phone,
  Mail,
  Calendar,
  Users,
  Edit2,
  Trash2,
  ChevronRight,
} from 'lucide-react';

export interface DoctorCardProps {
  doctor: Doctor;
  index?: number;
  onViewDetails: (doctor: Doctor) => void;
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctor: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  index = 0,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  return (
    <MotionWrapper
      key={doctor._id}
      animationType="fadeUp"
      delay={0.04 * (index % 9)}
      duration={0.3}
    >
      <Card className="relative overflow-hidden group hover:shadow-xl hover:border-primary/40 transition-all duration-300 p-5 flex flex-col justify-between h-full space-y-4">
        {/* hover glow */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* header */}
        <div className="space-y-3 relative">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-12 h-12 rounded-2xl bg-primary/10 text-primary overflow-hidden flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20 shadow-xs group-hover:scale-105 transition-transform duration-300">
                {doctor.avatar?.url ? (
                  <Image
                    src={doctor.avatar.url}
                    alt={doctor.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <Stethoscope className="w-6 h-6" />
                )}
              </div>

              <div className="min-w-0">
                <h3
                  onClick={() => onViewDetails(doctor)}
                  className="font-bold text-foreground group-hover:text-primary transition-colors text-sm truncate cursor-pointer"
                  title={doctor.name}
                >
                  {doctor.name}
                </h3>
                <Badge variant="primary" className="mt-1 text-[10px] font-semibold">
                  {doctor.specialization}
                </Badge>
              </div>
            </div>

            {/* actions */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => onEdit(doctor)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                title="Edit Doctor"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(doctor)}
                className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                title="Delete Doctor"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* hospital */}
          <div className="flex items-center gap-2 text-xs font-medium text-foreground bg-muted/40 px-3 py-2 rounded-xl border border-border/50">
            <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate">{doctor.hospital}</span>
          </div>

          {/* contact info */}
          <div className="space-y-1.5 pt-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-secondary shrink-0" />
              <span className="truncate font-medium">{doctor.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">{doctor.email}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground/70 pt-0.5">
              <Calendar className="w-3 h-3 shrink-0" />
              <span>Added {new Date(doctor.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="pt-3 border-t border-border flex items-center justify-between gap-2 relative">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onViewDetails(doctor)}
            title="View assigned patients"
          >
            <Users className="w-3.5 h-3.5" />
            <span>{doctor.patientCount || 0} Patients</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => onViewDetails(doctor)}
          >
            Details
            <ChevronRight className="w-3 h-3" />
          </Button>
        </div>
      </Card>
    </MotionWrapper>
  );
};
