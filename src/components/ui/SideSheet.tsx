'use client';

import React, { useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export interface SideSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const emptySubscribe = () => () => { };
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export const SideSheet: React.FC<SideSheetProps> = ({
  isOpen,
  onClose,
  children,
  width = 'md',
  className = '',
}) => {
  const isMounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

  // handle escape key and body scroll locking
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  const widthClass = {
    sm: 'max-w-sm sm:w-80',
    md: 'max-w-md sm:w-[26rem]',
    lg: 'max-w-lg sm:w-[30rem]',
    xl: 'max-w-xl sm:w-[34rem]',
  }[width];

  if (!isMounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex justify-end pointer-events-auto">
          {/* modal backdrop: transparent dim without blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          {/* slide-in container keeping floating sheet style */}
          <motion.aside
            key="side-sheet-card-container"
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.5 }}
            transition={{
              type: 'spring',
              stiffness: 320,
              damping: 32,
              mass: 0.8,
            }}
            className={`relative z-10 w-full ${widthClass} h-full p-3 sm:p-4 flex flex-col justify-center pointer-events-auto`}
          >
            <div
              className={`w-full h-full max-h-[96vh] rounded-3xl bg-card border border-border/80 shadow-2xl shadow-black/20 dark:shadow-primary/10 flex flex-col overflow-hidden ${className}`}
            >
              {children}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
