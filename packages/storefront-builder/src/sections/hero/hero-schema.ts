import { z } from 'zod';

export const heroSectionSchema = z.object({
  className: z.string().optional(),
  variant: z.enum(['centered', 'left-aligned', 'split']).optional().default('centered'),
  headline: z.string().min(1),
  subheadline: z.string().optional(),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  secondaryCtaText: z.string().optional(),
  secondaryCtaLink: z.string().optional(),
  backgroundImage: z.string().url().optional(),
  overlayOpacity: z.number().min(0).max(1).optional().default(0.5),
});

export const heroDefaultProps = {
  variant: 'centered' as const,
  headline: 'Welcome to Our Store',
  subheadline: 'Discover amazing products curated just for you.',
  ctaText: 'Shop Now',
  ctaLink: '/products',
  overlayOpacity: 0.5,
};
