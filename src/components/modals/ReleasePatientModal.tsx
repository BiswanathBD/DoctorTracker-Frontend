'use client';

import React, { useState } from 'react';
import { Modal, Button, Badge, DatePicker } from '@/components/ui';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import type { Patient } from '@/types/patient.types';
import { UserCheck, Calendar, FileText, Stethoscope, HeartPulse, Building2, Phone } from 'lucide-react';

export interface ReleasePatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  onConfirmRelease: (patientId: string, releaseDate: string, remark: string) => Promise<void> | void;
  loading?: boolean;
}

interface ReleaseFormProps {
  patient: Patient;
  onConfirmRelease: (patientId: string, releaseDate: string, remark: string) => Promise<void> | void;
  onClose: () => void;
  loading: boolean;
}

const ReleaseForm: React.FC<ReleaseFormProps> = ({
  patient,
  onConfirmRelease,
  onClose,
  loading,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => new Date());
  const [remark, setRemark] = useState<string>(() => patient.note || '');

  const todayEnd = React.useMemo(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d;
  }, []);

  const attendingDoctor =
    patient.doctorId && typeof patient.doctorId === 'object'
      ? patient.doctorId
      : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient._id) return;
    const targetDate = selectedDate || new Date();
    if (targetDate > todayEnd) return;

    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    const releaseDateStr = `${year}-${month}-${day}`;

    onConfirmRelease(patient._id, releaseDateStr, remark);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
      {/* scrollable center content */}
      <div className="flex-1 overflow-y-auto no-scrollbar scrollbar-none p-6 space-y-4">
        {/* compact, perfectly balanced 2-column patient dossier */}
        <MotionWrapper animationType="scale" delay={0.05} duration={0.25}>
        <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* left column: patient profile */}
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-sm text-foreground tracking-tight truncate">
                {patient.name}
              </h4>
              <Badge variant="warning" className="text-[10px] font-semibold py-0.5 px-2 shrink-0">
                <HeartPulse className="w-2.5 h-2.5 mr-1" />
                {patient.condition}
              </Badge>
            </div>
            <div className="inline-flex text-[11px] text-muted-foreground space-y-0.5">
                <span>{patient.age} yrs • {patient.gender} •</span>
                <p className="text-foreground/80 flex items-center gap-1 ml-1">
                <Phone className="w-3 h-3 text-muted-foreground shrink-0" />
                <span className="whitespace-nowrap">{patient.phone}</span>
              </p>
            </div>
          </div>

          {/* right column: clinical care info */}
          <div className="space-y-1.5 min-w-0 sm:border-l sm:border-border/60 sm:pl-3.5">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground min-w-0">
              <Stethoscope className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">
                Attending:{' '}
                <strong className="text-foreground">
                  {attendingDoctor ? attendingDoctor.name : 'No doctor'}
                </strong>
              </span>
            </div>

            {attendingDoctor?.hospital && (
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground min-w-0">
                <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="truncate">{attendingDoctor.hospital}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground min-w-0">
              <Calendar className="w-3.5 h-3.5 text-secondary shrink-0" />
              <span>
                Admitted:{' '}
                <strong className="text-foreground font-medium">
                  {patient.admissionDate
                    ? new Date(patient.admissionDate).toLocaleDateString()
                    : 'N/A'}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </MotionWrapper>

      {/* balanced 2-column inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* discharge date with shadcn datepicker */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-secondary" />
            Discharge / Release Date <span className="text-destructive">*</span>
          </label>
          <DatePicker
            date={selectedDate}
            onSelect={setSelectedDate}
            disabled={{ after: todayEnd }}
            endMonth={todayEnd}
            placeholder="Select discharge date"
          />
          <p className="text-[10.5px] text-muted-foreground text-left">
            Official discharge timestamp (future dates disabled).
          </p>
        </div>

        {/* discharge remark */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-secondary" />
            Discharge Remark / Note
          </label>
          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="e.g. Treatment completed successfully, recommended rest for 7 days."
            rows={2}
            className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-hidden focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all resize-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* full-width alert banner sitting neatly below both columns */}
      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2.5">
        <UserCheck className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-xs text-amber-800 dark:text-amber-300">
            Caseload Impact Notice
          </p>
          <p className="text-[11px] leading-relaxed opacity-90">
            Releasing decrements active doctor load and updates hospital KPIs while keeping patient history intact.
          </p>
        </div>
      </div>
    </div>

    {/* fixed footer following Profile Drawer 1:1 */}
    <div className="shrink-0 p-5 px-6 border-t border-border/80 bg-card/95 backdrop-blur-md flex items-center justify-end gap-2.5 z-10">
      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={onClose}
        disabled={loading}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        variant="secondary"
        size="sm"
        disabled={loading || !selectedDate}
        leftIcon={<UserCheck className="w-3.5 h-3.5" />}
      >
        {loading ? 'Discharging...' : 'Confirm Release'}
      </Button>
    </div>
  </form>
  );
};

export const ReleasePatientModal: React.FC<ReleasePatientModalProps> = ({
  isOpen,
  onClose,
  patient,
  onConfirmRelease,
  loading = false,
}) => {
  if (!patient) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Release Patient from Care"
      description={`Discharge ${patient.name} and record clinical completion.`}
      icon={<UserCheck className="w-5 h-5 text-secondary" />}
      maxWidth="xl"
    >
      <ReleaseForm
        key={patient._id}
        patient={patient}
        onConfirmRelease={onConfirmRelease}
        onClose={onClose}
        loading={loading}
      />
    </Modal>
  );
};
