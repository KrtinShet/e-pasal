'use client';

import { useMemo, useState, useCallback } from 'react';
import {
  presets,
  deepMerge,
  tokenSchema,
  defaultTokens,
  type DeepPartial,
  type ThemeTokens,
} from '@baazarify/ui';

import { apiRequest } from '@/lib/api';

import { ColorPicker } from './color-picker';
import { RadiusSlider } from './radius-slider';
import { FontSelector } from './font-selector';
import { ThemePreview } from './theme-preview';
import { PresetSelector } from './preset-selector';

interface ThemeData {
  preset?: string;
  tokens?: Record<string, unknown>;
  primaryColor?: string;
  accentColor?: string;
}

interface ThemeEditorProps {
  initialTheme?: ThemeData;
}

type EditorTab = 'presets' | 'colors' | 'typography' | 'radius';
type PreviewDevice = 'desktop' | 'tablet' | 'mobile';

export function ThemeEditor({ initialTheme }: ThemeEditorProps) {
  const [activeTab, setActiveTab] = useState<EditorTab>('presets');
  const initialPresetTokens = useMemo(() => {
    if (initialTheme?.preset && presets[initialTheme.preset]) {
      return presets[initialTheme.preset].tokens as DeepPartial<ThemeTokens>;
    }
    return {};
  }, [initialTheme?.preset]);

  const initialTokens = useMemo(
    () =>
      (initialTheme?.tokens as DeepPartial<ThemeTokens>) &&
      Object.keys((initialTheme?.tokens as Record<string, unknown>) || {}).length > 0
        ? (initialTheme?.tokens as DeepPartial<ThemeTokens>)
        : initialPresetTokens,
    [initialPresetTokens, initialTheme?.tokens]
  );

  const [activePreset, setActivePreset] = useState(initialTheme?.preset);
  const [tokens, setTokens] = useState<DeepPartial<ThemeTokens>>(initialTokens);
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const mergedTokens = deepMerge(defaultTokens, tokens) as ThemeTokens;

  const updateColor = useCallback((key: string, value: string) => {
    setTokens((prev) => ({
      ...prev,
      colors: { ...prev.colors, [key]: value },
    }));
    setActivePreset(undefined);
  }, []);

  const updateTextColor = useCallback((key: string, value: string) => {
    setTokens((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        text: { ...(prev.colors as any)?.text, [key]: value },
      },
    }));
    setActivePreset(undefined);
  }, []);

  const updateRadius = useCallback((key: string, value: number) => {
    setTokens((prev) => ({
      ...prev,
      radius: { ...prev.radius, [key]: value },
    }));
    setActivePreset(undefined);
  }, []);

  const updateFont = useCallback((key: string, value: string) => {
    setTokens((prev) => ({
      ...prev,
      typography: {
        ...prev.typography,
        fontFamily: { ...prev.typography?.fontFamily, [key]: value },
      },
    }));
    setActivePreset(undefined);
  }, []);

  const handlePresetSelect = async (presetKey: string) => {
    const previousPreset = activePreset;
    const previousTokens = tokens;
    const presetConfig = presets[presetKey];

    if (presetConfig) {
      setTokens(presetConfig.tokens as DeepPartial<ThemeTokens>);
    } else {
      setTokens({});
    }
    setActivePreset(presetKey);

    try {
      setSaving(true);
      await apiRequest('/stores/me/theme/preset/' + presetKey, { method: 'POST' });
      setMessage({ type: 'success', text: 'Preset applied' });
    } catch {
      setActivePreset(previousPreset);
      setTokens(previousTokens);
      setMessage({ type: 'error', text: 'Failed to apply preset' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await apiRequest('/stores/me/theme', {
        method: 'PUT',
        body: JSON.stringify({
          preset: activePreset,
          tokens,
        }),
      });
      setMessage({ type: 'success', text: 'Theme saved successfully' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to save theme' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleReset = async () => {
    try {
      setSaving(true);
      await apiRequest('/stores/me/theme/reset', { method: 'POST' });
      setTokens({});
      setActivePreset(undefined);
      setMessage({ type: 'success', text: 'Theme reset to defaults' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to reset theme' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const presetOptions = Object.entries(presets).map(([key, preset]) => ({
    key,
    name: preset.name,
    description: preset.description,
    colors: {
      primary: preset.tokens?.colors?.primary || defaultTokens.colors.primary,
      secondary: preset.tokens?.colors?.secondary || defaultTokens.colors.secondary,
      accent: preset.tokens?.colors?.accent || defaultTokens.colors.accent,
    },
  }));

  const tabs: { key: EditorTab; label: string }[] = [
    { key: 'presets', label: 'Presets' },
    { key: 'colors', label: 'Colors' },
    { key: 'typography', label: 'Typography' },
    { key: 'radius', label: 'Radius' },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="rounded-lg border border-[var(--grey-200)] bg-[white]">
          <div className="flex border-b border-[var(--grey-200)]">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-[var(--grey-600)] hover:text-[var(--grey-900)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'presets' && (
              <div>
                <p className="mb-4 text-sm text-[var(--grey-600)]">
                  Choose a preset to quickly style your store, or customize individual settings.
                </p>
                <PresetSelector
                  presets={presetOptions}
                  activePreset={activePreset}
                  onSelect={handlePresetSelect}
                />
              </div>
            )}

            {activeTab === 'colors' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[var(--grey-900)]">Brand Colors</h3>
                <ColorPicker
                  label="Primary"
                  value={mergedTokens.colors.primary}
                  onChange={(v) => updateColor('primary', v)}
                  description={tokenSchema.colors.primary.description}
                />
                <ColorPicker
                  label="Secondary"
                  value={mergedTokens.colors.secondary}
                  onChange={(v) => updateColor('secondary', v)}
                  description={tokenSchema.colors.secondary.description}
                />
                <ColorPicker
                  label="Accent"
                  value={mergedTokens.colors.accent}
                  onChange={(v) => updateColor('accent', v)}
                  description={tokenSchema.colors.accent.description}
                />

                <h3 className="mt-6 text-sm font-semibold text-[var(--grey-900)]">Background</h3>
                <ColorPicker
                  label="Background"
                  value={mergedTokens.colors.background}
                  onChange={(v) => updateColor('background', v)}
                />
                <ColorPicker
                  label="Surface"
                  value={mergedTokens.colors.surface}
                  onChange={(v) => updateColor('surface', v)}
                />
                <ColorPicker
                  label="Border"
                  value={mergedTokens.colors.border}
                  onChange={(v) => updateColor('border', v)}
                />

                <h3 className="mt-6 text-sm font-semibold text-[var(--grey-900)]">Text Colors</h3>
                <ColorPicker
                  label="Primary Text"
                  value={mergedTokens.colors.text.primary}
                  onChange={(v) => updateTextColor('primary', v)}
                />
                <ColorPicker
                  label="Secondary Text"
                  value={mergedTokens.colors.text.secondary}
                  onChange={(v) => updateTextColor('secondary', v)}
                />
                <ColorPicker
                  label="Muted Text"
                  value={mergedTokens.colors.text.muted}
                  onChange={(v) => updateTextColor('muted', v)}
                />
              </div>
            )}

            {activeTab === 'typography' && (
              <div className="space-y-4">
                <FontSelector
                  label="Display Font"
                  value={mergedTokens.typography.fontFamily.display}
                  options={tokenSchema.typography.fontFamily.display.options || []}
                  onChange={(v) => updateFont('display', v)}
                  description={tokenSchema.typography.fontFamily.display.description}
                />
                <FontSelector
                  label="Body Font"
                  value={mergedTokens.typography.fontFamily.body}
                  options={tokenSchema.typography.fontFamily.body.options || []}
                  onChange={(v) => updateFont('body', v)}
                  description={tokenSchema.typography.fontFamily.body.description}
                />
                <FontSelector
                  label="Monospace Font"
                  value={mergedTokens.typography.fontFamily.mono}
                  options={tokenSchema.typography.fontFamily.mono.options || []}
                  onChange={(v) => updateFont('mono', v)}
                  description={tokenSchema.typography.fontFamily.mono.description}
                />
              </div>
            )}

            {activeTab === 'radius' && (
              <div className="space-y-4">
                <RadiusSlider
                  label="Small"
                  value={mergedTokens.radius.sm}
                  onChange={(v) => updateRadius('sm', v)}
                  max={8}
                />
                <RadiusSlider
                  label="Medium"
                  value={mergedTokens.radius.md}
                  onChange={(v) => updateRadius('md', v)}
                  max={16}
                />
                <RadiusSlider
                  label="Large"
                  value={mergedTokens.radius.lg}
                  onChange={(v) => updateRadius('lg', v)}
                  max={24}
                />
                <RadiusSlider
                  label="Extra Large"
                  value={mergedTokens.radius.xl}
                  onChange={(v) => updateRadius('xl', v)}
                  max={32}
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-[var(--grey-200)] px-6 py-4">
            <button
              type="button"
              onClick={handleReset}
              disabled={saving}
              className="text-sm text-[var(--grey-600)] hover:text-[var(--grey-900)] disabled:opacity-50"
            >
              Reset to defaults
            </button>
            <div className="flex items-center gap-3">
              {message && (
                <span
                  className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
                >
                  {message.text}
                </span>
              )}
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Theme'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="sticky top-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-[var(--grey-900)]">Preview</h3>
            <div className="inline-flex rounded-lg border border-[var(--grey-200)] bg-white p-1">
              {(['desktop', 'tablet', 'mobile'] as PreviewDevice[]).map((device) => (
                <button
                  key={device}
                  type="button"
                  onClick={() => setPreviewDevice(device)}
                  className={`rounded-md px-2 py-1 text-xs font-semibold capitalize transition-colors ${
                    previewDevice === device
                      ? 'bg-[var(--primary-main)] text-white'
                      : 'text-[var(--grey-600)] hover:bg-[var(--grey-100)]'
                  }`}
                >
                  {device}
                </button>
              ))}
            </div>
          </div>
          <ThemePreview tokens={mergedTokens} device={previewDevice} />
        </div>
      </div>
    </div>
  );
}
