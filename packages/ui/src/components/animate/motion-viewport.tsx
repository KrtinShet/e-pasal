'use client';

import { m } from 'motion/react';
import type { ReactNode } from 'react';
import type { HTMLMotionProps } from 'motion/react';

import { varContainer } from './variants';

export interface MotionViewportProps extends HTMLMotionProps<'div'> {
  children?: ReactNode;
  disableAnimatedMobile?: boolean;
  className?: string;
}

export function MotionViewport({
  children,
  disableAnimatedMobile = true,
  className,
  ...other
}: MotionViewportProps) {
  return (
    <m.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
      variants={varContainer()}
      className={className}
      {...other}
    >
      {children}
    </m.div>
  );
}
