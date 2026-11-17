'use client';

import React, { useState, useRef, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import { Button, Card, Badge, toast, PageHeader } from '@/components/ui';
import {
  AuthService,
  subscribeAuth,
  getAuthSnapshot,
  getAuthServerSnapshot,
} from '@/server/auth.service';
import {
  Shield,
  Camera,
  LogOut,
  UploadCloud,
  Lock
} from 'lucide-react';

export default function ProfilePage() {
  const admin = useSyncExternalStore(subscribeAuth, getAuthSnapshot, getAuthServerSnapshot);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // handle avatar upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file', 'Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    try {
      setUploading(true);
      await AuthService.updateAvatar(file);
      toast.success('Avatar Updated', 'Your profile picture has been uploaded to Cloudinary.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'failed to upload avatar';
      toast.error('Upload Failed', msg);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-7 mx-auto">
      {/* header */}
      <MotionWrapper direction="up">
        <PageHeader
          icon={<Shield size={42} strokeWidth={1.2} />}
          title="Settings & Admin Profile"
          subtitle="Manage your administrative credentials, Cloudinary avatar, and security preferences."
          badge={
            <Badge variant="primary" className="text-xs">
              System Admin
            </Badge>
          }
        />
      </MotionWrapper>

      {/* admin profile card */}
      <MotionWrapper delay={0.1} direction="up">
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* avatar with upload trigger */}
            <div className="relative group">
              {admin?.avatar?.url ? (
                <div className="relative w-24 h-24 rounded-3xl overflow-hidden border-2 border-primary/25 shadow-xl">
                  <Image
                    src={admin.avatar.url}
                    alt={admin.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-secondary text-primary-foreground font-extrabold text-3xl flex items-center justify-center uppercase shadow-xl">
                  {admin?.name?.charAt(0) || 'A'}
                </div>
              )}

              {/* hidden input & overlay button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute inset-0 rounded-3xl bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:opacity-50"
              >
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold">
                  {uploading ? 'Uploading...' : 'Change'}
                </span>
              </button>
            </div>

            {/* info details */}
            <div className="space-y-2 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-extrabold text-foreground tracking-tight">
                    {admin?.name || 'Super Admin'}
                  </h2>
                  <p className="text-xs text-muted-foreground">{admin?.email || 'admin@doctortracker.com'}</p>
                </div>
                <Badge variant="success" className="self-center sm:self-auto font-bold uppercase text-[11px]">
                  <Shield className="w-3.5 h-3.5 mr-1" />
                  {admin?.role || 'admin'} Privileges
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                Full administrative access to all doctors, patient health records, hospital allocations, and real-time MongoDB analytics.
              </p>

              <div className="pt-2 flex items-center gap-3 justify-center sm:justify-start">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<UploadCloud className="w-3.5 h-3.5" />}
                  loading={uploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload New Photo
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  leftIcon={<LogOut className="w-3.5 h-3.5" />}
                  onClick={() => AuthService.logout()}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </MotionWrapper>

      {/* credentials & security section */}
      <MotionWrapper delay={0.2} direction="up">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm text-foreground">Security & System Configuration</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-1">
              <p className="font-semibold text-muted-foreground">Authentication Protocol</p>
              <p className="font-bold text-foreground">JWT (HMAC-SHA256) & Bcrypt (12 rounds)</p>
              <p className="text-[11px] text-muted-foreground">Session expires in 7 days</p>
            </div>

            <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-1">
              <p className="font-semibold text-muted-foreground">Cloud Storage Provider</p>
              <p className="font-bold text-foreground">Cloudinary v2 (Secure Auto-Cleanup)</p>
              <p className="text-[11px] text-muted-foreground">Previous avatars automatically deleted on replace</p>
            </div>
          </div>
        </Card>
      </MotionWrapper>
    </div>
  );
}
