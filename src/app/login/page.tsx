'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Logo } from '@/components/common/Logo';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import { Button, Input } from '@/components/ui';
import { AuthService } from '@/server/auth.service';
import { toast } from '@/utils/toast';
import { Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, Activity } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
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
      const { admin } = await AuthService.login(email, password);
      toast.success(`Welcome back, ${admin.name}!`, 'Redirecting to your dashboard...');

      router.push('/dashboard');
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid email or password.';
      toast.error('Authentication Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-background text-foreground overflow-hidden">
      {/* animated floating ambient background orbs using theme colors */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 -left-20 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20 bg-primary"
      />

      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          x: [0, -30, 0],
          y: [0, 25, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20 bg-secondary"
      />

      {/* main animated card */}
      <MotionWrapper
        direction="up"
        duration={0.6}
        scale={true}
        className="relative z-10 w-full max-w-md bg-card text-card-foreground rounded-3xl border border-border shadow-2xl p-8 sm:p-10 space-y-7"
      >
        {/* header & brand */}
        <div className="text-center space-y-3">
          <MotionWrapper delay={0.1} direction="down" className="flex justify-center">
            <Logo size="lg" />
          </MotionWrapper>

          <MotionWrapper delay={0.2} direction="up">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold mb-2">
              <Activity className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span>Doctor Tracker Portal</span>
            </div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              Administrative Portal
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Sign in with your admin credentials to manage doctors and patients.
            </p>
          </MotionWrapper>
        </div>

        {/* quick demo fill banner */}
        <MotionWrapper delay={0.25} direction="up">
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            type="button"
            onClick={handleQuickDemo}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-accent hover:bg-accent/80 border border-border text-accent-foreground text-xs font-medium transition-all group shadow-sm cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>
                Demo Admin: <strong className="font-semibold">admin@doctortracker.com</strong>
              </span>
            </span>
            <span className="text-[11px] underline opacity-80 group-hover:opacity-100">Click to fill</span>
          </motion.button>
        </MotionWrapper>

        {/* login form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <MotionWrapper delay={0.3} direction="up">
            <Input
              label="Admin Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@doctortracker.com"
              leftIcon={<Mail className="w-4 h-4" />}
            />
          </MotionWrapper>

          <MotionWrapper delay={0.35} direction="up">
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
                  className="cursor-pointer hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
          </MotionWrapper>

          <MotionWrapper delay={0.4} direction="up" className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full"
            >
              Sign In to Portal
            </Button>
          </MotionWrapper>
        </form>

        {/* security notice */}
        <MotionWrapper delay={0.45} direction="up" className="pt-2 border-t border-border flex items-center justify-center gap-2 text-[11px] text-muted-foreground text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-success" />
          <span>Protected by 256-bit JWT & bcrypt</span>
        </MotionWrapper>
      </MotionWrapper>
    </div>
  );
}
