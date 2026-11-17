'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Doctor, type DoctorPatient } from '@/server/doctor.service';
import { Button, Badge } from '@/components/ui';
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

  const cardContent = (
    <div className="w-88 sm:w-96 h-[calc(100vh-7rem)] rounded-3xl bg-card/80 backdrop-blur-xl border border-border/80 p-6 flex flex-col justify-between shadow-2xl shadow-black/10 dark:shadow-primary/5 shrink-0 transition-colors">
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
              title="Close doctor details"
              aria-label="Close doctor details"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* doctor info */}
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
            <Stethoscope className="w-7 h-7" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-extrabold text-foreground text-base tracking-tight truncate">
              {doctor.name}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 truncate mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-muted-foreground/80 flex-shrink-0" />
              <span>{doctor.hospital}</span>
            </p>
          </div>
        </div>

        {/* contact details */}
        <div className="p-3 rounded-2xl bg-muted/40 backdrop-blur-md border border-border/70 space-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
            <span className="truncate">{doctor.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span className="truncate">{doctor.email}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground/70 flex-shrink-0" />
            <span>Registered {new Date(doctor.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* assigned patients header & list */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Users className="w-3.5 h-3.5 text-secondary" />
              <span>Assigned Patients ({assignedPatients.length})</span>
            </div>
            <button
              type="button"
              onClick={onAddPatient}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Patient</span>
            </button>
          </div>

          {/* scrollable patients list */}
          <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
            {assignedPatients.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground rounded-2xl bg-muted/20 border border-dashed border-border/70">
                No patients assigned under this doctor yet.
              </div>
            ) : (
              assignedPatients.map((patient) => (
                <div
                  key={patient._id}
                  className="p-2.5 rounded-2xl bg-muted/40 border border-border/70 flex items-center justify-between gap-2 hover:border-secondary/40 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-foreground text-xs truncate">
                      {patient.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {patient.age} yrs &bull; {patient.gender}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="warning" className="text-[10px] py-0 px-2">
                      {patient.condition}
                    </Badge>
                    <button
                      type="button"
                      onClick={() => onRemovePatient(patient._id, patient.name)}
                      className="p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                      title="Remove patient from doctor"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* bottom actions */}
      <div className="pt-4 border-t border-border/70 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(doctor)}
          leftIcon={<Edit2 className="w-3.5 h-3.5" />}
          className="flex-1 rounded-2xl text-xs font-bold"
        >
          Edit Doctor
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onAddPatient}
          leftIcon={<UserPlus className="w-3.5 h-3.5" />}
          className="flex-1 rounded-2xl text-xs font-bold"
        >
          Assign Patient
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* desktop drawer */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.aside
            key="desktop-doctor-detail-card"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 384, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 280,
              damping: 30,
              mass: 0.8,
            }}
            className="hidden xl:block shrink-0 sticky top-22 z-20"
          >
            {cardContent}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="xl:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-foreground/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 32,
              }}
              className="fixed top-0 bottom-0 right-0 z-50 p-4 max-w-sm w-full flex items-center justify-end"
            >
              <div className="w-full h-full max-h-[96vh] my-auto">
                {cardContent}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
