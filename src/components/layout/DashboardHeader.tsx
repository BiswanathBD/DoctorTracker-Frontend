'use client';

import React, { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Menu, Moon, Sun, ShieldCheck, ChevronDown, ChevronLeft } from 'lucide-react';
import { type AdminUser } from '@/server/auth.service';
import { type DoctorSearchItem, type PatientSearchItem } from '@/server/search.service';
import { Logo } from '@/components/common/Logo';
import { Motion } from '@/components/common/MotionWrapper';
import { NavbarGlobalSearch } from './NavbarGlobalSearch';

interface DashboardHeaderProps {
  onMenuToggle: () => void;
  onProfileToggle: () => void;
  isProfileOpen: boolean;
  admin: AdminUser | null;
  onSelectDoctor?: (doctor: DoctorSearchItem) => void;
  onSelectPatient?: (patient: PatientSearchItem) => void;
}

const emptySubscribe = () => () => {};

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onMenuToggle,
  onProfileToggle,
  isProfileOpen,
  admin,
  onSelectDoctor,
  onSelectPatient,
}) => {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const brandRef = useRef<HTMLDivElement>(null);
  const [slantOffset, setSlantOffset] = useState<number>(240);

  const isDark = mounted ? resolvedTheme === 'dark' : false;

  // measure brand section width dynamically to ensure angled gradient never overlaps logo
  useEffect(() => {
    if (!brandRef.current) return;
    const updateSlant = () => {
      if (brandRef.current) {
        setSlantOffset(brandRef.current.offsetWidth + 10);
      }
    };
    updateSlant();
    const observer = new ResizeObserver(updateSlant);
    observer.observe(brandRef.current);
    window.addEventListener('resize', updateSlant);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSlant);
    };
  }, []);

  // toggle theme using next-themes
  const handleThemeToggle = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Motion
      id="dashboard-main-header"
      animationType="fadeDown"
      duration={0.35}
      className="w-full"
    >
      <header className="w-full rounded-3xl bg-card shadow-xl shadow-black/5 dark:shadow-primary/5 p-2.5 sm:p-3 md:py-2.5 md:px-3 flex flex-col md:flex-row md:items-center justify-between gap-2.5 md:gap-0 transition-all relative">
        {/* background wrapper with rounded-3xl & overflow-hidden so angled gradient conforms to header radius */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-0">
          {/* stylish angled gradient background covering right portion with \ slant cut (desktop only) */}
          <div
            style={{
              left: `${slantOffset}px`,
              clipPath: 'polygon(36px 0%, 100% 0%, 100% 100%, 0% 100%)',
            }}
            className="hidden md:block absolute inset-y-0 right-0 bg-linear-to-r from-primary via-primary-hover to-secondary pointer-events-none transition-all duration-200"
          />

          {/* subtle highlight sheen on the angled edge (desktop only) */}
          <div
            style={{
              left: `${slantOffset}px`,
              clipPath: 'polygon(36px 0%, 38px 0%, 2px 100%, 0% 100%)',
            }}
            className="hidden md:block absolute inset-y-0 w-10 bg-primary-foreground/20 pointer-events-none transition-all duration-200"
          />
        </div>

        {/* top row on < md / left section on md+ */}
        <div
          ref={brandRef}
          className="relative z-10 flex items-center justify-between w-full md:w-auto shrink-0"
        >
          {/* brand and menu button */}
          <div className="flex items-center gap-2 sm:gap-3 py-0.5 pr-2 md:pr-4">
            <button
              type="button"
              onClick={onMenuToggle}
              className="p-2 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-muted/80 lg:hidden cursor-pointer transition-colors"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center">
              <Logo size="md" />
            </div>
          </div>

          {/* mobile controls (Theme toggle + Profile button) */}
          <div className="flex items-center gap-1.5 md:hidden">
            {/* theme toggle */}
            <button
              type="button"
              onClick={handleThemeToggle}
              className="p-2 rounded-xl border border-primary/20 bg-linear-to-br from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 text-primary transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
              aria-label="Toggle color theme"
            >
              {isDark ? (
                <Sun className="w-4.5 h-4.5 text-warning" strokeWidth={1.5} />
              ) : (
                <Moon className="w-4.5 h-4.5 text-primary" strokeWidth={1.5} />
              )}
            </button>

            {/* profile trigger (< sm: short shape; sm+: full view profile pill) */}
            <button
              type="button"
              onClick={onProfileToggle}
              className={`flex items-center gap-2 p-1.5 sm:pr-3 rounded-2xl border transition-all cursor-pointer shadow-2xs active:scale-95 ${
                isProfileOpen
                  ? 'bg-linear-to-r from-primary via-primary-hover to-secondary text-primary-foreground border-transparent shadow-md ring-2 ring-primary/20'
                  : 'bg-linear-to-br from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 text-foreground border-primary/20'
              }`}
              aria-label="Toggle user profile"
            >
              <div className="relative shrink-0">
                {admin?.avatar?.url ? (
                  <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-xl overflow-hidden border border-primary/30 shadow-2xs">
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
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shadow-2xs ${
                      isProfileOpen
                        ? 'bg-primary-foreground/20 text-primary-foreground'
                        : 'bg-primary/15 text-primary'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-card bg-success" />
              </div>

              {/* sm+ full view profile pill (hidden on < sm, visible on sm to md-) */}
              <div className="hidden sm:flex flex-col items-start text-left min-w-0">
                <span
                  className={`text-xs sm:text-sm font-semibold truncate max-w-28 sm:max-w-36 ${
                    isProfileOpen ? 'text-primary-foreground' : 'text-foreground'
                  }`}
                >
                  {admin?.name || 'Super Admin'}
                </span>
                <span
                  className={`text-[10px] sm:text-xs truncate max-w-28 sm:max-w-36 font-medium ${
                    isProfileOpen ? 'text-primary-foreground/80' : 'text-muted-foreground'
                  }`}
                >
                  {admin?.role || 'Administrator'}
                </span>
              </div>

              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-250 shrink-0 ${
                  isProfileOpen ? 'rotate-180 text-primary-foreground' : 'text-muted-foreground'
                }`}
              />
            </button>
          </div>
        </div>

        {/* mobile row 2: search bar */}
        <div className="relative z-10 w-full md:hidden">
          <NavbarGlobalSearch
            variant="mobile"
            onSelectDoctor={onSelectDoctor || (() => {})}
            onSelectPatient={onSelectPatient || (() => {})}
          />
        </div>

        {/* md+ one line all: search, theme toggle, and profile over angled gradient */}
        <div className="relative z-10 hidden md:flex items-center justify-end gap-2 sm:gap-3 grow min-w-0 pl-10 lg:pl-12">
          {/* command-style search input styled for gradient background */}
          <div className="flex-1 max-w-xs lg:max-w-md mx-2 sm:mx-4 relative z-20">
            <NavbarGlobalSearch
              variant="desktop"
              onSelectDoctor={onSelectDoctor || (() => {})}
              onSelectPatient={onSelectPatient || (() => {})}
            />
          </div>

          {/* theme toggle pill over gradient */}
          <button
            type="button"
            onClick={handleThemeToggle}
            className="p-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/15 hover:bg-primary-foreground/25 backdrop-blur-md text-primary-foreground transition-all cursor-pointer shadow-xs active:scale-95"
            aria-label="Toggle color theme"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-warning" strokeWidth={1.5} />
            ) : (
              <Moon className="w-5 h-5 text-primary-foreground" strokeWidth={1.5} />
            )}
          </button>

          <div className="h-6 w-px bg-primary-foreground/25 mx-0.5" />

          {/* profile trigger button (md+: short shape like sm-; lg+: full shape with name & role) */}
          <button
            type="button"
            onClick={onProfileToggle}
            className={`flex items-center gap-2.5 p-1.5 lg:pr-3 rounded-2xl border transition-all cursor-pointer shadow-sm active:scale-98 ${
              isProfileOpen
                ? 'bg-card text-card-foreground border-card shadow-md'
                : 'bg-primary-foreground/15 hover:bg-primary-foreground/25 backdrop-blur-md text-primary-foreground border-primary-foreground/25'
            }`}
            aria-label="Toggle user profile"
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
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 ${
                  isProfileOpen ? 'border-card bg-success' : 'border-primary bg-success'
                }`}
              />
            </div>

            {/* md+: short shape (hidden on md to lg-); lg+: full shape (visible on lg+) */}
            <div className="hidden lg:flex flex-col items-start text-left min-w-0">
              <span
                className={`text-xs font-semibold truncate max-w-24 lg:max-w-28 ${
                  isProfileOpen ? 'text-card-foreground' : 'text-primary-foreground'
                }`}
              >
                {admin?.name || 'Super Admin'}
              </span>
              <span
                className={`text-[10px] truncate max-w-24 lg:max-w-28 ${
                  isProfileOpen ? 'text-muted-foreground' : 'text-primary-foreground/80'
                }`}
              >
                {admin?.email || 'Administrator'}
              </span>
            </div>

            <ChevronLeft
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
