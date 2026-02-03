'use client';

import { useState, forwardRef, type ImgHTMLAttributes } from 'react';

import { cn } from '../../utils';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const avatarSizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-20 h-20 text-2xl',
} as const;

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function generateColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + (hash * 31 - hash);
  }

  const colors = [
    'bg-[var(--color-primary)]',
    'bg-[var(--color-secondary)]',
    'bg-[var(--color-info)]',
    'bg-[var(--color-success)]',
    'bg-[var(--color-warning)]',
  ];

  return colors[Math.abs(hash) % colors.length];
}

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'size' | 'src'> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  fallback?: React.ReactNode;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, name, size = 'md', fallback, ...props }, ref) => {
    const [imageError, setImageError] = useState(false);
    const showImage = src && !imageError;
    const initials = name ? getInitials(name) : '';
    const bgColor = name ? generateColorFromName(name) : 'bg-[var(--color-surface)]';

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center rounded-full overflow-hidden flex-shrink-0',
          'ring-2 ring-[var(--color-background)]',
          avatarSizes[size],
          !showImage && bgColor,
          !showImage && 'text-white font-medium',
          className
        )}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
            {...props}
          />
        ) : fallback ? (
          fallback
        ) : initials ? (
          <span aria-label={name}>{initials}</span>
        ) : (
          <DefaultAvatarIcon />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

function DefaultAvatarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-3/5 h-3/5 text-[var(--color-text-muted)]"
      aria-hidden="true"
    >
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

export interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: AvatarSize;
  className?: string;
}

export function AvatarGroup({ children, max, size = 'md', className }: AvatarGroupProps) {
  const childArray = Array.isArray(children) ? children : [children];
  const visibleChildren = max ? childArray.slice(0, max) : childArray;
  const remainingCount = max ? childArray.length - max : 0;

  return (
    <div className={cn('flex -space-x-2', className)}>
      {visibleChildren.map((child, index) => (
        <div key={index} className="relative" style={{ zIndex: visibleChildren.length - index }}>
          {child}
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            'relative inline-flex items-center justify-center rounded-full',
            'bg-[var(--color-surface)] text-[var(--color-text-secondary)] font-medium',
            'ring-2 ring-[var(--color-background)]',
            avatarSizes[size]
          )}
          style={{ zIndex: 0 }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
