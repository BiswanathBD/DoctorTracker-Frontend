'use client';

import React from 'react';
import { Modal, Button } from '@/components/ui';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import type { Patient } from '@/types/patient.types';
import { Trash2, AlertCircle } from 'lucide-react';

export interface PatientDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  onConfirm: () => void;
  loading?: boolean;
}

export const PatientDeleteModal: React.FC<PatientDeleteModalProps> = ({
  isOpen,
  onClose,
  patient,
  onConfirm,
  loading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Patient Record"
      description="Are you sure you want to remove this patient record?"
      icon={<Trash2 className="w-5 h-5 text-destructive" />}
      maxWidth="sm"
    >
      <div className="space-y-4">
        <MotionWrapper animationType="scale" delay={0.1} duration={0.25}>
          <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-start gap-3 text-xs text-destructive">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Deleting <strong>{patient?.name}</strong> will remove their admission history and disconnect them from Dr.{' '}
              {typeof patient?.doctorId === 'object' && patient?.doctorId !== null
                ? patient.doctorId.name
                : 'Assigned'}
              . This action cannot be reversed.
            </p>
          </div>
        </MotionWrapper>

        <MotionWrapper animationType="fadeUp" delay={0.15} duration={0.25}>
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={loading}
              className="rounded-full px-4 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              loading={loading}
              onClick={onConfirm}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              className="rounded-full px-5 cursor-pointer"
            >
              Delete Record
            </Button>
          </div>
        </MotionWrapper>
      </div>
    </Modal>
  );
};
