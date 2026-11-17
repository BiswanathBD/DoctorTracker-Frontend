'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthService, type AdminUser } from '@/server/auth.service';
import { DashboardService, type DashboardStats } from '@/server/dashboard.service';
import { Button, Badge } from '@/components/ui';
import {
  LogOut,
  Shield,
  Stethoscope,
  Users,
  Settings,
  X,
  ExternalLink,
  Activity,
  CheckCircle2,
  Mail
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

  const cardContent = (
    <div className="w-80 h-[calc(100vh-7rem)] rounded-3xl bg-card/75 backdrop-blur-xl border border-border/80 p-6 flex flex-col justify-between shadow-2xl shadow-black/10 dark:shadow-primary/5 shrink-0 transition-colors">
      <div className="space-y-5">
        {/* header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/70">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Admin Profile
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-success/15 text-success text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Active
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/70 cursor-pointer transition-colors"
              title="Close profile card"
              aria-label="Close profile card"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* user info */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          <div className="relative group">
            {admin?.avatar?.url ? (
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary/40 shadow-lg shadow-primary/10 transition-transform group-hover:scale-105 duration-300">
                <Image
                  src={admin.avatar.url}
                  alt={admin.name || 'Admin'}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary via-primary-hover to-secondary text-primary-foreground font-black text-2xl flex items-center justify-center uppercase shadow-lg shadow-primary/20 transition-transform group-hover:scale-105 duration-300">
                {admin?.name?.charAt(0) || 'A'}
              </div>
            )}
            <div
              className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-success border-2 border-card flex items-center justify-center shadow-sm"
              title="Online"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="font-extrabold text-foreground text-base tracking-tight">
              {admin?.name || 'Super Admin'}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Mail className="w-3 h-3" />
              {admin?.email || 'admin@doctortracker.com'}
            </p>
            <Badge variant="primary" className="mt-1 font-semibold text-[10px]">
              System Administrator
            </Badge>
          </div>
        </div>

        {/* metrics */}
        <div className="space-y-2.5 pt-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Scope of Management
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-muted/40 backdrop-blur-md border border-border/70 space-y-1 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-1.5 text-primary text-[11px] font-semibold">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Doctors</span>
              </div>
              <p className="text-lg font-extrabold text-foreground tracking-tight">
                {totalDoctors}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-muted/40 backdrop-blur-md border border-border/70 space-y-1 hover:border-secondary/40 transition-colors">
              <div className="flex items-center gap-1.5 text-secondary text-[11px] font-semibold">
                <Users className="w-3.5 h-3.5" />
                <span>Patients</span>
              </div>
              <p className="text-lg font-extrabold text-foreground tracking-tight">
                {totalPatients}
              </p>
            </div>
          </div>
        </div>

        {/* settings link */}
        <div className="pt-1">
          <Link
            href="/profile"
            onClick={() => {
              if (window.innerWidth < 1280) onClose();
            }}
          >
            <div className="p-3 rounded-2xl bg-primary/5 hover:bg-primary/10 backdrop-blur-md border border-primary/20 transition-all flex items-center justify-between group cursor-pointer shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-xl bg-primary/15 text-primary group-hover:scale-105 transition-transform">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                    Account Settings
                  </p>
                  <p className="text-[10px] text-muted-foreground">Change photo & credentials</p>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>
        </div>
      </div>

      {/* logout */}
      <div className="pt-4 border-t border-border/70 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1 pb-1">
          <span className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-success" />
            Secure JWT Session
          </span>
          <span className="font-mono text-[10px]">v1.0.0</span>
        </div>

        <Button
          variant="outline"
          onClick={() => AuthService.logout()}
          className="w-full justify-center text-destructive border-destructive/20 hover:bg-destructive hover:text-destructive-foreground font-bold rounded-2xl py-2.5 transition-all shadow-sm"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* desktop drawer */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.aside
            key="desktop-profile-card"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 280,
              damping: 30,
              mass: 0.8,
            }}
            className="hidden xl:block shrink-0 sticky top-22 z-20"
          >
            {cardContent}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="xl:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-foreground/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 32,
              }}
              className="fixed top-0 bottom-0 right-0 z-50 p-4 max-w-sm w-full flex items-center justify-end"
            >
              <div className="w-full h-full max-h-[96vh] my-auto">
                {cardContent}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
