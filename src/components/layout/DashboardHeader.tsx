'use client';

import React, { useSyncExternalStore } from 'react';
import Image from 'next/image';
import { Menu, Search, Moon, Sun, User, ChevronDown, Command } from 'lucide-react';
import { type AdminUser } from '@/server/auth.service';
import { Logo } from '@/components/common/Logo';
import { Motion } from '@/components/common/MotionWrapper';

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
    <Motion
      id="dashboard-main-header"
      animationType="fadeDown"
      duration={0.35}
      className="w-full"
    >
      <header className="sticky top-3 z-10 w-full rounded-3xl bg-card border border-border/80 shadow-xl shadow-black/5 dark:shadow-primary/5 py-2.5 px-3 flex items-center justify-between transition-all overflow-hidden">
        {/* stylish angled gradient background covering right portion with \ slant cut */}
        <div
          style={{
            clipPath: 'polygon(36px 0%, 100% 0%, 100% 100%, 0% 100%)',
          }}
          className="absolute inset-y-0 right-0 left-44 sm:left-56 md:left-64 bg-linear-to-r from-primary via-primary-hover to-secondary pointer-events-none transition-all duration-300"
        />

        {/* subtle highlight sheen on the angled edge */}
        <div
          style={{
            clipPath: 'polygon(36px 0%, 38px 0%, 2px 100%, 0% 100%)',
          }}
          className="absolute inset-y-0 left-44 sm:left-56 md:left-64 w-10 bg-primary-foreground/20 pointer-events-none"
        />

        {/* brand on clean card background */}
        <div className="relative z-10 flex items-center gap-2.5 sm:gap-3 py-0.5 pr-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="p-2 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-muted/80 lg:hidden cursor-pointer transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center">
            <Logo size="md" />
          </div>
        </div>

        {/* search, theme toggle, and profile over angled gradient */}
        <div className="relative z-10 flex items-center justify-end gap-2 sm:gap-3 grow min-w-0">
          {/* command-style search input styled for gradient background */}
          <div className="flex-1 max-w-md mx-2 sm:mx-4 hidden md:block">
            <div className="relative w-full group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground group-focus-within:text-primary-foreground transition-colors z-1" />
              <input
                type="text"
                placeholder="Search specialists, patients, hospitals..."
                className="w-full pl-9.5 pr-14 py-2 text-xs rounded-2xl border border-primary-foreground/25 bg-primary-foreground/15 backdrop-blur-md text-primary-foreground placeholder:text-primary-foreground/75 focus:border-primary-foreground/60 focus:bg-primary-foreground/25 focus:ring-4 focus:ring-primary-foreground/15 outline-none transition-all shadow-xs"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg border border-primary-foreground/20 bg-primary-foreground/15 text-[10px] font-mono text-primary-foreground/80 select-none pointer-events-none shadow-xs">
                <Command className="w-2.5 h-2.5" />
                <span>K</span>
              </div>
            </div>
          </div>

          {/* theme toggle pill over gradient */}
          <button
            type="button"
            onClick={handleThemeToggle}
            className="p-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/15 hover:bg-primary-foreground/25 backdrop-blur-md text-primary-foreground transition-all cursor-pointer shadow-xs active:scale-95"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-warning" strokeWidth={1.5} />
            ) : (
              <Moon className="w-5 h-5 text-primary-foreground" strokeWidth={1.5} />
            )}
          </button>

          <div className="h-6 w-px bg-primary-foreground/25 mx-0.5 hidden sm:block" />

          {/* profile trigger button over gradient */}
          <button
            type="button"
            onClick={onProfileToggle}
            className={`flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl border transition-all cursor-pointer shadow-sm active:scale-98 ${
              isProfileOpen
                ? 'bg-card text-card-foreground border-card shadow-md'
                : 'bg-primary-foreground/15 hover:bg-primary-foreground/25 backdrop-blur-md text-primary-foreground border-primary-foreground/25'
            }`}
          >
            <div className="relative shrink-0">
              {admin?.avatar?.url ? (
                <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-primary-foreground/30 shadow-xs">
                  <Image
                    src={admin.avatar.url}
                    alt={admin.name || 'Admin'}
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-xs ${
                    isProfileOpen
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-primary-foreground/25 text-primary-foreground'
                  }`}
                >
                  <User className="w-4 h-4" />
                </div>
              )}
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 ${
                  isProfileOpen ? 'border-card bg-success' : 'border-primary bg-success'
                }`}
              />
            </div>

            <div className="hidden sm:flex flex-col items-start text-left min-w-0">
              <span
                className={`text-xs font-black leading-tight truncate max-w-28 ${
                  isProfileOpen ? 'text-card-foreground' : 'text-primary-foreground'
                }`}
              >
                {admin?.name || 'Super Admin'}
              </span>
              <span
                className={`text-[10px] leading-tight truncate max-w-28 font-medium mt-0.5 ${
                  isProfileOpen ? 'text-muted-foreground' : 'text-primary-foreground/80'
                }`}
              >
                {admin?.role || 'Administrator'}
              </span>
            </div>

            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-250 shrink-0 ${
                isProfileOpen ? 'rotate-180 text-card-foreground' : 'text-primary-foreground/80'
              }`}
            />
          </button>
        </div>
      </header>
    </Motion>
  );
};
