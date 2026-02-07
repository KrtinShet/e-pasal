'use client';

import { getAllSections, type SectionDefinition } from '@baazarify/storefront-builder';

interface AddSectionModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (type: string) => void;
}

const categoryLabels: Record<string, string> = {
  content: 'Content',
  commerce: 'Commerce',
  social: 'Social Proof',
  utility: 'Utility',
};

export function AddSectionModal({ open, onClose, onAdd }: AddSectionModalProps) {
  if (!open) return null;

  const sections = getAllSections();
  const grouped = sections.reduce(
    (acc, section) => {
      const cat = section.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(section);
      return acc;
    },
    {} as Record<string, SectionDefinition[]>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-2xl rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Add Section</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-6">
          {Object.entries(grouped).map(([category, secs]) => (
            <div key={category} className="mb-6 last:mb-0">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
                {categoryLabels[category] || category}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {secs.map((section) => (
                  <button
                    key={section.type}
                    type="button"
                    onClick={() => {
                      onAdd(section.type);
                      onClose();
                    }}
                    className="rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-blue-300 hover:bg-blue-50"
                  >
                    <p className="font-medium text-gray-900">{section.name}</p>
                    <p className="mt-1 text-xs text-gray-500">{section.description}</p>
                    {section.variants && section.variants.length > 0 && (
                      <p className="mt-2 text-xs text-gray-400">
                        Variants: {section.variants.join(', ')}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
