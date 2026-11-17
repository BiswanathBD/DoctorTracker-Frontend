'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import { Card, Badge, Button, PageHeader } from '@/components/ui';
import { DashboardService, type DashboardStats } from '@/server/dashboard.service';
import { DoctorService, type Doctor } from '@/server/doctor.service';
import {
  Activity,
  Stethoscope,
  Building2,
  RefreshCw,
  PlusCircle,
  TrendingUp,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

export default function DoctorWorkloadPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      DashboardService.getStats(),
      DoctorService.getAllDoctors({ page: 1, limit: 100 }),
    ])
      .then(([statsRes, docsRes]) => {
        setStats(statsRes);
        setAllDoctors(docsRes.data);
      })
      .catch((err) => console.error('failed to load workload data:', err))
      .finally(() => setLoading(false));
  }, []);

  const doctorsWorkload = stats?.patientsPerDoctor || [];
  const maxLoad = Math.max(1, ...doctorsWorkload.map((d) => d.patientCount));
  const avgLoad = stats?.overview.avgPatientsPerDoctor || 0;

  return (
    <div className="w-full space-y-7">
      {/* header */}
      <PageHeader
        backHref="/doctors"
        icon={<Stethoscope size={42} strokeWidth={1.2} />}
        title="Doctor Workload Distribution"
        subtitle="Real-time patient load analysis, capacity monitoring, and clinical assignments."
        actions={
          <Link href="/doctors?action=create">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<PlusCircle className="w-4 h-4" />}
              className="cursor-pointer"
            >
              Add Specialist
            </Button>
          </Link>
        }
      />

      {/* KPI summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <MotionWrapper delay={0.1} direction="up">
          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">Average Patient Load</p>
              <p className="text-3xl font-extrabold text-foreground tracking-tight">
                {loading ? '--' : avgLoad}
              </p>
              <Badge variant="outline">Per Specialist</Badge>
            </div>
            <div className="p-3.5 rounded-2xl bg-primary/10 text-primary">
              <Activity className="w-6 h-6" />
            </div>
          </Card>
        </MotionWrapper>

        <MotionWrapper delay={0.15} direction="up">
          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">Highest Assigned Load</p>
              <p className="text-3xl font-extrabold text-foreground tracking-tight">
                {loading ? '--' : maxLoad}
              </p>
              <Badge variant="secondary">Peak Ratio</Badge>
            </div>
            <div className="p-3.5 rounded-2xl bg-secondary/10 text-secondary">
              <TrendingUp className="w-6 h-6" />
            </div>
          </Card>
        </MotionWrapper>

        <MotionWrapper delay={0.2} direction="up">
          <Card className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">Specialists Monitored</p>
              <p className="text-3xl font-extrabold text-foreground tracking-tight">
                {loading ? '--' : (stats?.overview.totalDoctors || allDoctors.length)}
              </p>
              <Badge variant="success">Active Roster</Badge>
            </div>
            <div className="p-3.5 rounded-2xl bg-success/10 text-success">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </Card>
        </MotionWrapper>
      </div>

      {/* workload list */}
      <MotionWrapper delay={0.25} direction="up">
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-foreground flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-primary" />
                Workload Capacity Meters
              </h2>
              <p className="text-xs text-muted-foreground">
                Ranked by active patient assignments across affiliated hospital networks
              </p>
            </div>
            <Badge variant="primary">Real-Time Data</Badge>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-8 h-8 text-primary animate-spin" />
              <p className="text-xs font-semibold text-muted-foreground">Calculating workloads...</p>
            </div>
          ) : doctorsWorkload.length === 0 ? (
            <div className="py-16 text-center text-xs text-muted-foreground">
              No doctors or patient assignments found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctorsWorkload.map((doc, idx) => {
                const percentage = Math.round((doc.patientCount / maxLoad) * 100);
                const isHeavy = doc.patientCount > avgLoad * 1.5;

                return (
                  <div
                    key={doc._id}
                    className="p-4 rounded-2xl bg-muted/30 border border-border space-y-3 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
                          #{idx + 1}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-foreground text-sm truncate">{doc.name}</h3>
                          <p className="text-xs text-muted-foreground truncate flex items-center gap-1.5 mt-0.5">
                            <Building2 className="w-3 h-3 flex-shrink-0" />
                            {doc.hospital} &bull; {doc.specialization}
                          </p>
                        </div>
                      </div>

                      <Badge variant={isHeavy ? 'warning' : 'secondary'} className="font-bold">
                        {isHeavy ? (
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> High Load
                          </span>
                        ) : (
                          'Normal Load'
                        )}
                      </Badge>
                    </div>

                    {/* progress meter */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground text-[11px]">Assigned Patients</span>
                        <span className="font-extrabold text-primary">
                          {doc.patientCount} {doc.patientCount === 1 ? 'patient' : 'patients'}
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                        <div
                          style={{ width: `${Math.max(6, percentage)}%` }}
                          className={`h-full rounded-full transition-all duration-500 ${
                            isHeavy
                              ? 'bg-gradient-to-r from-warning to-destructive'
                              : 'bg-gradient-to-r from-primary to-secondary'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-end">
                      <Link href={`/doctors`}>
                        <Button variant="ghost" size="sm" className="text-xs h-7 px-2.5 text-primary">
                          Manage Doctor &rarr;
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </MotionWrapper>
    </div>
  );
}
