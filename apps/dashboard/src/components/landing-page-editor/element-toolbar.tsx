'use client';

import { motion, AnimatePresence } from 'motion/react';
import { AlignLeft, AlignCenter, AlignRight, Palette } from 'lucide-react';
import { useRef } from 'react';

import type { ElementStyleOverride } from '@baazarify/storefront-builder';

interface ElementToolbarProps {
  visible: boolean;
  position: { top: number; left: number; width: number };
  styles: ElementStyleOverride;
  onStyleChange: (styles: ElementStyleOverride) => void;
}

const FONT_SIZES = [
  { label: '0.75rem', value: '0.75rem' },
  { label: '0.875rem', value: '0.875rem' },
  { label: '1rem', value: '1rem' },
  { label: '1.125rem', value: '1.125rem' },
  { label: '1.25rem', value: '1.25rem' },
  { label: '1.5rem', value: '1.5rem' },
  { label: '2rem', value: '2rem' },
  { label: '2.5rem', value: '2.5rem' },
  { label: '3rem', value: '3rem' },
];

export function ElementToolbar({ visible, position, styles, onStyleChange }: ElementToolbarProps) {
  const colorInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (key: keyof ElementStyleOverride, value: string) => {
    onStyleChange({ ...styles, [key]: value });
  };

  const toggleBold = () => {
    const isBold = styles.fontWeight === '700' || styles.fontWeight === 'bold';
    handleChange('fontWeight', isBold ? '400' : '700');
  };

  const isBoldActive = styles.fontWeight === '700' || styles.fontWeight === 'bold';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          style={{
            position: 'fixed',
            top: position.top - 50,
            left: position.left + position.width / 2,
            transform: 'translateX(-50%)',
          }}
          className="z-50 flex items-center gap-1 rounded-lg border border-grey-200 bg-white px-2 py-1.5 shadow-lg"
        >
          <select
            value={styles.fontSize || '1rem'}
            onChange={(e) => handleChange('fontSize', e.target.value)}
            className="rounded border-none bg-transparent px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            {FONT_SIZES.map((size) => (
              <option key={size.value} value={size.value}>
                {size.label}
              </option>
            ))}
          </select>

          <div className="h-4 w-px bg-grey-200" />

          <button
            onClick={toggleBold}
            className={`rounded px-2 py-1 text-xs font-bold transition-colors ${
              isBoldActive
                ? 'bg-primary-500 text-white'
                : 'text-grey-700 hover:bg-grey-100'
            }`}
          >
            B
          </button>

          <div className="h-4 w-px bg-grey-200" />

          <button
            onClick={() => handleChange('textAlign', 'left')}
            className={`rounded p-1 transition-colors ${
              styles.textAlign === 'left'
                ? 'bg-primary-500 text-white'
                : 'text-grey-700 hover:bg-grey-100'
            }`}
          >
            <AlignLeft className="h-4 w-4" />
          </button>

          <button
            onClick={() => handleChange('textAlign', 'center')}
            className={`rounded p-1 transition-colors ${
              styles.textAlign === 'center'
                ? 'bg-primary-500 text-white'
                : 'text-grey-700 hover:bg-grey-100'
            }`}
          >
            <AlignCenter className="h-4 w-4" />
          </button>

          <button
            onClick={() => handleChange('textAlign', 'right')}
            className={`rounded p-1 transition-colors ${
              styles.textAlign === 'right'
                ? 'bg-primary-500 text-white'
                : 'text-grey-700 hover:bg-grey-100'
            }`}
          >
            <AlignRight className="h-4 w-4" />
          </button>

          <div className="h-4 w-px bg-grey-200" />

          <button
            onClick={() => colorInputRef.current?.click()}
            className="rounded p-1 text-grey-700 hover:bg-grey-100"
          >
            <Palette className="h-4 w-4" />
            <input
              ref={colorInputRef}
              type="color"
              value={styles.color || '#000000'}
              onChange={(e) => handleChange('color', e.target.value)}
              className="hidden"
            />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
