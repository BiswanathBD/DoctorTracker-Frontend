'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Modal, Button, Input, toast } from '@/components/ui';
import { PatientService, type Patient } from '@/server/patient.service';
import type { Doctor } from '@/server/doctor.service';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import { Users, Search, UserPlus, Check, AlertCircle, Stethoscope, Building2 } from 'lucide-react';
import Image from 'next/image';

export interface AssignExistingPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
  onSuccess: () => void;
  onOpenAdmitModal?: () => void;
}

export const AssignExistingPatientModal: React.FC<AssignExistingPatientModalProps> = ({
  isOpen,
  onClose,
  doctor,
  onSuccess,
  onOpenAdmitModal,
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleClose = useCallback(() => {
    setSelectedPatientId(null);
    setSearchTerm('');
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    PatientService.getAllPatients({ unassigned: true, limit: 100 })
      .then((res) => {
        if (isMounted) {
          setPatients(res.data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Failed to load unassigned patients:', err);
          toast.error('Load Error', 'Could not fetch unassigned patients list.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const filteredPatients = useMemo(() => {
    if (!searchTerm.trim()) return patients;
    const term = searchTerm.toLowerCase();
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.condition.toLowerCase().includes(term) ||
        p.phone.toLowerCase().includes(term) ||
        (p.email && p.email.toLowerCase().includes(term))
    );
  }, [patients, searchTerm]);

  const doctorDisplayName = doctor
    ? doctor.name.startsWith('Dr.')
      ? doctor.name
      : `Dr. ${doctor.name}`
    : 'Specialist';

  const handleAssign = async () => {
    if (!selectedPatientId || !doctor?._id) return;
    const patientToAssign = patients.find((p) => p._id === selectedPatientId);

    try {
      setSubmitting(true);
      await PatientService.updatePatient(selectedPatientId, {
        doctorId: doctor._id,
        isReleased: false,
      });

      toast.success(
        'Patient Assigned',
        `${patientToAssign?.name || 'Patient'} is now assigned to ${doctorDisplayName}.`
      );
      onSuccess();
      handleClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to assign patient.';
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
      title="Assign Patient to Specialist"
      description={`Select an unassigned patient to assign under ${doctorDisplayName}`}
      icon={<Users className="w-5 h-5 stroke-[2.2] text-secondary" />}
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* scrollable modal body */}
        <div className="flex-1 overflow-y-auto no-scrollbar scrollbar-none p-5 sm:p-6 space-y-4">
          {/* target doctor indicator banner */}
          {doctor && (
            <div className="p-3 rounded-2xl bg-muted/40 border border-border/80 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-foreground truncate">{doctorDisplayName}</p>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 truncate">
                    <span>{doctor.specialization}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {doctor.hospital}
                    </span>
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary/15 text-secondary font-bold text-[10px] shrink-0">
                Active Specialist
              </span>
            </div>
          )}

          {/* search filter */}
          <div className="relative">
            <Input
              placeholder="Search unassigned patients by name, condition, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-muted-foreground" />}
              className="w-full text-xs"
            />
          </div>

          {/* patient list */}
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
            ) : filteredPatients.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-border/80 rounded-2xl bg-muted/20 p-5 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mx-auto">
                  {searchTerm ? <AlertCircle className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-foreground">
                    {searchTerm ? 'No matching patients found' : 'No unassigned patients waiting'}
                  </p>
                  <p className="text-[11px] text-muted-foreground max-w-xs mx-auto leading-relaxed">
                    {searchTerm
                      ? 'Try searching with a different term or clear the search input.'
                      : 'All patients in the directory are currently under specialist care. You can admit a new patient directly.'}
                  </p>
                </div>
                {onOpenAdmitModal && !searchTerm && (
                  <div className="pt-2 flex justify-center">
                    <Button
                      type="button"
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        handleClose();
                        onOpenAdmitModal();
                      }}
                      leftIcon={<UserPlus className="w-3.5 h-3.5" />}
                    >
                      Admit New Patient
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              filteredPatients.map((p, idx) => {
                const isSelected = selectedPatientId === p._id;
                return (
                  <MotionWrapper key={p._id} delay={idx * 0.03} animationType="fade">
                    <div
                      onClick={() => setSelectedPatientId(p._id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-xs select-none ${
                        isSelected
                          ? 'bg-secondary/10 border-secondary shadow-xs'
                          : 'bg-card border-border/70 hover:border-secondary/40 hover:bg-muted/30'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* avatar or initial */}
                        {p.avatar?.url ? (
                          <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-border shrink-0">
                            <Image src={p.avatar.url} alt={p.name} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-secondary/15 text-secondary border border-secondary/25 flex items-center justify-center font-bold text-xs shrink-0">
                            {p.name.charAt(0)}
                          </div>
                        )}

                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-foreground truncate">{p.name}</span>
                            <span className="text-[10px] text-muted-foreground">
                              ({p.age}y • {p.gender})
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <span className="font-semibold text-warning truncate">{p.condition}</span>
                            <span>•</span>
                            <span className="truncate">{p.phone}</span>
                          </div>
                        </div>
                      </div>

                      {/* selection indicator */}
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all shrink-0 ${
                          isSelected
                            ? 'bg-secondary border-secondary text-secondary-foreground shadow-xs'
                            : 'border-border text-transparent hover:border-secondary/60'
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

        {/* fixed footer with proper spacing & borders */}
        <div className="shrink-0 p-4 sm:p-5 px-5 sm:px-6 border-t border-border/80 bg-card/95 backdrop-blur-md flex items-center justify-between gap-2.5 z-10">
          {onOpenAdmitModal ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                handleClose();
                onOpenAdmitModal();
              }}
              leftIcon={<UserPlus className="w-3.5 h-3.5 text-primary" />}
            >
              Admit New Patient
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              capsule={false}
              onClick={handleAssign}
              disabled={!selectedPatientId || submitting}
              loading={submitting}
            >
              Assign Selected
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
