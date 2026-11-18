'use client';

import React, { useState } from 'react';
import { Card, Badge } from '@/components/ui';
import { Layers } from 'lucide-react';

export interface SpecialtyItem {
  specialization: string;
  count: number;
}

interface SpecialtyDonutChartProps {
  data: SpecialtyItem[];
  loading?: boolean;
}

const PALETTE = [
  '#0284c7', // primary blue
  '#06b6d4', // secondary cyan
  '#10b981', // emerald green
  '#8b5cf6', // purple
  '#f59e0b', // amber
  '#ec4899', // pink
  '#3b82f6', // indigo
  '#14b8a6', // teal
];

export const SpecialtyDonutChart: React.FC<SpecialtyDonutChartProps> = ({
  data,
  loading = false,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const totalSpecialists = data.reduce((acc, curr) => acc + curr.count, 0);

  // SVG donut geometry
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const slices = data.reduce<
    Array<
      SpecialtyItem & {
        percent: number;
        color: string;
        strokeDasharray: string;
        strokeDashoffset: number;
        cumulative: number;
      }
    >
  >((acc, item, idx) => {
    const percent = totalSpecialists > 0 ? (item.count / totalSpecialists) * 100 : 0;
    const prevCumulative = acc.length > 0 ? acc[acc.length - 1].cumulative : 0;
    const strokeDasharray = `${(percent / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((prevCumulative / 100) * circumference);
    acc.push({
      ...item,
      percent: Math.round(percent),
      color: PALETTE[idx % PALETTE.length],
      strokeDasharray,
      strokeDashoffset,
      cumulative: prevCumulative + percent,
    });
    return acc;
  }, []);

  const activeSlice = hoveredIdx !== null ? slices[hoveredIdx] : null;

  return (
    <Card className="p-6 space-y-5 h-full flex flex-col justify-between">
      {/* header */}
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
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
          {data.length} Disciplines
        </Badge>
      </div>

      {loading ? (
        <div className="py-14 text-center text-xs text-muted-foreground">
          Loading discipline metrics...
        </div>
      ) : data.length === 0 ? (
        <div className="py-14 text-center text-xs text-muted-foreground">
          No specialization records registered.
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
          {/* donut SVG */}
          <div className="relative shrink-0 flex items-center justify-center">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="-rotate-90 transform select-none"
            >
              {/* background track */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="none"
                className="text-muted/30"
              />

              {/* slices */}
              {slices.map((slice, idx) => (
                <circle
                  key={slice.specialization}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={slice.color}
                  strokeWidth={hoveredIdx === idx ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                  fill="none"
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              ))}
            </svg>

            {/* center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {activeSlice ? `${activeSlice.percent}%` : totalSpecialists}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                {activeSlice ? activeSlice.specialization : 'Specialists'}
              </span>
            </div>
          </div>

          {/* legend list */}
          <div className="flex-1 w-full grid grid-cols-1 gap-2">
            {slices.slice(0, 6).map((slice, idx) => (
              <div
                key={slice.specialization}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`p-2 rounded-xl flex items-center justify-between text-xs transition-colors cursor-pointer ${
                  hoveredIdx === idx ? 'bg-muted' : 'hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="font-semibold text-foreground truncate">
                    {slice.specialization}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-muted-foreground font-medium">
                    {slice.count} docs
                  </span>
                  <span className="font-bold text-foreground min-w-8 text-right">
                    {slice.percent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
