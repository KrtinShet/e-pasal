import { z } from 'zod';

const featureItemSchema = z.object({
  icon: z.string().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
});

export const featuresSectionSchema = z.object({
  className: z.string().optional(),
  variant: z.enum(['grid', 'list', 'cards']).optional().default('grid'),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  features: z.array(featureItemSchema).min(1),
});

export const featuresDefaultProps = {
  variant: 'grid' as const,
  title: 'Why Choose Us',
  features: [
    {
      icon: 'truck',
      title: 'Fast Delivery',
      description: 'Get your orders delivered within Kathmandu valley in 24 hours.',
    },
    {
      icon: 'shield',
      title: 'Secure Payments',
      description: 'All transactions are encrypted and secure.',
    },
    {
      icon: 'refresh',
      title: 'Easy Returns',
      description: 'Not satisfied? Return within 7 days for a full refund.',
    },
  ],
};
