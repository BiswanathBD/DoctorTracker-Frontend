'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import { Card, Badge, Button, PageHeader } from '@/components/ui';
import { DashboardService, type DashboardStats } from '@/server/dashboard.service';
import { PatientService, type Patient } from '@/server/patient.service';
import {
  HeartPulse,
  PlusCircle,
  Calendar,
  Stethoscope,
  Loader2,
} from 'lucide-react';

export default function PatientConditionsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      DashboardService.getStats(),
      PatientService.getAllPatients({ page: 1, limit: 100 }),
    ])
      .then(([statsRes, patientsRes]) => {
        setStats(statsRes);
        setPatients(patientsRes.data);
      })
      .catch((err) => console.error('failed to load condition data:', err))
      .finally(() => setLoading(false));
  }, []);

  const conditionStats = stats?.conditionStats || [];
  const filteredPatients =
    selectedCondition === 'all'
      ? patients
      : patients.filter((p) => p.condition.toLowerCase() === selectedCondition.toLowerCase());

  return (
    <div className="w-full space-y-7">
      {/* header */}
      <PageHeader
        backHref="/patients"
        icon={<HeartPulse size={42} strokeWidth={1.2} />}
        title="Patient Conditions Breakdown"
        subtitle="Clinical diagnosis analytics, category clustering, and patient medical distribution."
        actions={
          <Link href="/patients?action=create">
            <Button
              variant="secondary"
              size="md"
              leftIcon={<PlusCircle className="w-4 h-4" />}
              className="cursor-pointer rounded-full"
            >
              Admit Patient
            </Button>
          </Link>
        }
      />

      {/* condition analytics summary cards grid */}
      <MotionWrapper delay={0.1} direction="up">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          <button
            type="button"
            onClick={() => setSelectedCondition('all')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedCondition === 'all'
                ? 'bg-secondary/15 border-secondary shadow-md scale-[1.02]'
                : 'bg-card border-border hover:border-secondary/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">All Conditions</span>
              <Badge variant={selectedCondition === 'all' ? 'secondary' : 'outline'}>
                {patients.length}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">Combined admissions</p>
          </button>

          {conditionStats.map((item) => (
            <button
              key={item.condition}
              type="button"
              onClick={() => setSelectedCondition(item.condition)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedCondition.toLowerCase() === item.condition.toLowerCase()
                  ? 'bg-secondary/15 border-secondary shadow-md scale-[1.02]'
                  : 'bg-card border-border hover:border-secondary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground truncate">{item.condition}</span>
                <Badge
                  variant={
                    selectedCondition.toLowerCase() === item.condition.toLowerCase()
                      ? 'secondary'
                      : 'warning'
                  }
                >
                  {item.count}
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">Diagnosed cases</p>
            </button>
          ))}
        </div>
      </MotionWrapper>

      {/* filtered patient list */}
      <MotionWrapper delay={0.2} direction="up">
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="font-bold text-base text-foreground flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-secondary" />
                Diagnosed Patient Records ({filteredPatients.length})
              </h2>
              <p className="text-xs text-muted-foreground">
                {selectedCondition === 'all'
                  ? 'Showing all recorded patient diagnoses'
                  : `Filtered by medical condition: ${selectedCondition}`}
              </p>
            </div>
            {selectedCondition !== 'all' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCondition('all')}
                className="text-xs text-secondary rounded-full"
              >
                Clear filter
              </Button>
            )}
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-secondary animate-spin" />
              <p className="text-xs font-semibold text-muted-foreground">Loading condition records...</p>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="py-16 text-center text-xs text-muted-foreground">
              No patients found under condition &quot;{selectedCondition}&quot;.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPatients.map((p) => {
                const docName =
                  typeof p.doctorId === 'object' && p.doctorId !== null
                    ? p.doctorId.name
                    : 'Assigned';
                const docHosp =
                  typeof p.doctorId === 'object' && p.doctorId !== null
                    ? p.doctorId.hospital
                    : '';

                return (
                  <div
                    key={p._id}
                    className="p-4 rounded-2xl bg-card border border-border/80 space-y-3 hover:border-secondary/50 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xs shrink-0">
                          {p.name?.charAt(0) || 'P'}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-foreground text-sm group-hover:text-secondary transition-colors truncate">
                            {p.name}
                          </h3>
                          <p className="text-[11px] text-muted-foreground">
                            {p.age} yrs • {p.gender}
                          </p>
                        </div>
                      </div>
                      <Badge variant="warning" className="font-bold text-[10px] shrink-0">
                        {p.condition}
                      </Badge>
                    </div>

                    <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 truncate max-w-[150px]">
                        <Stethoscope className="w-3 h-3 text-primary shrink-0" />
                        <span className="truncate">{docName}</span>
                        {docHosp && <span className="opacity-60 text-[10px]">({docHosp})</span>}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] shrink-0">
                        <Calendar className="w-3 h-3 text-muted-foreground/70" />
                        {new Date(p.admissionDate).toLocaleDateString()}
                      </span>
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
