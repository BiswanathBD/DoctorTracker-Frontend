'use client';

import React from 'react';
import { Card, Skeleton } from '@/components/ui';
import { Shield, ShieldCheck, Key, Lock, Cloud, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProfilePageSkeletonProps {
  animated?: boolean;
  className?: string;
}

export const ProfilePageSkeleton: React.FC<ProfilePageSkeletonProps> = ({
  animated = true,
  className,
}) => {
  return (
    <div
      className={cn(
        'w-full max-w-6xl space-y-6 mx-auto pb-10 transition-opacity duration-300',
        !animated && 'opacity-70',
        className
      )}
    >
      {/* 1. Page Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-3xl bg-card/40 backdrop-blur-md border border-border/50">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Shield
              size={32}
              className={cn('text-primary/60', animated && 'animate-pulse')}
              strokeWidth={1.2}
            />
          </div>
          <div className="space-y-1.5">
            <Skeleton animated={animated} className="h-6 w-52 sm:w-64 rounded-lg" />
            <Skeleton animated={animated} className="h-3.5 w-64 sm:w-96 rounded" />
          </div>
        </div>
      </div>

      {/* 2. Side by Side Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Profile Hero Card Skeleton */}
        <div className="lg:col-span-4">
          <Card
            className={cn(
              'relative overflow-hidden p-6 rounded-3xl bg-linear-to-br from-primary/15 via-card to-secondary/15 border border-primary/20 shadow-md space-y-6',
              animated && 'shimmer-active'
            )}
          >
            {/* Ambient glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-primary/15 blur-2xl pointer-events-none" />

            {/* Avatar & Hero Identity */}
            <div className="flex flex-col items-center text-center space-y-3 pt-2">
              <div className="relative w-24 h-24 rounded-3xl bg-primary/20 border-2 border-primary/30 flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-10 h-10 text-primary/70" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-success/70 border-2 border-card" />
              </div>

              <div className="space-y-1 w-full flex flex-col items-center">
                <Skeleton animated={animated} className="h-5 w-36 rounded-md" />
                <Skeleton animated={animated} className="h-3 w-48 rounded" />
              </div>

              <div className="pt-1">
                <Skeleton animated={animated} className="h-6 w-28 rounded-full bg-primary/20" />
              </div>
            </div>

            {/* Account Details Rows */}
            <div className="space-y-2.5 pt-2 border-t border-border/60">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/40">
                <Skeleton animated={animated} className="h-3 w-20 rounded" />
                <Skeleton animated={animated} className="h-3 w-28 rounded" />
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/40">
                <Skeleton animated={animated} className="h-3 w-24 rounded" />
                <Skeleton animated={animated} className="h-3 w-20 rounded" />
              </div>
            </div>

            {/* Sign out button skeleton */}
            <div className="pt-2">
              <div className="w-full h-10 rounded-xl bg-destructive/15 border border-destructive/25 flex items-center justify-center gap-2 text-destructive/70">
                <LogOut className="w-4 h-4" />
                <Skeleton animated={animated} className="h-3.5 w-18 rounded bg-destructive/25" />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Settings, Security & Infrastructure Cards */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Account Credentials Card Skeleton */}
          <Card
            className={cn(
              'p-6 rounded-3xl bg-card/60 backdrop-blur-xl border border-border/70 space-y-5',
              animated && 'shimmer-active'
            )}
          >
            <div className="flex items-center gap-2.5 pb-3 border-b border-border/50">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary/70 flex items-center justify-center">
                <Key className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <Skeleton animated={animated} className="h-4 w-40 rounded" />
                <Skeleton animated={animated} className="h-2.5 w-56 rounded" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Skeleton animated={animated} className="h-3 w-20 rounded" />
                <Skeleton animated={animated} className="h-10 rounded-xl bg-muted/40" />
              </div>
              <div className="space-y-1.5">
                <Skeleton animated={animated} className="h-3 w-24 rounded" />
                <Skeleton animated={animated} className="h-10 rounded-xl bg-muted/40" />
              </div>
            </div>
          </Card>

          {/* 2. Security Protocols Card Skeleton */}
          <Card
            className={cn(
              'p-6 rounded-3xl bg-card/60 backdrop-blur-xl border border-border/70 space-y-5',
              animated && 'shimmer-active'
            )}
          >
            <div className="flex items-center gap-2.5 pb-3 border-b border-border/50">
              <div className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary/70 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <Skeleton animated={animated} className="h-4 w-36 rounded" />
                <Skeleton animated={animated} className="h-2.5 w-60 rounded" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-border/40">
                <Skeleton animated={animated} className="h-3.5 w-32 rounded" />
                <Skeleton animated={animated} className="h-6 w-20 rounded-full bg-success/20" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-border/40">
                <Skeleton animated={animated} className="h-3.5 w-40 rounded" />
                <Skeleton animated={animated} className="h-6 w-24 rounded-full bg-primary/20" />
              </div>
            </div>
          </Card>

          {/* 3. Cloud Infrastructure Card Skeleton */}
          <Card
            className={cn(
              'p-6 rounded-3xl bg-card/60 backdrop-blur-xl border border-border/70 space-y-5',
              animated && 'shimmer-active'
            )}
          >
            <div className="flex items-center gap-2.5 pb-3 border-b border-border/50">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary/70 flex items-center justify-center">
                <Cloud className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <Skeleton animated={animated} className="h-4 w-44 rounded" />
                <Skeleton animated={animated} className="h-2.5 w-64 rounded" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton animated={animated} className="h-3 w-28 rounded" />
                <Skeleton animated={animated} className="h-3 w-16 rounded" />
              </div>
              <Skeleton animated={animated} className="h-3 w-full rounded-full bg-muted/50" />
            </div>
          </Card>
        </div>
      </div>

      {/* 3. Footer Skeleton */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground/60 border-t border-border/50">
        <Skeleton animated={animated} className="h-3 w-48 rounded" />
        <Skeleton animated={animated} className="h-3 w-36 rounded" />
      </div>
    </div>
  );
};

export default ProfilePageSkeleton;
