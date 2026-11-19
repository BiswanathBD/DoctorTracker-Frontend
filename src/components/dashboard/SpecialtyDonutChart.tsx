'use client';

import React, { useState, useMemo } from 'react';
import { Card, Badge } from '@/components/ui';
import { Layers } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { SpecialtyDonutSkeleton } from '@/components/skeletons/SpecialtyDonutSkeleton';

export interface SpecialtyItem {
  specialization: string;
  count: number;
}

interface SpecialtyDonutChartProps {
  data: SpecialtyItem[];
  loading?: boolean;
}

const PALETTE = [
  '#198dc7', // primary blue
  '#1ac3b5', // secondary teal
  '#6366f1', // indigo
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ec4899', // rose pink
  '#8b5cf6', // violet
  '#06b6d4', // cyan
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      specialization: string;
      count: number;
      percent: number;
      color: string;
    };
  }>;
}

const CustomPieTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0].payload;

  return (
    <div className="bg-card/95 backdrop-blur-md border border-border/80 rounded-2xl p-3 shadow-xl text-xs space-y-1.5 min-w-40 pointer-events-none">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
        <span className="font-bold text-foreground truncate">{item.specialization}</span>
      </div>
      <div className="flex items-center justify-between text-muted-foreground pt-1 border-t border-border/50 text-[11px]">
        <span>Specialists:</span>
        <strong className="text-foreground font-mono">{item.count}</strong>
      </div>
      <div className="flex items-center justify-between text-muted-foreground text-[11px]">
        <span>Share:</span>
        <strong className="text-foreground font-mono">{item.percent}%</strong>
      </div>
    </div>
  );
};

export const SpecialtyDonutChart: React.FC<SpecialtyDonutChartProps> = ({
  data,
  loading = false,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const totalSpecialists = useMemo(
    () => data.reduce((acc, curr) => acc + curr.count, 0),
    [data]
  );

  const chartData = useMemo(() => {
    return data.map((item, idx) => {
      const percent = totalSpecialists > 0 ? Math.round((item.count / totalSpecialists) * 100) : 0;
      return {
        ...item,
        percent,
        color: PALETTE[idx % PALETTE.length],
      };
    });
  }, [data, totalSpecialists]);

  const activeItem = hoveredIdx !== null ? chartData[hoveredIdx] : null;

  return (
    <Card className="p-6 space-y-4 h-full flex flex-col justify-between hover:border-primary/30 transition-all duration-300">
      {/* header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Layers className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground tracking-tight">
              Specialization Distribution
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              Medical discipline share across active specialists
            </p>
          </div>
        </div>

        <Badge variant="outline" className="text-xs py-0.5 px-2.5 font-medium">
          {data.length} {data.length === 1 ? 'Discipline' : 'Disciplines'}
        </Badge>
      </div>

      {/* dynamic content with cross-fade */}
      <div className="grid grid-cols-1 grid-rows-1 w-full flex-1">
        <AnimatePresence>
          {loading ? (
            <motion.div
              key="specialty-skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="col-start-1 row-start-1 w-full h-full flex items-center"
            >
              <SpecialtyDonutSkeleton />
            </motion.div>
          ) : data.length === 0 ? (
            <motion.div
              key="specialty-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="col-start-1 row-start-1 w-full h-full flex items-center justify-center py-14 text-xs text-muted-foreground"
            >
              No specialization records registered.
            </motion.div>
          ) : (
            <motion.div
              key="specialty-live"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="col-start-1 row-start-1 w-full h-full flex flex-col items-center justify-between gap-4 py-1"
            >
              {/* Top: Modern Recharts Donut with gaps and rounded corners */}
              <div className="relative shrink-0 w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center mx-auto my-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={62}
                      outerRadius={84}
                      cornerRadius={4}
                      paddingAngle={chartData.length > 1 ? 4 : 0}
                      dataKey="count"
                      nameKey="specialization"
                      startAngle={90}
                      endAngle={-270}
                      stroke="none"
                      isAnimationActive={true}
                      onMouseEnter={(_, index) => setHoveredIdx(index)}
                      onMouseLeave={() => setHoveredIdx(null)}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          opacity={hoveredIdx === null || hoveredIdx === index ? 1 : 0.35}
                          className="transition-all duration-300 cursor-pointer"
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center text display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-3">
                  <span className="text-2xl sm:text-3xl font-black tracking-tight text-foreground leading-none">
                    {activeItem ? `${activeItem.percent}%` : totalSpecialists}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1.5 truncate max-w-32">
                    {activeItem ? activeItem.specialization : 'Specialists'}
                  </span>
                </div>
              </div>

              {/* Bottom: Modern Interactive Pills */}
              <div className="w-full flex flex-wrap items-center justify-center gap-2 pt-3 border-t border-border/50">
                {chartData.map((item, idx) => {
                  const isHovered = hoveredIdx === idx;
                  return (
                    <button
                      key={item.specialization}
                      type="button"
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all duration-200 cursor-pointer ${
                        isHovered
                          ? 'border-primary/60 bg-primary/10 shadow-xs scale-105'
                          : 'border-border/60 bg-muted/20 hover:bg-muted/40 hover:border-border'
                      }`}
                      style={{
                        backgroundColor: isHovered ? `${item.color}15` : undefined,
                        borderColor: isHovered ? item.color : undefined,
                      }}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform"
                        style={{
                          backgroundColor: item.color,
                          boxShadow: `0 0 0 2px ${item.color}35`,
                        }}
                      />
                      <span className="font-semibold text-foreground truncate max-w-36">
                        {item.specialization}
                      </span>
                      <span className="text-muted-foreground text-[11px] font-medium">
                        ({item.count})
                      </span>
                      <span
                        className="font-bold text-[11px] font-mono px-1.5 py-0.2 rounded-md"
                        style={{
                          backgroundColor: `${item.color}15`,
                          color: item.color,
                        }}
                      >
                        {item.percent}%
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default SpecialtyDonutChart;
