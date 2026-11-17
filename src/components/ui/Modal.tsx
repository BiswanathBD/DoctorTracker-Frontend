'use client';

import React, { useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { PageHeader } from './PageHeader';
import { Motion } from '../common/MotionWrapper';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const emptySubscribe = () => () => { };
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  icon,
  children,
  maxWidth = 'md',
}) => {
  const isMounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

  // close on escape key and lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }[maxWidth];

  if (!isMounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* backdrop covering entire viewport including navbar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/40 backdrop-blur-md"
          />

          {/* modal card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={`relative z-10 w-full ${maxWidthClass} rounded-3xl bg-card text-card-foreground border-0 shadow-2xl overflow-hidden p-6 sm:p-7 space-y-5`}
          >
            {/* background decorative elements */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />
            <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-secondary/15 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#808080_1px,transparent_1px)] opacity-[0.07] bg-size-[18px_18px]" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-44 w-44 rounded-full border border-secondary/10" />

            <Motion animationType='button'
               className='absolute top-5 right-5 w-8 h-8 z-20 rounded-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center shadow-md transition-all cursor-pointer'>
              <button
                type="button"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </button>
            </Motion>

            {/* modal header using PageHeader */}
            {(title || description) && (
              <div className="relative">
                <PageHeader
                  title={title || ''}
                  subtitle={description}
                  icon={icon}
                />
              </div>
            )}

            {/* modal body */}
            <div className="relative space-y-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
