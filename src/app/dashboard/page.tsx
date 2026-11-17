'use client';

import React, { useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import { Card, Badge, Button } from '@/components/ui';
import {
  AuthService,
  subscribeAuth,
  getAuthSnapshot,
  getAuthServerSnapshot,
} from '@/server/auth.service';
import { 
  Users, 
  Stethoscope, 
  Activity, 
  TrendingUp, 
  Building2, 
  ChevronRight,
  ArrowUpRight,
  PlusCircle,
  FileSpreadsheet
} from 'lucide-react';

export default function DashboardPage() {
  const admin = useSyncExternalStore(subscribeAuth, getAuthSnapshot, getAuthServerSnapshot);

  useEffect(() => {
    AuthService.getProfile().catch((err) => {
      console.error('failed to fetch admin profile:', err);
    });
  }, []);

  return (
    <div className="w-full space-y-8">
      {/* animated welcome banner */}
      <MotionWrapper direction="up" duration={0.5}>
        <div className="rounded-3xl p-6 sm:p-8 bg-linear-to-r from-primary via-primary-hover to-secondary text-primary-foreground shadow-xl shadow-primary/15 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-semibold">
              <Activity className="w-3.5 h-3.5 text-accent animate-pulse" />
              <span>Real-Time Healthcare Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {admin?.name || 'Admin'}! 👋
            </h1>
            <p className="text-sm opacity-90 leading-relaxed font-normal">
              Manage all registered doctors, track patient assignments, and monitor real-time hospital statistics.
            </p>
          </div>

          {/* quick action button on banner */}
          <div className="relative z-10 flex items-center gap-3">
            <Link href="/doctors?action=create">
              <Button
                variant="outline"
                size="md"
                leftIcon={<PlusCircle className="w-4 h-4 text-primary" />}
                className="bg-white text-slate-900 hover:bg-slate-100 border-none shadow-md font-bold"
              >
                Add Doctor
              </Button>
            </Link>
          </div>
        </div>
      </MotionWrapper>

      {/* quick metric stats cards - full width 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {/* total doctors */}
        <MotionWrapper delay={0.1} direction="up">
          <Card variant="default" className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">Total Doctors</p>
              <p className="text-2xl font-extrabold text-foreground tracking-tight">--</p>
              <Badge variant="success">
                <TrendingUp className="w-3 h-3" /> Ready
              </Badge>
            </div>
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <Stethoscope className="w-6 h-6" />
            </div>
          </Card>
        </MotionWrapper>

        {/* total patients */}
        <MotionWrapper delay={0.15} direction="up">
          <Card variant="default" className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">Total Patients</p>
              <p className="text-2xl font-extrabold text-foreground tracking-tight">--</p>
              <Badge variant="secondary">
                <TrendingUp className="w-3 h-3" /> Ready
              </Badge>
            </div>
            <div className="p-3 rounded-2xl bg-secondary/10 text-secondary">
              <Users className="w-6 h-6" />
            </div>
          </Card>
        </MotionWrapper>

        {/* avg patients / doctor */}
        <MotionWrapper delay={0.2} direction="up">
          <Card variant="default" className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">Patients / Doctor</p>
              <p className="text-2xl font-extrabold text-foreground tracking-tight">--</p>
              <Badge variant="outline">Optimal Load</Badge>
            </div>
            <div className="p-3 rounded-2xl bg-accent text-accent-foreground">
              <Activity className="w-6 h-6" />
            </div>
          </Card>
        </MotionWrapper>

        {/* active hospitals */}
        <MotionWrapper delay={0.25} direction="up">
          <Card variant="default" className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">Hospitals</p>
              <p className="text-2xl font-extrabold text-foreground tracking-tight">--</p>
              <Badge variant="warning">Active Network</Badge>
            </div>
            <div className="p-3 rounded-2xl bg-warning/10 text-warning">
              <Building2 className="w-6 h-6" />
            </div>
          </Card>
        </MotionWrapper>
      </div>

      {/* main content split: quick navigation + recent overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MotionWrapper delay={0.3} direction="up">
          <Link href="/doctors" className="block group h-full">
            <Card variant="default" className="p-6 h-full group-hover:border-primary group-hover:shadow-md transition-all flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-primary/10 text-primary group-hover:scale-105 transition-transform shrink-0">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground text-base group-hover:text-primary transition-colors">
                      Doctor Management
                    </h3>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Create, search, filter, and assign patients to specialized doctors.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all shrink-0" />
            </Card>
          </Link>
        </MotionWrapper>

        <MotionWrapper delay={0.35} direction="up">
          <Link href="/patients" className="block group h-full">
            <Card variant="default" className="p-6 h-full group-hover:border-secondary group-hover:shadow-md transition-all flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-secondary/10 text-secondary group-hover:scale-105 transition-transform shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground text-base group-hover:text-secondary transition-colors">
                      Patient Management
                    </h3>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-secondary" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Track medical conditions, admission dates, and manage patient records.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 group-hover:text-secondary transition-all shrink-0" />
            </Card>
          </Link>
        </MotionWrapper>
      </div>

      {/* recent activity / quick overview section */}
      <MotionWrapper delay={0.4} direction="up">
        <Card variant="default" className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-foreground">Operational Overview</h3>
              <p className="text-xs text-muted-foreground">Quick actions and system health monitoring</p>
            </div>
            <Badge variant="outline">
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1" /> Ready for live data
            </Badge>
          </div>

          <div className="p-8 rounded-2xl bg-muted/40 border border-dashed border-border text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-accent text-accent-foreground mx-auto flex items-center justify-center">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-bold text-sm text-foreground">Analytics Engine Initialized</h4>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Real-time MongoDB aggregation charts (Patients per doctor, admission trends, and condition distribution) will render here once doctor records are loaded.
            </p>
          </div>
        </Card>
      </MotionWrapper>
    </div>
  );
}
