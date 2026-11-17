'use client';

import { motion, AnimatePresence, type Transition } from 'framer-motion';
import React, { useSyncExternalStore } from 'react';

export type AnimationType =
  | 'fade'
  | 'fadeLeft'
  | 'fadeRight'
  | 'fadeUp'
  | 'fadeDown'
  | 'scale'
  | 'button'
  | 'line'
  | 'heightIncrease'
  | 'widthIncrease';

export type AnimationConfig = {
  initial?: Record<string, number | string> | false;
  whileInView?: Record<string, number | string | number[]>;
  exit?: Record<string, number | string>;
  transition?: Transition;
  whileHover?: Record<string, number | string>;
  whileTap?: Record<string, number | string>;
  viewport?: { once?: boolean };
};

export type MotionProps = {
  children?: React.ReactNode;
  className?: string;
  animationType?: AnimationType;
  delay?: number;
  duration?: number;
  custom?: number;
  hoverScale?: number;
  once?: boolean;
  transition?: Transition;
  id?: string;
  // compatibility props for backward compatibility
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  scale?: boolean;
};

// global in-memory registry of elements that have completed their initial animate
const animatedKeys = new Set<string>();
let animationListeners: Array<() => void> = [];

const subscribeAnimation = (callback: () => void) => {
  animationListeners.push(callback);
  return () => {
    animationListeners = animationListeners.filter((l) => l !== callback);
  };
};

const notifyAnimation = () => {
  animationListeners.forEach((l) => l());
};

export const Motion: React.FC<MotionProps> = ({
  children,
  className,
  animationType = 'fade',
  delay = 0,
  duration = 0.3,
  hoverScale = 1.1,
  once = true,
  transition,
  id,
  direction,
  scale,
}) => {
  // compute an animation key if id is provided
  const animKey = id;

  const hasAlreadyAnimated = useSyncExternalStore(
    subscribeAnimation,
    () => (animKey ? animatedKeys.has(animKey) : false),
    () => false
  );

  // map legacy direction / scale props if provided
  const resolvedType: AnimationType = (() => {
    if (direction) {
      switch (direction) {
        case 'up':
          return 'fadeUp';
        case 'down':
          return 'fadeDown';
        case 'left':
          return 'fadeLeft';
        case 'right':
          return 'fadeRight';
        case 'none':
          return scale ? 'scale' : 'fade';
      }
    }
    if (scale) return 'scale';
    return animationType;
  })();

  const getAnimationConfig = (type: AnimationType): AnimationConfig => {
    const defaultTransition: Transition = {
      duration,
      delay,
      ease: 'easeOut',
    };

    const configs: Record<AnimationType, AnimationConfig> = {
      fade: {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        exit: { opacity: 0 },
        transition: transition ?? defaultTransition,
        viewport: { once },
      },

      fadeLeft: {
        initial: { opacity: 0, x: 20 },
        whileInView: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 },
        transition: transition ?? defaultTransition,
        viewport: { once },
      },

      fadeRight: {
        initial: { opacity: 0, x: -20 },
        whileInView: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
        transition: transition ?? defaultTransition,
        viewport: { once },
      },

      fadeUp: {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
        transition: transition ?? defaultTransition,
        viewport: { once },
      },

      fadeDown: {
        initial: { opacity: 0, y: -20 },
        whileInView: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: transition ?? defaultTransition,
        viewport: { once },
      },

      scale: {
        initial: { opacity: 0, scale: 0.9 },
        whileInView: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
        transition: transition ?? defaultTransition,
        viewport: { once },
      },

      button: {
        initial: { opacity: 0, scale: 0.95 },
        whileInView: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
        whileHover: { scale: hoverScale },
        whileTap: { scale: 0.95 },
        transition: transition ?? {
          duration: 0.2,
          ease: 'easeOut',
        },
        viewport: { once },
      },

      line: {
        initial: { width: 0 },
        whileInView: { width: 40 },
        exit: { width: 0 },
        transition: transition ?? defaultTransition,
        viewport: { once },
      },

      heightIncrease: {
        initial: { scaleY: 0, opacity: 0, originY: 0 },
        whileInView: { scaleY: 1, opacity: 1 },
        exit: { scaleY: 0, opacity: 0 },
        transition: transition ?? defaultTransition,
        viewport: { once },
      },

      widthIncrease: {
        initial: { scaleX: 0, opacity: 0, originX: 0 },
        whileInView: { scaleX: 1, opacity: 1 },
        exit: { scaleX: 0, opacity: 0 },
        transition: transition ?? defaultTransition,
        viewport: { once },
      },
    };

    return configs[type];
  };

  const config = getAnimationConfig(resolvedType);

  // if element has already animated during this session, do not rerun entrance animation
  const finalInitial = hasAlreadyAnimated ? false : config.initial;

  return (
    <motion.div
      className={className}
      {...config}
      initial={finalInitial}
      onAnimationComplete={() => {
        if (animKey && !animatedKeys.has(animKey)) {
          animatedKeys.add(animKey);
          notifyAnimation();
        }
      }}
    >
      {children}
    </motion.div>
  );
};

export const MotionWrapper = Motion;
export type MotionWrapperProps = MotionProps;

export { motion, AnimatePresence };
