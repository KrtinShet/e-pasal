'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, Home, Plus, Layers, FileText } from 'lucide-react';
import { useMemo, useState, useEffect, useCallback } from 'react';
import {
  getSection,
  PageRenderer,
  type PageConfig,
  type SectionConfig,
  type LandingPagesConfig,
  type ElementStyleOverride,
} from '@baazarify/storefront-builder';

import { apiRequest } from '@/lib/api';

import { Canvas } from './canvas';
import { AIChat } from './ai-chat';
import { Toolbar } from './toolbar';
import { useHistory } from './use-history';
import type { DeviceMode } from './canvas';
import { PropertiesPanel } from './properties-panel';
import { AIGenerateModal } from './ai-generate-modal';
import { AddSectionPanel } from './add-section-panel';
import { DraggableSectionList } from './draggable-section-list';

interface PageEditorProps {
  initialConfig?: LandingPagesConfig;
  initialPublishedPageIds?: string[];
}

const defaultPage: PageConfig = {
  id: 'landing',
  slug: '/',
  title: 'Home',
  sections: [],
  seo: {},
};

const RESERVED_SLUGS = new Set([
  '/products',
  '/cart',
  '/checkout',
  '/checkout/confirmation',
  '/robots.txt',
  '/sitemap.xml',
]);

