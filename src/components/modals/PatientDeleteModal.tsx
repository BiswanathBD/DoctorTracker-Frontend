'use client';

import React from 'react';
import { Modal, Button } from '@/components/ui';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import type { Patient } from '@/types/patient.types';
import { Trash2, AlertCircle } from 'lucide-react';

export interface PatientDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | { name: string; _id?: string; doctorId?: unknown } | null;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  warningText?: React.ReactNode;
}

export const PatientDeleteModal: React.FC<PatientDeleteModalProps> = ({
  isOpen,
  onClose,
  patient,
  onConfirm,
  loading = false,
  title = 'Delete Patient Record',
  description = 'Are you sure you want to remove this patient record?',
  confirmLabel = 'Delete Record',
  warningText,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      icon={<Trash2 className="w-5 h-5 text-destructive" />}
      maxWidth="sm"
    >
      <div className="space-y-4">
        <MotionWrapper animationType="scale" delay={0.1} duration={0.25}>
          <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-start gap-3 text-xs text-destructive">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              {warningText || (
                <p>
                  Deleting <strong>{patient?.name}</strong> will remove their admission history and disconnect them from Dr.{' '}
                  {typeof patient?.doctorId === 'object' && patient?.doctorId !== null
                    ? (patient.doctorId as { name: string }).name
                    : 'Assigned'}
                  . This action cannot be reversed.
                </p>
              )}
            </div>
          </div>
        </MotionWrapper>

        <MotionWrapper animationType="fadeUp" delay={0.15} duration={0.25}>
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              loading={loading}
              onClick={onConfirm}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              {confirmLabel}
            </Button>
          </div>
        </MotionWrapper>
      </div>
    </Modal>
  );
};
