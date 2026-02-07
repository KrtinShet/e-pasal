import { z } from 'zod';

const productItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  image: z.string().optional(),
  slug: z.string().optional(),
  compareAtPrice: z.number().optional(),
});

export const productGridSectionSchema = z.object({
  className: z.string().optional(),
  title: z.string().optional(),
  products: z.array(productItemSchema),
  columns: z
    .union([z.literal(2), z.literal(3), z.literal(4)])
    .optional()
    .default(4),
  limit: z.number().positive().optional(),
});

export const productGridDefaultProps = {
  title: 'Featured Products',
  products: [] as { id: string; name: string; price: number }[],
  columns: 4 as const,
};
