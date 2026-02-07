import { z } from 'zod';

export const newsletterSectionSchema = z.object({
  className: z.string().optional(),
  title: z.string().optional().default('Stay Updated'),
  description: z.string().optional(),
  placeholder: z.string().optional().default('Enter your email'),
  buttonText: z.string().optional().default('Subscribe'),
});

export const newsletterDefaultProps = {
  title: 'Stay Updated',
  description: 'Subscribe to our newsletter for the latest products and exclusive deals.',
  placeholder: 'Enter your email',
  buttonText: 'Subscribe',
};
