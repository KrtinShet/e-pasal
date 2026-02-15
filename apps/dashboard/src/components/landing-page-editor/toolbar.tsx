'use client';

import {
  Plus,
  Save,
  Undo2,
  Redo2,
  Minus,
  Tablet,
  Monitor,
  Sparkles,
  Smartphone,
} from 'lucide-react';

import type { DeviceMode } from './canvas';

interface ToolbarProps {
  device: DeviceMode;
  zoom: number;
  canUndo: boolean;
  canRedo: boolean;
  saving: boolean;
  publishing: boolean;
  hasUnsavedChanges: boolean;
  savedText: string;
  onDeviceChange: (device: DeviceMode) => void;
  onZoomChange: (zoom: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onPublish: () => void;
  onAIGenerate: () => void;
}

const DEVICE_ICONS: Record<DeviceMode, React.ComponentType<{ size?: number }>> = {
  desktop: Monitor,
  tablet: Tablet,
  mobile: Smartphone,
};

export function Toolbar({
  device,
  zoom,
  canUndo,
  canRedo,
  saving,
  publishing,
  hasUnsavedChanges,
  savedText,
  onDeviceChange,
  onZoomChange,
  onUndo,
  onRedo,
  onSave,
  onPublish,
  onAIGenerate,
}: ToolbarProps) {
  const handleZoomIn = () => {
    onZoomChange(Math.min(150, zoom + 10));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(50, zoom - 10));
  };

  return (
    <div className="flex items-center justify-between border-b border-[var(--grey-200)] bg-white px-5 py-3">
      {/* Left section */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="rounded-md p-2 text-[var(--grey-600)] transition-colors hover:bg-[var(--grey-100)] disabled:opacity-30 disabled:hover:bg-transparent"
          title="Undo"
        >
          <Undo2 size={16} />
        </button>
        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          className="rounded-md p-2 text-[var(--grey-600)] transition-colors hover:bg-[var(--grey-100)] disabled:opacity-30 disabled:hover:bg-transparent"
          title="Redo"
        >
          <Redo2 size={16} />
        </button>
        <div className="mx-2 h-5 w-px bg-[var(--grey-200)]" />
        <span className="text-[0.6875rem] text-[var(--grey-500)]">{savedText}</span>
      </div>

      {/* Center section */}
      <div className="flex items-center gap-3">
        {/* Device toggle */}
        <div className="flex items-center gap-1 rounded-xl border border-[var(--grey-200)] bg-[var(--grey-50)] p-1">
          {(['desktop', 'tablet', 'mobile'] as DeviceMode[]).map((mode) => {
            const Icon = DEVICE_ICONS[mode];
            const isActive = device === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => onDeviceChange(mode)}
                className={`rounded-lg px-3 py-1.5 text-[0.75rem] font-medium transition-all ${
                  isActive
                    ? 'bg-white text-[var(--grey-900)] shadow-sm'
                    : 'text-[var(--grey-500)] hover:text-[var(--grey-700)]'
                }`}
                title={mode.charAt(0).toUpperCase() + mode.slice(1)}
              >
                <Icon size={14} />
              </button>
            );
          })}
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1 rounded-xl border border-[var(--grey-200)] bg-white p-1">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            className="rounded-lg p-1.5 text-[var(--grey-600)] transition-colors hover:bg-[var(--grey-100)] disabled:opacity-30"
            title="Zoom out"
          >
            <Minus size={14} />
          </button>
          <span className="min-w-[3rem] text-center text-[0.6875rem] font-medium text-[var(--grey-700)]">
            {zoom}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoom >= 150}
            className="rounded-lg p-1.5 text-[var(--grey-600)] transition-colors hover:bg-[var(--grey-100)] disabled:opacity-30"
            title="Zoom in"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onAIGenerate}
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-[0.875rem] font-medium text-white shadow-sm transition-all hover:shadow-md active:scale-95"
          style={{
            background: 'linear-gradient(135deg, var(--primary-main), var(--warning-main))',
          }}
        >
          <Sparkles size={14} />
          AI Generate
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={!hasUnsavedChanges || saving}
          className="flex items-center gap-2 rounded-xl border border-[var(--grey-200)] bg-white px-4 py-2 text-[0.875rem] font-medium text-[var(--grey-700)] transition-all hover:bg-[var(--grey-50)] disabled:opacity-50"
        >
          <Save size={14} />
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onPublish}
          disabled={publishing}
          className="rounded-xl bg-[var(--success-main)] px-4 py-2 text-[0.875rem] font-bold text-white shadow-sm transition-all hover:shadow-md active:scale-95 disabled:opacity-50"
        >
          {publishing ? 'Publishing...' : 'Publish'}
        </button>
      </div>
    </div>
  );
}
