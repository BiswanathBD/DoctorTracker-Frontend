import React from 'react';

export const ProfileFooter: React.FC = () => {
  return (
    <footer className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-2 border-t border-border">
      <p className="text-xs font-semibold text-muted-foreground shrink-0">
        © {new Date().getFullYear()} <strong className="text-foreground">Doctor Tracker</strong>. All rights reserved
      </p>
      <div className='h-4 w-px rounded-full bg-secondary hidden sm:block'/>
      <p className="text-xs text-muted-foreground/60 shrink-0">
        Clinical Specialist Directory & In-Patient Tracking System
      </p>
    </footer>
  );
};
