'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { type ReactNode } from 'react';

interface StaggerProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delayChildren?: number;
  staggerChildren?: number;
}

/**
 * Container stagger - các children FadeIn sẽ vào tuần tự.
 * Dùng kèm StaggerItem ở dưới.
 */
export function Stagger({
  children,
  delayChildren = 0.1,
  staggerChildren = 0.08,
  ...rest
}: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { delayChildren, staggerChildren },
        },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  y = 14,
  ...rest
}: HTMLMotionProps<'div'> & { children: ReactNode; y?: number }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
