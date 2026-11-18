'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { PageHeader } from '@/components/ui';
import { SignOutModal } from '@/components/modals/SignOutModal';
import {
  AuthService,
  subscribeAuth,
  getAuthSnapshot,
  getAuthServerSnapshot,
} from '@/server/auth.service';
import { Shield } from 'lucide-react';
import { ProfileHeroCard } from '@/components/profile/ProfileHeroCard';
import { AccountCredentialsCard } from '@/components/profile/AccountCredentialsCard';
import { SecurityProtocolsCard } from '@/components/profile/SecurityProtocolsCard';
import { CloudInfrastructureCard } from '@/components/profile/CloudInfrastructureCard';
import { ProfileFooter } from '@/components/profile/ProfileFooter';

export default function ProfilePage() {
  const admin = useSyncExternalStore(subscribeAuth, getAuthSnapshot, getAuthServerSnapshot);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  // refresh admin profile from backend on mount
  useEffect(() => {
    AuthService.getProfile().catch((err) => {
      console.warn('unable to re-sync admin profile:', err);
    });
  }, []);

  return (
    <div className="w-full max-w-6xl space-y-6 mx-auto pb-10">
      {/* page header */}
      <PageHeader
        icon={<Shield size={42} strokeWidth={1.2} />}
        title="Admin Profile & Settings"
        subtitle="Manage administrative identity, authentication parameters, Cloudinary media storage, and infrastructure security."
      />

      {/* side by side layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* left column: profile identity hero card */}
        <div className="lg:col-span-4 lg:sticky lg:top-22">
          <ProfileHeroCard
            admin={admin}
            onSignOut={() => setIsSignOutModalOpen(true)}
          />
        </div>

        {/* right column: settings, security & infrastructure details */}
        <div className="lg:col-span-8 space-y-6">
          <AccountCredentialsCard admin={admin} />
          <SecurityProtocolsCard />
          <CloudInfrastructureCard />
        </div>
      </div>

      {/* copyright footer */}
      <ProfileFooter />

      {/* modal: sign out confirmation */}
      <SignOutModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={() => AuthService.logout()}
      />
    </div>
  );
}
