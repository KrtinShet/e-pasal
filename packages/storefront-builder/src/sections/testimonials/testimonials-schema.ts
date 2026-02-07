import { z } from 'zod';

const testimonialItemSchema = z.object({
  name: z.string().min(1),
  role: z.string().optional(),
  content: z.string().min(1),
  rating: z.number().min(1).max(5).optional(),
  avatar: z.string().url().optional(),
});

export const testimonialsSectionSchema = z.object({
  className: z.string().optional(),
  variant: z.enum(['carousel', 'grid']).optional().default('grid'),
  title: z.string().optional(),
  testimonials: z.array(testimonialItemSchema).min(1),
});

export const testimonialsDefaultProps = {
  variant: 'grid' as const,
  title: 'What Our Customers Say',
  testimonials: [
    {
      name: 'Sita Sharma',
      role: 'Regular Customer',
      content: 'Great products and fast delivery. Highly recommended!',
      rating: 5,
    },
    {
      name: 'Ram Thapa',
      role: 'Verified Buyer',
      content: 'The quality exceeded my expectations. Will definitely order again.',
      rating: 4,
    },
    {
      name: 'Anita K.C.',
      role: 'Customer',
      content: 'Excellent customer service and easy returns. Very happy with my purchase.',
      rating: 5,
    },
  ],
};
