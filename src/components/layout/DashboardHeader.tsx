'use client';

import React, { useSyncExternalStore } from 'react';
import Image from 'next/image';
import { Menu, Search, Bell, Moon, Sun } from 'lucide-react';
import { type AdminUser } from '@/server/auth.service';

interface DashboardHeaderProps {
  onMenuToggle: () => void;
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

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onMenuToggle, admin }) => {
  const isDark = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeServerSnapshot);

  // toggle theme and notify listeners
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
    <header className="sticky top-0 z-30 h-16 w-full bg-card/85 backdrop-blur-md border-b border-border px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-colors">
      {/* left: mobile menu toggle & search input */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-md">
        <button
          type="button"
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted lg:hidden cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* search input */}
        <div className="relative w-full max-w-xs hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search doctors, patients..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-ring/15 outline-none transition-all"
          />
        </div>
      </div>

      {/* right: actions & admin badge */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* theme toggle button */}
        <button
          type="button"
          onClick={handleThemeToggle}
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          title="Toggle Light / Dark mode"
        >
          {isDark ? <Sun className="w-4 h-4 text-warning" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* notifications button */}
        <button
          type="button"
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors relative cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full animate-pulse" />
        </button>

        {/* divider */}
        <div className="h-6 w-px bg-border mx-1 hidden sm:block" />

        {/* admin avatar pill */}
        <div className="flex items-center gap-2 pl-1">
          {admin?.avatar?.url ? (
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border flex-shrink-0">
              <Image
                src={admin.avatar.url}
                alt={admin.name}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground font-bold text-xs flex items-center justify-center uppercase">
              {admin?.name?.charAt(0) || 'A'}
            </div>
          )}
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-foreground leading-none">
              {admin?.name || 'Administrator'}
            </p>
            <p className="text-[10px] text-muted-foreground uppercase font-semibold mt-0.5">
              {admin?.role || 'admin'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
