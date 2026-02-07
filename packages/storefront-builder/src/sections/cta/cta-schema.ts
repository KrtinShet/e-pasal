import { z } from 'zod';

export const ctaSectionSchema = z.object({
  className: z.string().optional(),
  variant: z.enum(['simple', 'gradient', 'image']).optional().default('simple'),
  headline: z.string().min(1),
  description: z.string().optional(),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
  backgroundImage: z.string().url().optional(),
});

export const ctaDefaultProps = {
  variant: 'simple' as const,
  headline: 'Ready to Get Started?',
  description: 'Join thousands of happy customers shopping with us.',
  buttonText: 'Shop Now',
  buttonLink: '/products',
};