function generateId(): string {
  return `section-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function generatePageId(): string {
  return `page-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function titleToSlug(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function normalizeSlug(slug: string) {
  const trimmed = slug.trim();
  if (!trimmed) return '';
  if (trimmed === '/') return '/';

  const withoutLeading = trimmed.replace(/^\/+/, '');
  const cleaned = withoutLeading
    .toLowerCase()
    .replace(/[^a-z0-9/-]/g, '')
    .replace(/\/+/g, '/')
    .replace(/\/$/, '');

  return cleaned ? `/${cleaned}` : '/';
}

function getSlugValidationError(slug: string, pages: PageConfig[], currentPageId?: string) {
  if (!slug) {
    return 'Page slug is invalid';
  }

  if (RESERVED_SLUGS.has(slug)) {
    return `${slug} is reserved for storefront routes`;
  }

  if (slug === '/' && pages.some((page) => page.slug === '/' && page.id !== currentPageId)) {
    return 'Only one page can use /';
  }

  if (pages.some((page) => page.slug === slug && page.id !== currentPageId)) {
    return 'A page with this slug already exists';
  }

  return null;
}

function toDraftConfig(pages: PageConfig[], homePageId?: string): LandingPagesConfig {
  return {
    version: 2,
    pages,
    homePageId: homePageId || pages.find((page) => page.slug === '/')?.id || pages[0]?.id,
  };
}

export function PageEditor({ initialConfig, initialPublishedPageIds }: PageEditorProps) {
  const initialPages = initialConfig?.pages?.length ? initialConfig.pages : [defaultPage];
  const history = useHistory<PageConfig[]>(initialPages);
  const [homePageId, setHomePageId] = useState<string | undefined>(
    initialConfig?.homePageId ||
      initialPages.find((page) => page.slug === '/')?.id ||
      initialPages[0]?.id
  );
  const [publishedPageIds, setPublishedPageIds] = useState<Set<string>>(
    () => new Set(initialPublishedPageIds || [])
  );
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedElementPath, setSelectedElementPath] = useState<string | null>(null);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showNewPageForm, setShowNewPageForm] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [deletingPageIndex, setDeletingPageIndex] = useState<number | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const [zoom, setZoom] = useState(100);

  const pages = history.current;
  const config = pages[activePageIndex] || pages[0];
  const [pageTitleInput, setPageTitleInput] = useState(config?.title || '');
  const [pageSlugInput, setPageSlugInput] = useState(config?.slug || '/');

  const draftConfig = useMemo(() => toDraftConfig(pages, homePageId), [pages, homePageId]);
  const draftHash = useMemo(() => JSON.stringify(draftConfig), [draftConfig]);
  const [lastSavedHash, setLastSavedHash] = useState(draftHash);
  const hasUnsavedChanges = draftHash !== lastSavedHash;

  useEffect(() => {
    if (activePageIndex <= pages.length - 1) return;
    setActivePageIndex(Math.max(0, pages.length - 1));
  }, [activePageIndex, pages.length]);

  useEffect(() => {
    setHomePageId((prev) => {
      if (prev && pages.some((page) => page.id === prev)) return prev;
      return pages.find((page) => page.slug === '/')?.id || pages[0]?.id;
    });
  }, [pages]);

  useEffect(() => {
    if (!config) return;
    setPageTitleInput(config.title);
    setPageSlugInput(config.slug);
  }, [config?.id, config?.slug, config?.title]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          history.redo();
        } else {
          history.undo();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [history]);

  const showMessageToast = useCallback((type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }, []);

  const saveDraft = useCallback(
    async (options?: { silent?: boolean }) => {
      try {
        setSaving(true);
        const hashAtSave = draftHash;

        await apiRequest('/stores/me/landing-page/draft', {
          method: 'PUT',
          body: JSON.stringify(draftConfig),
        });

        setLastSavedHash(hashAtSave);
        setLastSavedAt(new Date());

        if (!options?.silent) {
          showMessageToast('success', 'Draft saved');
        }

        return true;
      } catch {
        showMessageToast('error', 'Failed to save draft');
        return false;
      } finally {
        setSaving(false);
      }
    },
    [draftConfig, draftHash, showMessageToast]
  );

  useEffect(() => {
    if (!hasUnsavedChanges || saving || publishing) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      void saveDraft({ silent: true });
    }, 1400);

    return () => clearTimeout(timeout);
  }, [hasUnsavedChanges, publishing, saveDraft, saving]);

  const updateActivePage = useCallback(
    (updater: (page: PageConfig) => PageConfig) => {
      history.set(pages.map((page, index) => (index === activePageIndex ? updater(page) : page)));
    },
    [activePageIndex, pages, history]
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
      updateSections((sections) => sections.filter((section) => section.id !== id));
      if (selectedSectionId === id) {
        setSelectedSectionId(null);
        setSelectedElementPath(null);
      }
    },
    [selectedSectionId, updateSections]
  );

  const handleReorderSections = useCallback(
    (activeId: string, overId: string) => {
      updateSections((sections) => {
        const oldIndex = sections.findIndex((s) => s.id === activeId);
        const newIndex = sections.findIndex((s) => s.id === overId);
        if (oldIndex === -1 || newIndex === -1) return sections;
        const updated = [...sections];
        const [moved] = updated.splice(oldIndex, 1);
        updated.splice(newIndex, 0, moved);
        return updated;
      });
    },
    [updateSections]
  );

  const handleToggleVisibility = useCallback(
    (id: string) => {
      updateSections((sections) =>
        sections.map((section) =>
          section.id === id ? { ...section, visible: !section.visible } : section
        )
      );
    },
    [updateSections]
  );

  const handleSectionPropsChange = useCallback(
    (id: string, props: Record<string, unknown>) => {
      updateSections((sections) =>
        sections.map((section) => (section.id === id ? { ...section, props } : section))
      );
    },
    [updateSections]
  );

  const handleElementStyleChange = useCallback(
    (sectionId: string, elementPath: string, styles: Partial<ElementStyleOverride>) => {
      updateSections((sections) =>
        sections.map((s) => {
          if (s.id !== sectionId) return s;
          return {
            ...s,
            elementStyles: {
              ...s.elementStyles,
              [elementPath]: { ...s.elementStyles?.[elementPath], ...styles },
            },
          };
        })
      );
    },
    [updateSections]
  );

  const handleSaveDraft = async () => {
    await saveDraft();
  };

  const handlePublish = async () => {
    if (!config) return;

    try {
      setPublishing(true);
      const saved = await saveDraft({ silent: true });
      if (!saved) return;

      await apiRequest('/stores/me/landing-page/publish', {
        method: 'POST',
        body: JSON.stringify({ pageId: config.id }),
      });

      setPublishedPageIds((prev) => new Set(prev).add(config.id));
      showMessageToast('success', `Published "${config.title}"`);
    } catch {
      showMessageToast('error', 'Failed to publish page');
    } finally {
      setPublishing(false);
    }
  };

  const handleAddPage = useCallback(() => {
    const trimmedTitle = newPageTitle.trim();
    if (!trimmedTitle) return;

    const requestedSlug = newPageSlug.trim() || titleToSlug(trimmedTitle);
    const slug = normalizeSlug(requestedSlug);

    const slugError = getSlugValidationError(slug, pages);
    if (slugError) {
      showMessageToast('error', slugError);
      return;
    }

    const pageId = generatePageId();
    const newPage: PageConfig = {
      id: pageId,
      slug,
      title: trimmedTitle,
      sections: [],
      seo: {},
    };

    history.set([...pages, newPage]);
    if (slug === '/') {
      setHomePageId(pageId);
    }
    setActivePageIndex(pages.length);
    setSelectedSectionId(null);
    setSelectedElementPath(null);
    setNewPageTitle('');
    setNewPageSlug('');
    setShowNewPageForm(false);
  }, [newPageSlug, newPageTitle, pages, showMessageToast, history]);

  const handleDeletePage = useCallback(
    async (index: number) => {
      if (pages.length <= 1) return;
      const target = pages[index];
      if (!target) return;

      try {
        setPublishing(true);

        if (publishedPageIds.has(target.id)) {
          await apiRequest(`/stores/me/landing-page/published/${target.id}`, {
            method: 'DELETE',
          });

          setPublishedPageIds((prev) => {
            const next = new Set(prev);
            next.delete(target.id);
            return next;
          });
        }

        history.set(pages.filter((_, i) => i !== index));

        if (homePageId === target.id) {
          const nextHomePage = pages.filter((_, i) => i !== index)[0]?.id;
          setHomePageId(nextHomePage);
        }

        if (activePageIndex >= index && activePageIndex > 0) {
          setActivePageIndex((prev) => prev - 1);
        }

        setSelectedSectionId(null);
        setSelectedElementPath(null);
        setDeletingPageIndex(null);
        showMessageToast('success', `Deleted "${target.title}"`);
      } catch {
        showMessageToast('error', 'Failed to delete page');
      } finally {
        setPublishing(false);
      }
    },
    [activePageIndex, homePageId, pages, publishedPageIds, showMessageToast, history]
  );

  const handlePageSwitch = useCallback((index: number) => {
    setActivePageIndex(index);
    setSelectedSectionId(null);
    setSelectedElementPath(null);
  }, []);

  const handlePageTitleCommit = useCallback(() => {
    if (!config) return;

    const nextTitle = pageTitleInput.trim();
    if (!nextTitle) {
      showMessageToast('error', 'Page title is required');
      setPageTitleInput(config.title);
      return;
    }

    if (nextTitle === config.title) {
      return;
    }

    updateActivePage((page) => ({ ...page, title: nextTitle }));
  }, [config, pageTitleInput, showMessageToast, updateActivePage]);

  const handlePageSlugCommit = useCallback(() => {
    if (!config) return;

    const normalized = normalizeSlug(pageSlugInput);
    const slugError = getSlugValidationError(normalized, pages, config.id);
    if (slugError) {
      showMessageToast('error', slugError);
      setPageSlugInput(config.slug);
      return;
    }

    if (normalized === config.slug) {
      return;
    }

    updateActivePage((page) => ({ ...page, slug: normalized }));
    if (normalized === '/') {
      setHomePageId(config.id);
    }
  }, [config, pageSlugInput, pages, showMessageToast, updateActivePage]);

  const handleAIGenerated = useCallback(
    (newConfig: PageConfig) => {
      updateActivePage((page) => ({
        ...newConfig,
        id: page.id,
        slug: page.slug,
        title: page.title,
      }));
      setSelectedSectionId(null);
      setSelectedElementPath(null);
    },
    [updateActivePage]
  );

  const savedText = useMemo(() => {
    if (hasUnsavedChanges) return 'Unsaved changes';
    if (!lastSavedAt) return 'All changes saved';
    return `Saved at ${lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }, [hasUnsavedChanges, lastSavedAt]);

  const selectedSection = useMemo(
    () => config?.sections.find((s) => s.id === selectedSectionId) || null,
    [config?.sections, selectedSectionId]
  );

  const handlePropertiesPanelClose = useCallback(() => {
    setSelectedSectionId(null);
    setSelectedElementPath(null);
  }, []);

  const handleSectionPropsChangeWrapper = useCallback(
    (props: Record<string, unknown>) => {
      if (selectedSectionId) {
        handleSectionPropsChange(selectedSectionId, props);
      }
    },
    [selectedSectionId, handleSectionPropsChange]
  );

  const handleElementStyleChangeWrapper = useCallback(
    (path: string, styles: ElementStyleOverride) => {
      if (selectedSectionId) {
        handleElementStyleChange(selectedSectionId, path, styles);
      }
    },
    [selectedSectionId, handleElementStyleChange]
  );

  if (!config) return null;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--grey-50)]">
      {/* Page Tabs */}
      <div className="flex items-center border-b border-[var(--grey-200)] bg-white shadow-sm">
        <div className="flex flex-1 items-center overflow-x-auto thin-scroll">
          {pages.map((page, index) => {
            const isActive = index === activePageIndex;
            const isPublished = publishedPageIds.has(page.id);
            const isHome = page.id === homePageId;

            return (
              <div
                key={page.id}
                className={`group relative flex items-center gap-1.5 border-b-2 px-4 py-3 text-[0.8125rem] transition-all ${
                  isActive
                    ? 'border-[var(--primary-main)] bg-white font-bold text-[var(--primary-main)]'
                    : 'border-transparent font-medium text-[var(--grey-500)] hover:bg-[var(--grey-50)] hover:text-[var(--grey-700)]'
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
                {isHome && <Home size={12} className="text-[var(--warning-main)]" />}
                {isPublished ? (
                  <span className="rounded-full bg-[var(--success-lighter)] px-1.5 py-0.5 text-[0.625rem] font-bold text-[var(--success-main)]">
                    Live
                  </span>
                ) : (
                  <span className="rounded-full bg-[var(--grey-100)] px-1.5 py-0.5 text-[0.625rem] font-bold text-[var(--grey-500)]">
                    Draft
                  </span>
                )}

                {pages.length > 1 && (
                  <>
                    {deletingPageIndex === index ? (
                      <span className="ml-1 flex items-center gap-1.5 text-[0.6875rem]">
                        <button
                          type="button"
                          onClick={() => void handleDeletePage(index)}
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
            );
          })}
        </div>

        {showNewPageForm ? (
          <div className="flex items-center gap-2 border-l border-[var(--grey-200)] px-3 py-2">
            <input
              type="text"
              value={newPageTitle}
              onChange={(event) => setNewPageTitle(event.target.value)}
              placeholder="Page title"
              autoFocus
              className="w-28 rounded-[10px] border border-[var(--grey-200)] bg-white px-2.5 py-1.5 text-[0.75rem] text-[var(--grey-900)] placeholder:text-[var(--grey-400)] focus:border-[var(--primary-main)] focus:outline-none"
              onKeyDown={(event) => {
                if (event.key === 'Enter') handleAddPage();
                if (event.key === 'Escape') setShowNewPageForm(false);
              }}
            />
            <input
              type="text"
              value={newPageSlug}
              onChange={(event) => setNewPageSlug(event.target.value)}
              placeholder="/slug"
              className="w-24 rounded-[10px] border border-[var(--grey-200)] bg-white px-2.5 py-1.5 text-[0.75rem] text-[var(--grey-900)] placeholder:text-[var(--grey-400)] focus:border-[var(--primary-main)] focus:outline-none"
              onKeyDown={(event) => {
                if (event.key === 'Enter') handleAddPage();
                if (event.key === 'Escape') setShowNewPageForm(false);
              }}
            />
            <button
              type="button"
              onClick={handleAddPage}
              disabled={!newPageTitle.trim()}
              className="rounded-[10px] bg-[var(--primary-main)] px-3 py-1.5 text-[0.75rem] font-bold text-white transition-all hover:bg-[var(--primary-dark)] disabled:opacity-40"
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
            className="flex items-center gap-1.5 border-l border-dashed border-[var(--grey-200)] px-4 py-3 text-[0.75rem] font-semibold text-[var(--grey-400)] transition-colors hover:bg-[var(--grey-50)] hover:text-[var(--primary-main)]"
          >
            <Plus size={14} />
            New Page
          </button>
        )}
      </div>

      {/* Toolbar */}
      <Toolbar
        device={device}
        zoom={zoom}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        saving={saving}
        publishing={publishing}
        hasUnsavedChanges={hasUnsavedChanges}
        savedText={savedText}
        onDeviceChange={setDevice}
        onZoomChange={setZoom}
        onUndo={history.undo}
        onRedo={history.redo}
        onSave={() => void handleSaveDraft()}
        onPublish={() => void handlePublish()}
        onAIGenerate={() => setShowAIModal(true)}
      />

      {/* 3-Panel Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Section Layers */}
        <div className="flex w-60 flex-shrink-0 flex-col border-r border-[var(--grey-200)] bg-white">
          <div className="flex items-center justify-between border-b border-[var(--grey-200)] px-4 py-3.5">
            <div className="flex items-center gap-2">
              <Layers size={14} className="text-[var(--grey-500)]" />
              <h3 className="text-[0.8125rem] font-bold text-[var(--grey-800)]">Sections</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAddPanel(true)}
              className="rounded-[10px] bg-[var(--primary-main)] px-2.5 py-1 text-[0.6875rem] font-bold text-white transition-all hover:bg-[var(--primary-dark)] active:scale-95"
            >
              + Add
            </button>
          </div>
          <div className="flex-1 overflow-y-auto thin-scroll p-3">
            <DraggableSectionList
              sections={config.sections}
              selectedId={selectedSectionId || undefined}
              onSelect={setSelectedSectionId}
              onReorder={handleReorderSections}
              onToggleVisibility={handleToggleVisibility}
              onDelete={handleDeleteSection}
            />
            {config.sections.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 py-12">
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

        {/* Center Panel: Canvas */}
        <Canvas device={device} zoom={zoom} onZoomChange={setZoom}>
          {config.sections.length > 0 ? (
            <PageRenderer
              config={config}
              editMode
              selectedSectionId={selectedSectionId}
              onSectionSelect={setSelectedSectionId}
              onSectionPropsChange={handleSectionPropsChange}
            />
          ) : (
            <div className="flex h-96 flex-col items-center justify-center gap-3 bg-white">
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
        </Canvas>

        {/* Right Panel: Properties */}
        <PropertiesPanel
          selectedSection={selectedSection}
          selectedElementPath={selectedElementPath}
          elementStyles={selectedSection?.elementStyles}
          onSectionPropsChange={handleSectionPropsChangeWrapper}
          onElementStyleChange={handleElementStyleChangeWrapper}
          onClose={handlePropertiesPanelClose}
        />
      </div>

      {/* AI Chat */}
      <AIChat
        onGenerated={handleAIGenerated}
        selectedSectionId={selectedSectionId}
        selectedSectionType={selectedSection?.type}
      />

      {/* Add Section Panel */}
      <AddSectionPanel
        open={showAddPanel}
        onClose={() => setShowAddPanel(false)}
        onAdd={handleAddSection}
      />

      {/* AI Generate Modal */}
      <AIGenerateModal
        open={showAIModal}
        onClose={() => setShowAIModal(false)}
        onGenerated={handleAIGenerated}
      />

      {/* Toast Messages */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 rounded-xl bg-white px-4 py-3 shadow-lg"
          >
            <span
              className={`text-sm font-semibold ${
                message.type === 'success'
                  ? 'text-[var(--success-main)]'
                  : 'text-[var(--error-main)]'
              }`}
            >
              {message.text}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
