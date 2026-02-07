'use client';

import type { PageConfig } from '../schema/page-schema';

import { EditModeWrapper } from './edit-mode';
import { SectionRenderer } from './section-renderer';

export interface PageRendererProps {
  config: PageConfig;
  editMode?: boolean;
  onSectionSelect?: (sectionId: string) => void;
  onSectionMove?: (sectionId: string, direction: 'up' | 'down') => void;
  onSectionDelete?: (sectionId: string) => void;
}

export function PageRenderer({
  config,
  editMode = false,
  onSectionSelect,
  onSectionMove,
  onSectionDelete,
}: PageRendererProps) {
  const visibleSections = config.sections.filter((s) => s.visible);

  return (
    <div>
      {visibleSections.map((section, index) => {
        const rendered = <SectionRenderer key={section.id} section={section} />;

        if (!editMode) return rendered;

        return (
          <EditModeWrapper
            key={section.id}
            sectionId={section.id}
            sectionType={section.type}
            isFirst={index === 0}
            isLast={index === visibleSections.length - 1}
            onSelect={onSectionSelect}
            onMove={onSectionMove}
            onDelete={onSectionDelete}
          >
            {rendered}
          </EditModeWrapper>
        );
      })}
    </div>
  );
}
