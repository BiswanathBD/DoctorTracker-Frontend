import React from 'react';
import { cn } from '@/lib/utils';

export interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      className={cn(
        'pt-4 pb-2 flex flex-col sm:flex-row items-center justify-center gap-2 border-t border-border/80',
        className
      )}
    >
      <p className="text-xs font-semibold text-muted-foreground shrink-0">
        © {new Date().getFullYear()}{' '}
        <strong className="text-foreground font-bold">Doctor Tracker</strong>. All rights reserved
      </p>
      <div className="h-4 w-px rounded-full bg-secondary hidden sm:block" />
      <p className="text-xs text-muted-foreground/60 shrink-0">
        Clinical Specialist Directory & In-Patient Tracking System
      </p>
    </footer>
  );
};

export default Footer;