export const grey = {
  50: '#fdfbf7',
  100: '#f7f4ed',
  200: '#f0ebe2',
  300: '#e0dbd2',
  400: '#b0aaa1',
  500: '#8a847b',
  600: '#6b6560',
  700: '#4a4540',
  800: '#2d2d2d',
  900: '#1a1a1a',
} as const;

export const primary = {
  lighter: '#fde8e3',
  light: '#f08872',
  main: '#e8654a',
  dark: '#c94e36',
  darker: '#a33d2a',
  contrastText: '#ffffff',
} as const;

export const secondary = {
  lighter: '#efd6ff',
  light: '#c684ff',
  main: '#8E33FF',
  dark: '#5119b7',
  darker: '#27097a',
  contrastText: '#ffffff',
} as const;

export const info = {
  lighter: '#d6eaff',
  light: '#84b8f0',
  main: '#5ba4e5',
  dark: '#3a7bc8',
  darker: '#1e5aab',
  contrastText: '#ffffff',
} as const;

export const success = {
  lighter: '#d8f5e0',
  light: '#a3d9a5',
  main: '#7fb069',
  dark: '#5c8a4a',
  darker: '#3a6630',
  contrastText: '#ffffff',
} as const;

export const warning = {
  lighter: '#fef3d5',
  light: '#f9c96b',
  main: '#f5a623',
  dark: '#c8841a',
  darker: '#9a6312',
  contrastText: '#1a1a1a',
} as const;

export const error = {
  lighter: '#fee2e2',
  light: '#f87171',
  main: '#ef4444',
  dark: '#dc2626',
  darker: '#b91c1c',
  contrastText: '#ffffff',
} as const;

export const common = {
  black: '#000000',
  white: '#ffffff',
} as const;

export const action = {
  hover: 'rgba(26, 26, 26, 0.04)',
  selected: 'rgba(26, 26, 26, 0.08)',
  disabled: 'rgba(26, 26, 26, 0.26)',
  disabledBackground: 'rgba(26, 26, 26, 0.12)',
  focus: 'rgba(26, 26, 26, 0.12)',
} as const;

export const text = {
  primary: grey[900],
  secondary: '#6b7280',
  muted: '#9ca3af',
  disabled: '#d1d5db',
} as const;

export const background = {
  default: grey[50],
  paper: common.white,
  neutral: grey[200],
} as const;

export const divider = 'rgba(26, 26, 26, 0.12)';
export const backdrop = 'rgba(26, 26, 26, 0.5)';

/** Legacy name aliases (backward compat) */
export const legacy = {
  cream: grey[50],
  creamDark: grey[100],
  charcoal: grey[900],
  charcoalLight: grey[800],
  coral: primary.main,
  coralLight: primary.light,
  coralDark: primary.dark,
  amber: warning.main,
  sage: success.main,
  sky: info.main,
} as const;

export const palette = {
  grey,
  primary,
  secondary,
  info,
  success,
  warning,
  error,
  common,
  action,
  text,
  background,
  divider,
  backdrop,
  legacy,
} as const;
