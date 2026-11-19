'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { Card, Badge, Skeleton } from '@/components/ui';
import { Calendar, RefreshCw, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DailyActivityChartSkeleton } from '@/components/skeletons/DailyActivityChartSkeleton';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

export interface DailyActivityItem {
  date: string;
  displayDate: string;
  dayName: string;
  patients: number;
  doctors: number;
  total: number;
}

interface DailyActivityChartProps {
  data: DailyActivityItem[];
  loading?: boolean;
  daysRange?: 7 | 14 | 30;
  onDaysRangeChange?: (days: 7 | 14 | 30) => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
    dataKey: string;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const patientsVal = payload.find((p) => p.dataKey === 'patients')?.value ?? 0;
  const doctorsVal = payload.find((p) => p.dataKey === 'doctors')?.value ?? 0;
  const combined = patientsVal + doctorsVal;

  return (
    <div className="bg-card/95 backdrop-blur-md border border-border/80 rounded-2xl p-3 shadow-xl text-xs space-y-2 min-w-44 transition-all pointer-events-none">
      <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
        <span className="font-bold text-foreground">{label}</span>
        <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-medium">
          {combined} {combined === 1 ? 'action' : 'actions'}
        </Badge>
      </div>
      <div className="space-y-1.5 pt-0.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1ac3b5] ring-2 ring-[#1ac3b5]/25" />
            <span className="text-muted-foreground font-medium">Patients Admitted</span>
          </div>
          <span className="font-bold text-foreground text-sm font-mono">{patientsVal}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#198dc7] ring-2 ring-[#198dc7]/25" />
            <span className="text-muted-foreground font-medium">Doctors Registered</span>
          </div>
          <span className="font-bold text-foreground text-sm font-mono">{doctorsVal}</span>
        </div>
      </div>
    </div>
  );
};

const emptySubscribe = () => () => {};

