'use client';

import { useState, useCallback } from 'react';
import { X, Plus, Layers, FileText, Sparkles } from 'lucide-react';
import {
  getSection,
  PageRenderer,
  type PageConfig,
  type SectionConfig,
} from '@baazarify/storefront-builder';

import { apiRequest } from '@/lib/api';

import { AIChat } from './ai-chat';
import { SectionList } from './section-list';
import { SectionSettings } from './section-settings';
import { AddSectionModal } from './add-section-modal';
import { AIGenerateModal } from './ai-generate-modal';

interface PageEditorProps {
  initialPages?: PageConfig[];
}

const defaultPage: PageConfig = {
  id: 'landing',
  slug: '/',
  title: 'Home',
  sections: [],
  seo: {},
};

function generateId(): string {
  return `section-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function generatePageId(): string {
  return `page-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function PageEditor({ initialPages }: PageEditorProps) {
  const [pages, setPages] = useState<PageConfig[]>(
    initialPages && initialPages.length > 0 ? initialPages : [defaultPage]
  );
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showNewPageForm, setShowNewPageForm] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [deletingPageIndex, setDeletingPageIndex] = useState<number | null>(null);

  const config = pages[activePageIndex];

  const selectedSection = config.sections.find((s) => s.id === selectedSectionId);

  const showMessageToast = useCallback((type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }, []);

  const updateActivePage = useCallback(
    (updater: (page: PageConfig) => PageConfig) => {
      setPages((prev) => prev.map((p, i) => (i === activePageIndex ? updater(p) : p)));
    },
    [activePageIndex]
  );

  const updateSections = useCallback(
    (updater: (sections: SectionConfig[]) => SectionConfig[]) => {
      updateActivePage((page) => ({ ...page, sections: updater(page.sections) }));
    },
    [updateActivePage]
  );

  const handleAddSection = useCallback(
    (type: string) => {
      const definition = getSection(type);
      if (!definition) return;

      const newSection: SectionConfig = {
        id: generateId(),
        type,
        props: { ...definition.defaultProps },
        visible: true,
      };

      updateSections((sections) => [...sections, newSection]);
      setSelectedSectionId(newSection.id);
    },
    [updateSections]
  );

  const handleDeleteSection = useCallback(
    (id: string) => {
      updateSections((sections) => sections.filter((s) => s.id !== id));
      if (selectedSectionId === id) setSelectedSectionId(null);
    },
    [selectedSectionId, updateSections]
  );

  const handleMoveSection = useCallback(
    (id: string, direction: 'up' | 'down') => {
      updateSections((sections) => {
        const index = sections.findIndex((s) => s.id === id);
        if (index === -1) return sections;
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= sections.length) return sections;

        const updated = [...sections];
        [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
        return updated;
      });
    },
    [updateSections]
  );

  const handleToggleVisibility = useCallback(
    (id: string) => {
      updateSections((sections) =>
        sections.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s))
      );
    },
    [updateSections]
  );

  const handleUpdateProps = useCallback(
    (props: Record<string, unknown>) => {
      if (!selectedSectionId) return;
      updateSections((sections) =>
        sections.map((s) => (s.id === selectedSectionId ? { ...s, props } : s))
      );
    },
    [selectedSectionId, updateSections]
  );

  const handleSaveDraft = async () => {
    try {
      setSaving(true);
      await apiRequest('/stores/me/landing-page/draft', {
        method: 'PUT',
        body: JSON.stringify(config),
      });
      showMessageToast('success', 'Draft saved');
    } catch {
      showMessageToast('error', 'Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    try {
      setPublishing(true);
      await apiRequest('/stores/me/landing-page/draft', {
        method: 'PUT',
        body: JSON.stringify(config),
      });
      await apiRequest('/stores/me/landing-page/publish', { method: 'POST' });
      showMessageToast('success', 'Landing page published');
    } catch {
      showMessageToast('error', 'Failed to publish');
    } finally {
      setPublishing(false);
    }
  };

  const handleAddPage = useCallback(() => {
    if (!newPageTitle.trim()) return;
    const slug = newPageSlug.trim() || `/${newPageTitle.trim().toLowerCase().replace(/\s+/g, '-')}`;
    const newPage: PageConfig = {
      id: generatePageId(),
      slug,
      title: newPageTitle.trim(),
      sections: [],
      seo: {},
    };
    setPages((prev) => [...prev, newPage]);
    setActivePageIndex(pages.length);
    setSelectedSectionId(null);
    setNewPageTitle('');
    setNewPageSlug('');
    setShowNewPageForm(false);
  }, [newPageTitle, newPageSlug, pages.length]);

  const handleDeletePage = useCallback(
    (index: number) => {
      if (pages.length <= 1) return;
      setPages((prev) => prev.filter((_, i) => i !== index));
      if (activePageIndex >= index && activePageIndex > 0) {
        setActivePageIndex((prev) => prev - 1);
      }
      setSelectedSectionId(null);
      setDeletingPageIndex(null);
    },
    [pages.length, activePageIndex]
  );

  const handlePageSwitch = useCallback((index: number) => {
    setActivePageIndex(index);
    setSelectedSectionId(null);
  }, []);

  const handleAIGenerated = useCallback(
    (newConfig: PageConfig) => {
      updateActivePage(() => newConfig);
      setSelectedSectionId(null);
    },
    [updateActivePage]
  );

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col overflow-hidden rounded-[20px] border border-[var(--grey-200)] bg-white shadow-[0_1px_3px_-1px_rgba(26,26,26,0.04),0_4px_12px_-4px_rgba(26,26,26,0.03)]">
      {/* ── Page tabs ── */}
      <div className="flex items-center border-b border-[var(--grey-200)] bg-[var(--grey-50)]">
        <div className="flex flex-1 items-center overflow-x-auto thin-scroll">
          {pages.map((page, index) => (
            <div
              key={page.id}
              className={`group relative flex items-center gap-1.5 border-b-2 px-4 py-3 text-[0.8125rem] transition-all ${
                index === activePageIndex
                  ? 'border-[var(--color-primary)] font-bold text-[var(--color-primary)] bg-white'
                  : 'border-transparent font-medium text-[var(--grey-500)] hover:text-[var(--grey-700)] hover:bg-white/60'
              }`}
            >
              <FileText size={14} className="flex-shrink-0 opacity-60" />
              <button
                type="button"
                onClick={() => handlePageSwitch(index)}
                className="whitespace-nowrap"
              >
                {page.title}
              </button>
              {pages.length > 1 && (
                <>
                  {deletingPageIndex === index ? (
                    <span className="ml-1 flex items-center gap-1.5 text-[0.6875rem]">
                      <button
                        type="button"
                        onClick={() => handleDeletePage(index)}
                        className="font-bold text-red-500 hover:text-red-700"
                      >
                        Yes
                      </button>
                      <span className="text-[var(--grey-300)]">/</span>
                      <button
                        type="button"
                        onClick={() => setDeletingPageIndex(null)}
                        className="text-[var(--grey-500)] hover:text-[var(--grey-700)]"
                      >
                        No
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeletingPageIndex(index)}
                      className="ml-0.5 hidden rounded-md p-0.5 text-[var(--grey-400)] hover:bg-[var(--grey-200)] hover:text-[var(--grey-600)] group-hover:inline-flex"
                    >
                      <X size={12} />
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {showNewPageForm ? (
          <div className="flex items-center gap-2 border-l border-[var(--grey-200)] px-3 py-2">
            <input
              type="text"
              value={newPageTitle}
              onChange={(e) => setNewPageTitle(e.target.value)}
              placeholder="Page title"
              autoFocus
              className="w-24 rounded-[10px] border border-[var(--grey-200)] bg-white px-2.5 py-1.5 text-[0.75rem] text-[var(--grey-900)] placeholder:text-[var(--grey-400)] focus:border-[var(--color-primary)] focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddPage();
                if (e.key === 'Escape') setShowNewPageForm(false);
              }}
            />
            <input
              type="text"
              value={newPageSlug}
              onChange={(e) => setNewPageSlug(e.target.value)}
              placeholder="/slug"
              className="w-20 rounded-[10px] border border-[var(--grey-200)] bg-white px-2.5 py-1.5 text-[0.75rem] text-[var(--grey-900)] placeholder:text-[var(--grey-400)] focus:border-[var(--color-primary)] focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddPage();
                if (e.key === 'Escape') setShowNewPageForm(false);
              }}
            />
            <button
              type="button"
              onClick={handleAddPage}
              disabled={!newPageTitle.trim()}
              className="rounded-[10px] bg-[var(--color-primary)] px-3 py-1.5 text-[0.75rem] font-bold text-white transition-all hover:bg-[var(--primary-dark)] disabled:opacity-40"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowNewPageForm(false)}
              className="rounded-md p-1 text-[var(--grey-400)] hover:text-[var(--grey-600)]"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowNewPageForm(true)}
            className="flex items-center gap-1.5 border-l border-dashed border-[var(--grey-200)] px-4 py-3 text-[0.75rem] font-semibold text-[var(--grey-400)] transition-colors hover:text-[var(--color-primary)] hover:bg-white/60"
          >
            <Plus size={14} />
            New Page
          </button>
        )}
      </div>

      {/* ── Editor panels ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <div className="flex w-60 flex-shrink-0 flex-col border-r border-[var(--grey-200)] bg-[var(--grey-50)]">
          <div className="flex items-center justify-between border-b border-[var(--grey-200)] px-4 py-3.5">
            <div className="flex items-center gap-2">
              <Layers size={14} className="text-[var(--grey-500)]" />
              <h3 className="text-[0.8125rem] font-bold text-[var(--grey-800)]">Sections</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="rounded-[10px] bg-[var(--color-primary)] px-2.5 py-1 text-[0.6875rem] font-bold text-white transition-all hover:bg-[var(--primary-dark)] active:scale-95"
            >
              + Add
            </button>
          </div>
          <div className="flex-1 overflow-y-auto thin-scroll p-3">
            <SectionList
              sections={config.sections}
              selectedId={selectedSectionId || undefined}
              onSelect={setSelectedSectionId}
              onMove={handleMoveSection}
              onToggleVisibility={handleToggleVisibility}
              onDelete={handleDeleteSection}
            />
            {config.sections.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <Layers size={24} className="text-[var(--grey-300)]" />
                <p className="text-center text-[0.75rem] text-[var(--grey-400)]">
                  No sections yet.
                  <br />
                  Click + Add to get started.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Center: Preview */}
        <div className="flex flex-1 flex-col overflow-hidden bg-[var(--grey-50)]">
          <div className="flex items-center justify-between border-b border-[var(--grey-200)] bg-white px-5 py-3">
            <h3 className="text-[0.8125rem] font-bold text-[var(--grey-800)]">Preview</h3>
            <div className="flex items-center gap-2">
              {message && (
                <span
                  className={`animate-slide-up text-[0.75rem] font-semibold ${
                    message.type === 'success'
                      ? 'text-[var(--success-main)]'
                      : 'text-[var(--error-main)]'
                  }`}
                >
                  {message.text}
                </span>
              )}
              <button
                type="button"
                onClick={() => setShowAIModal(true)}
                className="inline-flex items-center gap-1.5 rounded-[10px] bg-gradient-to-r from-[var(--color-primary)] to-[var(--warning-main)] px-3.5 py-1.5 text-[0.75rem] font-bold text-white shadow-sm transition-all hover:shadow-md active:scale-[0.97]"
              >
                <Sparkles size={12} />
                AI Generate
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={saving}
                className="rounded-[10px] border border-[var(--grey-200)] px-3.5 py-1.5 text-[0.75rem] font-semibold text-[var(--grey-700)] transition-all hover:bg-[var(--grey-50)] hover:border-[var(--grey-300)] disabled:opacity-40"
              >
                {saving ? 'Saving...' : 'Save Draft'}
              </button>
              <button
                type="button"
                onClick={handlePublish}
                disabled={publishing}
                className="rounded-[10px] bg-[var(--success-main)] px-3.5 py-1.5 text-[0.75rem] font-bold text-white shadow-sm transition-all hover:bg-[var(--success-dark)] disabled:opacity-40 active:scale-[0.97]"
              >
                {publishing ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto thin-scroll">
            <div className="min-h-[400px]">
              {config.sections.length > 0 ? (
                <PageRenderer
                  config={config}
                  editMode
                  onSectionSelect={setSelectedSectionId}
                  onSectionMove={handleMoveSection}
                  onSectionDelete={handleDeleteSection}
                />
              ) : (
                <div className="flex h-96 flex-col items-center justify-center gap-3">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--grey-100)]">
                    <FileText size={28} className="text-[var(--grey-300)]" />
                  </div>
                  <p className="text-[0.9375rem] font-medium text-[var(--grey-500)]">
                    Your page is empty
                  </p>
                  <p className="text-[0.75rem] text-[var(--grey-400)]">
                    Add sections or use AI to generate a page
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        {selectedSection && (
          <div className="w-72 flex-shrink-0 overflow-y-auto thin-scroll border-l border-[var(--grey-200)] bg-white p-5">
            <SectionSettings section={selectedSection} onChange={handleUpdateProps} />
          </div>
        )}
      </div>

      {/* ── AI Chat bar ── */}
      <AIChat onGenerated={handleAIGenerated} />

      <AddSectionModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddSection}
      />

      <AIGenerateModal
        open={showAIModal}
        onClose={() => setShowAIModal(false)}
        onGenerated={handleAIGenerated}
      />
    </div>
  );
}
