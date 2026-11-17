'use client';

import React, { useEffect, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import { Card, Badge, Button, PageHeader } from '@/components/ui';
import {
  AuthService,
  subscribeAuth,
  getAuthSnapshot,
  getAuthServerSnapshot,
} from '@/server/auth.service';
import { DashboardService, type DashboardStats } from '@/server/dashboard.service';
import {
  Users,
  Stethoscope,
  Activity,
  TrendingUp,
  Building2,
  ChevronRight,
  ArrowUpRight,
  PlusCircle,
  HeartPulse,
  BarChart3,
  RefreshCw,
  Calendar,
  Layers,
  UserRoundShield
} from 'lucide-react';

export default function DashboardPage() {
  const admin = useSyncExternalStore(subscribeAuth, getAuthSnapshot, getAuthServerSnapshot);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timelineView, setTimelineView] = useState<'all' | 'patients' | 'doctors'>('all');

  useEffect(() => {
    AuthService.getProfile().catch((err) => {
      console.error('failed to fetch admin profile:', err);
    });

    DashboardService.getStats()
      .then((data) => setStats(data))
      .catch((err) => console.error('failed to fetch dashboard statistics:', err))
      .finally(() => setLoading(false));
  }, []);

  const overview = stats?.overview || {
    totalDoctors: 0,
    totalPatients: 0,
    totalHospitals: 0,
    avgPatientsPerDoctor: 0,
  };

  const maxDoctorPatients = Math.max(
    1,
    ...(stats?.patientsPerDoctor?.map((d) => d.patientCount) || [1])
  );

  // process timeline data for the date-based statistics chart
  const timelineDates = Array.from(
    new Set([
      ...(stats?.timeline?.patients?.map((p) => p.date) || []),
      ...(stats?.timeline?.doctors?.map((d) => d.date) || []),
    ])
  ).sort();

  const patientMap = new Map(stats?.timeline?.patients?.map((p) => [p.date, p.patients]) || []);
  const doctorMap = new Map(stats?.timeline?.doctors?.map((d) => [d.date, d.doctors]) || []);

  const timelineChartData = timelineDates.slice(-14).map((date) => {
    const patients = patientMap.get(date) || 0;
    const doctors = doctorMap.get(date) || 0;
    return {
      date,
      displayDate: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      patients,
      doctors,
      total: patients + doctors,
    };
  });

  const maxTimelineVal = Math.max(
    1,
    ...timelineChartData.map((d) => Math.max(d.patients, d.doctors))
  );

  return (
    <div className="w-full space-y-8">
      {/* header */}
      <MotionWrapper direction="up" duration={0.4}>
        <PageHeader
          icon={<UserRoundShield size={42} strokeWidth={1.2} />}
          title={`Welcome back, ${admin?.name || 'Super Admin'}!`}
          subtitle="Real-time analytics, specialist workload tracking, and patient monitoring."

          actions={
            <div className="flex items-center gap-2.5">
              <Link href="/doctors?action=create">
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={<PlusCircle className="w-4 h-4 text-primary" />}
                  className="font-bold cursor-pointer"
                >
                  Add Doctor
                </Button>
              </Link>
              <Link href="/patients?action=create">
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<Users className="w-4 h-4" />}
                  className="font-bold cursor-pointer shadow-md shadow-primary/20"
                >
                  Admit Patient
                </Button>
              </Link>
            </div>
          }
        />
      </MotionWrapper>

      {/* kpi cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <MotionWrapper delay={0.1} direction="up">
          <Card variant="default" className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">Total Doctors</p>
              <p className="text-3xl font-extrabold text-foreground tracking-tight">
                {loading ? '--' : overview.totalDoctors}
              </p>
              <Badge variant="success">
                <TrendingUp className="w-3 h-3" /> Live Network
              </Badge>
            </div>
            <div className="p-3.5 rounded-2xl bg-primary/10 text-primary">
              <Stethoscope className="w-6 h-6" />
            </div>
          </Card>
        </MotionWrapper>

        <MotionWrapper delay={0.15} direction="up">
          <Card variant="default" className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">Total Patients</p>
              <p className="text-3xl font-extrabold text-foreground tracking-tight">
                {loading ? '--' : overview.totalPatients}
              </p>
              <Badge variant="secondary">
                <TrendingUp className="w-3 h-3" /> Active Care
              </Badge>
            </div>
            <div className="p-3.5 rounded-2xl bg-secondary/10 text-secondary">
              <Users className="w-6 h-6" />
            </div>
          </Card>
        </MotionWrapper>

        <MotionWrapper delay={0.2} direction="up">
          <Card variant="default" className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">Patients / Doctor</p>
              <p className="text-3xl font-extrabold text-foreground tracking-tight">
                {loading ? '--' : overview.avgPatientsPerDoctor}
              </p>
              <Badge variant="outline">Average Ratio</Badge>
            </div>
            <div className="p-3.5 rounded-2xl bg-accent text-accent-foreground">
              <Activity className="w-6 h-6 text-primary" />
            </div>
          </Card>
        </MotionWrapper>

        <MotionWrapper delay={0.25} direction="up">
          <Card variant="default" className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">Affiliated Hospitals</p>
              <p className="text-3xl font-extrabold text-foreground tracking-tight">
                {loading ? '--' : overview.totalHospitals}
              </p>
              <Badge variant="warning">Registered Clinics</Badge>
            </div>
            <div className="p-3.5 rounded-2xl bg-warning/10 text-warning">
              <Building2 className="w-6 h-6" />
            </div>
          </Card>
        </MotionWrapper>
      </div>

      {/* timeline */}
      <MotionWrapper delay={0.28} direction="up">
        <Card className="p-6 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Date-Based Activity Timeline
              </h3>
              <p className="text-xs text-muted-foreground">
                Daily patient admissions and doctor registrations over the last 14 active days
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted border border-border text-xs">
                <button
                  type="button"
                  onClick={() => setTimelineView('all')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${timelineView === 'all'
                      ? 'bg-card text-foreground shadow-sm font-bold'
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setTimelineView('patients')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${timelineView === 'patients'
                      ? 'bg-secondary text-secondary-foreground shadow-sm font-bold'
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  Patients
                </button>
                <button
                  type="button"
                  onClick={() => setTimelineView('doctors')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${timelineView === 'doctors'
                      ? 'bg-primary text-primary-foreground shadow-sm font-bold'
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  Doctors
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-16 flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : timelineChartData.length === 0 ? (
            <div className="py-14 text-center text-xs text-muted-foreground">
              No daily admission or registration trends recorded yet.
            </div>
          ) : (
            <div className="space-y-4">
              {/* interactive bar visualizer */}
              <div className="h-56 flex items-end gap-2 sm:gap-3 pt-6 pb-2 px-2 overflow-x-auto">
                {timelineChartData.map((item) => {
                  const patientHeight = Math.round((item.patients / maxTimelineVal) * 160);
                  const doctorHeight = Math.round((item.doctors / maxTimelineVal) * 160);

                  return (
                    <div
                      key={item.date}
                      className="flex-1 min-w-9 flex flex-col items-center gap-2 group relative"
                    >
                      {/* tooltip on hover */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-[10px] font-bold py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap z-20 shadow-lg">
                        {item.displayDate}: {item.patients} patients, {item.doctors} doctors
                      </div>

                      {/* stacked or side bars */}
                      <div className="w-full flex items-end justify-center gap-1 h-44">
                        {(timelineView === 'all' || timelineView === 'patients') && (
                          <div
                            style={{ height: `${Math.max(6, patientHeight)}px` }}
                            className="w-1/2 rounded-t-lg bg-secondary/80 hover:bg-secondary transition-all"
                            title={`Patients: ${item.patients}`}
                          />
                        )}
                        {(timelineView === 'all' || timelineView === 'doctors') && (
                          <div
                            style={{ height: `${Math.max(6, doctorHeight)}px` }}
                            className="w-1/2 rounded-t-lg bg-primary/80 hover:bg-primary transition-all"
                            title={`Doctors: ${item.doctors}`}
                          />
                        )}
                      </div>

                      {/* date label */}
                      <span className="text-[10px] text-muted-foreground font-medium group-hover:text-foreground">
                        {item.displayDate}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* legend footer */}
              <div className="flex items-center justify-end gap-5 text-xs text-muted-foreground pt-2 border-t border-border">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                  <span>Admitted Patients</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span>Registered Doctors</span>
                </div>
              </div>
            </div>
          )}
        </Card>
      </MotionWrapper>

      {/* workload & conditions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MotionWrapper delay={0.3} direction="up">
          <Card className="p-6 space-y-5 h-full">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Doctor Workload Distribution
                </h3>
                <p className="text-xs text-muted-foreground">Patients assigned per doctor</p>
              </div>
              <Link href="/doctors/workload">
                <Badge variant="primary" className="cursor-pointer hover:opacity-80">
                  Full Workload &rarr;
                </Badge>
              </Link>
            </div>

            {loading ? (
              <div className="py-12 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : !stats?.patientsPerDoctor || stats.patientsPerDoctor.length === 0 ? (
              <div className="py-10 text-center text-xs text-muted-foreground">
                No doctor workload data recorded yet.
              </div>
            ) : (
              <div className="space-y-4">
                {stats.patientsPerDoctor.slice(0, 6).map((doc) => {
                  const percent = Math.round((doc.patientCount / maxDoctorPatients) * 100);
                  return (
                    <div key={doc._id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-foreground">
                          {doc.name} <span className="font-normal text-muted-foreground">({doc.specialization})</span>
                        </span>
                        <span className="font-extrabold text-primary">{doc.patientCount} patients</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                        <div
                          style={{ width: `${Math.max(5, percent)}%` }}
                          className="h-full rounded-full bg-linear-to-r from-primary to-secondary transition-all duration-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </MotionWrapper>

        <MotionWrapper delay={0.35} direction="up">
          <Card className="p-6 space-y-5 h-full">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-secondary" />
                  Patient Condition Breakdown
                </h3>
                <p className="text-xs text-muted-foreground">Distribution of active diagnoses</p>
              </div>
              <Link href="/patients/conditions">
                <Badge variant="secondary" className="cursor-pointer hover:opacity-80">
                  All Conditions &rarr;
                </Badge>
              </Link>
            </div>

            {loading ? (
              <div className="py-12 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-secondary animate-spin" />
              </div>
            ) : !stats?.conditionStats || stats.conditionStats.length === 0 ? (
              <div className="py-10 text-center text-xs text-muted-foreground">
                No patient condition records found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {stats.conditionStats.map((item, idx) => (
                  <div
                    key={item.condition}
                    className="p-3.5 rounded-2xl bg-muted/40 border border-border flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-xl bg-accent text-accent-foreground font-bold text-xs flex items-center justify-center shrink-0">
                        #{idx + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-foreground text-xs truncate">
                          {item.condition}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Diagnosed cases</p>
                      </div>
                    </div>
                    <Badge variant="warning" className="font-bold">
                      {item.count}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </MotionWrapper>
      </div>

      {/* specializations */}
      {stats?.specializationStats && stats.specializationStats.length > 0 && (
        <MotionWrapper delay={0.38} direction="up">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  Doctor Specialization Distribution
                </h3>
                <p className="text-xs text-muted-foreground">
                  Proportion of medical specialties across affiliated hospitals
                </p>
              </div>
              <Badge variant="outline">Network Coverage</Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {stats.specializationStats.map((spec) => (
                <div
                  key={spec.specialization}
                  className="p-3.5 rounded-2xl bg-muted/30 border border-border flex flex-col justify-between space-y-2"
                >
                  <p className="text-xs font-bold text-foreground truncate">{spec.specialization}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">Practicing</span>
                    <Badge variant="primary" className="font-bold">
                      {spec.count} {spec.count === 1 ? 'doc' : 'docs'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </MotionWrapper>
      )}

      {/* quick links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MotionWrapper delay={0.4} direction="up">
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

        <MotionWrapper delay={0.45} direction="up">
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
    </div>
  );
}
