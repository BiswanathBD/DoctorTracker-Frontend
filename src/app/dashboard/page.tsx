'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Logo } from '@/components/common/Logo';
import { AuthService, type AdminUser } from '@/server/auth.service';
import {
  Users,
  Stethoscope,
  LogOut,
  Activity,
  TrendingUp,
  Building2,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    if (typeof window !== 'undefined') {
      return AuthService.getUser();
    }
    return null;
  });

  useEffect(() => {
    let isMounted = true;
    AuthService.getProfile()
      .then((user) => {
        if (isMounted) setAdmin(user);
      })
      .catch((err) => {
        console.error('failed to fetch admin profile:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    AuthService.logout();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* top navbar */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="sm" />

          {/* navigation links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/dashboard"
              className="px-3 py-1.5 rounded-lg text-sm font-semibold text-sky-700 bg-sky-50 dark:bg-sky-950/50 dark:text-sky-300"
            >
              Dashboard
            </Link>
            <Link
              href="/doctors"
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              Doctors
            </Link>
            <Link
              href="/patients"
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              Patients
            </Link>
          </nav>

          {/* admin profile & logout */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              {admin?.avatar?.url ? (
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                  <Image
                    src={admin.avatar.url}
                    alt={admin.name}
                    fill
                    sizes="32px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-sky-500 to-teal-500 text-white font-bold text-xs flex items-center justify-center uppercase">
                  {admin?.name?.charAt(0) || 'A'}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-900 dark:text-white leading-none">
                  {admin?.name || 'Administrator'}
                </p>
                <p className="text-[10px] text-slate-500 uppercase font-medium mt-0.5">
                  {admin?.role || 'admin'}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* main content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* welcome banner */}
        <div className="rounded-3xl p-6 sm:p-8 bg-linear-to-r from-sky-600 via-sky-700 to-teal-700 text-white shadow-xl shadow-sky-600/15 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-medium">
              <Activity className="w-3.5 h-3.5 text-teal-300" />
              <span>Real-Time Healthcare Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {admin?.name || 'Admin'}! 👋
            </h1>
            <p className="text-sm text-sky-100 font-normal">
              Manage all registered doctors, track patient assignments, and monitor real-time hospital statistics.
            </p>
          </div>
        </div>

        {/* quick metric stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* total doctors */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Doctors</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">--</p>
              <span className="text-[11px] text-emerald-600 font-medium inline-flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> Ready to load
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
              <Stethoscope className="w-6 h-6" />
            </div>
          </div>

          {/* total patients */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Patients</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">--</p>
              <span className="text-[11px] text-emerald-600 font-medium inline-flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> Ready to load
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* avg patients / doctor */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Patients per Doctor</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">--</p>
              <span className="text-[11px] text-slate-400 font-medium mt-1 block">Optimal load</span>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Activity className="w-6 h-6" />
            </div>
          </div>

          {/* hospitals */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Hospitals</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">--</p>
              <span className="text-[11px] text-slate-400 font-medium mt-1 block">Active networks</span>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* quick navigation cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/doctors"
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-800 shadow-sm hover:shadow-md transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 group-hover:scale-110 transition-transform">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Doctor Management</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  View, search, filter, and assign patients to specialized doctors.
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-sky-600 transition-all" />
          </Link>

          <Link
            href="/patients"
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-800 shadow-sm hover:shadow-md transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Patient Management</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Track medical conditions, admission dates, and manage patient records.
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-teal-600 transition-all" />
          </Link>
        </div>
      </main>
    </div>
  );
}
