'use client';

interface FontSelectorProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  description?: string;
}

export function FontSelector({ label, value, options, onChange, description }: FontSelectorProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      {description && <p className="mb-1 text-xs text-gray-500">{description}</p>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        style={{ fontFamily: value }}
      >
        {options.map((font) => (
          <option key={font} value={font} style={{ fontFamily: font }}>
            {font}
          </option>
        ))}
      </select>
    </div>
  );
}
