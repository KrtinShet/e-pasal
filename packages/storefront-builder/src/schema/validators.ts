import { z } from 'zod';

export const sectionConfigSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  props: z.record(z.unknown()),
  visible: z.boolean(),
});

export const pageSeoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  ogImage: z.string().url().optional(),
});

export const pageConfigSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  sections: z.array(sectionConfigSchema),
  seo: pageSeoSchema,
});

export type ValidatedPageConfig = z.infer<typeof pageConfigSchema>;
export type ValidatedSectionConfig = z.infer<typeof sectionConfigSchema>;
