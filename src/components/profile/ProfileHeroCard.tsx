'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import { Button, Card, toast } from '@/components/ui';
import { AuthService, type AdminUser } from '@/server/auth.service';
import {
  Camera,
  Loader2,
  Trash2,
  ShieldCheck,
  Mail,
  CheckCircle2,
  Copy,
  Calendar,
  Clock,
  LogOut,
} from 'lucide-react';

interface ProfileHeroCardProps {
  admin: AdminUser | null;
  onSignOut: () => void;
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

export const ProfileHeroCard: React.FC<ProfileHeroCardProps> = ({ admin, onSignOut }) => {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // handle avatar upload to cloudinary
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

  // handle avatar delete
  const handleAvatarDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!admin?.avatar?.url) return;

    try {
      setDeleting(true);
      await AuthService.deleteAvatar();
      toast.success('Avatar Deleted', 'Your profile picture has been removed.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'failed to delete avatar';
      toast.error('Delete Failed', msg);
    } finally {
      setDeleting(false);
    }
  };

  // copy text to clipboard helper
  const handleCopyText = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success('Copied to Clipboard', text);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <MotionWrapper delay={0.1} direction="up" className="h-full">
      <Card className="relative overflow-hidden p-6 text-center border border-border/80 bg-card/90 backdrop-blur-xl shadow-xl rounded-3xl lg:h-[calc(100vh-7rem)] flex flex-col justify-between">
        {/* background ambient glow */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-36 w-36 rounded-full bg-secondary/15 blur-3xl" />

        {/* top content section */}
        <div className="space-y-4">
          {/* avatar with upload overlay and online badge */}
          <div className="relative mx-auto w-28 h-28 group">
            {admin?.avatar?.url ? (
              <div className="relative w-28 h-28 rounded-3xl overflow-hidden border-2 border-primary/40 shadow-xl group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={admin.avatar.url}
                  alt={admin.name || 'Admin'}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-28 h-28 rounded-3xl bg-linear-to-br from-primary via-primary-hover to-secondary text-primary-foreground flex items-center justify-center shadow-xl border-2 border-primary/40 group-hover:scale-105 transition-transform duration-300">
                <ShieldCheck className="w-12 h-12 text-white" />
              </div>
            )}

            {/* active status indicator pill */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-card border-2 border-card flex items-center justify-center shadow-md">
              <span className="w-3 h-3 rounded-full bg-success animate-pulse inline-block" />
            </div>

            {/* hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* hover update & delete action overlay */}
            <div className="absolute inset-0 rounded-3xl bg-black/65 backdrop-blur-[1px] text-white flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20 p-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || deleting}
                className="w-20 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs font-semibold disabled:opacity-50"
                title="Upload new photo"
              >
                {uploading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Camera className="w-3.5 h-3.5" />
                )}
                <span>{uploading ? 'Wait...' : 'Update'}</span>
              </button>

              {admin?.avatar?.url && (
                <button
                  type="button"
                  onClick={handleAvatarDelete}
                  disabled={uploading || deleting}
                  className="w-20 py-1 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs font-semibold disabled:opacity-50 shadow-md"
                  title="Delete avatar photo"
                >
                  {deleting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>

          {/* admin name */}
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-foreground tracking-tight truncate">
              {admin?.name || 'System Administrator'}
            </h2>
          </div>

          {/* profile description */}
          <p className="text-xs text-muted-foreground leading-relaxed px-2">
            Root administrator controlling clinical records, specialists directory, and media storage on <strong>Doctor Tracker</strong>.
          </p>

          {/* quick credential pills */}
          <div className="space-y-2 pt-1 border-t border-border/60 text-xs">
            <div className="p-2.5 rounded-2xl bg-muted/40 border border-border/70 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate text-foreground font-medium text-[11px]">
                  {admin?.email || 'admin@doctortracker.com'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyText(admin?.email || '', 'Email')}
                className="text-muted-foreground hover:text-foreground p-1 transition-colors cursor-pointer"
                title="Copy email"
              >
                {copiedField === 'Email' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* created date pill */}
            <div className="p-2.5 rounded-2xl bg-muted/40 border border-border/70 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-[11px] font-semibold text-muted-foreground">Account Created:</span>
              </div>
              <span className="text-[11px] font-semibold text-foreground">
                {formatDate(admin?.createdAt)}
              </span>
            </div>

            {/* last updated date pill */}
            <div className="p-2.5 rounded-2xl bg-muted/40 border border-border/70 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Clock className="w-3.5 h-3.5 text-secondary shrink-0" />
                <span className="text-[11px] font-semibold text-muted-foreground">Last Updated:</span>
              </div>
              <span className="text-[11px] font-semibold text-foreground">
                {formatDate(admin?.updatedAt || admin?.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* sign out of session (logout button aligned to the right) */}
        <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-3 text-left">
          <div className="space-y-0.5 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-destructive">
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Sign Out of Session</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
              End your current administrative session.
            </p>
          </div>

          <div className="shrink-0">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={onSignOut}
              leftIcon={<LogOut className="w-3.5 h-3.5" />}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </Card>
    </MotionWrapper>
  );
};
