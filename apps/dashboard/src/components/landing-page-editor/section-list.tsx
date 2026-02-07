'use client';

import type { SectionConfig } from '@baazarify/storefront-builder';

interface SectionListProps {
  sections: SectionConfig[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  onToggleVisibility: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SectionList({
  sections,
  selectedId,
  onSelect,
  onMove,
  onToggleVisibility,
  onDelete,
}: SectionListProps) {
  return (
    <div className="space-y-1">
      {sections.map((section, index) => (
        <div
          key={section.id}
          className={`flex items-center gap-2 rounded-md border px-3 py-2 ${
            selectedId === section.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white hover:bg-gray-50'
          } ${!section.visible ? 'opacity-50' : ''}`}
        >
          <button
            type="button"
            className="flex-1 text-left text-sm font-medium text-gray-700"
            onClick={() => onSelect(section.id)}
          >
            {section.type}
          </button>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onMove(section.id, 'up')}
              disabled={index === 0}
              className="rounded p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
              title="Move up"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => onMove(section.id, 'down')}
              disabled={index === sections.length - 1}
              className="rounded p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
              title="Move down"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => onToggleVisibility(section.id)}
              className="rounded p-1 text-gray-400 hover:text-gray-600"
              title={section.visible ? 'Hide' : 'Show'}
            >
              {section.visible ? (
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={() => onDelete(section.id)}
              className="rounded p-1 text-gray-400 hover:text-red-600"
              title="Delete"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
