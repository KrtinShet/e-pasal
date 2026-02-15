'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search } from 'lucide-react';
import { getAllSections, type SectionDefinition } from '@baazarify/storefront-builder';
import type { SectionCategory } from '@baazarify/storefront-builder/src/sections/types';

interface AddSectionPanelProps {
  open: boolean;
  onClose: () => void;
  onAdd: (type: string) => void;
}

const GRADIENT_MAP: Record<string, string> = {
  hero: 'bg-gradient-to-br from-blue-500 to-purple-600',
  features: 'bg-gradient-to-br from-emerald-500 to-teal-600',
  about: 'bg-gradient-to-br from-amber-500 to-orange-600',
  testimonials: 'bg-gradient-to-br from-pink-500 to-rose-600',
  cta: 'bg-gradient-to-br from-violet-500 to-indigo-600',
  faq: 'bg-gradient-to-br from-cyan-500 to-blue-600',
  contact: 'bg-gradient-to-br from-green-500 to-emerald-600',
  gallery: 'bg-gradient-to-br from-fuchsia-500 to-pink-600',
  stats: 'bg-gradient-to-br from-yellow-500 to-amber-600',
  newsletter: 'bg-gradient-to-br from-sky-500 to-cyan-600',
  'product-grid': 'bg-gradient-to-br from-red-500 to-orange-600',
};

const CATEGORIES: Array<{ value: SectionCategory | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'content', label: 'Content' },
  { value: 'commerce', label: 'Commerce' },
  { value: 'social', label: 'Social Proof' },
  { value: 'utility', label: 'Utility' },
];

export function AddSectionPanel({ open, onClose, onAdd }: AddSectionPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SectionCategory | 'all'>('all');

  const sections = useMemo(() => getAllSections(), []);

  const filteredSections = useMemo(() => {
    return sections.filter((section) => {
      const matchesSearch =
        searchQuery === '' ||
        section.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || section.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [sections, searchQuery, selectedCategory]);

  const handleAddSection = (type: string) => {
    onAdd(type);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-[380px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--grey-200)]">
              <h2 className="text-lg font-semibold text-[var(--grey-900)]">Add Section</h2>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-[var(--grey-50)] rounded-md transition-colors"
              >
                <X className="w-5 h-5 text-[var(--grey-600)]" />
              </button>
            </div>

            {/* Search */}
            <div className="px-6 py-4 border-b border-[var(--grey-200)]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--grey-400)]" />
                <input
                  type="text"
                  placeholder="Search sections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[var(--grey-50)] border border-[var(--grey-200)] rounded-lg text-sm text-[var(--grey-900)] placeholder:text-[var(--grey-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Tabs */}
            <div className="px-6 py-3 border-b border-[var(--grey-200)] overflow-x-auto">
              <div className="flex gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                      selectedCategory === category.value
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-[var(--grey-50)] text-[var(--grey-600)] hover:bg-[var(--grey-200)]'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Section Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredSections.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-[var(--grey-500)]">No sections found</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {filteredSections.map((section) => (
                    <SectionCard
                      key={section.type}
                      section={section}
                      onAdd={() => handleAddSection(section.type)}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface SectionCardProps {
  section: SectionDefinition;
  onAdd: () => void;
}

function SectionCard({ section, onAdd }: SectionCardProps) {
  const gradientClass = GRADIENT_MAP[section.type] || 'bg-gradient-to-br from-gray-500 to-gray-600';

  return (
    <button
      onClick={onAdd}
      className="group flex flex-col overflow-hidden rounded-lg border border-[var(--grey-200)] bg-white hover:border-[var(--color-primary)] hover:shadow-md transition-all text-left"
    >
      {/* Thumbnail */}
      <div className={`h-20 ${gradientClass} flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="text-[0.75rem] font-bold text-[var(--grey-900)] mb-1">
          {section.name}
        </h3>
        <p className="text-[0.625rem] text-[var(--grey-600)] line-clamp-2 mb-2">
          {section.description}
        </p>

        {/* Variant Chips */}
        {section.variants && section.variants.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto">
            {section.variants.slice(0, 2).map((variant) => (
              <span
                key={variant}
                className="px-1.5 py-0.5 bg-[var(--grey-50)] text-[0.625rem] text-[var(--grey-500)] rounded"
              >
                {variant}
              </span>
            ))}
            {section.variants.length > 2 && (
              <span className="px-1.5 py-0.5 bg-[var(--grey-50)] text-[0.625rem] text-[var(--grey-500)] rounded">
                +{section.variants.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
