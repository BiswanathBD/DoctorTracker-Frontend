'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Container, Skeleton } from '@/components/ui';
import { DashboardPageSkeleton } from './DashboardPageSkeleton';
import { DoctorsPageSkeleton } from './DoctorsPageSkeleton';
import { PatientsPageSkeleton } from './PatientsPageSkeleton';
import { ProfilePageSkeleton } from './ProfilePageSkeleton';
import {
  Stethoscope,
  Users,
  Sun,
  ShieldCheck,
  ChevronDown,
  LayoutDashboard,
  Compass,
  ChevronRight,
  Search,
  Command,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DashboardSkeletonProps {
  className?: string;
  withLayout?: boolean;
  showHeader?: boolean;
  animated?: boolean;
  pathname?: string;
  children?: React.ReactNode;
}

export const DashboardSkeleton: React.FC<DashboardSkeletonProps> = ({
  className,
  withLayout = true,
  showHeader = true,
  animated = true,
  pathname: propPathname,
  children,
}) => {
  const routerPathname = usePathname();
  const currentPath = propPathname || routerPathname || '/dashboard';

  const isDoctors = currentPath.startsWith('/doctors');
  const isPatients = currentPath.startsWith('/patients');
  const isProfile = currentPath.startsWith('/profile');
  const isDashboard = !isDoctors && !isPatients && !isProfile;

  // Decide inner content based on route
  const resolvedContent = children ? (
    children
  ) : isDoctors ? (
    <DoctorsPageSkeleton animated={animated} className={className} />
  ) : isPatients ? (
    <PatientsPageSkeleton animated={animated} className={className} />
  ) : isProfile ? (
    <ProfilePageSkeleton animated={animated} className={className} />
  ) : (
    <DashboardPageSkeleton
      animated={animated}
      showHeader={showHeader}
      className={className}
    />
  );

  // If layout wrapper is disabled, return inner page skeleton directly
  if (!withLayout) {
    return resolvedContent;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-x-clip">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-150 h-150 rounded-full bg-primary/8 blur-[140px]" />
        <div className="absolute top-10 -right-32 w-150 h-150 rounded-full bg-secondary/8 blur-[150px]" />
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-175 h-175 rounded-full bg-primary/4 blur-[180px]" />
        <div className="absolute -bottom-40 left-1/4 w-162.5 h-162.5 rounded-full bg-secondary/6 blur-[160px]" />
      </div>

      {/* 1. Header Skeleton */}
      <header className="sticky top-0 z-40 w-full pt-3 pb-2">
        <Container size="2xl">
          <div
            className={cn(
              'w-full rounded-3xl bg-card shadow-xl shadow-black/5 dark:shadow-primary/5 p-2.5 sm:p-3 md:py-2.5 md:px-3 flex flex-col md:flex-row md:items-center justify-between gap-2.5 md:gap-0 relative overflow-hidden transition-all duration-300',
              animated && 'shimmer-active',
              !animated && 'opacity-70'
            )}
          >
            {/* stylish angled gradient background covering right portion with \ slant cut (desktop only) */}
            <div
              style={{
                left: '240px',
                clipPath: 'polygon(36px 0%, 100% 0%, 100% 100%, 0% 100%)',
              }}
              className="hidden md:block absolute inset-y-0 right-0 bg-linear-to-r from-primary via-primary-hover to-secondary pointer-events-none transition-all duration-200"
            />

            {/* subtle highlight sheen on the angled edge (desktop only) */}
            <div
              style={{
                left: '240px',
                clipPath: 'polygon(36px 0%, 38px 0%, 2px 100%, 0% 100%)',
              }}
              className="hidden md:block absolute inset-y-0 w-10 bg-primary-foreground/20 pointer-events-none transition-all duration-200"
            />

            {/* top row on < md / left section on md+ */}
            <div className="relative z-10 flex items-center justify-between w-full md:w-auto shrink-0">
              {/* brand identity */}
              <div className="flex items-center gap-2 sm:gap-3 py-0.5 pr-2 md:pr-4">
                <div className="p-2 rounded-2xl bg-muted/60 lg:hidden shrink-0">
                  <div className="w-5 h-5 flex flex-col justify-center gap-1">
                    <span className="w-4 h-0.5 rounded-full bg-muted-foreground/40" />
                    <span className="w-5 h-0.5 rounded-full bg-muted-foreground/40" />
                    <span className="w-3.5 h-0.5 rounded-full bg-muted-foreground/40" />
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-linear-to-br from-primary/30 to-secondary/30 flex items-center justify-center shadow-xs">
                    <div className="w-4 h-4 rounded-full bg-primary/50" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton animated={animated} className="h-4 w-24 rounded bg-muted-foreground/20" />
                    <Skeleton animated={animated} className="h-2.5 w-16 rounded bg-muted-foreground/15" />
                  </div>
                </div>
              </div>

              {/* mobile controls (< md) */}
              <div className="flex items-center gap-1.5 md:hidden">
                <div className="p-2 rounded-xl border border-primary/20 bg-linear-to-br from-primary/10 to-secondary/10 text-primary/70">
                  <Sun className="w-4.5 h-4.5 text-warning/70" strokeWidth={1.5} />
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-2xl border border-primary/20 bg-linear-to-br from-primary/10 to-secondary/10">
                  <div className="w-7 h-7 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop center & right controls (md+) over angled gradient */}
            <div className="relative z-10 hidden md:flex items-center justify-end gap-2 sm:gap-3 grow min-w-0 pl-10 lg:pl-12">
              {/* Search input placeholder over gradient */}
              <div className="flex-1 max-w-xs lg:max-w-md mx-2 sm:mx-4">
                <div className="w-full h-10 rounded-2xl border border-primary-foreground/25 bg-primary-foreground/15 backdrop-blur-md px-3.5 flex items-center justify-between text-primary-foreground/80 text-xs shadow-xs">
                  <div className="flex items-center gap-2 flex-1">
                    <Search className="w-4 h-4 text-primary-foreground" />
                    <Skeleton animated={animated} className="h-3.5 w-44 rounded bg-primary-foreground/35" />
                  </div>
                  <div className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg border border-primary-foreground/20 bg-primary-foreground/15 text-[10px] text-primary-foreground/80 shadow-xs">
                    <Command className="w-2.5 h-2.5" />
                    <span>K</span>
                  </div>
                </div>
              </div>

              {/* Theme toggle skeleton over gradient */}
              <div className="p-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/15 backdrop-blur-md text-primary-foreground shadow-xs">
                <Sun className="w-5 h-5 text-warning/90" strokeWidth={1.5} />
              </div>

              <div className="h-6 w-px bg-primary-foreground/25 mx-0.5" />

              {/* Profile pill skeleton over gradient */}
              <div
                className={cn(
                  'flex items-center gap-2.5 p-1.5 lg:pr-3 rounded-2xl border transition-all shadow-sm',
                  isProfile
                    ? 'bg-card text-card-foreground border-card shadow-md'
                    : 'bg-primary-foreground/15 backdrop-blur-md text-primary-foreground border-primary-foreground/25'
                )}
              >
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-xl bg-primary-foreground/25 flex items-center justify-center border border-primary-foreground/30 shadow-xs">
                    <ShieldCheck className="w-4 h-4 text-primary-foreground" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-primary bg-success" />
                  </div>
                </div>
                <div className="hidden lg:flex flex-col space-y-1">
                  <Skeleton animated={animated} className="h-3 w-18 rounded bg-primary-foreground/40" />
                  <Skeleton animated={animated} className="h-2 w-22 rounded bg-primary-foreground/25" />
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-primary-foreground/70" />
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* 2. Main Layout (Sidebar + Content inside Container) */}
      <div className="relative flex-1 w-full flex flex-col py-3">
        <Container size="2xl" className="flex-1 flex gap-6 items-start">
          {/* Desktop Sidebar Skeleton with route-aware active item */}
          <aside
            className={cn(
              'hidden lg:flex sticky top-24 z-20 w-64 xl:w-72 h-[calc(100vh-7rem)] text-primary-foreground p-4 flex-col justify-between overflow-hidden rounded-3xl shrink-0 transition-all duration-300',
              'bg-linear-to-b from-primary/45 via-primary-hover/40 to-secondary/45 backdrop-blur-xl border border-primary-foreground/15 shadow-xl shadow-primary/10',
              animated && 'shimmer-active',
              !animated && 'opacity-65'
            )}
          >
            {/* Ambient Background elements inside sidebar */}
            <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-primary-foreground/10 blur-xl pointer-events-none" />
            <div className="absolute top-1/2 -left-12 w-36 h-36 rounded-full bg-primary-foreground/8 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 right-0 w-44 h-44 rounded-full bg-secondary/20 blur-2xl pointer-events-none" />

            {/* ECG Waveform accent */}
            <div className="absolute bottom-36 -right-4 w-64 h-28 opacity-12 pointer-events-none">
              <svg viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-full h-full">
                <path d="M0 50 L40 50 L50 20 L60 80 L70 35 L80 65 L90 50 L130 50 L140 30 L150 70 L160 50 L200 50" />
              </svg>
            </div>

            {/* Top Navigation Items */}
            <div className="relative z-10 space-y-6">
              {/* Sidebar Header Title Skeleton */}
              <div className="flex items-center gap-2 px-3 py-2 text-primary-foreground/70">
                <Compass className="w-4 h-4 text-accent/80" />
                <Skeleton animated={animated} className="h-3 w-24 rounded bg-primary-foreground/20" />
              </div>

              {/* Navigation Links */}
              <nav className="space-y-2">
                {/* 1. Dashboard Nav Item */}
                <div
                  className={cn(
                    'relative flex items-center justify-between p-3 rounded-2xl transition-all',
                    isDashboard
                      ? 'bg-primary-foreground/15 text-primary-foreground border border-primary-foreground/20 shadow-sm'
                      : 'bg-primary-foreground/5 text-primary-foreground/75 border border-transparent'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'p-2 rounded-xl',
                        isDashboard ? 'bg-primary-foreground/15 text-primary-foreground' : 'bg-primary-foreground/8'
                      )}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                    </div>
                    <div className="space-y-1.5">
                      <Skeleton
                        animated={animated}
                        className={cn('h-3.5 w-20 rounded', isDashboard ? 'bg-primary-foreground/35' : 'bg-primary-foreground/20')}
                      />
                      <Skeleton
                        animated={animated}
                        className={cn('h-2.5 w-32 rounded', isDashboard ? 'bg-primary-foreground/20' : 'bg-primary-foreground/15')}
                      />
                    </div>
                  </div>
                  {isDashboard ? (
                    <div className="w-1.5 h-6 rounded-full bg-accent/80" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-primary-foreground/30" />
                  )}
                </div>

                {/* 2. Doctors Nav Item */}
                <div
                  className={cn(
                    'relative flex items-center justify-between p-3 rounded-2xl transition-all',
                    isDoctors
                      ? 'bg-primary-foreground/15 text-primary-foreground border border-primary-foreground/20 shadow-sm'
                      : 'bg-primary-foreground/5 text-primary-foreground/75 border border-transparent'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'p-2 rounded-xl',
                        isDoctors ? 'bg-primary-foreground/15 text-primary-foreground' : 'bg-primary-foreground/8'
                      )}
                    >
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div className="space-y-1.5">
                      <Skeleton
                        animated={animated}
                        className={cn('h-3.5 w-16 rounded', isDoctors ? 'bg-primary-foreground/35' : 'bg-primary-foreground/20')}
                      />
                      <Skeleton
                        animated={animated}
                        className={cn('h-2.5 w-28 rounded', isDoctors ? 'bg-primary-foreground/20' : 'bg-primary-foreground/15')}
                      />
                    </div>
                  </div>
                  {isDoctors ? (
                    <div className="w-1.5 h-6 rounded-full bg-accent/80" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-primary-foreground/30" />
                  )}
                </div>

                {/* 3. Patients Nav Item */}
                <div
                  className={cn(
                    'relative flex items-center justify-between p-3 rounded-2xl transition-all',
                    isPatients
                      ? 'bg-primary-foreground/15 text-primary-foreground border border-primary-foreground/20 shadow-sm'
                      : 'bg-primary-foreground/5 text-primary-foreground/75 border border-transparent'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'p-2 rounded-xl',
                        isPatients ? 'bg-primary-foreground/15 text-primary-foreground' : 'bg-primary-foreground/8'
                      )}
                    >
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="space-y-1.5">
                      <Skeleton
                        animated={animated}
                        className={cn('h-3.5 w-16 rounded', isPatients ? 'bg-primary-foreground/35' : 'bg-primary-foreground/20')}
                      />
                      <Skeleton
                        animated={animated}
                        className={cn('h-2.5 w-24 rounded', isPatients ? 'bg-primary-foreground/20' : 'bg-primary-foreground/15')}
                      />
                    </div>
                  </div>
                  {isPatients ? (
                    <div className="w-1.5 h-6 rounded-full bg-accent/80" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-primary-foreground/30" />
                  )}
                </div>
              </nav>
            </div>

            {/* Bottom Profile Footer Skeleton */}
            <div
              className={cn(
                'relative z-10 p-3 rounded-2xl backdrop-blur-md border shadow-sm space-y-2.5 transition-all',
                isProfile
                  ? 'bg-primary-foreground/20 border-primary-foreground/30'
                  : 'bg-primary-foreground/10 border-primary-foreground/15'
              )}
            >
              <div className="flex items-center justify-between gap-2.5 p-1 rounded-xl">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-primary-foreground/15 text-primary-foreground flex items-center justify-center border border-primary-foreground/20">
                      <ShieldCheck className="w-5 h-5 text-primary-foreground/80" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-success/75 border-2 border-primary/50" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <Skeleton animated={animated} className="h-3.5 w-20 rounded bg-primary-foreground/30" />
                    <Skeleton animated={animated} className="h-2.5 w-28 rounded bg-primary-foreground/18" />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-primary-foreground/10 flex items-center justify-end">
                <Skeleton animated={animated} className="h-7 w-20 rounded-lg bg-primary-foreground/15" />
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 space-y-8">
            {resolvedContent}
          </main>
        </Container>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
