'use client';

import type { PageConfig } from '../schema/page-schema';

import { EditModeWrapper } from './edit-mode';
import { PageEditProvider } from './edit-context';
import { SectionRenderer } from './section-renderer';

export interface PageRendererProps {
  config: PageConfig;
  editMode?: boolean;
  onSectionSelect?: (sectionId: string) => void;
  onSectionMove?: (sectionId: string, direction: 'up' | 'down') => void;
  onSectionDelete?: (sectionId: string) => void;
  onSectionPropsChange?: (sectionId: string, props: Record<string, unknown>) => void;
  selectedSectionId?: string | null;
}

export function PageRenderer({
  config,
  editMode = false,
  onSectionSelect,
  onSectionMove,
  onSectionDelete,
  onSectionPropsChange,
  selectedSectionId,
}: PageRendererProps) {
  const visibleSections = config.sections.filter((s) => s.visible);

  return (
    <PageEditProvider
      editMode={editMode}
      onSectionSelect={onSectionSelect}
      onSectionPropsChange={onSectionPropsChange}
    >
      <div>
        {visibleSections.map((section, index) => {
          const rendered = (
            <SectionRenderer
              key={section.id}
              section={section}
              editMode={editMode}
              onSectionPropsChange={onSectionPropsChange}
            />
          );

          if (!editMode) return rendered;

          return (
            <EditModeWrapper
              key={section.id}
              sectionId={section.id}
              sectionType={section.type}
              isFirst={index === 0}
              isLast={index === visibleSections.length - 1}
              isSelected={selectedSectionId === section.id}
              onSelect={onSectionSelect}
              onMove={onSectionMove}
              onDelete={onSectionDelete}
            >
              {rendered}
            </EditModeWrapper>
          );
        })}
      </div>
    </PageEditProvider>
  );
}
