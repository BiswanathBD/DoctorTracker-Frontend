'use client';

import React, { useState } from 'react';
import { Logo } from '@/components/common/Logo';
import { Button, Input, toast } from '@/components/ui';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useAuth } from '@/providers/AuthProvider';
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';
import { Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, ShieldLock } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // quick demo credentials helper
  const handleQuickDemo = () => {
    setEmail('admin@doctortracker.com');
    setPassword('Admin@DT2026');
    toast.success('Credentials filled!', 'Ready to sign in as Super Admin.');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Missing fields', 'Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const { admin } = await login(email, password);
      toast.success(`Welcome back, ${admin.name}!`, 'Redirecting to your dashboard...');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid email or password.';
      toast.error('Authentication Failed', message);
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-background text-foreground overflow-hidden no-scrollbar">
      {/* dashboard skeleton background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <DashboardSkeleton withLayout={true} animated={false} />
      </div>

      {/* Login Modal */}
      <Dialog open={true}>
        <DialogContent
          hideCloseButton={true}
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="w-full max-w-md p-6 sm:p-7 rounded-3xl bg-card/95 backdrop-blur-2xl shadow-2xl shadow-primary/10 select-none overflow-hidden no-scrollbar space-y-4"
        >
          {/* Ambient inner soft background glow */}
          <div className="absolute -top-20 -right-20 w-44 h-44 rounded-full bg-primary/15 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-44 h-44 rounded-full bg-secondary/15 blur-2xl pointer-events-none" />

          {/* Header & Branding */}
          <DialogHeader className="relative z-10 flex flex-col items-start text-left space-y-2">
            <div className="flex items-center pb-4 border-b border-border w-full">
              <Logo size="md" />
            </div>

            <div className="space-y-0.5">
              <DialogTitle className="text-xl sm:text-2xl font-black text-foreground ">
                Administrative Portal
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground leading-normal">
                Secure access for hospital telemetry and specialist records
              </DialogDescription>
            </div>
          </DialogHeader>

          {/* Quick Demo Autofill Banner */}
          <button
            type="button"
            onClick={handleQuickDemo}
            className="relative z-10 w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-linear-to-r from-primary/10 via-secondary/10 to-primary/5 hover:from-primary/15 hover:to-secondary/15 border-0 border-none outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 text-foreground text-xs font-medium transition-all group shadow-2xs cursor-pointer active:scale-98"
          >
            <span className="flex items-center gap-2 min-w-0">
              <span className="w-5 h-5 rounded-md bg-primary/15 flex items-center justify-center shrink-0">
                <ShieldLock className="w-3 h-3 text-primary" />
              </span>
              <span className="truncate text-[11px]">
                Demo: <strong className="font-semibold text-foreground">admin@doctortracker.com</strong>
              </span>
            </span>
            <span className="text-[10px] font-bold text-primary bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground px-2 py-1 rounded-md transition-all shrink-0">
              Auto Fill
            </span>
          </button>

          {/* Form */}
          <form onSubmit={handleLogin} className="relative z-10 space-y-3.5">
            <Input
              label="Admin Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@doctortracker.com"
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors p-1"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <div className="pt-1">
              <Button
                type="submit"
                size="lg"
                capsule={false}
                loading={loading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full h-11 text-sm font-bold shadow-lg shadow-primary/25 rounded-full bg-linear-to-r from-primary to-secondary text-primary-foreground hover:opacity-95 transition-opacity flex items-center justify-center cursor-pointer"
              >
                {loading ? 'Signing In...' : 'Sign In to Dashboard'}
              </Button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="relative z-10 pt-2 border-t border-border/60 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Protected • Authorized Only</span>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
