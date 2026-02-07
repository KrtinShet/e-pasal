'use client';

import { m } from 'motion/react';
import type { HTMLAttributes } from 'react';
import { useState, useEffect } from 'react';

import { cn } from '../../utils';

export interface SplashScreenProps extends HTMLAttributes<HTMLDivElement> {}

export function SplashScreen({ className, ...other }: SplashScreenProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={cn(
        'absolute inset-0 z-[9998] flex items-center justify-center bg-[var(--color-background)]',
        className
      )}
      {...other}
    >
      <m.div
        animate={{ scale: [1, 0.9, 0.9, 1, 1], opacity: [1, 0.48, 0.48, 1, 1] }}
        transition={{ duration: 2, ease: 'easeInOut', repeatDelay: 1, repeat: Infinity }}
      >
        <div className="h-16 w-16 rounded-full bg-[var(--color-primary)]" />
      </m.div>

      <m.div
        animate={{
          scale: [1.6, 1, 1, 1.6, 1.6],
          rotate: [270, 0, 0, 270, 270],
          opacity: [0.25, 1, 1, 1, 0.25],
          borderRadius: ['25%', '25%', '50%', '50%', '25%'],
        }}
        transition={{ ease: 'linear', duration: 3.2, repeat: Infinity }}
        className="absolute h-[100px] w-[100px] border-[3px] border-[var(--color-primary)]/24"
      />

      <m.div
        animate={{
          scale: [1, 1.2, 1.2, 1, 1],
          rotate: [0, 270, 270, 0, 0],
          opacity: [1, 0.25, 0.25, 0.25, 1],
          borderRadius: ['25%', '25%', '50%', '50%', '25%'],
        }}
        transition={{ ease: 'linear', duration: 3.2, repeat: Infinity }}
        className="absolute h-[120px] w-[120px] border-[8px] border-[var(--color-primary)]/24"
      />
    </div>
  );
}
