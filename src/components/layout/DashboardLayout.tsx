'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';
import { ProfileCard } from './ProfileCard';
import { Container } from '@/components/ui';
import {
  AuthService,
  subscribeAuth,
  getAuthSnapshot,
  getAuthServerSnapshot,
} from '@/server/auth.service';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const admin = useSyncExternalStore(subscribeAuth, getAuthSnapshot, getAuthServerSnapshot);

  useEffect(() => {
    AuthService.getProfile().catch((err) => {
      console.error('failed to fetch admin profile in layout:', err);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-x-clip">
      {/* background glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-150 h-150 rounded-full bg-primary/12 blur-[140px]" />
        <div className="absolute top-10 -right-32 w-150 h-150 rounded-full bg-secondary/12 blur-[150px]" />
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-175 h-175 rounded-full bg-primary/5 blur-[180px]" />
        <div className="absolute -bottom-40 left-1/4 w-162.5 h-162.5 rounded-full bg-secondary/8 blur-[160px]" />
      </div>

      {/* header */}
      <div className="sticky top-0 z-40 w-full pt-3 pb-2">
        <Container size="2xl">
          <DashboardHeader
            onMenuToggle={() => setSidebarOpen((prev) => !prev)}
            onProfileToggle={() => setProfileOpen((prev) => !prev)}
            isProfileOpen={profileOpen}
            admin={admin}
          />
        </Container>
      </div>

      {/* main content */}
      <div className="relative z-10 flex-1 w-full flex flex-col py-3">
        <Container size="2xl" className="flex-1 flex gap-6 items-start">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            admin={admin}
          />

          <motion.main
            layout
            initial={false}
            animate={{
              scale: profileOpen ? 0.985 : 1,
              transition: {
                type: 'spring',
                stiffness: 280,
                damping: 30,
                mass: 0.8,
              },
            }}
            style={{ originX: 0, originY: 0 }}
            className="flex-1 min-w-0 space-y-8"
          >
            {children}
          </motion.main>

          <ProfileCard
            isOpen={profileOpen}
            onClose={() => setProfileOpen(false)}
            admin={admin}
          />
        </Container>
      </div>
    </div>
  );
};
