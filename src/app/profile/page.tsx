'use client';

import React, { useState, useRef, useEffect, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import { Button, Card, Badge, toast, PageHeader } from '@/components/ui';
import { SignOutModal } from '@/components/modals/SignOutModal';
import {
  AuthService,
  subscribeAuth,
  getAuthSnapshot,
  getAuthServerSnapshot,
} from '@/server/auth.service';
import { DashboardService, type DashboardStats } from '@/server/dashboard.service';
import {
  Shield,
  Camera,
  LogOut,
  UploadCloud,
  Lock,
  Stethoscope,
  Users,
  Building2,
  CheckCircle2,
  Copy,
  Server,
  Database,
  Cloud,
  KeyRound,
  Loader2,
  Sparkles,
} from 'lucide-react';

export default function ProfilePage() {
  const admin = useSyncExternalStore(subscribeAuth, getAuthSnapshot, getAuthServerSnapshot);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats['overview'] | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // refresh admin profile and fetch system telemetry
  useEffect(() => {
    let isMounted = true;

    // refresh profile from backend
    AuthService.getProfile().catch((err) => {
      console.warn('Unable to re-sync admin profile:', err);
    });

    // fetch dashboard stats for telemetry cards
    DashboardService.getStats()
      .then((res) => {
        if (!isMounted) return;
        setStats(res.overview);
      })
      .catch((err) => {
        console.warn('Unable to fetch system telemetry:', err);
      })
      .finally(() => {
        if (isMounted) setLoadingStats(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // handle avatar upload to Cloudinary
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

  // copy admin email or ID to clipboard
  const handleCopyId = () => {
    if (!admin?.id && !admin?.email) return;
    const textToCopy = admin?.email || admin?.id || '';
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success('Copied to Clipboard', textToCopy);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl space-y-8 mx-auto">
      {/* page header */}
      <PageHeader
        icon={<Shield size={42} strokeWidth={1.2} />}
        title="Admin Profile & System Settings"
        subtitle="Manage administrative credentials, Cloudinary media storage, security controls, and system telemetry."
        actions={
          <Button
            variant="destructive"
            size="md"
            onClick={() => setIsSignOutModalOpen(true)}
            leftIcon={<LogOut className="w-4 h-4" />}
            className="cursor-pointer rounded-full"
          >
            Sign Out
          </Button>
        }
      />

      {/* hero admin profile card */}
      <MotionWrapper delay={0.1} direction="up">
        <Card className="relative overflow-hidden p-6 sm:p-8 space-y-6">
          {/* subtle decorative background elements */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-secondary/15 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#808080_1px,transparent_1px)] opacity-[0.06] bg-size-[20px_20px]" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* profile avatar with upload overlay */}
            <div className="relative group shrink-0">
              {admin?.avatar?.url ? (
                <div className="relative w-28 h-28 rounded-3xl overflow-hidden border-2 border-primary/30 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={admin.avatar.url}
                    alt={admin.name || 'Admin'}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-primary via-primary/80 to-secondary text-primary-foreground font-black text-4xl flex items-center justify-center uppercase shadow-2xl border-2 border-primary/30 group-hover:scale-105 transition-transform duration-300">
                  {admin?.name?.charAt(0) || 'A'}
                </div>
              )}

              {/* hidden file input & hover overlay button */}
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
                className="absolute inset-0 rounded-3xl bg-black/60 backdrop-blur-[1px] text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:opacity-50"
                title="Change profile photo"
              >
                {uploading ? (
                  <Loader2 className="w-6 h-6 animate-spin mb-1 text-primary-foreground" />
                ) : (
                  <Camera className="w-6 h-6 mb-1 text-primary-foreground" />
                )}
                <span className="text-[10px] font-bold">
                  {uploading ? 'Uploading...' : 'Update Photo'}
                </span>
              </button>
            </div>

            {/* admin details & status */}
            <div className="space-y-3 flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                    <h2 className="text-2xl font-black text-foreground tracking-tight truncate">
                      {admin?.name || 'System Administrator'}
                    </h2>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-success/10 text-success text-[11px] font-bold">
                      <span className="w-2 h-2 rounded-full bg-success animate-pulse inline-block" />
                      Active Session
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center justify-center sm:justify-start gap-1.5 font-mono">
                    <span>{admin?.email || 'admin@doctortracker.com'}</span>
                    <button
                      type="button"
                      onClick={handleCopyId}
                      className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
                      title="Copy email"
                    >
                      {copied ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </p>
                </div>

                <Badge
                  variant="primary"
                  className="self-center sm:self-auto font-black uppercase text-[11px] px-3 py-1 shadow-sm"
                >
                  <Shield className="w-3.5 h-3.5 mr-1" />
                  {admin?.role || 'admin'} Privileges
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Full administrative authority over clinical personnel, patient records, hospital rosters,
                and real-time analytics for the <strong>Doctor Tracker</strong> platform.
              </p>

              {/* quick actions buttons */}
              <div className="pt-2 flex items-center gap-3 justify-center sm:justify-start flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<UploadCloud className="w-3.5 h-3.5 text-primary" />}
                  loading={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full text-xs font-semibold cursor-pointer"
                >
                  Change Profile Photo
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSignOutModalOpen(true)}
                  leftIcon={<LogOut className="w-3.5 h-3.5 text-destructive" />}
                  className="rounded-full text-xs font-semibold text-destructive hover:bg-destructive/10 cursor-pointer"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </MotionWrapper>

      {/* live system telemetry statistics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* card 1: total doctors */}
        <MotionWrapper delay={0.15} direction="up">
          <Card className="p-4 rounded-3xl border border-border/80 hover:border-primary/50 transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Doctors
              </span>
              <div className="w-7 h-7 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Stethoscope className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-2xl font-black text-foreground">
                {loadingStats ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : stats?.totalDoctors ?? '—'}
              </p>
              <p className="text-[10px] text-muted-foreground">Registered specialists</p>
            </div>
          </Card>
        </MotionWrapper>

        {/* card 2: total patients */}
        <MotionWrapper delay={0.2} direction="up">
          <Card className="p-4 rounded-3xl border border-border/80 hover:border-secondary/50 transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Patients
              </span>
              <div className="w-7 h-7 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                <Users className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-2xl font-black text-foreground">
                {loadingStats ? <Loader2 className="w-5 h-5 animate-spin text-secondary" /> : stats?.totalPatients ?? '—'}
              </p>
              <p className="text-[10px] text-muted-foreground">Admitted in-patients</p>
            </div>
          </Card>
        </MotionWrapper>

        {/* card 3: total hospitals */}
        <MotionWrapper delay={0.25} direction="up">
          <Card className="p-4 rounded-3xl border border-border/80 hover:border-primary/50 transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Hospitals
              </span>
              <div className="w-7 h-7 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Building2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-2xl font-black text-foreground">
                {loadingStats ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : stats?.totalHospitals ?? '—'}
              </p>
              <p className="text-[10px] text-muted-foreground">Partner clinical centers</p>
            </div>
          </Card>
        </MotionWrapper>

        {/* card 4: cloud storage */}
        <MotionWrapper delay={0.3} direction="up">
          <Card className="p-4 rounded-3xl border border-border/80 hover:border-success/50 transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Cloudinary CDN
              </span>
              <div className="w-7 h-7 rounded-xl bg-success/10 text-success flex items-center justify-center">
                <Cloud className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-lg font-black text-success flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Operational
              </p>
              <p className="text-[10px] text-muted-foreground">Auto-clean media cloud</p>
            </div>
          </Card>
        </MotionWrapper>
      </div>

      {/* detailed administrative panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* security & authentication protocol */}
        <MotionWrapper delay={0.35} direction="up">
          <Card className="p-6 space-y-5 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/70">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">Security & Encryption</h3>
                  <p className="text-[11px] text-muted-foreground">Core security parameters and protocols</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/70 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <KeyRound className="w-3 h-3 text-primary" />
                    Authentication Protocol
                  </span>
                  <p className="font-bold text-foreground">JSON Web Tokens (JWT)</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Signed with HMAC-SHA256. Cookies are configured with 7-day expiration and strict bearer protection.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/70 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Shield className="w-3 h-3 text-success" />
                    Password Hash Engine
                  </span>
                  <p className="font-bold text-foreground">Bcrypt (Salt Rounds: 12)</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Zero plaintext password persistence with salted cryptographic hashing.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border/70 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Token Session: <strong>7 Days Active</strong></span>
              <span className="text-success font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
                Protected Route
              </span>
            </div>
          </Card>
        </MotionWrapper>

        {/* cloud architecture & database telemetry */}
        <MotionWrapper delay={0.4} direction="up">
          <Card className="p-6 space-y-5 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/70">
                <div className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">System Infrastructure</h3>
                  <p className="text-[11px] text-muted-foreground">Backend cluster and media pipeline</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/70 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Database className="w-3 h-3 text-secondary" />
                    Database Cluster
                  </span>
                  <p className="font-bold text-foreground">MongoDB Aggregation Engine</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Full text search indices, dynamic pagination pipelines, and foreign key population across doctors and patients.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/70 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Cloud className="w-3 h-3 text-primary" />
                    Asset Optimization
                  </span>
                  <p className="font-bold text-foreground">Cloudinary v2 Storage</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Automated avatar uploads with automatic orphan cleanup to eliminate unused image assets.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border/70 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Stack: <strong>Next.js 16 + Express + Node.js</strong></span>
              <span className="text-primary font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                RESTful API
              </span>
            </div>
          </Card>
        </MotionWrapper>
      </div>

      {/* administrator account reference info card */}
      <MotionWrapper delay={0.45} direction="up">
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-sm text-foreground">Account Identification & Access Scope</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-semibold">
              Root Level
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
            <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/60 space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Assigned Role</p>
              <p className="font-bold text-foreground capitalize">{admin?.role || 'Administrator'}</p>
              <p className="text-[10px] text-muted-foreground">Global read/write/delete permissions</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/60 space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Unique Identifier</p>
              <p className="font-mono font-bold text-foreground truncate">
                {admin?.id ? `#${admin.id.slice(-8).toUpperCase()}` : '#ADM-ROOT'}
              </p>
              <p className="text-[10px] text-muted-foreground">Verified system admin key</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/60 space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Platform</p>
              <p className="font-bold text-foreground">Doctor Tracker</p>
              <p className="text-[10px] text-muted-foreground">Clinical & Specialist Directory</p>
            </div>
          </div>
        </Card>
      </MotionWrapper>

      {/* modal: sign out confirmation */}
      <SignOutModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={() => AuthService.logout()}
      />
    </div>
  );
}
