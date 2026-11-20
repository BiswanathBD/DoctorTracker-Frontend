'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { AuthService, type AdminUser } from '@/server/auth.service';
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  LogOut,
  Compass,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export interface SidebarProps {
  admin?: AdminUser | null;
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ admin, className = '' }) => {
  const pathname = usePathname();

  const navItems = [
    {
      title: 'Dashboard',
      subtitle: 'Overview & Hospital KPIs',
      href: '/dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      active: pathname === '/dashboard',
    },
    {
      title: 'Doctors',
      subtitle: 'Specialists & Assignments',
      href: '/doctors',
      icon: <Stethoscope className="w-4 h-4" />,
      active: pathname.startsWith('/doctors'),
    },
    {
      title: 'Patients',
      subtitle: 'Admissions & Clinical Records',
      href: '/patients',
      icon: <Users className="w-4 h-4" />,
      active: pathname.startsWith('/patients'),
    },
  ];

  return (
    <motion.aside
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`hidden lg:flex sticky top-24 z-20 w-64 xl:w-72 h-[calc(100vh-7rem)] bg-linear-to-b from-primary via-primary-hover to-secondary text-primary-foreground shadow-2xl shadow-primary/30 border border-primary-foreground/20 p-4 flex-col justify-between overflow-hidden rounded-3xl shrink-0 ${className}`}
    >
      {/* Ambient background glows */}
      <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-primary-foreground/20 blur-xl pointer-events-none" />
      <div className="absolute top-1/2 -left-12 w-36 h-36 rounded-full bg-primary-foreground/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 right-0 w-44 h-44 rounded-full bg-secondary/40 blur-2xl pointer-events-none" />
      <div className="absolute -top-20 -left-20 w-56 h-56 rounded-full border border-primary-foreground/10 pointer-events-none" />
      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full border border-primary-foreground/10 pointer-events-none" />

      {/* ECG waveform accent */}
      <div className="absolute bottom-36 -right-4 w-64 h-28 opacity-20 pointer-events-none mask-l-from-0%">
        <svg
          viewBox="0 0 200 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full"
        >
          <path d="M0,50 L40,50 L52,20 L62,80 L72,30 L82,65 L92,50 L200,50" />
        </svg>
      </div>

      {/* Top navigation links */}
      <div className="relative z-10 flex-1 overflow-y-auto pr-1 space-y-2 py-2">
        {/* Navigation header */}
        <div className="px-3 py-1.5 flex items-center justify-between border-b border-primary-foreground/10 pb-2 mb-2">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-accent" />
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/85 select-none">
              Navigation
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary-foreground/15 backdrop-blur-sm text-[9px] font-bold text-primary-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
            <span>Live Portal</span>
          </div>
        </div>

        {/* Links */}
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-colors duration-200 cursor-pointer group ${
                item.active
                  ? 'text-primary-foreground font-bold'
                  : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10'
              }`}
            >
              {/* Active indicators */}
              {item.active && (
                <motion.div
                  layoutId="activeDesktopNavHighlight"
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 32,
                    mass: 0.8,
                  }}
                  className="absolute inset-0 rounded-2xl bg-primary-foreground/20 border border-primary-foreground/30 backdrop-blur-md shadow-lg shadow-black/10 z-0"
                />
              )}

              {item.active && (
                <motion.div
                  layoutId="activeDesktopNavIndicator"
                  transition={{
                    type: 'spring',
                    stiffness: 450,
                    damping: 35,
                  }}
                  className="absolute -left-1 top-3.5 bottom-3.5 w-2 rounded-full bg-primary-foreground z-10 shadow-sm"
                />
              )}

              <div className="relative z-10 flex items-center gap-3 min-w-0 flex-1">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                    item.active
                      ? 'bg-primary-foreground/25 text-primary-foreground shadow-sm'
                      : 'bg-primary-foreground/10 text-primary-foreground/90 group-hover:bg-primary-foreground/20 group-hover:scale-105'
                  }`}
                >
                  {item.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-primary-foreground truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-primary-foreground/75 font-medium truncate mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <ChevronRight
                className={`relative z-10 w-4 h-4 transition-transform duration-200 shrink-0 ${
                  item.active
                    ? 'text-accent translate-x-0.5'
                    : 'text-primary-foreground/40 group-hover:text-primary-foreground/80 group-hover:translate-x-0.5'
                }`}
              />
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom profile & logout */}
      <div className="relative z-10 pt-2 shrink-0">
        <div className="p-3 rounded-2xl bg-primary-foreground/12 backdrop-blur-md border border-primary-foreground/20 shadow-xl shadow-black/10 space-y-2.5">
          <Link
            href="/profile"
            className="flex items-center justify-between gap-2.5 p-1 rounded-xl group cursor-pointer hover:bg-primary-foreground/10 transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="relative shrink-0">
                {admin?.avatar?.url ? (
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden border-2 border-primary-foreground/30 shadow-md group-hover:border-primary-foreground/60 transition-colors">
                    <Image
                      src={admin.avatar.url}
                      alt={admin.name || 'Admin'}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 text-primary-foreground flex items-center justify-center shadow-md border border-primary-foreground/30 group-hover:bg-primary-foreground/30 transition-colors">
                    <ShieldCheck className="w-5 h-5 text-primary-foreground" />
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-success border-2 border-primary" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-primary-foreground truncate transition-colors">
                  {admin?.name || 'Super Admin'}
                </p>
                <p className="text-xs text-primary-foreground/75 truncate mt-0.5 font-medium">
                  {admin?.email || 'admin@doctortracker.com'}
                </p>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-primary-foreground/50 group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>

          {/* Footer actions */}
          <div className="pt-2 border-t border-primary-foreground/10 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => AuthService.logout()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all font-semibold text-xs shadow-md shadow-destructive/25 cursor-pointer active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
