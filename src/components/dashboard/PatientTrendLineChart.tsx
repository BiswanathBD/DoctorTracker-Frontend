'use client';

import React, { useState, useRef } from 'react';
import { Card, Badge } from '@/components/ui';
import { TrendingUp, Sparkles, Activity } from 'lucide-react';

export interface TimelineDataPoint {
  date: string;
  displayDate: string;
  value: number;
}

interface PatientTrendLineChartProps {
  data: TimelineDataPoint[];
  loading?: boolean;
}

export const PatientTrendLineChart: React.FC<PatientTrendLineChartProps> = ({
  data,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // SVG dimensions
  const width = 600;
  const height = 180;
  const paddingX = 24;
  const paddingTop = 20;
  const paddingBottom = 28;

  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingTop - paddingBottom;

  const values = data.map((d) => d.value);
  const maxVal = Math.max(1, ...values);
  const totalCount = values.reduce((a, b) => a + b, 0);
  const peakPoint = data.reduce(
    (max, cur) => (cur.value > max.value ? cur : max),
    data[0] || { displayDate: '--', value: 0 }
  );

  // compute point coordinates
  const points = data.map((d, index) => {
    const x = paddingX + (index / Math.max(1, data.length - 1)) * innerWidth;
    const y = paddingTop + innerHeight - (d.value / maxVal) * innerHeight;
    return { x, y, data: d };
  });

  // compute smooth cubic bezier spline curve
  const getCurvePath = () => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cx1 = prev.x + (curr.x - prev.x) * 0.45;
      const cy1 = prev.y;
      const cx2 = curr.x - (curr.x - prev.x) * 0.45;
      const cy2 = curr.y;
      path += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`;
    }
    return path;
  };

  const curveD = getCurvePath();
  const areaD =
    points.length > 0
      ? `${curveD} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom
      } Z`
      : '';

  const activePoint = hoverIndex !== null && points[hoverIndex] ? points[hoverIndex] : null;

  return (
    <Card className="p-6 space-y-5 relative overflow-hidden group">
      {/* ambient top right glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 w-32 h-32 rounded-full bg-secondary/10 blur-2xl" />

      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center font-bold">
            <Activity className="w-4 h-4 text-secondary" />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground  flex items-center gap-2">
              Patient Admission Trend
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              Daily patient intake & admission momentum over the active observation period
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs py-0.5 px-2.5 font-medium">
            <TrendingUp className="w-3 h-3 mr-1" />
            {totalCount} Total Admitted
          </Badge>
        </div>
      </div>

      {/* interactive line chart container */}
      <div className="relative pt-2" ref={containerRef}>
        {/* tooltip display */}
        <div className="h-6 flex items-center justify-between text-xs px-1">
          {activePoint ? (
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping inline-block" />
              <span>{activePoint.data.displayDate}:</span>
              <span className="text-secondary font-bold">{activePoint.data.value} Admitted</span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              Hover across the trajectory line to inspect individual days
            </span>
          )}

          <div className="text-[11px] font-medium text-muted-foreground">
            Peak: <strong className="text-foreground">{peakPoint.displayDate} ({peakPoint.value})</strong>
          </div>
        </div>

        {/* SVG curve canvas */}
        <div className="relative w-full aspect-16/7 sm:aspect-16/6 mt-2">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full overflow-visible select-none"
            preserveAspectRatio="none"
          >
            <defs>
              {/* gradient area fill */}
              <linearGradient id="patient-trend-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--color-secondary, #06b6d4)" stopOpacity="0.35" />
                <stop offset="60%" stopColor="var(--color-secondary, #06b6d4)" stopOpacity="0.08" />
                <stop offset="100%" stopColor="var(--color-secondary, #06b6d4)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* horizontal guide lines */}
            <line
              x1={paddingX}
              y1={paddingTop}
              x2={width - paddingX}
              y2={paddingTop}
              stroke="currentColor"
              strokeDasharray="4 4"
              className="text-border/40"
              strokeWidth="1"
            />
            <line
              x1={paddingX}
              y1={paddingTop + innerHeight / 2}
              x2={width - paddingX}
              y2={paddingTop + innerHeight / 2}
              stroke="currentColor"
              strokeDasharray="4 4"
              className="text-border/30"
              strokeWidth="1"
            />
            <line
              x1={paddingX}
              y1={height - paddingBottom}
              x2={width - paddingX}
              y2={height - paddingBottom}
              stroke="currentColor"
              className="text-border/60"
              strokeWidth="1.5"
            />

            {/* gradient area */}
            {areaD && <path d={areaD} fill="url(#patient-trend-gradient)" />}

            {/* smooth line path */}
            {curveD && (
              <path
                d={curveD}
                fill="none"
                stroke="var(--color-secondary, #06b6d4)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* active hover crosshair vertical guide */}
            {activePoint && (
              <line
                x1={activePoint.x}
                y1={paddingTop}
                x2={activePoint.x}
                y2={height - paddingBottom}
                stroke="var(--color-secondary, #06b6d4)"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                className="opacity-80"
              />
            )}

            {/* point nodes */}
            {points.map((p, idx) => (
              <g key={idx}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoverIndex === idx ? 6 : p.data.value > 0 ? 3.5 : 2}
                  className={`transition-all duration-150 ${hoverIndex === idx
                      ? 'fill-secondary stroke-card stroke-2 ring-4 ring-secondary/30'
                      : 'fill-card stroke-secondary stroke-2'
                    }`}
                />
                {/* transparent hover target overlay */}
                <rect
                  x={p.x - 14}
                  y={0}
                  width={28}
                  height={height}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverIndex(idx)}
                  onMouseLeave={() => setHoverIndex(null)}
                />
              </g>
            ))}
          </svg>
        </div>

        {/* x-axis dates */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 px-1 font-medium">
          <span>{data[0]?.displayDate || 'Start'}</span>
          <span>{data[Math.floor(data.length / 2)]?.displayDate || 'Mid'}</span>
          <span>{data[data.length - 1]?.displayDate || 'Latest'}</span>
        </div>
      </div>
    </Card>
  );
};
