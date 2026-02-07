import { z } from 'zod';

export const aboutSectionSchema = z.object({
  className: z.string().optional(),
  variant: z.enum(['image-left', 'image-right', 'centered']).optional().default('image-right'),
  title: z.string().optional(),
  content: z.string().min(1),
  image: z.string().url().optional(),
  imageAlt: z.string().optional(),
});

export const aboutDefaultProps = {
  variant: 'image-right' as const,
  title: 'About Our Store',
  content:
    'We are passionate about bringing you the best products at affordable prices. Our team carefully curates every item in our collection to ensure quality and satisfaction.',
};
