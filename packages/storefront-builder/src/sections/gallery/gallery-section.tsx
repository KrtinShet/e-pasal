'use client';

import { cn } from '@baazarify/ui';

import type { BaseSectionProps } from '../types';

export type GalleryVariant = 'grid' | 'masonry' | 'carousel';

export interface GalleryImage {
  src: string;
  alt?: string;
}

export interface GallerySectionProps extends BaseSectionProps {
  variant?: GalleryVariant;
  title?: string;
  images: GalleryImage[];
}

export function GallerySection({
  className,
  variant = 'grid',
  title,
  images,
}: GallerySectionProps) {
  return (
    <section className={cn('py-16', className)}>
      <div className="mx-auto max-w-7xl px-6">
        {title && (
          <h2 className="mb-8 text-center font-display text-3xl font-bold text-[var(--color-text-primary)]">
            {title}
          </h2>
        )}

        {variant === 'grid' && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {images.map((img, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-lg">
                <img
                  src={img.src}
                  alt={img.alt || ''}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        )}

        {variant === 'masonry' && (
          <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
            {images.map((img, i) => (
              <div key={i} className="mb-4 overflow-hidden rounded-lg">
                <img
                  src={img.src}
                  alt={img.alt || ''}
                  className="w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        )}

        {variant === 'carousel' && (
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {images.map((img, i) => (
              <div key={i} className="aspect-[4/3] w-80 flex-shrink-0 overflow-hidden rounded-lg">
                <img
                  src={img.src}
                  alt={img.alt || ''}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
