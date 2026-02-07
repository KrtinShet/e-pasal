'use client';

import { getSection } from '../schema/section-registry';
import type { SectionConfig } from '../schema/page-schema';

export interface SectionRendererProps {
  section: SectionConfig;
}

export function SectionRenderer({ section }: SectionRendererProps) {
  const definition = getSection(section.type);

  if (!definition) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className="border-2 border-dashed border-red-300 bg-red-50 p-8 text-center">
          <p className="text-red-600">Unknown section type: &quot;{section.type}&quot;</p>
        </div>
      );
    }
    return null;
  }

  const Component = definition.component;
  return <Component {...(section.props as any)} />;
}
