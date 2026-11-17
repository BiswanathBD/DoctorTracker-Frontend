'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface MotionWrapperProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  scale?: boolean;
}

export const MotionWrapper: React.FC<MotionWrapperProps> = ({
  children,
  delay = 0,
  duration = 0.5,
  direction = 'up',
  scale = false,
  className = '',
  ...props
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: 24, opacity: 0 };
      case 'down':
        return { y: -24, opacity: 0 };
      case 'left':
        return { x: 24, opacity: 0 };
      case 'right':
        return { x: -24, opacity: 0 };
      case 'none':
        return { opacity: 0 };
      default:
        return { y: 24, opacity: 0 };
    }
  };

  const initial = {
    ...getInitialPosition(),
    ...(scale ? { scale: 0.95 } : {}),
  };

  const animate = {
    x: 0,
    y: 0,
    opacity: 1,
    ...(scale ? { scale: 1 } : {}),
  };

  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
