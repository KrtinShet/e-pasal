import type { DeepPartial, ThemeTokens } from './types';

export interface ThemePreset {
  name: string;
  description: string;
  tokens: DeepPartial<ThemeTokens>;
}

export const presets: Record<string, ThemePreset> = {
  default: {
    name: 'Default',
    description: 'Clean and professional with green accents',
    tokens: {
      colors: {
        primary: '#00A76F',
        secondary: '#8E33FF',
        accent: '#FFAB00',
      },
    },
  },

  ocean: {
    name: 'Ocean',
    description: 'Cool blues and teals for a calm, trustworthy feel',
    tokens: {
      colors: {
        primary: '#0EA5E9',
        secondary: '#6366F1',
        accent: '#14B8A6',
      },
    },
  },

  sunset: {
    name: 'Sunset',
    description: 'Warm oranges and pinks for an energetic vibe',
    tokens: {
      colors: {
        primary: '#F97316',
        secondary: '#EC4899',
        accent: '#FBBF24',
      },
    },
  },

  forest: {
    name: 'Forest',
    description: 'Natural greens for eco-friendly and organic brands',
    tokens: {
      colors: {
        primary: '#22C55E',
        secondary: '#84CC16',
        accent: '#A3E635',
      },
    },
  },

  minimal: {
    name: 'Minimal',
    description: 'Monochromatic with sharp edges for a modern look',
    tokens: {
      colors: {
        primary: '#1A1A1A',
        secondary: '#525252',
        accent: '#A3A3A3',
      },
      radius: {
        none: 0,
        sm: 0,
        md: 0,
        lg: 0,
        xl: 0,
        full: 9999,
      },
    },
  },

  playful: {
    name: 'Playful',
    description: 'Vibrant colors and rounded corners for a fun personality',
    tokens: {
      colors: {
        primary: '#EC4899',
        secondary: '#8B5CF6',
        accent: '#06B6D4',
      },
      radius: {
        none: 0,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        full: 9999,
      },
    },
  },
};

export function getPreset(name: string): ThemePreset | undefined {
  return presets[name];
}

export function getAllPresets(): ThemePreset[] {
  return Object.values(presets);
}

export function getPresetNames(): string[] {
  return Object.keys(presets);
}
