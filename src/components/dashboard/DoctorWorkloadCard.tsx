'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui';
import { Activity, Building2, ArrowUpRight, Stethoscope } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DoctorWorkloadSkeleton } from '@/components/skeletons/DoctorWorkloadSkeleton';
import type { PatientsPerDoctorItem } from '@/types/dashboard.types';

interface DoctorWorkloadCardProps {
  doctors: PatientsPerDoctorItem[];
  loading?: boolean;
}

// Colors derived directly from globals.css theme variables
const CARD_THEMES = [
  {
    bg: 'bg-primary/5 hover:bg-primary/10',
    border: 'border-primary/25 hover:border-primary/45',
    avatarBg: 'bg-primary/15 text-primary border-primary/25',
    iconColor: 'text-primary',
    badge: 'bg-primary/15 text-primary border-primary/25',
    bar: 'bg-primary',
  },
  {
    bg: 'bg-secondary/5 hover:bg-secondary/10',
    border: 'border-secondary/25 hover:border-secondary/45',
    avatarBg: 'bg-secondary/15 text-secondary border-secondary/25',
    iconColor: 'text-secondary',
    badge: 'bg-secondary/15 text-secondary border-secondary/25',
    bar: 'bg-secondary',
  },
  {
    bg: 'bg-chart-3/5 hover:bg-chart-3/10',
    border: 'border-chart-3/25 hover:border-chart-3/45',
    avatarBg: 'bg-chart-3/15 text-chart-3 border-chart-3/25',
    iconColor: 'text-chart-3',
    badge: 'bg-chart-3/15 text-chart-3 border-chart-3/25',
    bar: 'bg-chart-3',
  },
  {
    bg: 'bg-warning/5 hover:bg-warning/10',
    border: 'border-warning/25 hover:border-warning/45',
    avatarBg: 'bg-warning/15 text-warning border-warning/25',
    iconColor: 'text-warning',
    badge: 'bg-warning/15 text-warning border-warning/25',
    bar: 'bg-warning',
  },
  {
    bg: 'bg-chart-5/5 hover:bg-chart-5/10',
    border: 'border-chart-5/25 hover:border-chart-5/45',
    avatarBg: 'bg-chart-5/15 text-chart-5 border-chart-5/25',
    iconColor: 'text-chart-5',
    badge: 'bg-chart-5/15 text-chart-5 border-chart-5/25',
    bar: 'bg-chart-5',
  },
  {
    bg: 'bg-accent/5 hover:bg-accent/10',
    border: 'border-accent/25 hover:border-accent/45',
    avatarBg: 'bg-accent/15 text-accent border-accent/25',
    iconColor: 'text-accent',
    badge: 'bg-accent/15 text-accent border-accent/25',
    bar: 'bg-accent',
  },
];

const DoctorAvatar: React.FC<{
  url?: string;
  name: string;
  avatarBg: string;
  iconColor: string;
}> = ({ url, name, avatarBg, iconColor }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={cn(
        'relative w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs overflow-hidden group-hover:scale-105 transition-all duration-200 border',
        avatarBg
      )}
    >
      {url && !hasError ? (
        <Image
          src={url}
          alt={name}
          fill
          sizes="40px"
          className="object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <Stethoscope className={cn('w-5 h-5', iconColor)} />
      )}
    </div>
  );
};

export const DoctorWorkloadCard: React.FC<DoctorWorkloadCardProps> = ({
  doctors,
  loading = false,
}) => {
  const maxCaseload = React.useMemo(() => {
    if (!doctors.length) return 1;
    return Math.max(...doctors.map((d) => d.patientCount), 1);
  }, [doctors]);

  return (
    <Card className="p-5 sm:p-6 rounded-3xl border border-border/80 bg-card shadow-xs h-full flex flex-col justify-between space-y-4">
      {/* Header: Modern, clean & stylish */}
      <div className="flex items-center justify-between pb-3 border-b border-border/50 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 shadow-2xs">
            <Activity className="w-4.5 h-4.5 text-primary" />
          </div>
          <div className="min-w-0 space-y-0.5">
            <h3 className="font-bold text-sm sm:text-base text-foreground truncate">
              Specialist Caseload Distribution
            </h3>
            <p className="text-xs text-muted-foreground font-medium truncate">
              Active clinical assignments per specialist
            </p>
          </div>
        </div>

        <Link
          href="/doctors"
          className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors inline-flex items-center gap-1 group py-1 px-2.5 rounded-xl hover:bg-primary/10 border border-transparent hover:border-primary/20 shrink-0"
        >
          <span>View All</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {/* Dynamic content with cross-fade: 2-column grid cards with colored backgrounds */}
      <div className="grid grid-cols-1 grid-rows-1 w-full flex-1">
        <AnimatePresence>
          {loading ? (
            <motion.div
              key="caseload-skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="col-start-1 row-start-1 w-full h-full flex items-center"
            >
              <DoctorWorkloadSkeleton />
            </motion.div>
          ) : doctors.length === 0 ? (
            <motion.div
              key="caseload-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="col-start-1 row-start-1 w-full h-full flex items-center justify-center py-12 text-xs text-muted-foreground"
            >
              No specialist assignments recorded yet.
            </motion.div>
          ) : (
            <motion.div
              key="caseload-live"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="col-start-1 row-start-1 w-full h-full grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 py-0.5 content-between"
            >
              {doctors.slice(0, 6).map((doc, idx) => {
                const theme = CARD_THEMES[idx % CARD_THEMES.length];
                return (
                  <div
                    key={doc._id || idx}
                    className={cn(
                      'p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 flex items-stretch justify-between gap-3 group shadow-2xs',
                      theme.bg,
                      theme.border
                    )}
                  >
                    {/* Left Section: Avatar, Info, Hospital & Progress bar */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between gap-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <DoctorAvatar
                          url={doc.avatar?.url}
                          name={doc.name}
                          avatarBg={theme.avatarBg}
                          iconColor={theme.iconColor}
                        />

                        <div className="min-w-0 flex-1 space-y-0.5">
                          <p className="font-bold text-xs sm:text-sm text-foreground truncate group-hover:text-primary transition-colors">
                            {doc.name}
                          </p>
                          <p className="text-[11px] sm:text-xs text-muted-foreground truncate font-medium">
                            {doc.specialization}
                          </p>
                        </div>
                      </div>

                      {/* Hospital & relative caseload bar */}
                      <div className="space-y-1.5 pt-1.5 border-t border-border/30">
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground/80 truncate">
                          <Building2 className="w-3 h-3 shrink-0 text-muted-foreground/50" />
                          <span className="truncate">{doc.hospital || 'Medical Center'}</span>
                        </div>

                        <div className="w-full h-1 rounded-full bg-muted/60 overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all duration-500',
                              theme.bar
                            )}
                            style={{
                              width: `${Math.min(100, Math.max(12, Math.round((doc.patientCount / maxCaseload) * 100)))}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Section: Full card height big number with small text below number */}
                    <div
                      className={cn(
                        'w-16 sm:w-20 rounded-xl flex flex-col items-center justify-center text-center p-2 border shrink-0 shadow-2xs self-stretch',
                        theme.badge
                      )}
                    >
                      <span className="text-2xl sm:text-3xl font-bold font-mono leading-none">
                        {doc.patientCount}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider opacity-80 mt-1 leading-tight">
                        {doc.patientCount === 1 ? 'Patient' : 'Patients'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default DoctorWorkloadCard;
