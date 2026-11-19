'use client';

import React from 'react';
import { Card, Skeleton, Container } from '@/components/ui';
import { CircleStatCardSkeleton } from './CircleStatCardSkeleton';
import { DailyActivityChartSkeleton } from './DailyActivityChartSkeleton';
import { DoctorWorkloadSkeleton } from './DoctorWorkloadSkeleton';
import { SpecialtyDonutSkeleton } from './SpecialtyDonutSkeleton';
import {
  Stethoscope,
  Users,
  Activity,
  Layers,
  Calendar,
  Menu,
  Search,
  Command,
  Sun,
  ShieldCheck,
  ChevronDown,
  LayoutDashboard,
  Compass,
  ChevronRight,
  UserRoundShield,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DashboardSkeletonProps {
  className?: string;
  withLayout?: boolean;
  showHeader?: boolean;
  animated?: boolean;
}

export const DashboardSkeleton: React.FC<DashboardSkeletonProps> = ({
  className,
  withLayout = true,
  showHeader = true,
  animated = true,
}) => {
  // Inner main content skeleton
  const mainContent = (
    <div
      className={cn(
        'w-full space-y-8 pb-12 transition-opacity duration-300',
        !animated && 'opacity-70',
        !withLayout && className
      )}
    >
      {/* 1. Page Header Skeleton */}
      {showHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-3xl bg-card/40 backdrop-blur-md border border-border/50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
              <UserRoundShield
                size={36}
                className={cn('text-primary/50', animated && 'animate-pulse')}
                strokeWidth={1.2}
              />
            </div>
            <div className="space-y-2">
              <Skeleton animated={animated} className="h-6 w-48 sm:w-64 rounded-lg" />
              <Skeleton animated={animated} className="h-3.5 w-64 sm:w-96 rounded" />
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Skeleton animated={animated} className="h-10 w-28 rounded-xl" />
            <Skeleton animated={animated} className="h-10 w-32 rounded-xl" />
          </div>
        </div>
      )}

      {/* 2. Top Metric Cards (4 Circular Stat Skeletons with subdued opacities) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <CircleStatCardSkeleton
          animated={animated}
          activeColor="#198dc7"
          icon={<Stethoscope className="w-3.5 h-3.5 text-primary/70" />}
        />
        <CircleStatCardSkeleton
          animated={animated}
          activeColor="#1ac3b5"
          icon={<Users className="w-3.5 h-3.5 text-secondary/70" />}
        />
        <CircleStatCardSkeleton
          animated={animated}
          activeColor="#10b981"
          icon={<Activity className="w-3.5 h-3.5 text-emerald-500/70" />}
        />
        <CircleStatCardSkeleton
          animated={animated}
          activeColor="#6366f1"
          icon={<Activity className="w-3.5 h-3.5 text-indigo-500/70" />}
        />
      </div>

      {/* 3. Daily Operations & Activity Timeline Skeleton Card */}
      <Card
        className={cn(
          'p-6 space-y-5 border-border/50 bg-card/50 backdrop-blur-md',
          animated && 'shimmer-active'
        )}
      >
        {/* Chart Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary/70 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4 text-primary/70" />
            </div>
            <div className="space-y-1">
              <Skeleton animated={animated} className="h-4 w-52 sm:w-64 rounded" />
              <Skeleton animated={animated} className="h-3 w-64 sm:w-80 rounded" />
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Days switcher pill placeholder */}
            <div className="flex items-center gap-1 p-1 bg-muted/25 rounded-xl border border-border/30">
              <Skeleton animated={animated} className="h-6 w-9 rounded-lg" />
              <Skeleton animated={animated} className="h-6 w-9 rounded-lg" />
              <Skeleton animated={animated} className="h-6 w-9 rounded-lg" />
            </div>

            {/* Filter pills placeholder */}
            <div className="hidden md:flex items-center gap-1 p-1 bg-muted/25 rounded-xl border border-border/30">
              <Skeleton animated={animated} className="h-6 w-20 rounded-lg" />
              <Skeleton animated={animated} className="h-6 w-16 rounded-lg" />
              <Skeleton animated={animated} className="h-6 w-16 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Chart Line Skeleton */}
        <div className="pt-2">
          <DailyActivityChartSkeleton animated={animated} />
        </div>
      </Card>

      {/* 4. Bottom Analytics Grid: Doctor Workload & Specialty Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left: Doctor Workload List Skeleton */}
        <DoctorWorkloadSkeleton animated={animated} />

        {/* Right: Specialty Distribution Donut Skeleton */}
        <Card
          className={cn(
            'p-6 border-border/50 bg-card/50 backdrop-blur-md flex flex-col justify-between h-full',
            animated && 'shimmer-active'
          )}
        >
          <div className="flex items-center justify-between pb-4 border-b border-border/40 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary/70 flex items-center justify-center">
                <Layers className="w-4 h-4 text-primary/70" />
              </div>
              <div className="space-y-1">
                <Skeleton animated={animated} className="h-4 w-44 rounded" />
                <Skeleton animated={animated} className="h-3 w-56 rounded" />
              </div>
            </div>

            <Skeleton animated={animated} className="h-5 w-20 rounded-md" />
          </div>

          <div className="flex-1 w-full flex items-center">
            <SpecialtyDonutSkeleton animated={animated} />
          </div>
        </Card>
      </div>
    </div>
  );

  // If layout wrapper is not requested, return main content directly
  if (!withLayout) {
    return mainContent;
  }

  // Full screen layout with Ambient Glows, Navbar and Sidebar
  return (
    <div
      className={cn(
        'min-h-screen bg-background text-foreground flex flex-col relative overflow-x-clip transition-opacity duration-300',
        !animated && 'opacity-75',
        className
      )}
    >
      {/* Background ambient lighting glows with reduced opacity */}
      <div
        className={cn(
          'fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity',
          animated ? 'opacity-50' : 'opacity-25'
        )}
      >
        <div className="absolute -top-32 -left-32 w-150 h-150 rounded-full bg-primary/8 blur-[140px]" />
        <div className="absolute top-10 -right-32 w-150 h-150 rounded-full bg-secondary/8 blur-[150px]" />
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-175 h-175 rounded-full bg-primary/4 blur-[180px]" />
        <div className="absolute -bottom-40 left-1/4 w-162.5 h-162.5 rounded-full bg-secondary/5 blur-[160px]" />
      </div>

      {/* 1. Top Navbar Skeleton with softened colors and borders */}
      <header className="sticky top-0 z-40 w-full pt-3 pb-2">
        <Container size="2xl">
          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-border/50 bg-card/45 backdrop-blur-md shadow-xs p-2 sm:p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Desktop diagonal linear gradient slant banner with reduced opacity */}
            <div
              style={{
                left: '260px',
                clipPath: 'polygon(38px 0%, 100% 0%, 100% 100%, 0% 100%)',
              }}
              className="hidden md:block absolute inset-y-0 right-0 bg-linear-to-r from-primary/40 via-primary-hover/35 to-secondary/40 pointer-events-none opacity-40"
            />

            {/* Left section: Hamburger button & Brand Logo Skeleton */}
            <div className="relative z-10 flex items-center justify-between w-full md:w-auto shrink-0">
              <div className="flex items-center gap-2 sm:gap-3 py-0.5 pr-2 md:pr-4">
                <div className="p-2 rounded-2xl text-muted-foreground/60 lg:hidden">
                  <Menu className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      'w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center',
                      animated && 'animate-pulse'
                    )}
                  >
                    <div className="w-4 h-4 rounded-full bg-primary/30" />
                  </div>
                  <div className="space-y-1 hidden sm:block">
                    <Skeleton animated={animated} className="h-4 w-24 rounded bg-muted-foreground/15" />
                    <Skeleton animated={animated} className="h-2.5 w-16 rounded bg-muted-foreground/10" />
                  </div>
                </div>
              </div>

              {/* Mobile controls on right (< md) */}
              <div className="flex items-center gap-1.5 md:hidden">
                <div className="p-2 rounded-xl border border-primary/15 bg-linear-to-br from-primary/8 to-secondary/8 text-primary/60">
                  <Sun className="w-4.5 h-4.5 text-warning/60" strokeWidth={1.5} />
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-2xl border border-primary/15 bg-linear-to-br from-primary/8 to-secondary/8">
                  <div className="w-7 h-7 rounded-xl bg-primary/10 text-primary/60 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop center & right controls (md+) */}
            <div className="relative z-10 hidden md:flex items-center justify-end gap-3 flex-1">
              {/* Search input placeholder */}
              <div className="flex-1 max-w-md relative flex items-center">
                <div className="w-full h-10 rounded-2xl bg-card/60 border border-primary-foreground/15 px-3.5 flex items-center justify-between text-muted-foreground text-xs shadow-2xs">
                  <div className="flex items-center gap-2 flex-1">
                    <Search className="w-4 h-4 text-primary/60" />
                    <Skeleton animated={animated} className="h-3.5 w-44 rounded bg-muted-foreground/15" />
                  </div>
                  <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold bg-muted/50 rounded-md border border-border/40 opacity-50">
                    <Command className="w-2.5 h-2.5" /> K
                  </kbd>
                </div>
              </div>

              {/* Theme toggle skeleton */}
              <div className="w-10 h-10 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground/60 flex items-center justify-center shadow-2xs">
                <Sun className="w-4.5 h-4.5" strokeWidth={1.5} />
              </div>

              {/* Profile pill skeleton */}
              <div className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground shadow-2xs">
                <div className="relative w-8 h-8 rounded-xl bg-primary-foreground/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-primary-foreground/70" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-card bg-success/80" />
                </div>
                <div className="flex flex-col space-y-1">
                  <Skeleton animated={animated} className="h-3 w-18 rounded bg-primary-foreground/30" />
                  <Skeleton animated={animated} className="h-2 w-22 rounded bg-primary-foreground/18" />
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-primary-foreground/50" />
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* 2. Main Layout (Sidebar + Content inside Container) */}
      <div className="relative flex-1 w-full flex flex-col py-3">
        <Container size="2xl" className="flex-1 flex gap-6 items-start">
          {/* Desktop Sidebar Skeleton with softer gradient & opacity */}
          <aside
            className={cn(
              'hidden lg:flex sticky top-22 z-20 w-64 xl:w-72 h-[calc(100vh-7rem)] text-primary-foreground p-4 flex-col justify-between overflow-hidden rounded-3xl shrink-0 relative transition-all duration-300',
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
                {/* 1. Item Active */}
                <div className="relative flex items-center justify-between p-3 rounded-2xl bg-primary-foreground/15 text-primary-foreground border border-primary-foreground/20 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary-foreground/15 text-primary-foreground">
                      <LayoutDashboard className="w-4 h-4" />
                    </div>
                    <div className="space-y-1.5">
                      <Skeleton animated={animated} className="h-3.5 w-20 rounded bg-primary-foreground/35" />
                      <Skeleton animated={animated} className="h-2.5 w-32 rounded bg-primary-foreground/20" />
                    </div>
                  </div>
                  <div className="w-1.5 h-6 rounded-full bg-accent/80" />
                </div>

                {/* 2. Item Inactive */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-primary-foreground/5 text-primary-foreground/75 border border-transparent">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary-foreground/8">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div className="space-y-1.5">
                      <Skeleton animated={animated} className="h-3.5 w-16 rounded bg-primary-foreground/20" />
                      <Skeleton animated={animated} className="h-2.5 w-28 rounded bg-primary-foreground/15" />
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-primary-foreground/30" />
                </div>

                {/* 3. Item Inactive */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-primary-foreground/5 text-primary-foreground/75 border border-transparent">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary-foreground/8">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="space-y-1.5">
                      <Skeleton animated={animated} className="h-3.5 w-16 rounded bg-primary-foreground/20" />
                      <Skeleton animated={animated} className="h-2.5 w-24 rounded bg-primary-foreground/15" />
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-primary-foreground/30" />
                </div>
              </nav>
            </div>

            {/* Bottom Profile Footer Skeleton */}
            <div className="relative z-10 p-3 rounded-2xl bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/15 shadow-sm space-y-2.5">
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

          {/* Main Dashboard Content */}
          <main className="flex-1 min-w-0 space-y-8">
            {mainContent}
          </main>
        </Container>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
