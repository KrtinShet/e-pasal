'use client';

import type { HTMLAttributes } from 'react';
import { m, useSpring } from 'motion/react';
import type { MotionValue } from 'motion/react';

import { cn } from '../../utils';

export interface ScrollProgressProps extends HTMLAttributes<HTMLDivElement> {
  color?: 'inherit' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  size?: number;
  scrollYProgress: MotionValue<number>;
}

const colorStyles: Record<string, string> = {
  inherit: 'bg-[var(--color-text)]',
  primary:
    'bg-gradient-to-br from-[var(--color-primary-light,var(--color-primary))] to-[var(--color-primary)]',
  secondary:
    'bg-gradient-to-br from-[var(--color-secondary-light,var(--color-secondary))] to-[var(--color-secondary)]',
  info: 'bg-gradient-to-br from-[var(--color-info-light,var(--color-info))] to-[var(--color-info)]',
  success:
    'bg-gradient-to-br from-[var(--color-success-light,var(--color-success))] to-[var(--color-success)]',
  warning:
    'bg-gradient-to-br from-[var(--color-warning-light,var(--color-warning))] to-[var(--color-warning)]',
  error:
    'bg-gradient-to-br from-[var(--color-error-light,var(--color-error))] to-[var(--color-error)]',
};

export function ScrollProgress({
  color = 'primary',
  size = 3,
  scrollYProgress,
  className,
  ...other
}: ScrollProgressProps) {
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <m.div
      className={cn(
        'fixed top-0 left-0 right-0 z-[1999] origin-left',
        colorStyles[color] || colorStyles.primary,
        className
      )}
      style={{ height: size, scaleX }}
      {...(other as any)}
    />
  );
}
