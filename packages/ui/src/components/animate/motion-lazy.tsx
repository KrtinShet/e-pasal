'use client';

import type { ReactNode } from 'react';
import { m, domMax, LazyMotion } from 'framer-motion';

export interface MotionLazyProps {
  children: ReactNode;
}

export function MotionLazy({ children }: MotionLazyProps) {
  return (
    <LazyMotion strict features={domMax}>
      <m.div className="h-full">{children}</m.div>
    </LazyMotion>
  );
}
