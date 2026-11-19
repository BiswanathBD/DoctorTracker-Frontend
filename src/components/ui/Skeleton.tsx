import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  animated?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  animated = true,
  ...props
}) => {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'rounded-md bg-muted-foreground/12',
        animated ? 'animate-pulse shimmer-active' : 'opacity-60',
        className
      )}
      {...props}
    />
  );
};

export default Skeleton;
