import { z } from 'zod';

const galleryImageSchema = z.object({
  src: z.string().url(),
  alt: z.string().optional(),
});

export const gallerySectionSchema = z.object({
  className: z.string().optional(),
  variant: z.enum(['grid', 'masonry', 'carousel']).optional().default('grid'),
  title: z.string().optional(),
  images: z.array(galleryImageSchema).min(1),
});

export const galleryDefaultProps = {
  variant: 'grid' as const,
  title: 'Gallery',
  images: [] as { src: string; alt?: string }[],
};
