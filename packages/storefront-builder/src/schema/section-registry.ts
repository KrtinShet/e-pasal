import type { z } from 'zod';
import type { ComponentType } from 'react';

import type { SectionCategory, BaseSectionProps } from '../sections/types';

export interface SectionDefinition<P extends BaseSectionProps = BaseSectionProps> {
  type: string;
  name: string;
  description: string;
  icon: string;
  component: ComponentType<P>;
  schema: z.ZodType<P>;
  defaultProps: P;
  variants?: string[];
  category: SectionCategory;
}

const registry = new Map<string, SectionDefinition>();

export function registerSection(definition: SectionDefinition<any>) {
  registry.set(definition.type, definition);
}

export function getSection(type: string): SectionDefinition | undefined {
  return registry.get(type);
}

export function getAllSections(): SectionDefinition[] {
  return Array.from(registry.values());
}

export function getSectionsByCategory(category: SectionCategory): SectionDefinition[] {
  return getAllSections().filter((s) => s.category === category);
}

export { registry as sectionRegistry };
