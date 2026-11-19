'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui';
import { BarChart3, Building2, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DoctorWorkloadSkeleton } from '@/components/skeletons/DoctorWorkloadSkeleton';
import type { PatientsPerDoctorItem } from '@/types/dashboard.types';

interface DoctorWorkloadCardProps {
  doctors: PatientsPerDoctorItem[];
  loading?: boolean;
}

const getInitials = (name?: string): string => {
  if (!name || typeof name !== 'string') return 'DR';
  const cleanName = name.replace(/^(Dr\.|Doctor|Prof\.|MD)\s+/i, '').trim();
  const parts = cleanName.split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return cleanName.slice(0, 2).toUpperCase() || 'DR';
};

export const DoctorWorkloadCard: React.FC<DoctorWorkloadCardProps> = ({
  doctors,
  loading = false,
}) => {
  return (
    <Card className="p-6 space-y-5 h-full flex flex-col justify-between hover:border-primary/30 transition-all duration-300">
      {/* header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
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
          className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 group py-1 px-2.5 rounded-lg hover:bg-primary/5"
        >
          <span>View All</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {/* dynamic content with cross-fade */}
      <div className="grid grid-cols-1 grid-rows-1 w-full flex-1">
        <AnimatePresence>
          {loading ? (
            <motion.div
              key="caseload-skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
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
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="col-start-1 row-start-1 w-full h-full flex items-center justify-center py-14 text-xs text-muted-foreground"
            >
              No doctor assignments recorded yet.
            </motion.div>
          ) : (
            <motion.div
              key="caseload-live"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="col-start-1 row-start-1 w-full h-full space-y-2.5 py-1 flex flex-col justify-between"
            >
              {doctors.slice(0, 5).map((doc, idx) => {
                return (
                  <div
                    key={doc._id || idx}
                    className="p-3.5 rounded-2xl border border-border/40 bg-card/40 hover:bg-muted/30 hover:border-primary/25 transition-all duration-200 flex items-center justify-between gap-4 group"
                  >
                    {/* Left: Avatar & Info */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Doctor Avatar */}
                      <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary/15 to-secondary/15 text-primary border border-primary/20 flex items-center justify-center text-xs font-bold shrink-0 tracking-tight shadow-xs">
                        {getInitials(doc.name)}
                      </div>

                      {/* Doctor Name & Details */}
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                          {doc.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 truncate">
                          <span className="font-medium text-foreground/80 truncate">
                            {doc.specialization}
                          </span>
                          {doc.hospital && (
                            <>
                              <span className="text-muted-foreground/40">•</span>
                              <span className="flex items-center gap-1 truncate text-muted-foreground">
                                <Building2 className="w-3 h-3 shrink-0 text-muted-foreground/60" />
                                <span className="truncate">{doc.hospital}</span>
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Large Patient Count in minimal styling */}
                    <div className="flex flex-col items-end shrink-0 pl-2">
                      <span className="text-2xl sm:text-3xl font-black font-mono text-primary leading-none tracking-tight">
                        {doc.patientCount}
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">
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
