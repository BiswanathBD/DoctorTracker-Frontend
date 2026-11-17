'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/common/Logo';
import { AuthService, type AdminUser } from '@/server/auth.service';
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  Settings,
  ChevronDown,
  LogOut,
  PlusCircle,
  ListOrdered,
  Activity,
  HeartPulse,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  admin: AdminUser | null;
}

interface NavItem {
  title: string;
  icon: React.ReactNode;
  href?: string;
  submenu?: {
    title: string;
    href: string;
    icon: React.ReactNode;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, admin }) => {
  const pathname = usePathname();

  // state for open submenus (open doctors by default if on /doctors, etc.)
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    doctors: pathname.startsWith('/doctors'),
    patients: pathname.startsWith('/patients'),
  });

  const toggleSubmenu = (key: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const navItems: { key: string; item: NavItem }[] = [
    {
      key: 'dashboard',
      item: {
        title: 'Dashboard Home',
        href: '/dashboard',
        icon: <LayoutDashboard className="w-5 h-5" />,
      },
    },
    {
      key: 'doctors',
      item: {
        title: 'Doctor Management',
        icon: <Stethoscope className="w-5 h-5" />,
        submenu: [
          {
            title: 'All Doctors',
            href: '/doctors',
            icon: <ListOrdered className="w-4 h-4" />,
          },
          {
            title: 'Add New Doctor',
            href: '/doctors?action=create',
            icon: <PlusCircle className="w-4 h-4" />,
          },
          {
            title: 'Doctor Workload',
            href: '/doctors/workload',
            icon: <Activity className="w-4 h-4" />,
          },
        ],
      },
    },
    {
      key: 'patients',
      item: {
        title: 'Patient Management',
        icon: <Users className="w-5 h-5" />,
        submenu: [
          {
            title: 'All Patients',
            href: '/patients',
            icon: <ListOrdered className="w-4 h-4" />,
          },
          {
            title: 'Add New Patient',
            href: '/patients?action=create',
            icon: <PlusCircle className="w-4 h-4" />,
          },
          {
            title: 'Patient Conditions',
            href: '/patients/conditions',
            icon: <HeartPulse className="w-4 h-4" />,
          },
        ],
      },
    },
    {
      key: 'settings',
      item: {
        title: 'Settings & Profile',
        href: '/profile',
        icon: <Settings className="w-5 h-5" />,
      },
    },
  ];

  return (
    <>
      {/* mobile backdrop overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* side navigation bar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-card border-r border-border flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* header brand */}
        <div className="h-16 px-6 border-b border-border flex items-center justify-between flex-shrink-0">
          <Logo size="sm" />
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted lg:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* navigation items list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
          <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
            Main Navigation
          </p>

          {navItems.map(({ key, item }) => {
            const hasSubmenu = !!item.submenu;
            const isSubmenuOpen = !!openSubmenus[key];
            const isActive = item.href ? pathname === item.href : false;

            if (!hasSubmenu && item.href) {
              return (
                <Link
                  key={key}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              );
            }

            return (
              <div key={key} className="space-y-1">
                {/* parent menu trigger */}
                <button
                  type="button"
                  onClick={() => toggleSubmenu(key)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isSubmenuOpen
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isSubmenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* expandable submenu */}
                <AnimatePresence initial={false}>
                  {isSubmenuOpen && item.submenu && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pl-5 pr-1 space-y-1"
                    >
                      {item.submenu.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => {
                              if (window.innerWidth < 1024) onClose();
                            }}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                              isSubActive
                                ? 'bg-primary/10 text-primary font-bold'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            }`}
                          >
                            <span className={isSubActive ? 'text-primary' : 'text-muted-foreground'}>{sub.icon}</span>
                            <span>{sub.title}</span>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* footer admin profile & logout */}
        <div className="p-4 pb-6 border-t border-border flex-shrink-0 space-y-3 bg-card">
          <div className="p-3 rounded-2xl bg-muted/50 border border-border flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              {admin?.avatar?.url ? (
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-border flex-shrink-0">
                  <Image
                    src={admin.avatar.url}
                    alt={admin.name}
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground font-bold text-xs flex items-center justify-center uppercase flex-shrink-0">
                  {admin?.name?.charAt(0) || 'A'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-foreground truncate leading-tight">
                  {admin?.name || 'Administrator'}
                </p>
                <p className="text-[10px] text-muted-foreground truncate uppercase font-semibold mt-0.5">
                  {admin?.role || 'admin'}
                </p>
              </div>
            </div>

            <button
              onClick={() => AuthService.logout()}
              title="Sign Out"
              className="p-1.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
