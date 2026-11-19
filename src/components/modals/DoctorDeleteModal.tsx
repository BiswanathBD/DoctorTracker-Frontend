'use client';

import React from 'react';
import { Modal, Button } from '@/components/ui';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import { type Doctor } from '@/types/doctor.types';
import { AlertCircle, Trash2 } from 'lucide-react';

export interface DoctorDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
  onConfirm: () => void;
  loading?: boolean;
}

export const DoctorDeleteModal: React.FC<DoctorDeleteModalProps> = ({
  isOpen,
  onClose,
  doctor,
  onConfirm,
  loading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Doctor Deletion"
      description="Are you sure you want to remove this doctor from the portal?"
      icon={<Trash2 className="w-5 h-5 text-destructive" />}
      maxWidth="sm"
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* scrollable center content */}
        <div className="flex-1 overflow-y-auto no-scrollbar scrollbar-none p-6 space-y-4">
          <MotionWrapper animationType="scale" delay={0.1} duration={0.25}>
            <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-start gap-3 text-xs text-destructive">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Deleting <strong>{doctor?.name}</strong> will also automatically remove or cascade their assigned patient records. This action cannot be undone.
              </p>
            </div>
          </MotionWrapper>
        </div>

        {/* fixed footer following Profile Drawer 1:1 */}
        <div className="shrink-0 p-5 px-6 border-t border-border/80 bg-card/95 backdrop-blur-md flex items-center justify-end gap-2.5 z-10">
          <Button
            variant="destructive"
            size="sm"
            loading={loading}
            onClick={onConfirm}
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Confirm Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};
