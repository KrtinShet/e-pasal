'use client';

import { m } from 'motion/react';
import type { ReactNode } from 'react';
import type { HTMLMotionProps } from 'motion/react';

import { varContainer } from './variants';

export interface MotionContainerProps extends HTMLMotionProps<'div'> {
  animate?: boolean;
  action?: boolean;
  children?: ReactNode;
  className?: string;
}

export function MotionContainer({
  animate,
  action = false,
  children,
  className,
  ...other
}: MotionContainerProps) {
  if (action) {
    return (
      <m.div
        initial={false}
        animate={animate ? 'animate' : 'exit'}
        variants={varContainer()}
        className={className}
        {...other}
      >
        {children}
      </m.div>
    );
  }

  return (
    <m.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={varContainer()}
      className={className}
      {...other}
    >
      {children}
    </m.div>
  );
}
