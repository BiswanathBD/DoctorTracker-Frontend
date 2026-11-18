'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AuthService, type AdminUser } from '@/server/auth.service';
import { DashboardService, type DashboardStats } from '@/server/dashboard.service';
import { SideSheet, Badge } from '@/components/ui';
import {
  LogOut,
  Shield,
  Stethoscope,
  Users,
  Settings,
  X,
  ChevronRight,
  Mail,
  Building2,
  User,
} from 'lucide-react';

interface ProfileCardProps {
  isOpen: boolean;
  onClose: () => void;
  admin: AdminUser | null;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ isOpen, onClose, admin }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    DashboardService.getStats()
      .then((data) => setStats(data))
      .catch((err) => console.error('failed to fetch stats for profile card:', err));
  }, []);

  const totalDoctors = stats?.overview.totalDoctors ?? '--';
  const totalPatients = stats?.overview.totalPatients ?? '--';
  const totalHospitals = stats?.overview.totalHospitals ?? '--';

  return (
    <SideSheet isOpen={isOpen} onClose={onClose} width="md" className="p-0">
      {/* fixed header */}
      <div className="shrink-0 px-6 py-4 border-b border-border/80 flex items-center justify-between bg-card/90">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            Account Center
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* scrollable body */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
        {/* modern identity card */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary/15 via-muted/30 to-card border border-primary/20 py-3 px-4 shadow-sm">
          {/* subtle decorative vector */}
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-center gap-4">
            <div className="relative shrink-0">
              {admin?.avatar?.url ? (
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary/40 shadow-lg shadow-primary/20">
                  <Image
                    src={admin.avatar.url}
                    alt={admin.name || 'Admin'}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary via-primary-hover to-secondary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
                  <User className="w-8 h-8" />
                </div>
              )}
              <div
                className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-success border-2 border-card"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-foreground text-base tracking-tight truncate">
                  {admin?.name || 'Super Admin'}
                </h3>
              </div>

              <p className="text-xs text-muted-foreground flex items-center gap-1.5 truncate mt-0.5 font-medium">
                <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate">{admin?.email || 'admin@doctortracker.com'}</span>
              </p>

              <div className="mt-2 flex items-center gap-1.5">
                <Badge variant="primary" className="text-[10px] py-0.5 px-2 font-bold">
                  {admin?.role || 'Super Admin'}
                </Badge>
                <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                  <Shield className="w-3 h-3 text-success" />
                  Verified Access
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* platform impact metrics */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <p className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
              Platform Directory
            </p>
            <span className="text-[10px] text-primary font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Live Sync
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {/* doctors card */}
            <Link
              href="/doctors"
              onClick={onClose}
              className="group relative overflow-hidden p-3.5 rounded-2xl bg-linear-to-b from-primary/10 via-card to-card border border-primary/20 hover:border-primary/50 transition-all flex flex-col justify-between shadow-xs hover:shadow-md hover:shadow-primary/10 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-xl bg-primary/15 text-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                  <Stethoscope className="w-3.5 h-3.5" />
                </div>
                <ChevronRight className="w-3 h-3 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="mt-3">
                <p className="text-xl font-black text-foreground tracking-tight leading-none group-hover:text-primary transition-colors">
                  {totalDoctors}
                </p>
                <p className="text-[10px] font-bold text-muted-foreground mt-1">Specialists</p>
              </div>
            </Link>

            {/* patients card */}
            <Link
              href="/patients"
              onClick={onClose}
              className="group relative overflow-hidden p-3.5 rounded-2xl bg-linear-to-b from-secondary/10 via-card to-card border border-secondary/20 hover:border-secondary/50 transition-all flex flex-col justify-between shadow-xs hover:shadow-md hover:shadow-secondary/10 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <ChevronRight className="w-3 h-3 text-muted-foreground/40 group-hover:text-secondary group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="mt-3">
                <p className="text-xl font-black text-foreground tracking-tight leading-none group-hover:text-secondary transition-colors">
                  {totalPatients}
                </p>
                <p className="text-[10px] font-bold text-muted-foreground mt-1">Admissions</p>
              </div>
            </Link>

            {/* hospitals card */}
            <Link
              href="/doctors"
              onClick={onClose}
              className="group relative overflow-hidden p-3.5 rounded-2xl bg-linear-to-b from-primary/10 via-card to-card border border-primary/20 hover:border-primary/50 transition-all flex flex-col justify-between shadow-xs hover:shadow-md hover:shadow-primary/10 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-xl bg-primary/15 text-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <ChevronRight className="w-3 h-3 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="mt-3">
                <p className="text-xl font-black text-foreground tracking-tight leading-none group-hover:text-primary transition-colors">
                  {totalHospitals}
                </p>
                <p className="text-[10px] font-bold text-muted-foreground mt-1">Hospitals</p>
              </div>
            </Link>
          </div>
        </div>

        {/* navigation & settings options */}
        <div className="space-y-2">
          <p className="text-[11px] font-black uppercase tracking-wider text-muted-foreground px-1">
            Preferences
          </p>

          <Link
            href="/profile"
            onClick={onClose}
            className="p-3.5 rounded-2xl bg-card hover:bg-muted/50 border border-border/80 hover:border-primary/40 transition-all flex items-center justify-between group cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                <Settings className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-black text-foreground group-hover:text-primary transition-colors leading-tight">
                  Admin Settings
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Edit profile, credentials & avatar</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>
      </div>

      {/* fixed footer */}
      <div className="shrink-0 p-5 border-t border-border/80 bg-card/90">
        <button
          type="button"
          onClick={() => AuthService.logout()}
          className="w-full py-3 px-4 rounded-2xl bg-destructive hover:bg-destructive/90 text-destructive-foreground font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-destructive/25 transition-all cursor-pointer active:scale-[0.99]"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </SideSheet>
  );
};
