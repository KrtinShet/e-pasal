'use client';

interface PresetOption {
  key: string;
  name: string;
  description: string;
  colors: { primary: string; secondary: string; accent: string };
}

interface PresetSelectorProps {
  presets: PresetOption[];
  activePreset?: string;
  onSelect: (key: string) => void;
}

export function PresetSelector({ presets, activePreset, onSelect }: PresetSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
      {presets.map((preset) => (
        <button
          key={preset.key}
          type="button"
          onClick={() => onSelect(preset.key)}
          className={`rounded-lg border-2 p-3 text-left transition-all ${
            activePreset === preset.key
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="mb-2 flex gap-1">
            <div
              className="h-6 w-6 rounded-full"
              style={{ backgroundColor: preset.colors.primary }}
            />
            <div
              className="h-6 w-6 rounded-full"
              style={{ backgroundColor: preset.colors.secondary }}
            />
            <div
              className="h-6 w-6 rounded-full"
              style={{ backgroundColor: preset.colors.accent }}
            />
          </div>
          <p className="text-sm font-medium text-gray-900">{preset.name}</p>
          <p className="text-xs text-gray-500">{preset.description}</p>
        </button>
      ))}
    </div>
  );
}
