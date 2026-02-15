'use client';

import { cn } from '@baazarify/ui';

import type { BaseSectionProps } from '../types';
import {
  InlineText,
  InlineImage,
  InlineSelect,
  EditableElement,
  useSectionEditor,
  InlineItemActions,
  InlineListToolbar,
} from '../../renderer';

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
  const { editMode, append, removeAt, moveItem } = useSectionEditor();

  return (
    <section className={cn('py-16', className)}>
      <div className="mx-auto max-w-7xl px-6">
        {editMode && (
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <InlineSelect
              path="variant"
              value={variant}
              options={['grid', 'masonry', 'carousel']}
              label="Variant"
            />
            <InlineListToolbar
              label="Add image"
              onAdd={() => append('images', { src: '', alt: 'Gallery image' })}
            />
          </div>
        )}

        {title && (
          <EditableElement path="title">
            <InlineText
              path="title"
              value={title}
              as="h2"
              className="mb-8 text-center font-display text-3xl font-bold text-[var(--color-text-primary)]"
            />
          </EditableElement>
        )}

        {variant === 'grid' && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-lg">
                {editMode && (
                  <div className="absolute z-10 mt-2 ml-2">
                    <InlineItemActions
                      onMoveUp={i > 0 ? () => moveItem('images', i, i - 1) : undefined}
                      onMoveDown={
                        i < images.length - 1 ? () => moveItem('images', i, i + 1) : undefined
                      }
                      onDelete={() => removeAt('images', i)}
                    />
                  </div>
                )}
                <InlineImage
                  srcPath={`images.${i}.src`}
                  src={img.src}
                  altPath={`images.${i}.alt`}
                  alt={img.alt}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  placeholderClassName="h-full w-full"
                />
              </div>
            ))}
          </div>
        )}

        {variant === 'masonry' && (
          <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
            {images.map((img, i) => (
              <div key={i} className="mb-4 overflow-hidden rounded-lg">
                {editMode && (
                  <div className="mb-2">
                    <InlineItemActions
                      onMoveUp={i > 0 ? () => moveItem('images', i, i - 1) : undefined}
                      onMoveDown={
                        i < images.length - 1 ? () => moveItem('images', i, i + 1) : undefined
                      }
                      onDelete={() => removeAt('images', i)}
                    />
                  </div>
                )}
                <InlineImage
                  srcPath={`images.${i}.src`}
                  src={img.src}
                  altPath={`images.${i}.alt`}
                  alt={img.alt}
                  className="w-full object-cover transition-transform duration-300 hover:scale-105"
                  placeholderClassName="w-full min-h-32"
                />
              </div>
            ))}
          </div>
        )}

        {variant === 'carousel' && (
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {images.map((img, i) => (
              <div key={i} className="aspect-[4/3] w-80 flex-shrink-0 overflow-hidden rounded-lg">
                {editMode && (
                  <div className="mb-2">
                    <InlineItemActions
                      onMoveUp={i > 0 ? () => moveItem('images', i, i - 1) : undefined}
                      onMoveDown={
                        i < images.length - 1 ? () => moveItem('images', i, i + 1) : undefined
                      }
                      onDelete={() => removeAt('images', i)}
                    />
                  </div>
                )}
                <InlineImage
                  srcPath={`images.${i}.src`}
                  src={img.src}
                  altPath={`images.${i}.alt`}
                  alt={img.alt}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  placeholderClassName="h-full w-full"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
