'use client';

import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../../utils';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

const variantStyles = {
  text: 'rounded-[var(--radius-sm)]',
  circular: 'rounded-full',
  rectangular: 'rounded-none',
  rounded: 'rounded-[var(--radius-md)]',
} as const;

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'text', width, height, animation = 'pulse', style, ...props }, ref) => {
    const animationClass =
      animation === 'pulse'
        ? 'animate-pulse'
        : animation === 'wave'
          ? 'animate-[shimmer_1.5s_ease-in-out_infinite]'
          : '';

    return (
      <div
        ref={ref}
        className={cn(
          'bg-[var(--color-surface)]',
          variantStyles[variant],
          animationClass,
          className
        )}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          ...style,
        }}
        aria-hidden="true"
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export interface SkeletonTextProps extends HTMLAttributes<HTMLDivElement> {
  lines?: number;
  lastLineWidth?: string;
  spacing?: 'sm' | 'md' | 'lg';
}

const spacingStyles = {
  sm: 'gap-1.5',
  md: 'gap-2',
  lg: 'gap-3',
} as const;

export const SkeletonText = forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ className, lines = 3, lastLineWidth = '75%', spacing = 'md', ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col', spacingStyles[spacing], className)} {...props}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          height={16}
          style={{
            width: index === lines - 1 ? lastLineWidth : '100%',
          }}
        />
      ))}
    </div>
  )
);

SkeletonText.displayName = 'SkeletonText';

export interface SkeletonAvatarProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const avatarSizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
} as const;

export const SkeletonAvatar = forwardRef<HTMLDivElement, SkeletonAvatarProps>(
  ({ className, size = 'md', ...props }, ref) => (
    <Skeleton
      ref={ref}
      variant="circular"
      className={cn(avatarSizes[size], className)}
      {...props}
    />
  )
);

SkeletonAvatar.displayName = 'SkeletonAvatar';
