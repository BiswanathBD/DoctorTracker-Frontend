'use client';

import React from 'react';
import { Modal, Button } from '@/components/ui';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import { LogOut } from 'lucide-react';

export interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export const SignOutModal: React.FC<SignOutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sign Out of Doctor Tracker"
      description="Are you sure you want to end your administrative session?"
      icon={<LogOut className="w-5 h-5 text-destructive" />}
      maxWidth="sm"
    >
      <div className="space-y-4">
        <MotionWrapper animationType="scale" delay={0.1} duration={0.25}>
          <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-start gap-3 text-xs text-destructive">
            <LogOut className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Ending your session will clear your local administrative authentication tokens. You will need to log in again to access the management portal.
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
              leftIcon={<LogOut className="w-3.5 h-3.5" />}
              className="rounded-full px-5 cursor-pointer"
            >
              Sign Out
            </Button>
          </div>
        </MotionWrapper>
      </div>
    </Modal>
  );
};
