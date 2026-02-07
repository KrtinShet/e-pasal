'use client';

import { useState, useCallback } from 'react';
import {
  getSection,
  PageRenderer,
  type PageConfig,
  type SectionConfig,
} from '@baazarify/storefront-builder';

import { apiRequest } from '@/lib/api';

import { SectionList } from './section-list';
import { SectionSettings } from './section-settings';
import { AddSectionModal } from './add-section-modal';
import { AIGenerateModal } from './ai-generate-modal';

interface PageEditorProps {
  initialConfig?: PageConfig | null;
}

const defaultConfig: PageConfig = {
  id: 'landing',
  slug: '/',
  title: 'Home',
  sections: [],
  seo: {},
};

function generateId(): string {
  return `section-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function PageEditor({ initialConfig }: PageEditorProps) {
  const [config, setConfig] = useState<PageConfig>(initialConfig || defaultConfig);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const selectedSection = config.sections.find((s) => s.id === selectedSectionId);

  const showMessage = useCallback((type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }, []);

  const updateSections = useCallback((updater: (sections: SectionConfig[]) => SectionConfig[]) => {
    setConfig((prev) => ({ ...prev, sections: updater(prev.sections) }));
  }, []);

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
      showMessage('success', 'Draft saved');
    } catch {
      showMessage('error', 'Failed to save draft');
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
      showMessage('success', 'Landing page published');
    } catch {
      showMessage('error', 'Failed to publish');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] gap-4">
      {/* Left sidebar: Section list */}
      <div className="flex w-64 flex-shrink-0 flex-col rounded-lg border border-[var(--color-border)] bg-[var(--ivory)]">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
          <h3 className="text-sm font-semibold text-[var(--charcoal)]">Sections</h3>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700"
          >
            + Add
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <SectionList
            sections={config.sections}
            selectedId={selectedSectionId || undefined}
            onSelect={setSelectedSectionId}
            onMove={handleMoveSection}
            onToggleVisibility={handleToggleVisibility}
            onDelete={handleDeleteSection}
          />
          {config.sections.length === 0 && (
            <p className="py-8 text-center text-sm text-[var(--stone)]">
              No sections yet. Click + Add to get started.
            </p>
          )}
        </div>
      </div>

      {/* Center: Preview */}
      <div className="flex-1 overflow-y-auto rounded-lg border border-[var(--color-border)] bg-[var(--ivory)]">
        <div className="border-b border-[var(--color-border)] px-4 py-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--charcoal)]">Preview</h3>
            <div className="flex items-center gap-2">
              {message && (
                <span
                  className={`text-xs ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
                >
                  {message.text}
                </span>
              )}
              <button
                type="button"
                onClick={() => setShowAIModal(true)}
                className="rounded-md bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-700"
              >
                AI Generate
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={saving}
                className="rounded-md border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--charcoal)] hover:bg-[var(--cream-dark)] disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Draft'}
              </button>
              <button
                type="button"
                onClick={handlePublish}
                disabled={publishing}
                className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                {publishing ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
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
            <div className="flex h-96 items-center justify-center text-[var(--stone)]">
              <div className="text-center">
                <p className="text-lg">Your landing page is empty</p>
                <p className="mt-1 text-sm">Add sections to build your page</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right sidebar: Section settings */}
      {selectedSection && (
        <div className="w-72 flex-shrink-0 overflow-y-auto rounded-lg border border-[var(--color-border)] bg-[var(--ivory)] p-4">
          <SectionSettings section={selectedSection} onChange={handleUpdateProps} />
        </div>
      )}

      <AddSectionModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddSection}
      />

      <AIGenerateModal
        open={showAIModal}
        onClose={() => setShowAIModal(false)}
        onGenerated={(newConfig) => {
          setConfig(newConfig);
          setSelectedSectionId(null);
        }}
      />
    </div>
  );
}
