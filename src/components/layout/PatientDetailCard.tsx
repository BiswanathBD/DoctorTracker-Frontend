'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Patient } from '@/server/patient.service';
import { Button, Badge } from '@/components/ui';
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

  const cardContent = (
    <div className="w-88 sm:w-96 h-[calc(100vh-7rem)] rounded-3xl bg-card/80 backdrop-blur-xl border border-border/80 p-6 flex flex-col justify-between shadow-2xl shadow-black/10 dark:shadow-primary/5 shrink-0 transition-colors">
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
              title="Close patient details"
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
          <div className="flex items-center gap-2 text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />
            <span>Admitted on {new Date(patient.admissionDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* attending doctor */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Attending Specialist
          </p>

          {attendingDoctor ? (
            <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-primary/10 text-primary">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground truncate">
                      {attendingDoctor.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {attendingDoctor.specialization}
                    </p>
                  </div>
                </div>
                <Badge variant="primary" className="text-[10px]">
                  Assigned
                </Badge>
              </div>

              {attendingDoctor.hospital && (
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1 border-t border-primary/10">
                  <Building2 className="w-3 h-3 shrink-0" />
                  <span className="truncate">{attendingDoctor.hospital}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-muted/30 border border-dashed border-border/70 text-xs text-muted-foreground text-center">
              No doctor currently assigned.
            </div>
          )}
        </div>

        {/* diagnosis */}
        <div className="p-3 rounded-2xl bg-warning/10 border border-warning/20 flex items-center gap-2.5 text-warning">
          <Activity className="w-4 h-4 shrink-0" />
          <div className="text-xs">
            <span className="font-bold">Active Diagnosis:</span> {patient.condition}
          </div>
        </div>
      </div>

      {/* actions */}
      <div className="pt-4 border-t border-border/70 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(patient)}
          leftIcon={<Edit2 className="w-3.5 h-3.5" />}
          className="flex-1 rounded-2xl text-xs font-bold"
        >
          Edit Patient
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(patient)}
          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          className="flex-1 rounded-2xl text-xs font-bold text-destructive border-destructive/20 hover:bg-destructive hover:text-destructive-foreground"
        >
          Delete Record
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
            key="desktop-patient-detail-card"
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
