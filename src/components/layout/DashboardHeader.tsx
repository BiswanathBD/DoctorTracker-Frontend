'use client';

import React, { useSyncExternalStore } from 'react';
import Image from 'next/image';
import { Menu, Search, Moon, Sun, User, ChevronDown } from 'lucide-react';
import { type AdminUser } from '@/server/auth.service';
import { Logo } from '@/components/common/Logo';

interface DashboardHeaderProps {
  onMenuToggle: () => void;
  onProfileToggle: () => void;
  isProfileOpen: boolean;
  admin: AdminUser | null;
}

// theme store for hydration-safe external subscription
let themeListeners: Array<() => void> = [];

const subscribeTheme = (callback: () => void) => {
  themeListeners.push(callback);
  return () => {
    themeListeners = themeListeners.filter((l) => l !== callback);
  };
};

const getThemeSnapshot = (): boolean => {
  if (typeof window === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
};

const getThemeServerSnapshot = (): boolean => false;

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onMenuToggle,
  onProfileToggle,
  isProfileOpen,
  admin,
}) => {
  const isDark = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeServerSnapshot);

  // toggle theme
  const handleThemeToggle = () => {
    const root = document.documentElement;
    const nextDark = !root.classList.contains('dark');
    if (nextDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    themeListeners.forEach((l) => l());
  };

  return (
    <header className="sticky top-3 z-10 w-full rounded-3xl bg-card/80 backdrop-blur-xl border border-border/80 shadow-lg shadow-black/5 py-2 px-3 flex items-center justify-between transition-all">
      {/* brand & mobile toggle */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted lg:hidden cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center">
          <Logo size="md" />
        </div>
      </div>

      {/* search & profile */}
      <div className="flex items-center justify-end gap-2 sm:gap-3 grow">
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search doctors, patients, conditions..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-2xl border border-input bg-muted/40 text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-card focus:ring-4 focus:ring-ring/15 outline-none transition-all"
            />
          </div>
        </div>

        {/* theme toggle */}
        <button
          type="button"
          onClick={handleThemeToggle}
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          title="Toggle Light / Dark mode"
        >
          {isDark ? <Sun className="w-4 h-4 text-warning" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="h-6 w-px bg-border mx-1 hidden sm:block" />

        {/* profile trigger */}
        <button
          type="button"
          onClick={onProfileToggle}
          className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-2xl border transition-all cursor-pointer bg-linear-to-br from-primary to-primary-hover text-primary-foreground border-border shadow-md"
        >
          {admin?.avatar?.url ? (
            <div className="relative w-8 h-8 rounded-xl overflow-hidden border-2 border-border shrink-0">
              <Image
                src={admin.avatar.url}
                alt={admin.name || 'Admin'}
                fill
                sizes="28px"
                className="object-cover"
              />
            </div>
          ) : (
            <div
              className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center uppercase shrink-0 ${
                isProfileOpen
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-gradient-to-br from-primary to-secondary text-primary-foreground'
              }`}
            >
              {admin?.name?.charAt(0) || <User className="w-3.5 h-3.5" />}
            </div>
          )}

          <div className="hidden sm:flex flex-col items-start text-left">
            <span className="text-sm font-bold leading-tight truncate max-w-25">
              {admin?.name || 'Profile'}
            </span>
            <span className="text-xs leading-tight truncate max-w-25">{admin?.role}</span>
          </div>

          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${isProfileOpen && 'rotate-180'}`}
          />
        </button>
      </div>
    </header>
  );
};
