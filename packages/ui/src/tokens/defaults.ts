import { tokenSchema } from './schema';
import type { ThemeTokens } from './types';

function extractDefaultsFromSchema(): ThemeTokens {
  return {
    colors: {
      primary: tokenSchema.colors.primary.default,
      secondary: tokenSchema.colors.secondary.default,
      accent: tokenSchema.colors.accent.default,
      background: tokenSchema.colors.background.default,
      surface: tokenSchema.colors.surface.default,
      text: {
        primary: tokenSchema.colors.text.primary.default,
        secondary: tokenSchema.colors.text.secondary.default,
        muted: tokenSchema.colors.text.muted.default,
      },
      border: tokenSchema.colors.border.default,
      error: tokenSchema.colors.error.default,
      warning: tokenSchema.colors.warning.default,
      success: tokenSchema.colors.success.default,
      info: tokenSchema.colors.info.default,
    },
    radius: {
      none: tokenSchema.radius.none.default,
      sm: tokenSchema.radius.sm.default,
      md: tokenSchema.radius.md.default,
      lg: tokenSchema.radius.lg.default,
      xl: tokenSchema.radius.xl.default,
      full: tokenSchema.radius.full.default,
    },
    spacing: {
      xs: tokenSchema.spacing.xs.default,
      sm: tokenSchema.spacing.sm.default,
      md: tokenSchema.spacing.md.default,
      lg: tokenSchema.spacing.lg.default,
      xl: tokenSchema.spacing.xl.default,
      '2xl': tokenSchema.spacing['2xl'].default,
    },
    typography: {
      fontFamily: {
        display: tokenSchema.typography.fontFamily.display.default,
        body: tokenSchema.typography.fontFamily.body.default,
        mono: tokenSchema.typography.fontFamily.mono.default,
      },
      fontSize: {
        xs: tokenSchema.typography.fontSize.xs.default,
        sm: tokenSchema.typography.fontSize.sm.default,
        base: tokenSchema.typography.fontSize.base.default,
        lg: tokenSchema.typography.fontSize.lg.default,
        xl: tokenSchema.typography.fontSize.xl.default,
        '2xl': tokenSchema.typography.fontSize['2xl'].default,
        '3xl': tokenSchema.typography.fontSize['3xl'].default,
        '4xl': tokenSchema.typography.fontSize['4xl'].default,
      },
      fontWeight: {
        normal: tokenSchema.typography.fontWeight.normal.default,
        medium: tokenSchema.typography.fontWeight.medium.default,
        semibold: tokenSchema.typography.fontWeight.semibold.default,
        bold: tokenSchema.typography.fontWeight.bold.default,
      },
      lineHeight: {
        tight: tokenSchema.typography.lineHeight.tight.default,
        normal: tokenSchema.typography.lineHeight.normal.default,
        relaxed: tokenSchema.typography.lineHeight.relaxed.default,
      },
    },
    shadows: {
      none: tokenSchema.shadows.none.default,
      sm: tokenSchema.shadows.sm.default,
      md: tokenSchema.shadows.md.default,
      lg: tokenSchema.shadows.lg.default,
      xl: tokenSchema.shadows.xl.default,
    },
    transitions: {
      fast: tokenSchema.transitions.fast.default,
      normal: tokenSchema.transitions.normal.default,
      slow: tokenSchema.transitions.slow.default,
    },
  };
}

export const defaultTokens: ThemeTokens = extractDefaultsFromSchema();
