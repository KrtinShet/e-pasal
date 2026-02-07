'use client';

import { useState } from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
}

export function ColorPicker({ label, value, onChange, description }: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(value);

  const handleInputChange = (val: string) => {
    setInputValue(val);
    if (/^#[0-9a-fA-F]{6}$/.test(val)) {
      onChange(val);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setInputValue(e.target.value);
        }}
        className="h-10 w-10 cursor-pointer rounded-md border border-gray-200"
      />
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm font-mono"
      />
    </div>
  );
}
