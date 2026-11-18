'use client';

import React from 'react';
import Link from 'next/link';
import { Card, Badge } from '@/components/ui';
import { BarChart3, Building2, ArrowUpRight } from 'lucide-react';
import type { PatientsPerDoctorItem } from '@/types/dashboard.types';

interface DoctorWorkloadCardProps {
  doctors: PatientsPerDoctorItem[];
  loading?: boolean;
}

export const DoctorWorkloadCard: React.FC<DoctorWorkloadCardProps> = ({
  doctors,
  loading = false,
}) => {
  const maxPatients = Math.max(1, ...doctors.map((d) => d.patientCount));

  return (
    <Card className="p-6 space-y-5 h-full flex flex-col justify-between">
      {/* header */}
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <BarChart3 className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground tracking-tight">
              Specialist Caseload Distribution
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              Patients currently assigned per attending physician
            </p>
          </div>
        </div>

        <Link
          href="/doctors"
          className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
        >
          <span>View All</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="py-14 text-center text-xs text-muted-foreground">
          Loading specialist caseloads...
        </div>
      ) : doctors.length === 0 ? (
        <div className="py-14 text-center text-xs text-muted-foreground">
          No doctor assignments recorded yet.
        </div>
      ) : (
        <div className="space-y-4 flex-1">
          {doctors.slice(0, 5).map((doc, idx) => {
            const percent = Math.round((doc.patientCount / maxPatients) * 100);
            const loadStatus =
              doc.patientCount > 10
                ? { label: 'High Load', variant: 'warning' as const }
                : doc.patientCount > 4
                ? { label: 'Active', variant: 'secondary' as const }
                : { label: 'Balanced', variant: 'outline' as const };

            return (
              <div key={doc._id || idx} className="space-y-1.5 p-2 rounded-xl hover:bg-muted/40 transition-colors">
                <div className="flex items-center justify-between text-xs">
                  <div className="min-w-0 flex items-center gap-2">
                    <span className="font-bold text-foreground truncate">
                      {doc.name}
                    </span>
                    <span className="text-[11px] text-muted-foreground truncate hidden sm:inline">
                      • {doc.specialization}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-primary">
                      {doc.patientCount} {doc.patientCount === 1 ? 'patient' : 'patients'}
                    </span>
                    <Badge variant={loadStatus.variant} className="text-[10px] py-0 px-2 font-medium">
                      {loadStatus.label}
                    </Badge>
                  </div>
                </div>

                {/* hospital tag */}
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1 truncate max-w-[200px]">
                    <Building2 className="w-3 h-3 shrink-0 text-muted-foreground" />
                    <span className="truncate">{doc.hospital}</span>
                  </span>
                  <span>{percent}% capacity</span>
                </div>

                {/* progress bar */}
                <div className="w-full h-2 rounded-full bg-muted/70 overflow-hidden">
                  <div
                    style={{ width: `${Math.max(6, percent)}%` }}
                    className="h-full rounded-full bg-linear-to-r from-primary to-secondary transition-all duration-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
