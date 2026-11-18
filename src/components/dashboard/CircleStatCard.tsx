'use client';

import React from 'react';
import { Card, Badge } from '@/components/ui';
import { TrendingUp, TrendingDown } from 'lucide-react';

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
  gradientTo,
  trendText,
  trendPositive = true,
  sparkline = [],
  insightText,
  loading = false,
}) => {
  // SVG circular geometry
  const radius = 30;
  const strokeWidth = 5.5;
  const circumference = 2 * Math.PI * radius;
  const clampedPercent = Math.min(Math.max(percentage, 0), 100);
  const strokeDashoffset = circumference - (clampedPercent / 100) * circumference;

  // 2-color pie slices calculation
  const pieGeometry = (() => {
    if (!pieMode || !pieSlices || pieSlices.length < 2) return null;
    const [s1, s2] = pieSlices;
    const total = Math.max(1, s1.value + s2.value);
    const len1 = (s1.value / total) * circumference;
    const len2 = (s2.value / total) * circumference;
    return {
      slice1: { ...s1, length: len1, offset: 0 },
      slice2: { ...s2, length: len2, offset: -len1 },
    };
  })();

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

  const activeColor = singleColor || gradientFrom;

  return (
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
              {loading ? '--' : value}
            </h3>
          </div>
        </div>

        {/* circle progress / 2-color pie gauge */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg className="w-[74px] h-[74px] -rotate-90 transform" viewBox="0 0 76 76">
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={gradientFrom} />
                <stop offset="100%" stopColor={gradientTo} />
              </linearGradient>
            </defs>

            {/* background track */}
            <circle
              cx="38"
              cy="38"
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-muted/40"
              fill="none"
            />

            {pieMode && pieGeometry ? (
              // 2-color pie chart ring for ratio
              <>
                {/* Slice 1 (e.g. Patients) */}
                <circle
                  cx="38"
                  cy="38"
                  r={radius}
                  stroke={pieGeometry.slice1.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${pieGeometry.slice1.length} ${circumference}`}
                  strokeDashoffset={pieGeometry.slice1.offset}
                  className="transition-all duration-1000 ease-out"
                  fill="none"
                />
                {/* Slice 2 (e.g. Doctors) */}
                <circle
                  cx="38"
                  cy="38"
                  r={radius}
                  stroke={pieGeometry.slice2.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${pieGeometry.slice2.length} ${circumference}`}
                  strokeDashoffset={pieGeometry.slice2.offset}
                  className="transition-all duration-1000 ease-out"
                  fill="none"
                />
              </>
            ) : (
              // Single solid color or gradient ring
              <circle
                cx="38"
                cy="38"
                r={radius}
                stroke={singleColor || `url(#${gradientId})`}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={loading ? circumference : strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                fill="none"
              />
            )}
          </svg>

          {/* inner circle center content with real contextual sublabel */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-[11px] font-extrabold text-foreground tracking-tight leading-tight">
              {percentLabel || `${Math.round(clampedPercent)}%`}
            </span>
            <span className="text-[7.5px] font-bold text-muted-foreground uppercase tracking-wider leading-none mt-0.5">
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
  );
};
