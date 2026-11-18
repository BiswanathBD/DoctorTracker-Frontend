'use client';

import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from './drawer';

export interface SideSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const SideSheet: React.FC<SideSheetProps> = ({
  isOpen,
  onClose,
  children,
  width = 'md',
  className = '',
}) => {
  const widthClass = {
    sm: 'max-w-sm sm:w-80',
    md: 'max-w-md sm:w-[26rem]',
    lg: 'max-w-lg sm:w-[30rem]',
    xl: 'max-w-xl sm:w-[34rem]',
  }[width];

  return (
    <Drawer
      direction="right"
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DrawerContent
        direction="right"
        className={`w-full ${widthClass} h-full p-4 flex flex-col justify-center pointer-events-auto outline-none`}
      >
        <DrawerHeader className="sr-only">
          <DrawerTitle>Profile Details Dossier</DrawerTitle>
          <DrawerDescription>Detailed specialist or patient clinical record view</DrawerDescription>
        </DrawerHeader>
        <div
          className={`w-full h-full max-h-[96vh] rounded-3xl bg-card border border-border/80 shadow-2xl shadow-black/20 dark:shadow-primary/10 flex flex-col overflow-hidden outline-none ${className}`}
        >
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
