'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './dialog';
import { PageHeader } from './PageHeader';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  icon,
  children,
  maxWidth = 'md',
}) => {
  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }[maxWidth];

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        hideCloseButton={true}
        className={`w-[calc(100%-2rem)] sm:w-full ${maxWidthClass} max-h-[90vh] p-0 flex flex-col overflow-hidden rounded-3xl bg-card border border-border/80 shadow-2xl`}
      >
        {/* accessible hidden title & description for ARIA compliance */}
        <DialogHeader className="sr-only">
          <DialogTitle>{title || 'Dialog'}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {/* fixed header using PageHeader size="sm" */}
        {(title || description) && (
          <PageHeader
            size="sm"
            title={title || ''}
            subtitle={description}
            icon={icon}
            onClose={onClose}
            className="shrink-0 px-6 py-4 border-b border-border/80 bg-card/95 backdrop-blur-md relative z-10"
          />
        )}

        {/* modal body container */}
        <div className="flex-1 min-h-0 flex flex-col relative">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};