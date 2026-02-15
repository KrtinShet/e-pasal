'use client';

import { cn } from '@baazarify/ui';

import type { BaseSectionProps } from '../types';
import {
  InlineText,
  InlineImage,
  InlineSelect,
  EditableElement,
  useSectionEditor,
} from '../../renderer';

export type AboutVariant = 'image-left' | 'image-right' | 'centered';

export interface AboutSectionProps extends BaseSectionProps {
  variant?: AboutVariant;
  title?: string;
  content: string;
  image?: string;
  imageAlt?: string;
}

export function AboutSection({
  className,
  variant = 'image-right',
  title,
  content,
  image,
  imageAlt = 'About us',
}: AboutSectionProps) {
  const { editMode } = useSectionEditor();

  if (variant === 'centered') {
    return (
      <section className={cn('py-16', className)}>
        <div className="mx-auto max-w-3xl px-6 text-center">
          {editMode && (
            <div className="mb-5 flex justify-center">
              <InlineSelect
                path="variant"
                value={variant}
                options={['image-left', 'image-right', 'centered']}
                label="Variant"
              />
            </div>
          )}
          {title && (
            <EditableElement path="title">
              <InlineText
                path="title"
                value={title}
                as="h2"
                className="font-display text-3xl font-bold text-[var(--color-text-primary)]"
              />
            </EditableElement>
          )}
          {image && (
            <EditableElement path="image">
              <InlineImage
                srcPath="image"
                src={image}
                altPath="imageAlt"
                alt={imageAlt}
                className="mx-auto mt-8 max-h-80 rounded-xl object-cover"
              />
            </EditableElement>
          )}
          {!image && editMode ? (
            <InlineImage
              srcPath="image"
              src={image}
              altPath="imageAlt"
              alt={imageAlt}
              placeholderClassName="mx-auto mt-8 max-h-80"
            />
          ) : null}
          <EditableElement path="content">
            <InlineText
              path="content"
              value={content}
              as="p"
              multiline
              className="mt-6 text-lg leading-relaxed text-[var(--color-text-secondary)]"
            />
          </EditableElement>
        </div>
      </section>
    );
  }

  const imageFirst = variant === 'image-left';

  return (
    <section className={cn('py-16', className)}>
      <div className="mx-auto max-w-7xl px-6">
        {editMode && (
          <div className="mb-5">
            <InlineSelect
              path="variant"
              value={variant}
              options={['image-left', 'image-right', 'centered']}
              label="Variant"
            />
          </div>
        )}
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className={cn({ 'md:order-2': !imageFirst })}>
            {image ? (
              <EditableElement path="image">
                <InlineImage
                  srcPath="image"
                  src={image}
                  altPath="imageAlt"
                  alt={imageAlt}
                  className="w-full rounded-xl object-cover shadow-lg"
                />
              </EditableElement>
            ) : (
              <>
                <div className="aspect-[4/3] rounded-xl bg-[var(--color-surface)]" />
                {editMode ? (
                  <div className="mt-2">
                    <InlineImage
                      srcPath="image"
                      src={image}
                      altPath="imageAlt"
                      alt={imageAlt}
                      placeholderClassName="aspect-[4/3]"
                    />
                  </div>
                ) : null}
              </>
            )}
          </div>
          <div className={cn({ 'md:order-1': !imageFirst })}>
            {title && (
              <EditableElement path="title">
                <InlineText
                  path="title"
                  value={title}
                  as="h2"
                  className="font-display text-3xl font-bold text-[var(--color-text-primary)]"
                />
              </EditableElement>
            )}
            <EditableElement path="content">
              <InlineText
                path="content"
                value={content}
                as="p"
                multiline
                className="mt-6 text-lg leading-relaxed text-[var(--color-text-secondary)]"
              />
            </EditableElement>
          </div>
        </div>
      </div>
    </section>
  );
}
