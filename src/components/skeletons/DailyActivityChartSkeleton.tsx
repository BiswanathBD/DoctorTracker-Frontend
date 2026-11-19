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
        {/* Left Y-axis ticks in muted foreground (0 to 4) */}
        <div className="absolute left-1 inset-y-2 flex flex-col justify-between text-[10px] font-medium text-muted-foreground/40 pointer-events-none select-none">
          <span>4</span>
          <span>3</span>
          <span>2</span>
          <span>1</span>
          <span>0</span>
        </div>

        {/* Horizontal dashed grid guides */}
        <div className="w-full ml-8 border-b border-border/20 border-dashed" />
        <div className="w-full ml-8 border-b border-border/20 border-dashed" />
        <div className="w-full ml-8 border-b border-border/20 border-dashed" />
        <div className="w-full ml-8 border-b border-border/20 border-dashed" />
        <div className="w-full ml-8 border-b border-border/20 border-dashed" />

        {/* Clean dual-line SVG curves */}
        <div className="absolute inset-0 pl-8 pr-2 py-2 pointer-events-none">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="pSkelGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1ac3b5" stopOpacity="0.2" />
                <stop offset="95%" stopColor="#1ac3b5" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="dSkelGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#198dc7" stopOpacity="0.2" />
                <stop offset="95%" stopColor="#198dc7" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Patients Area (Teal) */}
            <path
              d="M 25 175 C 45 150, 55 130, 75 130 L 275 130 C 295 130, 305 175, 325 175 C 345 175, 355 130, 375 130 C 395 130, 405 175, 425 175 L 575 175 C 595 175, 605 90, 625 90 C 645 90, 655 175, 675 175 L 675 195 L 25 195 Z"
              fill="url(#pSkelGrad)"
              className={cn(animated && 'animate-pulse')}
            />
            <path
              d="M 25 175 C 45 150, 55 130, 75 130 L 275 130 C 295 130, 305 175, 325 175 C 345 175, 355 130, 375 130 C 395 130, 405 175, 425 175 L 575 175 C 595 175, 605 90, 625 90 C 645 90, 655 175, 675 175"
              fill="none"
              stroke="#1ac3b5"
              strokeWidth="2.5"
              strokeOpacity="0.45"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn(animated && 'animate-pulse')}
            />

            {/* Patients Vertex Day Dots */}
            {[
              [25, 175], [75, 130], [125, 130], [175, 130], [225, 130],
              [275, 130], [325, 175], [375, 130], [425, 175], [475, 175],
              [525, 175], [575, 175], [625, 90], [675, 175],
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

            {/* Doctors Area (Primary) */}
            <path
              d="M 25 175 C 45 175, 55 90, 75 90 L 125 90 C 145 90, 155 175, 175 175 L 575 175 C 595 175, 605 40, 625 40 C 645 40, 655 175, 675 175 L 675 195 L 25 195 Z"
              fill="url(#dSkelGrad)"
              className={cn(animated && 'animate-pulse')}
            />
            <path
              d="M 25 175 C 45 175, 55 90, 75 90 L 125 90 C 145 90, 155 175, 175 175 L 575 175 C 595 175, 605 40, 625 40 C 645 40, 655 175, 675 175"
              fill="none"
              stroke="#198dc7"
              strokeWidth="2.5"
              strokeOpacity="0.45"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn(animated && 'animate-pulse')}
              style={{ animationDelay: animated ? '150ms' : undefined }}
            />

            {/* Doctors Vertex Day Dots */}
            {[
              [25, 175], [75, 90], [125, 90], [175, 175], [225, 175],
              [275, 175], [325, 175], [375, 175], [425, 175], [475, 175],
              [525, 175], [575, 175], [625, 40], [675, 175],
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
                style={{ animationDelay: animated ? '150ms' : undefined }}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Date labels skeleton strip */}
      <div className="flex justify-between items-center pl-8 pt-2">
        {['Nov 6', 'Nov 8', 'Nov 10', 'Nov 12', 'Nov 14', 'Nov 16', 'Nov 19'].map((date) => (
          <Skeleton
            key={date}
            animated={animated}
            className="h-2.5 w-8 rounded bg-muted-foreground/15"
          />
        ))}
      </div>
    </div>
  );
};
export default DailyActivityChartSkeleton;
