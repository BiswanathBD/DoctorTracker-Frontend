'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';
import {
  AuthService,
  subscribeAuth,
  getAuthSnapshot,
  getAuthServerSnapshot,
} from '@/server/auth.service';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const admin = useSyncExternalStore(subscribeAuth, getAuthSnapshot, getAuthServerSnapshot);

  useEffect(() => {
    AuthService.getProfile().catch((err) => {
      console.error('failed to fetch admin profile in layout:', err);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* sidebar navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        admin={admin}
      />

      {/* main content column with full width */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all">
        {/* sticky top header */}
        <DashboardHeader
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
          admin={admin}
        />

        {/* full width main content area without restricted container */}
        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
};
