'use client';

import React, { useState } from 'react';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import { Card, toast } from '@/components/ui';
import { type AdminUser } from '@/server/auth.service';
import {
  User,
  Mail,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Copy,
} from 'lucide-react';

interface AccountCredentialsCardProps {
  admin: AdminUser | null;
}

export const AccountCredentialsCard: React.FC<AccountCredentialsCardProps> = ({ admin }) => {
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
    <MotionWrapper delay={0.15} direction="up">
      <Card className="relative overflow-hidden p-6 space-y-6 rounded-3xl bg-linear-to-br from-primary via-primary-hover to-secondary text-primary-foreground border border-primary-foreground/20 shadow-2xl shadow-primary/20">
        {/* sleek angled light beams (distinct from sidebar) */}
        <div className="pointer-events-none absolute -top-24 -right-12 w-96 h-36 bg-primary-foreground/15 rotate-12 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 w-80 h-32 bg-primary-foreground/10 -rotate-12 blur-2xl" />

        {/* card header */}
        <div className="relative z-10 flex items-center justify-between gap-3 pb-3 border-b border-primary-foreground/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-foreground/15 border border-primary-foreground/30 flex items-center justify-center text-primary-foreground shadow-xs">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-primary-foreground tracking-tight">Account Identity & Credentials</h3>
              <p className="text-xs text-primary-foreground/80 font-medium">Verified administrator attributes and access privileges</p>
            </div>
          </div>
        </div>

        {/* stylized frosted glass credential blocks */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* name block */}
          <div className="p-4 rounded-2xl bg-primary-foreground/12 backdrop-blur-md border border-primary-foreground/20 hover:bg-primary-foreground/18 transition-all space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/85 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Administrator Name
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-primary-foreground/20 text-primary-foreground font-bold">
                KEY-ADMIN
              </span>
            </div>
            <p className="font-semibold text-primary-foreground text-sm tracking-tight">{admin?.name || 'System Administrator'}</p>
            <p className="text-xs text-primary-foreground/75 font-medium">Primary identity bound to audit and action logs</p>
          </div>

          {/* email block */}
          <div className="p-4 rounded-2xl bg-primary-foreground/12 backdrop-blur-md border border-primary-foreground/20 hover:bg-primary-foreground/18 transition-all space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/85 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                Email Address
              </span>
              <button
                type="button"
                onClick={() => handleCopyText(admin?.email || '', 'Email')}
                className="text-primary-foreground/80 hover:text-primary-foreground text-xs font-mono flex items-center gap-1 px-1.5 py-0.5 rounded-md hover:bg-primary-foreground/20 transition-colors cursor-pointer"
                title="Copy email address"
              >
                {copiedField === 'Email' ? (
                  <CheckCircle2 className="w-3 h-3 text-accent" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>Copy</span>
              </button>
            </div>
            <p className="font-semibold text-primary-foreground text-sm font-mono truncate">
              {admin?.email || 'admin@doctortracker.com'}
            </p>
            <p className="text-xs text-primary-foreground/75 font-medium">Primary administrative authentication channel</p>
          </div>

          {/* authorization role block */}
          <div className="p-4 rounded-2xl bg-primary-foreground/12 backdrop-blur-md border border-primary-foreground/20 hover:bg-primary-foreground/18 transition-all space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/85 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                Authorization Level
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-accent/20 text-accent border border-accent/30">
                Full Access
              </span>
            </div>
            <p className="font-semibold text-primary-foreground text-sm capitalize">{admin?.role || 'Root Administrator'}</p>
            <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-primary-foreground/15 text-primary-foreground/90 font-semibold">CRUD</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-primary-foreground/15 text-primary-foreground/90 font-semibold">Media Pipeline</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-primary-foreground/15 text-primary-foreground/90 font-semibold">Roster Control</span>
            </div>
          </div>

          {/* platform tenant block */}
          <div className="p-4 rounded-2xl bg-primary-foreground/12 backdrop-blur-md border border-primary-foreground/20 hover:bg-primary-foreground/18 transition-all space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/85 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-primary-foreground" />
                Platform Tenant
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-primary-foreground/15 text-primary-foreground font-bold">
                v1.0.0
              </span>
            </div>
            <p className="font-semibold text-primary-foreground text-sm">Doctor Tracker</p>
            <p className="text-xs text-primary-foreground/75 font-medium">Clinical specialist directory & in-patient portal</p>
          </div>
        </div>

        {/* bottom verification footer */}
        <div className="relative z-10 pt-2 flex items-center justify-between text-xs text-primary-foreground/80 border-t border-primary-foreground/20">
          <span className="font-mono text-xs">AUTH_MODE: <strong>TOKEN_BEARER_STRICT</strong></span>
          <span className="text-primary-foreground font-semibold flex items-center gap-1 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
            Synchronized with Database
          </span>
        </div>
      </Card>
    </MotionWrapper>
  );
};
