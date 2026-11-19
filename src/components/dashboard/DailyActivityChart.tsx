'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { Card, Badge, Skeleton } from '@/components/ui';
import { Calendar, RefreshCw, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DailyActivityChartSkeleton } from '@/components/skeletons/DailyActivityChartSkeleton';
import {
  ResponsiveContainer,
  LineChart,
  Line,
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
    <div className="bg-card/95 backdrop-blur-md border border-border/80 rounded-2xl p-3.5 shadow-xl text-xs space-y-2 min-w-44 transition-all pointer-events-none">
      <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
        <span className="font-bold text-foreground">{label}</span>
        <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-medium">
          {combined} {combined === 1 ? 'record' : 'records'}
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

  const maxPatients = Math.max(1, ...(data.length ? data.map((d) => d.patients) : [1]));
  const maxDoctors = Math.max(1, ...(data.length ? data.map((d) => d.doctors) : [1]));

  return (
    <Card className="p-6 space-y-6">
      {/* header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground tracking-tight flex items-center gap-2">
                Daily Operations & Activity Timeline
              </h3>
              <p className="text-xs text-muted-foreground font-medium">
                Day-by-day record of clinical admissions and specialist registrations over the last {daysRange} days
              </p>
            </div>
          </div>
        </div>

        {/* filter & timeframe controls */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
          {/* 7D, 14D, 30D timeframe toggle */}
          {onDaysRangeChange && (
            <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/60 border border-border/70 text-xs shadow-2xs">
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

          {/* view filter */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/70 border border-border/80 text-xs shadow-2xs">
            <button
              type="button"
              onClick={() => setViewFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewFilter === 'all'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All Activity
            </button>
            <button
              type="button"
              onClick={() => setViewFilter('patients')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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

      <div className="space-y-6">
        {/* Dynamic Chart Area with smooth cross-fade for API data */}
        <div className="grid grid-cols-1 grid-rows-1 w-full h-72 pt-2">
          <AnimatePresence>
            {loading ? (
              <motion.div
                key="chart-skeleton-layer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
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
                transition={{ duration: 0.3, ease: 'easeInOut' }}
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
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="col-start-1 row-start-1 w-full h-full"
              >
                {!isMounted ? (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                    <RefreshCw className="w-5 h-5 animate-spin text-primary mr-2" />
                    Loading chart...
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data}
                      margin={{ top: 14, right: 14, left: 6, bottom: 4 }}
                    >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={true}
                    horizontal={true}
                    stroke="currentColor"
                    className="text-border/40"
                    opacity={0.35}
                  />

                  <XAxis
                    dataKey="displayDate"
                    stroke="currentColor"
                    className="text-muted-foreground text-[10px]"
                    tickLine={false}
                    axisLine={{ stroke: 'currentColor', opacity: 0.15 }}
                    dy={6}
                  />

                  {/* Left Y Axis (Patients - Teal) */}
                  {(viewFilter === 'all' || viewFilter === 'patients') && (
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      width={32}
                      stroke="#1ac3b5"
                      tickLine={false}
                      axisLine={{ stroke: '#1ac3b5', opacity: 0.3 }}
                      tick={{ fill: '#1ac3b5', fontSize: 10, fontWeight: 600 }}
                      domain={[0, Math.max(4, Math.ceil(maxPatients * 1.25))]}
                      allowDecimals={false}
                    />
                  )}

                  {/* Right Y Axis (Doctors - Primary Biaxial) */}
                  {(viewFilter === 'all' || viewFilter === 'doctors') && (
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      width={32}
                      stroke="#198dc7"
                      tickLine={false}
                      axisLine={{ stroke: '#198dc7', opacity: 0.3 }}
                      tick={{ fill: '#198dc7', fontSize: 10, fontWeight: 600 }}
                      domain={[0, Math.max(3, Math.ceil(maxDoctors * 1.35))]}
                      allowDecimals={false}
                    />
                  )}

                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{
                      stroke: 'currentColor',
                      strokeWidth: 1.5,
                      strokeDasharray: '4 4',
                      className: 'text-muted-foreground/30',
                    }}
                  />

                  {/* Patients Line (Teal with Circular Dots) */}
                  {(viewFilter === 'all' || viewFilter === 'patients') && (
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="patients"
                      name="Patients"
                      stroke="#1ac3b5"
                      strokeWidth={2.5}
                      dot={{
                        r: 4,
                        strokeWidth: 2,
                        stroke: '#1ac3b5',
                        fill: 'var(--card)',
                      }}
                      activeDot={{
                        r: 6.5,
                        strokeWidth: 3,
                        stroke: '#1ac3b5',
                        fill: '#1ac3b5',
                      }}
                    />
                  )}

                  {/* Doctors Line (Primary with Circular Dots) */}
                  {(viewFilter === 'all' || viewFilter === 'doctors') && (
                    <Line
                      yAxisId={viewFilter === 'doctors' ? 'right' : 'right'}
                      type="monotone"
                      dataKey="doctors"
                      name="Doctors"
                      stroke="#198dc7"
                      strokeWidth={2.5}
                      dot={{
                        r: 4,
                        strokeWidth: 2,
                        stroke: '#198dc7',
                        fill: 'var(--card)',
                      }}
                      activeDot={{
                        r: 6.5,
                        strokeWidth: 3,
                        stroke: '#198dc7',
                        fill: '#198dc7',
                      }}
                    />
                  )}
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

          {/* Chart Legend & Summary matching Reference Image 5 */}
          <div className="pt-2 border-t border-border/60 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#1ac3b5] ring-2 ring-[#1ac3b5]/25" />
                <span className="font-semibold text-foreground">Patients Admitted</span>
                {loading ? (
                  <Skeleton className="w-6 h-3.5 rounded animate-pulse" />
                ) : (
                  <span className="font-mono text-muted-foreground">({totalPatients})</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#198dc7] ring-2 ring-[#198dc7]/25" />
                <span className="font-semibold text-foreground">Doctors Registered</span>
                {loading ? (
                  <Skeleton className="w-6 h-3.5 rounded animate-pulse" />
                ) : (
                  <span className="font-mono text-muted-foreground">({totalDoctors})</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-muted-foreground text-[11px]">
              <span className="flex items-center gap-1 font-medium">
                <Activity className="w-3.5 h-3.5 text-primary" />
                Total Operations:{' '}
                {loading ? (
                  <Skeleton className="w-7 h-3 rounded animate-pulse inline-block ml-0.5" />
                ) : (
                  <strong className="text-foreground font-mono ml-0.5">{totalCombined}</strong>
                )}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
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
