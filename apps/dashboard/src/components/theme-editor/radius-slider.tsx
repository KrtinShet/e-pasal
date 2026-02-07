'use client';

interface RadiusSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function RadiusSlider({ label, value, onChange, min = 0, max = 32 }: RadiusSliderProps) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm text-gray-500">{value}px</span>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
        />
        <div
          className="h-8 w-8 flex-shrink-0 border border-gray-300 bg-blue-100"
          style={{ borderRadius: `${value}px` }}
        />
      </div>
    </div>
  );
}
