'use client';

import React, { useState, useMemo } from 'react';
import { Card, Badge } from '@/components/ui';
import { PieChart as PieChartIcon } from 'lucide-react';
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
  '#198dc7', // blue
  '#1ac3b5', // teal
  '#8b5cf6', // violet
  '#f59e0b', // amber
  '#ec4899', // rose pink
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#f97316', // orange
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
      <div className="flex items-center justify-between text-muted-foreground pt-1 border-t border-border/50 text-xs">
        <span>Specialists:</span>
        <strong className="text-foreground font-mono">{item.count}</strong>
      </div>
      <div className="flex items-center justify-between text-muted-foreground text-xs">
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
    <Card className="p-5 sm:p-6 rounded-3xl border border-border/80 bg-card shadow-xs h-full flex flex-col justify-between space-y-4">
      {/* Header: Clean & minimal */}
      <div className="flex items-center justify-between pb-3 border-b border-border/50 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0 border border-secondary/20 shadow-2xs">
            <PieChartIcon className="w-4.5 h-4.5 text-secondary" />
          </div>
          <div className="min-w-0 space-y-0.5">
            <h3 className="font-bold text-sm sm:text-base text-foreground truncate">
              Specialization Distribution
            </h3>
            <p className="text-xs text-muted-foreground font-medium truncate">
              Discipline share across active specialists
            </p>
          </div>
        </div>

        <Badge variant="outline" className="text-xs py-1 px-2.5 rounded-xl font-medium shrink-0">
          {data.length} {data.length === 1 ? 'Discipline' : 'Disciplines'}
        </Badge>
      </div>

      {/* Dynamic content with cross-fade */}
      <div className="grid grid-cols-1 grid-rows-1 w-full flex-1">
        <AnimatePresence>
          {loading ? (
            <motion.div
              key="specialty-skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
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
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="col-start-1 row-start-1 w-full h-full flex items-center justify-center py-12 text-xs text-muted-foreground"
            >
              No specialization records registered.
            </motion.div>
          ) : (
            <motion.div
              key="specialty-live"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="col-start-1 row-start-1 w-full h-full flex flex-col items-center justify-between gap-4 py-0.5"
            >
              {/* Donut ring */}
              <div className="relative shrink-0 w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center mx-auto my-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={62}
                      outerRadius={82}
                      cornerRadius={5}
                      paddingAngle={chartData.length > 1 ? 3 : 0}
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
                          className="transition-all duration-200 cursor-pointer"
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center text display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
                  <div className="w-20 h-20 rounded-full bg-card/85 backdrop-blur-xs border border-border/40 flex flex-col items-center justify-center shadow-2xs">
                    <span className="text-2xl sm:text-3xl font-bold text-foreground leading-none font-mono">
                      {activeItem ? `${activeItem.percent}%` : totalSpecialists}
                    </span>
                    <span className="text-[11px] font-semibold text-muted-foreground mt-1 truncate max-w-16">
                      {activeItem ? activeItem.specialization : 'Specialists'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom modern 2-column discipline grid */}
              <div className="grid grid-cols-2 gap-2 w-full pt-3 border-t border-border/50">
                {chartData.map((item, idx) => {
                  const isHovered = hoveredIdx === idx;
                  return (
                    <button
                      key={item.specialization}
                      type="button"
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                      className={`flex items-center justify-between p-2 sm:p-2.5 rounded-xl border text-xs transition-all duration-200 cursor-pointer text-left ${
                        isHovered
                          ? 'shadow-2xs'
                          : 'bg-muted/15 border-border/40 hover:bg-muted/25 hover:border-border/70'
                      }`}
                      style={{
                        backgroundColor: isHovered ? `${item.color}22` : `${item.color}0d`,
                        borderColor: isHovered ? item.color : `${item.color}30`,
                      }}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium text-foreground truncate text-xs">
                          {item.specialization}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 pl-1 font-mono">
                        <span className="text-xs font-bold" style={{ color: item.color }}>
                          {item.count}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          ({item.percent}%)
                        </span>
                      </div>
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
