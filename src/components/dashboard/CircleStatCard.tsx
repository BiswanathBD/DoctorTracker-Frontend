'use client';

import React, { useMemo } from 'react';
import { Card, Badge } from '@/components/ui';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { CircleStatCardSkeleton } from '@/components/skeletons/CircleStatCardSkeleton';

export interface PieSlice {
  value: number;
  color: string;
}

export interface CircleStatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  percentage: number; // 0 - 100
  percentLabel?: string;
  sublabel?: string; // e.g. "ACTIVE", "IN CARE", "RATIO", "SPREAD"
  badgeText: string;
  badgeVariant?: 'primary' | 'secondary' | 'success' | 'warning' | 'outline';
  singleColor?: string; // solid single color when requested
  pieMode?: boolean; // 2-color pie/donut mode for ratio
  pieSlices?: [PieSlice, PieSlice]; // [Patients slice, Doctors slice]
  gradientId: string;
  gradientFrom: string;
  gradientTo: string;
  trendText?: string;
  trendPositive?: boolean;
  sparkline?: number[];
  insightText?: string;
  loading?: boolean;
}

export const CircleStatCard: React.FC<CircleStatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  percentage,
  percentLabel,
  sublabel = 'RATE',
  badgeText,
  badgeVariant = 'primary',
  singleColor,
  pieMode = false,
  pieSlices,
  gradientId,
  gradientFrom,
  trendText,
  trendPositive = true,
  sparkline = [],
  insightText,
  loading = false,
}) => {
  const clampedPercent = Math.min(Math.max(percentage, 0), 100);
  const activeColor = singleColor || gradientFrom;

  // Recharts Pie Chart data with gap (paddingAngle) and rounded corners (cornerRadius)
  const chartData = useMemo(() => {
    if (pieMode && pieSlices && pieSlices.length >= 2) {
      const [s1, s2] = pieSlices;
      return [
        { name: 'Slice 1', value: Math.max(0.1, s1.value), color: s1.color },
        { name: 'Slice 2', value: Math.max(0.1, s2.value), color: s2.color },
      ];
    }

    const filled = clampedPercent;
    if (filled <= 0) {
      return [{ name: 'Remaining', value: 100, color: 'rgba(150, 150, 150, 0.18)' }];
    }
    if (filled >= 100) {
      return [{ name: 'Filled', value: 100, color: activeColor }];
    }
    return [
      { name: 'Filled', value: filled, color: activeColor },
      { name: 'Remaining', value: 100 - filled, color: 'rgba(150, 150, 150, 0.18)' },
    ];
  }, [pieMode, pieSlices, clampedPercent, activeColor]);

  // Mini sparkline computation (7 points)
  const sparkWidth = 72;
  const sparkHeight = 26;
  const sparkPoints = (() => {
    if (!sparkline || sparkline.length < 2) return null;
    const max = Math.max(1, ...sparkline);
    const min = 0;
    const range = max - min || 1;
    const points = sparkline.map((val, i) => {
      const x = (i / (sparkline.length - 1)) * (sparkWidth - 4) + 2;
      const y = sparkHeight - 2 - ((val - min) / range) * (sparkHeight - 6);
      return { x, y };
    });

    let linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cx1 = prev.x + (curr.x - prev.x) * 0.45;
      const cy1 = prev.y;
      const cx2 = curr.x - (curr.x - prev.x) * 0.45;
      const cy2 = curr.y;
      linePath += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`;
    }

    const areaPath = `${linePath} L ${points[points.length - 1].x} ${sparkHeight} L ${points[0].x} ${sparkHeight} Z`;
    return { linePath, areaPath };
  })();

  return (
    <div className="grid grid-cols-1 grid-rows-1 h-full w-full">
      <AnimatePresence>
        {loading ? (
          <motion.div
            key="card-skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="col-start-1 row-start-1 h-full w-full"
          >
            <CircleStatCardSkeleton
              title={title}
              icon={icon}
              activeColor={activeColor}
              sublabel={sublabel}
              badgeText={badgeText}
              badgeVariant={badgeVariant}
            />
          </motion.div>
        ) : (
          <motion.div
            key="card-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="col-start-1 row-start-1 h-full w-full"
          >
          <Card className="relative overflow-hidden p-5 flex flex-col justify-between h-full group hover:shadow-xl hover:border-primary/40 transition-all duration-300">
            {/* subtle ambient background glow */}
            <div
              className="pointer-events-none absolute -right-8 -top-8 w-28 h-28 rounded-full blur-2xl opacity-15 transition-opacity group-hover:opacity-30"
              style={{ backgroundColor: activeColor }}
            />

            {/* card top section */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md bg-muted/80 flex items-center justify-center text-muted-foreground shrink-0 group-hover:text-foreground transition-colors">
                    {icon}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {title}
                  </span>
                </div>

                <div className="pt-1 flex items-baseline gap-2">
                  <h3 className="text-3xl font-extrabold tracking-tight text-foreground">
                    {value}
                  </h3>
                </div>
              </div>

              {/* circle progress / recharts pie chart with gap and rounded corners */}
              <div className="relative shrink-0 w-17 h-17 flex items-center justify-center">
                <PieChart width={68} height={68} className="overflow-visible">
                  <Pie
                    data={chartData}
                    cx={29}
                    cy={29}
                    innerRadius={27}
                    outerRadius={32}
                    cornerRadius={3}
                    paddingAngle={chartData.length > 1 ? 5 : 0}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                    isAnimationActive={true}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>

                {/* inner circle center content with real contextual sublabel */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-[10.5px] font-extrabold text-foreground tracking-tight leading-tight">
                    {percentLabel || `${Math.round(clampedPercent)}%`}
                  </span>
                  <span className="text-[7px] font-bold text-muted-foreground uppercase tracking-wider leading-none mt-0.5">
                    {sublabel}
                  </span>
                </div>
              </div>
            </div>

            {/* middle sparkline & insight */}
            <div className="py-2.5 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                {insightText ? (
                  <p className="text-xs font-semibold text-foreground/85 truncate">
                    {insightText}
                  </p>
                ) : subtitle ? (
                  <p className="text-xs text-muted-foreground truncate font-medium">
                    {subtitle}
                  </p>
                ) : null}
              </div>

              {/* 7-day mini sparkline visual */}
              {sparkPoints && (
                <div className="shrink-0 flex items-center">
                  <svg
                    width={sparkWidth}
                    height={sparkHeight}
                    viewBox={`0 0 ${sparkWidth} ${sparkHeight}`}
                    className="overflow-visible opacity-85 group-hover:opacity-100 transition-opacity"
                  >
                    <defs>
                      <linearGradient id={`spark-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={activeColor} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={activeColor} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <path
                      d={sparkPoints.areaPath}
                      fill={`url(#spark-${gradientId})`}
                    />
                    <path
                      d={sparkPoints.linePath}
                      fill="none"
                      stroke={activeColor}
                      strokeWidth={1.75}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* card bottom section */}
            <div className="pt-2.5 border-t border-border/60 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0" title={trendText}>
                {trendText && (
                  <span
                    className={`text-[11px] font-semibold flex items-center gap-1 truncate ${
                      trendPositive ? 'text-success' : 'text-muted-foreground'
                    }`}
                  >
                    {trendPositive ? (
                      <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span className="truncate">{trendText}</span>
                  </span>
                )}
              </div>

              <Badge variant={badgeVariant} className="text-[10px] py-0.5 px-2 font-semibold shrink-0 whitespace-nowrap">
                {badgeText}
              </Badge>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
    </div>
  );
};
