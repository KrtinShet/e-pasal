'use client';

import { motion, AnimatePresence } from 'motion/react';
import { getSection } from '@baazarify/storefront-builder';
import { X, AlignLeft, AlignRight, AlignCenter } from 'lucide-react';
import type { SectionConfig, ElementStyleOverride } from '@baazarify/storefront-builder';

interface PropertiesPanelProps {
  selectedSection: SectionConfig | null;
  selectedElementPath: string | null;
  elementStyles: Record<string, ElementStyleOverride> | undefined;
  onSectionPropsChange: (props: Record<string, unknown>) => void;
  onElementStyleChange: (path: string, styles: ElementStyleOverride) => void;
  onClose: () => void;
}

function humanize(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

function SectionProperties({
  section,
  onPropsChange,
}: {
  section: SectionConfig;
  onPropsChange: (props: Record<string, unknown>) => void;
}) {
  const definition = getSection(section.type);
  if (!definition) return null;

  const editableEntries = Object.entries(section.props).filter(
    ([key]) => key !== 'className' && key !== 'variant'
  );

  const handleVariantChange = (variant: string) => {
    onPropsChange({ ...section.props, variant });
  };

  const handlePropChange = (key: string, value: unknown) => {
    onPropsChange({ ...section.props, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-grey-900">{definition.name}</h3>
        <p className="mt-1 text-xs text-grey-600">{definition.description}</p>
      </div>

      {definition.variants && definition.variants.length > 0 && (
        <div>
          <label className="mb-2 block text-xs font-medium text-grey-700">Variant</label>
          <div className="grid grid-cols-2 gap-2">
            {definition.variants.map((variant) => (
              <button
                key={variant}
                onClick={() => handleVariantChange(variant)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  section.props.variant === variant
                    ? 'border-primary-500 bg-primary-500 text-white'
                    : 'border-grey-200 bg-white text-grey-700 hover:border-grey-300'
                }`}
              >
                {humanize(variant)}
              </button>
            ))}
          </div>
        </div>
      )}

      {editableEntries.map(([key, value]) => {
        const label = humanize(key);
        const valueType = typeof value;

        if (valueType === 'boolean') {
          return (
            <div key={key}>
              <label className="mb-2 block text-xs font-medium text-grey-700">{label}</label>
              <button
                onClick={() => handlePropChange(key, !value)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  value ? 'bg-primary-500' : 'bg-grey-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    value ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          );
        }

        if (valueType === 'number') {
          return (
            <div key={key}>
              <label className="mb-2 block text-xs font-medium text-grey-700">{label}</label>
              <input
                type="number"
                value={value as number}
                onChange={(e) => handlePropChange(key, parseFloat(e.target.value))}
                className="w-full rounded-lg border border-grey-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
              />
            </div>
          );
        }

        if (valueType === 'string') {
          const isLongText =
            (value as string).length > 80 ||
            key.toLowerCase().includes('description') ||
            key.toLowerCase().includes('content');

          return (
            <div key={key}>
              <label className="mb-2 block text-xs font-medium text-grey-700">{label}</label>
              {isLongText ? (
                <textarea
                  value={value as string}
                  onChange={(e) => handlePropChange(key, e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-grey-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                />
              ) : (
                <input
                  type="text"
                  value={value as string}
                  onChange={(e) => handlePropChange(key, e.target.value)}
                  className="w-full rounded-lg border border-grey-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                />
              )}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

function ElementProperties({
  elementPath,
  styles,
  onStyleChange,
}: {
  elementPath: string;
  styles: ElementStyleOverride;
  onStyleChange: (styles: ElementStyleOverride) => void;
}) {
  const handleChange = (key: keyof ElementStyleOverride, value: string) => {
    onStyleChange({ ...styles, [key]: value });
  };

  const alignmentMap = {
    left: 'left',
    center: 'center',
    right: 'right',
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-grey-900">Element Styles</h3>
        <p className="mt-1 text-xs text-grey-600">{elementPath}</p>
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium text-grey-700">Font Size</label>
        <input
          type="text"
          value={styles.fontSize || ''}
          onChange={(e) => handleChange('fontSize', e.target.value)}
          placeholder="e.g., 1rem, 16px"
          className="w-full rounded-lg border border-grey-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium text-grey-700">Font Weight</label>
        <select
          value={styles.fontWeight || ''}
          onChange={(e) => handleChange('fontWeight', e.target.value)}
          className="w-full rounded-lg border border-grey-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
        >
          <option value="">Default</option>
          <option value="300">Light</option>
          <option value="400">Regular</option>
          <option value="500">Medium</option>
          <option value="600">Semibold</option>
          <option value="700">Bold</option>
          <option value="800">Extra Bold</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium text-grey-700">Color</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={styles.color || '#000000'}
            onChange={(e) => handleChange('color', e.target.value)}
            className="h-10 w-16 rounded-lg border border-grey-200"
          />
          <input
            type="text"
            value={styles.color || ''}
            onChange={(e) => handleChange('color', e.target.value)}
            placeholder="#000000"
            className="flex-1 rounded-lg border border-grey-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium text-grey-700">Text Alignment</label>
        <div className="flex gap-1">
          {Object.entries(alignmentMap).map(([key, value]) => {
            const Icon = key === 'left' ? AlignLeft : key === 'center' ? AlignCenter : AlignRight;
            return (
              <button
                key={key}
                onClick={() => handleChange('textAlign', value)}
                className={`flex-1 rounded-lg border px-3 py-2 transition-colors ${
                  styles.textAlign === value
                    ? 'border-primary-500 bg-primary-500 text-white'
                    : 'border-grey-200 bg-white text-grey-700 hover:border-grey-300'
                }`}
              >
                <Icon className="mx-auto h-4 w-4" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-xs font-medium text-grey-700">Padding</label>
          <input
            type="text"
            value={styles.padding || ''}
            onChange={(e) => handleChange('padding', e.target.value)}
            placeholder="e.g., 1rem"
            className="w-full rounded-lg border border-grey-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-xs font-medium text-grey-700">Margin</label>
          <input
            type="text"
            value={styles.margin || ''}
            onChange={(e) => handleChange('margin', e.target.value)}
            placeholder="e.g., 0.5rem"
            className="w-full rounded-lg border border-grey-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

export function PropertiesPanel({
  selectedSection,
  selectedElementPath,
  elementStyles,
  onSectionPropsChange,
  onElementStyleChange,
  onClose,
}: PropertiesPanelProps) {
  const isOpen = selectedSection !== null || selectedElementPath !== null;
  const currentElementStyles = selectedElementPath
    ? elementStyles?.[selectedElementPath] || {}
    : {};

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 320, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="border-l border-grey-200 bg-white overflow-hidden"
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-grey-200 px-4 py-3">
              <h2 className="text-sm font-semibold text-grey-900">Properties</h2>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-grey-500 hover:bg-grey-100 hover:text-grey-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {selectedSection && !selectedElementPath && (
                <SectionProperties section={selectedSection} onPropsChange={onSectionPropsChange} />
              )}

              {selectedElementPath && (
                <ElementProperties
                  elementPath={selectedElementPath}
                  styles={currentElementStyles}
                  onStyleChange={(styles) => onElementStyleChange(selectedElementPath, styles)}
                />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
