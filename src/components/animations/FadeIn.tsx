'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { type ReactNode } from 'react';

interface FadeInProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
}

/**
 * Wrapper Framer Motion: fade-in + slide-up nhẹ.
 * Dùng trong toàn app cho entrance animation.
 */
export function FadeIn({ children, delay = 0, duration = 0.6, y = 16, ...rest }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // easeOutQuint - cinematic
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
