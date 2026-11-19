'use client';

import React from 'react';
import { Skeleton } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface DailyActivityChartSkeletonProps {
  className?: string;
}

export const DailyActivityChartSkeleton: React.FC<DailyActivityChartSkeletonProps> = ({ className }) => {
  return (
    <div className={cn('w-full h-full flex flex-col justify-between', className)}>
      <div className="relative w-full h-60 flex flex-col justify-between py-1 border-b border-border/40">
        {/* Left Y-axis ticks in teal (0 to 4) */}
        <div className="absolute left-1 inset-y-2 flex flex-col justify-between text-[10px] font-semibold text-[#1ac3b5]/60 pointer-events-none select-none">
          <span>4</span>
          <span>3</span>
          <span>2</span>
          <span>1</span>
          <span>0</span>
        </div>

        {/* Right Y-axis ticks in primary (0 to 7) */}
        <div className="absolute right-1 inset-y-2 flex flex-col justify-between text-[10px] font-semibold text-primary/60 pointer-events-none select-none">
          <span>7</span>
          <span>6</span>
          <span>4</span>
          <span>2</span>
          <span>0</span>
        </div>

        {/* Horizontal dashed grid guides */}
        <div className="w-full ml-8 mr-8 border-b border-border/30 border-dashed" />
        <div className="w-full ml-8 mr-8 border-b border-border/30 border-dashed" />
        <div className="w-full ml-8 mr-8 border-b border-border/30 border-dashed" />
        <div className="w-full ml-8 mr-8 border-b border-border/30 border-dashed" />
        <div className="w-full ml-8 mr-8 border-b border-border/30 border-dashed" />

        {/* Clean dual-line SVG curves (Multi-directional up/down/flat fluctuations, NO area fills) */}
        <div className="absolute inset-0 px-8 py-2 pointer-events-none">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
            {/* Patients Clean Line (Teal) with multi-directional fluctuations */}
            <path
              d="M 25 175 C 45 150, 55 130, 75 130 L 275 130 C 295 130, 305 175, 325 175 C 345 175, 355 130, 375 130 C 395 130, 405 175, 425 175 L 575 175 C 595 175, 605 90, 625 90 C 645 90, 655 175, 675 175"
              fill="none"
              stroke="#1ac3b5"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-pulse"
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
                r="3.5"
                fill="var(--card)"
                stroke="#1ac3b5"
                strokeWidth="2"
                className="animate-pulse"
              />
            ))}

            {/* Doctors Clean Line (Primary Blue) with baseline & steep peak */}
            <path
              d="M 25 175 L 575 175 C 595 175, 605 40, 625 40 C 645 40, 655 175, 675 175"
              fill="none"
              stroke="#198dc7"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-pulse"
              style={{ animationDelay: '250ms' }}
            />

            {/* Doctors Vertex Dots */}
            {[
              [25, 175],
              [75, 175],
              [125, 175],
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
                r="3.5"
                fill="var(--card)"
                stroke="#198dc7"
                strokeWidth="2"
                className="animate-pulse"
                style={{ animationDelay: '250ms' }}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* X-axis date pills skeleton (14 date positions) */}
      <div className="flex items-center justify-between px-8 pt-2">
        {Array.from({ length: 14 }).map((_, i) => (
          <Skeleton key={i} className="h-2 w-6 sm:w-8 rounded" />
        ))}
      </div>
    </div>
  );
};

export default DailyActivityChartSkeleton;
