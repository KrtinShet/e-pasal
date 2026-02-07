import { z } from 'zod';

const statItemSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  description: z.string().optional(),
});

export const statsSectionSchema = z.object({
  className: z.string().optional(),
  title: z.string().optional(),
  stats: z.array(statItemSchema).min(1),
});

export const statsDefaultProps = {
  title: 'Our Impact',
  stats: [
    { label: 'Happy Customers', value: '10,000+', description: 'and growing every day' },
    { label: 'Products', value: '500+', description: 'across all categories' },
    { label: 'Cities', value: '25+', description: 'delivery coverage' },
    { label: 'Years', value: '5+', description: 'of trusted service' },
  ],
};
