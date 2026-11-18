'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AuthService, type AdminUser } from '@/server/auth.service';
import { SideSheet, Badge, toast, PageHeader } from '@/components/ui';
import {
  LogOut,
  ShieldCheck,
  Settings,
  ChevronRight,
  Mail,
  Calendar,
  Clock,
  Lock,
  Copy,
  CheckCircle2,
} from 'lucide-react';

interface ProfileCardProps {
  isOpen: boolean;
  onClose: () => void;
  admin: AdminUser | null;
}

// format display date helper
const formatDate = (dateVal?: string | Date) => {
  if (!dateVal) return 'Recently';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return 'Recently';
  return d.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const ProfileCard: React.FC<ProfileCardProps> = ({ isOpen, onClose, admin }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // copy text to clipboard helper
  const handleCopyText = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success('Copied to Clipboard', text);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <SideSheet isOpen={isOpen} onClose={onClose} width="lg" className="p-0">
      {/* fixed header using PageHeader size="sm" */}
      <PageHeader
        size="sm"
        title="Administrative Profile"
        subtitle="System administrator dossier"
        icon={<ShieldCheck className="w-4 h-4 text-primary" />}
        onClose={onClose}
        className="shrink-0 px-6 py-4 border-b border-border/80 bg-card/90"
      />

      {/* scrollable body */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-5">
        {/* stylish hero identity card (following main profile card) */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary via-primary-hover to-secondary text-primary-foreground p-5 shadow-xl border border-primary-foreground/20 space-y-4">

          {/* absolute admin privilege pill on top right */}
          <div className="absolute top-4 right-4 z-20">
            <Badge variant="primary" className="bg-primary-foreground/20! text-primary-foreground border-primary-foreground/30 text-xs py-0.5 px-2.5 font-medium shadow-2xs backdrop-blur-xs">
              <ShieldCheck className="w-3 h-3 mr-1" />
              <span className="capitalize">{admin?.role || 'admin'}</span> Privileges
            </Badge>
          </div>

          {/* angled glowing light accents */}
          <div className="pointer-events-none absolute -top-16 -right-10 w-64 h-28 bg-primary-foreground/15 rotate-12 blur-xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-8 w-56 h-24 bg-primary-foreground/10 -rotate-12 blur-xl" />

          {/* watermark guard emblem */}
          <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 opacity-10">
            <ShieldCheck className="w-36 h-36 text-primary-foreground stroke-1" />
          </div>

          <div className="relative z-10 flex items-center gap-4 pr-32">
            <div className="relative shrink-0">
              {admin?.avatar?.url ? (
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary-foreground/40 shadow-lg shadow-black/10">
                  <Image
                    src={admin.avatar.url}
                    alt={admin.name || 'Admin'}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 text-primary-foreground flex items-center justify-center border-2 border-primary-foreground/40 shadow-lg backdrop-blur-sm">
                  <ShieldCheck className="w-8 h-8 text-primary-foreground" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <h3 className="font-semibold text-primary-foreground text-base tracking-tight truncate">
                {admin?.name || 'Super Admin'}
              </h3>

              <p className="text-xs text-primary-foreground/85 flex items-center gap-1.5 truncate font-medium">
                <Mail className="w-3.5 h-3.5 text-primary-foreground/90 shrink-0" />
                <span className="truncate">{admin?.email || 'admin@doctortracker.com'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* real & relevant account credentials and session details */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
            Account & Session Identity
          </p>

          {/* email pill with copy */}
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                  Verified Email
                </p>
                <p className="text-xs font-semibold text-foreground truncate">
                  {admin?.email || 'admin@doctortracker.com'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopyText(admin?.email || '', 'Email')}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0"
              title="Copy email"
            >
              {copiedField === 'Email' ? (
                <CheckCircle2 className="w-4 h-4 text-success" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* dates side-by-side */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* created at */}
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70 space-y-1 shadow-2xs">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                Account Created
              </span>
              <p className="font-semibold text-foreground truncate text-xs">
                {formatDate(admin?.createdAt)}
              </p>
            </div>

            {/* last updated */}
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70 space-y-1 shadow-2xs">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-secondary" />
                Last Updated
              </span>
              <p className="font-semibold text-foreground truncate text-xs">
                {formatDate(admin?.updatedAt || admin?.createdAt)}
              </p>
            </div>
          </div>

          {/* security & session protocol */}
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-xl bg-success/10 text-success flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                  Security Protocol
                </p>
                <p className="text-xs font-semibold text-foreground truncate">
                  JWT • 7-Day Session Lifespan
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-success flex items-center gap-1 bg-success/10 px-2.5 py-0.5 rounded-full border border-success/20 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-success" />
              Protected
            </span>
          </div>
        </div>

        {/* navigation & settings options */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
            Administrative Dossier
          </p>

          <Link
            href="/profile"
            onClick={onClose}
            className="p-3.5 rounded-2xl bg-card hover:bg-muted/50 border border-border/80 hover:border-primary/40 transition-all flex items-center justify-between group cursor-pointer shadow-xs gap-3"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary/15 to-secondary/15 border border-primary/25 flex items-center justify-center text-primary group-hover:scale-105 transition-transform shrink-0">
                <Settings className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  Full Profile & Settings
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium truncate">
                  Manage identity, media storage, & security
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </Link>
        </div>
      </div>

      {/* fixed footer with matching logout button on right */}
      <div className="shrink-0 p-5 border-t border-border/80 bg-card/90 flex items-center justify-between gap-3 text-left">
        <div className="space-y-0.5 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-destructive">
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Sign Out of Session</span>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            Clear token and end session.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            onClose();
            AuthService.logout();
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all font-semibold text-xs shadow-md shadow-destructive/25 cursor-pointer active:scale-95 shrink-0"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </SideSheet>
  );
};
