import React from 'react';
import { cn } from '@/lib/utils';

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      data-slot="skeleton"
      className={cn('animate-pulse rounded-md bg-muted-foreground/10', className)}
      {...props}
    />
  );
};

export default Skeleton;
