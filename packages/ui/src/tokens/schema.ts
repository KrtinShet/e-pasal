import type { TokenSchema } from './types';

export const tokenSchema: TokenSchema = {
  colors: {
    primary: {
      type: 'color',
      default: '#00A76F',
      label: 'Primary Color',
      description: 'Main brand color used for buttons, links, and accents',
    },
    secondary: {
      type: 'color',
      default: '#8E33FF',
      label: 'Secondary Color',
      description: 'Supporting color for highlights and secondary actions',
    },
    accent: {
      type: 'color',
      default: '#FFAB00',
      label: 'Accent Color',
      description: 'Eye-catching color for badges, notifications, and promotions',
    },
    background: {
      type: 'color',
      default: '#FFFFFF',
      label: 'Background',
      description: 'Main page background color',
    },
    surface: {
      type: 'color',
      default: '#F9FAFB',
      label: 'Surface',
      description: 'Card and elevated surface background',
    },
    text: {
      primary: {
        type: 'color',
        default: '#1A1A1A',
        label: 'Primary Text',
        description: 'Main text color',
      },
      secondary: {
        type: 'color',
        default: '#6B7280',
        label: 'Secondary Text',
        description: 'Less prominent text',
      },
      muted: {
        type: 'color',
        default: '#9CA3AF',
        label: 'Muted Text',
        description: 'Hints, placeholders, disabled text',
      },
    },
    border: {
      type: 'color',
      default: '#E5E7EB',
      label: 'Border',
      description: 'Default border color',
    },
    error: {
      type: 'color',
      default: '#EF4444',
      label: 'Error',
      description: 'Error states and destructive actions',
    },
    warning: {
      type: 'color',
      default: '#F59E0B',
      label: 'Warning',
      description: 'Warning states and alerts',
    },
    success: {
      type: 'color',
      default: '#22C55E',
      label: 'Success',
      description: 'Success states and confirmations',
    },
    info: {
      type: 'color',
      default: '#3B82F6',
      label: 'Info',
      description: 'Informational states',
    },
  },

  radius: {
    none: { type: 'number', default: 0, min: 0, max: 0, unit: 'px', label: 'None' },
    sm: { type: 'number', default: 4, min: 0, max: 8, unit: 'px', label: 'Small' },
    md: { type: 'number', default: 8, min: 4, max: 16, unit: 'px', label: 'Medium' },
    lg: { type: 'number', default: 12, min: 8, max: 24, unit: 'px', label: 'Large' },
    xl: { type: 'number', default: 16, min: 12, max: 32, unit: 'px', label: 'Extra Large' },
    full: { type: 'number', default: 9999, min: 9999, max: 9999, unit: 'px', label: 'Full (Pill)' },
  },

  spacing: {
    xs: { type: 'number', default: 4, min: 2, max: 8, unit: 'px', label: 'Extra Small' },
    sm: { type: 'number', default: 8, min: 4, max: 12, unit: 'px', label: 'Small' },
    md: { type: 'number', default: 16, min: 12, max: 24, unit: 'px', label: 'Medium' },
    lg: { type: 'number', default: 24, min: 20, max: 32, unit: 'px', label: 'Large' },
    xl: { type: 'number', default: 32, min: 24, max: 48, unit: 'px', label: 'Extra Large' },
    '2xl': { type: 'number', default: 48, min: 40, max: 64, unit: 'px', label: '2X Large' },
  },

  typography: {
    fontFamily: {
      display: {
        type: 'select',
        default: 'Playfair Display',
        options: ['Playfair Display', 'Poppins', 'Inter', 'Montserrat', 'Roboto Slab'],
        label: 'Display Font',
        description: 'Used for headings and hero text',
      },
      body: {
        type: 'select',
        default: 'DM Sans',
        options: ['DM Sans', 'Inter', 'Open Sans', 'Roboto', 'Lato', 'Source Sans Pro'],
        label: 'Body Font',
        description: 'Used for body text and UI elements',
      },
      mono: {
        type: 'select',
        default: 'JetBrains Mono',
        options: ['JetBrains Mono', 'Fira Code', 'Source Code Pro', 'Roboto Mono'],
        label: 'Monospace Font',
        description: 'Used for code and technical content',
      },
    },
    fontSize: {
      xs: { type: 'number', default: 12, min: 10, max: 14, unit: 'px', label: 'Extra Small' },
      sm: { type: 'number', default: 14, min: 12, max: 16, unit: 'px', label: 'Small' },
      base: { type: 'number', default: 16, min: 14, max: 18, unit: 'px', label: 'Base' },
      lg: { type: 'number', default: 18, min: 16, max: 22, unit: 'px', label: 'Large' },
      xl: { type: 'number', default: 20, min: 18, max: 26, unit: 'px', label: 'Extra Large' },
      '2xl': { type: 'number', default: 24, min: 22, max: 32, unit: 'px', label: '2X Large' },
      '3xl': { type: 'number', default: 30, min: 26, max: 40, unit: 'px', label: '3X Large' },
      '4xl': { type: 'number', default: 36, min: 32, max: 48, unit: 'px', label: '4X Large' },
    },
    fontWeight: {
      normal: { type: 'number', default: 400, min: 400, max: 400, unit: '', label: 'Normal' },
      medium: { type: 'number', default: 500, min: 500, max: 500, unit: '', label: 'Medium' },
      semibold: { type: 'number', default: 600, min: 600, max: 600, unit: '', label: 'Semibold' },
      bold: { type: 'number', default: 700, min: 700, max: 700, unit: '', label: 'Bold' },
    },
    lineHeight: {
      tight: {
        type: 'number',
        default: 1.25,
        min: 1.1,
        max: 1.3,
        step: 0.05,
        unit: '',
        label: 'Tight',
      },
      normal: {
        type: 'number',
        default: 1.5,
        min: 1.4,
        max: 1.6,
        step: 0.05,
        unit: '',
        label: 'Normal',
      },
      relaxed: {
        type: 'number',
        default: 1.75,
        min: 1.6,
        max: 2,
        step: 0.05,
        unit: '',
        label: 'Relaxed',
      },
    },
  },

  shadows: {
    none: { type: 'string', default: 'none', label: 'None' },
    sm: { type: 'string', default: '0 1px 2px 0 rgb(0 0 0 / 0.05)', label: 'Small' },
    md: { type: 'string', default: '0 4px 6px -1px rgb(0 0 0 / 0.1)', label: 'Medium' },
    lg: { type: 'string', default: '0 10px 15px -3px rgb(0 0 0 / 0.1)', label: 'Large' },
    xl: { type: 'string', default: '0 20px 25px -5px rgb(0 0 0 / 0.1)', label: 'Extra Large' },
  },

  transitions: {
    fast: { type: 'number', default: 150, min: 100, max: 200, unit: 'ms', label: 'Fast' },
    normal: { type: 'number', default: 200, min: 150, max: 300, unit: 'ms', label: 'Normal' },
    slow: { type: 'number', default: 300, min: 250, max: 500, unit: 'ms', label: 'Slow' },
  },
};
