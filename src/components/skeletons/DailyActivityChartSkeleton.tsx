'use client';

import React from 'react';
import { Skeleton } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface DailyActivityChartSkeletonProps {
  className?: string;
  animated?: boolean;
}

export const DailyActivityChartSkeleton: React.FC<DailyActivityChartSkeletonProps> = ({
  className,
  animated = true,
}) => {
  return (
    <div className={cn('w-full h-full flex flex-col justify-between', className)}>
      <div className="relative w-full h-60 flex flex-col justify-between py-1 border-b border-border/30">
        {/* Left Y-axis ticks in teal (0 to 4) */}
        <div className="absolute left-1 inset-y-2 flex flex-col justify-between text-[10px] font-semibold text-[#1ac3b5]/40 pointer-events-none select-none">
          <span>4</span>
          <span>3</span>
          <span>2</span>
          <span>1</span>
          <span>0</span>
        </div>

        {/* Right Y-axis ticks in primary (0 to 7) */}
        <div className="absolute right-1 inset-y-2 flex flex-col justify-between text-[10px] font-semibold text-primary/40 pointer-events-none select-none">
          <span>7</span>
          <span>6</span>
          <span>4</span>
          <span>2</span>
          <span>0</span>
        </div>

        {/* Horizontal dashed grid guides */}
        <div className="w-full ml-8 mr-8 border-b border-border/20 border-dashed" />
        <div className="w-full ml-8 mr-8 border-b border-border/20 border-dashed" />
        <div className="w-full ml-8 mr-8 border-b border-border/20 border-dashed" />
        <div className="w-full ml-8 mr-8 border-b border-border/20 border-dashed" />
        <div className="w-full ml-8 mr-8 border-b border-border/20 border-dashed" />

        {/* Clean dual-line SVG curves */}
        <div className="absolute inset-0 px-8 py-2 pointer-events-none">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
            {/* Patients Clean Line (Teal) */}
            <path
              d="M 25 175 C 45 150, 55 130, 75 130 L 275 130 C 295 130, 305 175, 325 175 C 345 175, 355 130, 375 130 C 395 130, 405 175, 425 175 L 575 175 C 595 175, 605 90, 625 90 C 645 90, 655 175, 675 175"
              fill="none"
              stroke="#1ac3b5"
              strokeWidth="2"
              strokeOpacity="0.45"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn(animated && 'animate-pulse')}
            />

            {/* Patients Vertex Dots */}
            {[
              [25, 175],
              [75, 130],
              [125, 130],
              [175, 130],
              [225, 130],
              [275, 130],
              [325, 175],
              [375, 130],
              [425, 175],
              [475, 175],
              [525, 175],
              [575, 175],
              [625, 90],
              [675, 175],
            ].map(([cx, cy], i) => (
              <circle
                key={`p-dot-${i}`}
                cx={cx}
                cy={cy}
                r="3"
                fill="var(--card)"
                stroke="#1ac3b5"
                strokeWidth="1.5"
                strokeOpacity="0.5"
                className={cn(animated && 'animate-pulse')}
              />
            ))}

            {/* Doctors Clean Line (Primary) */}
            <path
              d="M 25 175 C 45 175, 55 90, 75 90 L 125 90 C 145 90, 155 175, 175 175 L 575 175 C 595 175, 605 40, 625 40 C 645 40, 655 175, 675 175"
              fill="none"
              stroke="#198dc7"
              strokeWidth="2"
              strokeOpacity="0.45"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn(animated && 'animate-pulse')}
              style={{ animationDelay: animated ? '150ms' : undefined }}
            />

            {/* Doctors Vertex Dots */}
            {[
              [25, 175],
              [75, 90],
              [125, 90],
              [175, 175],
              [225, 175],
              [275, 175],
              [325, 175],
              [375, 175],
              [425, 175],
              [475, 175],
              [525, 175],
              [575, 175],
              [625, 40],
              [675, 175],
            ].map(([cx, cy], i) => (
              <circle
                key={`d-dot-${i}`}
                cx={cx}
                cy={cy}
                r="3"
                fill="var(--card)"
                stroke="#198dc7"
                strokeWidth="1.5"
                strokeOpacity="0.5"
                className={cn(animated && 'animate-pulse')}
                style={{ animationDelay: animated ? '200ms' : undefined }}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* X-axis date pills skeleton (14 date positions) */}
      <div className="flex items-center justify-between px-8 pt-2">
        {Array.from({ length: 14 }).map((_, i) => (
          <Skeleton
            key={i}
            animated={animated}
            className="h-2 w-6 sm:w-8 rounded opacity-40"
          />
        ))}
      </div>
    </div>
  );
};

export default DailyActivityChartSkeleton;
