export const fontFamily = {
  display: "'Playfair Display', Georgia, serif",
  body: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
} as const;

export const h1 = {
  fontFamily: fontFamily.display,
  fontWeight: 700,
  fontSize: 'clamp(2rem, 4vw, 3rem)',
  lineHeight: 1.25,
} as const;

export const h2 = {
  fontFamily: fontFamily.display,
  fontWeight: 700,
  fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
  lineHeight: 1.3,
} as const;

export const h3 = {
  fontFamily: fontFamily.display,
  fontWeight: 600,
  fontSize: 'clamp(1.5rem, 2.5vw, 1.875rem)',
  lineHeight: 1.3,
} as const;

export const h4 = {
  fontFamily: fontFamily.body,
  fontWeight: 600,
  fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
  lineHeight: 1.35,
} as const;

export const h5 = {
  fontFamily: fontFamily.body,
  fontWeight: 600,
  fontSize: '1.25rem',
  lineHeight: 1.4,
} as const;

export const h6 = {
  fontFamily: fontFamily.body,
  fontWeight: 600,
  fontSize: '1.125rem',
  lineHeight: 1.4,
} as const;

export const body1 = {
  fontFamily: fontFamily.body,
  fontWeight: 400,
  fontSize: '1rem',
  lineHeight: 1.5,
} as const;

export const body2 = {
  fontFamily: fontFamily.body,
  fontWeight: 400,
  fontSize: '0.875rem',
  lineHeight: 1.5,
} as const;

export const subtitle1 = {
  fontFamily: fontFamily.body,
  fontWeight: 500,
  fontSize: '1rem',
  lineHeight: 1.5,
} as const;

export const subtitle2 = {
  fontFamily: fontFamily.body,
  fontWeight: 500,
  fontSize: '0.875rem',
  lineHeight: 1.5,
} as const;

export const caption = {
  fontFamily: fontFamily.body,
  fontWeight: 400,
  fontSize: '0.75rem',
  lineHeight: 1.5,
} as const;

export const overline = {
  fontFamily: fontFamily.body,
  fontWeight: 600,
  fontSize: '0.75rem',
  lineHeight: 1.5,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
} as const;

export const typography = {
  fontFamily,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  body1,
  body2,
  subtitle1,
  subtitle2,
  caption,
  overline,
} as const;