export const DailyActivityChart: React.FC<DailyActivityChartProps> = ({
  data,
  loading = false,
  daysRange = 14,
  onDaysRangeChange,
}) => {
  const [viewFilter, setViewFilter] = useState<'all' | 'patients' | 'doctors'>('all');
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const totalPatients = data.reduce((acc, curr) => acc + curr.patients, 0);
  const totalDoctors = data.reduce((acc, curr) => acc + curr.doctors, 0);
  const totalCombined = totalPatients + totalDoctors;
  const peakDay = data.reduce(
    (max, curr) => (curr.total > max.total ? curr : max),
    data[0] || { displayDate: 'None', total: 0 }
  );

  // Single unified max domain for consistent Y scaling
  const maxActivityVal = Math.max(
    1,
    ...(data.length ? data.map((d) => Math.max(d.patients, d.doctors)) : [1])
  );
  const yAxisMax = Math.max(4, Math.ceil(maxActivityVal * 1.25));

  return (
    <Card className="p-5 sm:p-6 rounded-3xl border border-border/80 bg-card shadow-xs h-full flex flex-col justify-between space-y-4">
      {/* Header: Clean, balanced & responsive */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-border/50">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 shadow-2xs">
            <Calendar className="w-4.5 h-4.5 text-primary" />
          </div>
          <div className="min-w-0 space-y-0.5">
            <h3 className="font-bold text-sm sm:text-base text-foreground truncate">
              Daily Activity Timeline
            </h3>
            <p className="text-xs text-muted-foreground font-medium truncate">
              Clinical admissions &amp; doctor registrations ({daysRange}D view)
            </p>
          </div>
        </div>

        {/* Filter Controls: Perfectly aligned in one row */}
        <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
          {/* Timeframe selector (7D, 14D, 30D) */}
          {onDaysRangeChange && (
            <div className="flex items-center gap-0.5 p-1 rounded-xl bg-muted/60 border border-border/70 text-xs shadow-2xs">
              {([7, 14, 30] as const).map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => onDaysRangeChange(days)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    daysRange === days
                      ? 'bg-card text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {days}D
                </button>
              ))}
            </div>
          )}

          {/* Activity Category Filters */}
          <div className="flex items-center gap-0.5 p-1 rounded-xl bg-muted/60 border border-border/70 text-xs shadow-2xs">
            <button
              type="button"
              onClick={() => setViewFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewFilter === 'all'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setViewFilter('patients')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewFilter === 'patients'
                  ? 'bg-secondary text-secondary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Patients
            </button>
            <button
              type="button"
              onClick={() => setViewFilter('doctors')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewFilter === 'doctors'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Doctors
            </button>
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="space-y-4 flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-1 grid-rows-1 w-full min-h-[250px] sm:min-h-[270px] flex-1 pt-1">
          <AnimatePresence>
            {loading ? (
              <motion.div
                key="chart-skeleton-layer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="col-start-1 row-start-1 w-full h-full"
              >
                <DailyActivityChartSkeleton />
              </motion.div>
            ) : data.length === 0 ? (
              <motion.div
                key="chart-empty-layer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="col-start-1 row-start-1 w-full h-full flex items-center justify-center text-xs text-muted-foreground"
              >
                No daily records found for the past {daysRange} days.
              </motion.div>
            ) : (
              <motion.div
                key="chart-live-layer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="col-start-1 row-start-1 w-full h-full"
              >
                {!isMounted ? (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                    <RefreshCw className="w-5 h-5 animate-spin text-primary mr-2" />
                    Loading chart...
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={data}
                      margin={{ top: 12, right: 12, left: -14, bottom: 2 }}
                    >
                      <defs>
                        {/* Soft modern gradient fill for Patients (Teal) */}
                        <linearGradient id="patientsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#1ac3b5" stopOpacity={0.28} />
                          <stop offset="95%" stopColor="#1ac3b5" stopOpacity={0.0} />
                        </linearGradient>

                        {/* Soft modern gradient fill for Doctors (Primary Blue) */}
                        <linearGradient id="doctorsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#198dc7" stopOpacity={0.28} />
                          <stop offset="95%" stopColor="#198dc7" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>

                      {/* Subtle horizontal-only dashed grid lines */}
                      <CartesianGrid
                        strokeDasharray="4 4"
                        vertical={false}
                        horizontal={true}
                        stroke="currentColor"
                        className="text-border/40"
                        opacity={0.35}
                      />

                      {/* X Axis */}
                      <XAxis
                        dataKey="displayDate"
                        stroke="currentColor"
                        className="text-muted-foreground text-[10px] sm:text-[11px]"
                        tickLine={false}
                        axisLine={{ stroke: 'currentColor', opacity: 0.15 }}
                        dy={8}
                      />

                      {/* Unified Single Left Y-Axis */}
                      <YAxis
                        stroke="currentColor"
                        className="text-muted-foreground text-[10px]"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 500 }}
                        domain={[0, yAxisMax]}
                        allowDecimals={false}
                        width={28}
                      />

                      {/* Tooltip */}
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{
                          stroke: 'currentColor',
                          strokeWidth: 1.5,
                          strokeDasharray: '4 4',
                          className: 'text-muted-foreground/30',
                        }}
                      />

                      {/* Patients Area Curve (Teal with Day Dots) */}
                      {(viewFilter === 'all' || viewFilter === 'patients') && (
                        <Area
                          type="monotone"
                          dataKey="patients"
                          name="Patients"
                          stroke="#1ac3b5"
                          strokeWidth={2.5}
                          fill="url(#patientsGradient)"
                          dot={{
                            r: 3.5,
                            strokeWidth: 2,
                            stroke: '#1ac3b5',
                            fill: 'var(--card)',
                          }}
                          activeDot={{
                            r: 6,
                            strokeWidth: 2.5,
                            stroke: '#1ac3b5',
                            fill: '#1ac3b5',
                          }}
                        />
                      )}

                      {/* Doctors Area Curve (Primary Blue with Day Dots) */}
                      {(viewFilter === 'all' || viewFilter === 'doctors') && (
                        <Area
                          type="monotone"
                          dataKey="doctors"
                          name="Doctors"
                          stroke="#198dc7"
                          strokeWidth={2.5}
                          fill="url(#doctorsGradient)"
                          dot={{
                            r: 3.5,
                            strokeWidth: 2,
                            stroke: '#198dc7',
                            fill: 'var(--card)',
                          }}
                          activeDot={{
                            r: 6,
                            strokeWidth: 2.5,
                            stroke: '#198dc7',
                            fill: '#198dc7',
                          }}
                        />
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Legend & Summary: Clean, aligned & minimal */}
        <div className="pt-3 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1ac3b5] ring-2 ring-[#1ac3b5]/25" />
              <span className="font-semibold text-foreground">Patients Admitted</span>
              {loading ? (
                <Skeleton className="w-6 h-3.5 rounded animate-pulse" />
              ) : (
                <span className="font-mono font-bold text-secondary">({totalPatients})</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#198dc7] ring-2 ring-[#198dc7]/25" />
              <span className="font-semibold text-foreground">Doctors Registered</span>
              {loading ? (
                <Skeleton className="w-6 h-3.5 rounded animate-pulse" />
              ) : (
                <span className="font-mono font-bold text-primary">({totalDoctors})</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
            <span className="flex items-center gap-1 font-medium">
              <Activity className="w-3.5 h-3.5 text-primary" />
              Total Operations:{' '}
              {loading ? (
                <Skeleton className="w-7 h-3 rounded animate-pulse inline-block ml-0.5" />
              ) : (
                <strong className="text-foreground font-bold font-mono ml-0.5">{totalCombined}</strong>
              )}
            </span>
            <span>•</span>
            <span className="font-medium">
              Peak Volume:{' '}
              {loading ? (
                <Skeleton className="w-14 h-3 rounded animate-pulse inline-block ml-0.5" />
              ) : (
                <>
                  <strong className="text-foreground font-semibold">{peakDay.displayDate}</strong> ({peakDay.total})
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DailyActivityChart;
