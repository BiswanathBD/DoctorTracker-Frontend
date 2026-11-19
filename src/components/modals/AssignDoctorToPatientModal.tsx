'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Modal, Button, Input, toast } from '@/components/ui';
import { DoctorService, type Doctor } from '@/server/doctor.service';
import { PatientService, type Patient } from '@/server/patient.service';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import { Stethoscope, Search, Check, AlertCircle, Building2, User, Users } from 'lucide-react';
import Image from 'next/image';

export interface AssignDoctorToPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  onSuccess: (updatedPatient: Patient) => void;
}

export const AssignDoctorToPatientModal: React.FC<AssignDoctorToPatientModalProps> = ({
  isOpen,
  onClose,
  patient,
  onSuccess,
}) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleClose = useCallback(() => {
    setSelectedDoctorId(null);
    setSearchTerm('');
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    DoctorService.getAllDoctors({ limit: 100 })
      .then((res) => {
        if (isMounted) {
          setDoctors(res.data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Failed to load doctors list:', err);
          toast.error('Load Error', 'Could not fetch doctors list.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const filteredDoctors = useMemo(() => {
    if (!searchTerm.trim()) return doctors;
    const term = searchTerm.toLowerCase();
    return doctors.filter(
      (doc) =>
        doc.name.toLowerCase().includes(term) ||
        doc.specialization.toLowerCase().includes(term) ||
        doc.hospital.toLowerCase().includes(term)
    );
  }, [doctors, searchTerm]);

  const handleAssign = async () => {
    if (!selectedDoctorId || !patient?._id) return;
    const chosenDoctor = doctors.find((d) => d._id === selectedDoctorId);

    try {
      setSubmitting(true);
      const updated = await PatientService.updatePatient(patient._id, {
        doctorId: selectedDoctorId,
        isReleased: false,
      });

      const docName = chosenDoctor?.name.startsWith('Dr.')
        ? chosenDoctor.name
        : `Dr. ${chosenDoctor?.name || 'Specialist'}`;

      toast.success(
        'Specialist Assigned',
        `${docName} has been assigned as attending doctor for ${patient.name}.`
      );
      onSuccess(updated);
      handleClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to assign specialist.';
      toast.error('Assignment Failed', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="md"
      title="Assign Attending Specialist"
      description={`Select a doctor to oversee clinical care for ${patient?.name || 'Patient'}`}
      icon={<Stethoscope className="w-5 h-5 text-primary" />}
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* scrollable modal body */}
        <div className="flex-1 overflow-y-auto no-scrollbar scrollbar-none p-5 sm:p-6 space-y-4">
          {/* target patient banner */}
          {patient && (
            <div className="p-3 rounded-2xl bg-muted/40 border border-border/80 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-foreground truncate">{patient.name}</p>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 truncate">
                    <span className="font-semibold text-warning">{patient.condition}</span>
                    <span>•</span>
                    <span>{patient.age} years ({patient.gender})</span>
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-warning/15 text-warning font-bold text-[10px] shrink-0">
                Needs Doctor
              </span>
            </div>
          )}

          {/* search filter */}
          <div className="relative">
            <Input
              placeholder="Search specialists by name, specialty, or hospital..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-muted-foreground" />}
              className="w-full text-xs"
            />
          </div>

          {/* doctors list */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-none">
            {loading ? (
              <div className="space-y-2 py-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-muted/30 border border-border/60 animate-pulse flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-muted" />
                      <div className="space-y-1.5">
                        <div className="w-28 h-3.5 bg-muted rounded-md" />
                        <div className="w-20 h-2.5 bg-muted rounded-md" />
                      </div>
                    </div>
                    <div className="w-16 h-6 bg-muted rounded-full" />
                  </div>
                ))}
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-border/80 rounded-2xl bg-muted/20 p-5 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-foreground">
                    {searchTerm ? 'No matching doctors found' : 'No doctors available'}
                  </p>
                  <p className="text-[11px] text-muted-foreground max-w-xs mx-auto leading-relaxed">
                    {searchTerm
                      ? 'Try searching with a different name or specialty.'
                      : 'Please add a doctor first in the Doctor Directory.'}
                  </p>
                </div>
              </div>
            ) : (
              filteredDoctors.map((doc, idx) => {
                const isSelected = selectedDoctorId === doc._id;
                const displayName = doc.name.startsWith('Dr.') ? doc.name : `Dr. ${doc.name}`;

                return (
                  <MotionWrapper key={doc._id} delay={idx * 0.03} animationType="fade">
                    <div
                      onClick={() => setSelectedDoctorId(doc._id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-xs select-none ${
                        isSelected
                          ? 'bg-primary/10 border-primary shadow-xs'
                          : 'bg-card border-border/70 hover:border-primary/40 hover:bg-muted/30'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* doctor avatar or stethoscope */}
                        {doc.avatar?.url ? (
                          <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-border shrink-0">
                            <Image src={doc.avatar.url} alt={doc.name} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                            <Stethoscope className="w-4.5 h-4.5" />
                          </div>
                        )}

                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-foreground truncate">{displayName}</span>
                            <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-primary/15 text-primary">
                              {doc.specialization}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1 truncate">
                              <Building2 className="w-3 h-3 shrink-0" />
                              {doc.hospital}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-secondary font-medium">
                              <Users className="w-3 h-3 shrink-0" />
                              {doc.patientCount || 0} Patients
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* selection indicator */}
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all shrink-0 ${
                          isSelected
                            ? 'bg-primary border-primary text-primary-foreground shadow-xs'
                            : 'border-border text-transparent hover:border-primary/60'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    </div>
                  </MotionWrapper>
                );
              })
            )}
          </div>
        </div>

        {/* fixed footer with NO cancel button */}
        <div className="shrink-0 p-4 sm:p-5 px-5 sm:px-6 border-t border-border/80 bg-card/95 backdrop-blur-md flex items-center justify-end gap-2.5 z-10">
          <Button
            type="button"
            variant="primary"
            size="sm"
            capsule={false}
            onClick={handleAssign}
            disabled={!selectedDoctorId || submitting}
            loading={submitting}
            leftIcon={<Stethoscope className="w-3.5 h-3.5" />}
          >
            Assign Specialist
          </Button>
        </div>
      </div>
    </Modal>
  );
};
