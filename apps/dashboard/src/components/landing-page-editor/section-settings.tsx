'use client';

import { getSection, type SectionConfig } from '@baazarify/storefront-builder';

interface SectionSettingsProps {
  section: SectionConfig;
  onChange: (props: Record<string, unknown>) => void;
}

function PropField({
  name,
  value,
  onChange,
}: {
  name: string;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  if (typeof value === 'boolean') {
    return (
      <div className="flex items-center justify-between">
        <label className="text-sm text-[var(--charcoal)]">{name}</label>
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-[var(--color-border)]"
        />
      </div>
    );
  }

  if (typeof value === 'number') {
    return (
      <div>
        <label className="mb-1 block text-sm text-[var(--charcoal)]">{name}</label>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full rounded-md border border-[var(--color-border)] px-3 py-1.5 text-sm"
        />
      </div>
    );
  }

  if (typeof value === 'string') {
    if (value.length > 100 || name === 'content' || name === 'description') {
      return (
        <div>
          <label className="mb-1 block text-sm text-[var(--charcoal)]">{name}</label>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-[var(--color-border)] px-3 py-1.5 text-sm"
          />
        </div>
      );
    }
    return (
      <div>
        <label className="mb-1 block text-sm text-[var(--charcoal)]">{name}</label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-[var(--color-border)] px-3 py-1.5 text-sm"
        />
      </div>
    );
  }

  return null;
}

export function SectionSettings({ section, onChange }: SectionSettingsProps) {
  const definition = getSection(section.type);
  const props = section.props;

  const handlePropChange = (key: string, value: unknown) => {
    onChange({ ...props, [key]: value });
  };

  const editableEntries = Object.entries(props).filter(
    ([, v]) => typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean'
  );

  return (
    <div className="space-y-4">
      <div className="border-b border-[var(--color-border)] pb-3">
        <h3 className="text-sm font-semibold text-[var(--charcoal)]">
          {definition?.name || section.type} Settings
        </h3>
        {definition?.description && (
          <p className="mt-1 text-xs text-[var(--slate)]">{definition.description}</p>
        )}
      </div>

      {definition?.variants && definition.variants.length > 0 && (
        <div>
          <label className="mb-1 block text-sm text-[var(--charcoal)]">Variant</label>
          <select
            value={(props.variant as string) || definition.variants[0]}
            onChange={(e) => handlePropChange('variant', e.target.value)}
            className="w-full rounded-md border border-[var(--color-border)] px-3 py-1.5 text-sm"
          >
            {definition.variants.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      )}

      {editableEntries.map(([key, value]) => {
        if (key === 'variant' || key === 'className') return null;
        return (
          <PropField
            key={key}
            name={key}
            value={value}
            onChange={(v) => handlePropChange(key, v)}
          />
        );
      })}

      {editableEntries.length === 0 && (
        <p className="text-sm text-[var(--slate)]">No editable properties for this section.</p>
      )}
    </div>
  );
}
