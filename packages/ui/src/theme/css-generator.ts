import type { ThemeTokens } from '../tokens/types';

export function generateCSSVariables(tokens: ThemeTokens): string {
  const lines: string[] = [':root {'];

  lines.push(...generateColorVariables(tokens.colors));
  lines.push(...generateRadiusVariables(tokens.radius));
  lines.push(...generateSpacingVariables(tokens.spacing));
  lines.push(...generateTypographyVariables(tokens.typography));
  lines.push(...generateShadowVariables(tokens.shadows));
  lines.push(...generateTransitionVariables(tokens.transitions));

  lines.push('}');
  return lines.join('\n');
}

export function generateCSSObject(tokens: ThemeTokens): Record<string, string> {
  const vars: Record<string, string> = {};

  addColorVariables(vars, tokens.colors);
  addRadiusVariables(vars, tokens.radius);
  addSpacingVariables(vars, tokens.spacing);
  addTypographyVariables(vars, tokens.typography);
  addShadowVariables(vars, tokens.shadows);
  addTransitionVariables(vars, tokens.transitions);

  return vars;
}

function generateColorVariables(colors: ThemeTokens['colors']): string[] {
  const lines: string[] = [];

  lines.push(`  --color-primary: ${colors.primary};`);
  lines.push(`  --color-secondary: ${colors.secondary};`);
  lines.push(`  --color-accent: ${colors.accent};`);
  lines.push(`  --color-background: ${colors.background};`);
  lines.push(`  --color-surface: ${colors.surface};`);
  lines.push(`  --color-text-primary: ${colors.text.primary};`);
  lines.push(`  --color-text-secondary: ${colors.text.secondary};`);
  lines.push(`  --color-text-muted: ${colors.text.muted};`);
  lines.push(`  --color-border: ${colors.border};`);
  lines.push(`  --color-error: ${colors.error};`);
  lines.push(`  --color-warning: ${colors.warning};`);
  lines.push(`  --color-success: ${colors.success};`);
  lines.push(`  --color-info: ${colors.info};`);

  return lines;
}

function generateRadiusVariables(radius: ThemeTokens['radius']): string[] {
  return Object.entries(radius).map(([key, value]) => `  --radius-${key}: ${value}px;`);
}

function generateSpacingVariables(spacing: ThemeTokens['spacing']): string[] {
  return Object.entries(spacing).map(([key, value]) => `  --spacing-${key}: ${value}px;`);
}

function generateTypographyVariables(typography: ThemeTokens['typography']): string[] {
  const lines: string[] = [];

  Object.entries(typography.fontFamily).forEach(([key, value]) => {
    lines.push(`  --font-${key}: '${value}', system-ui, sans-serif;`);
  });

  Object.entries(typography.fontSize).forEach(([key, value]) => {
    lines.push(`  --text-${key}: ${value}px;`);
  });

  Object.entries(typography.fontWeight).forEach(([key, value]) => {
    lines.push(`  --font-weight-${key}: ${value};`);
  });

  Object.entries(typography.lineHeight).forEach(([key, value]) => {
    lines.push(`  --leading-${key}: ${value};`);
  });

  return lines;
}

function generateShadowVariables(shadows: ThemeTokens['shadows']): string[] {
  return Object.entries(shadows).map(([key, value]) => `  --shadow-${key}: ${value};`);
}

function generateTransitionVariables(transitions: ThemeTokens['transitions']): string[] {
  return Object.entries(transitions).map(([key, value]) => `  --transition-${key}: ${value}ms;`);
}

function addColorVariables(vars: Record<string, string>, colors: ThemeTokens['colors']): void {
  vars['--color-primary'] = colors.primary;
  vars['--color-secondary'] = colors.secondary;
  vars['--color-accent'] = colors.accent;
  vars['--color-background'] = colors.background;
  vars['--color-surface'] = colors.surface;
  vars['--color-text-primary'] = colors.text.primary;
  vars['--color-text-secondary'] = colors.text.secondary;
  vars['--color-text-muted'] = colors.text.muted;
  vars['--color-border'] = colors.border;
  vars['--color-error'] = colors.error;
  vars['--color-warning'] = colors.warning;
  vars['--color-success'] = colors.success;
  vars['--color-info'] = colors.info;
}

function addRadiusVariables(vars: Record<string, string>, radius: ThemeTokens['radius']): void {
  Object.entries(radius).forEach(([key, value]) => {
    vars[`--radius-${key}`] = `${value}px`;
  });
}

function addSpacingVariables(vars: Record<string, string>, spacing: ThemeTokens['spacing']): void {
  Object.entries(spacing).forEach(([key, value]) => {
    vars[`--spacing-${key}`] = `${value}px`;
  });
}

function addTypographyVariables(
  vars: Record<string, string>,
  typography: ThemeTokens['typography']
): void {
  Object.entries(typography.fontFamily).forEach(([key, value]) => {
    vars[`--font-${key}`] = `'${value}', system-ui, sans-serif`;
  });

  Object.entries(typography.fontSize).forEach(([key, value]) => {
    vars[`--text-${key}`] = `${value}px`;
  });

  Object.entries(typography.fontWeight).forEach(([key, value]) => {
    vars[`--font-weight-${key}`] = `${value}`;
  });

  Object.entries(typography.lineHeight).forEach(([key, value]) => {
    vars[`--leading-${key}`] = `${value}`;
  });
}

function addShadowVariables(vars: Record<string, string>, shadows: ThemeTokens['shadows']): void {
  Object.entries(shadows).forEach(([key, value]) => {
    vars[`--shadow-${key}`] = value;
  });
}

function addTransitionVariables(
  vars: Record<string, string>,
  transitions: ThemeTokens['transitions']
): void {
  Object.entries(transitions).forEach(([key, value]) => {
    vars[`--transition-${key}`] = `${value}ms`;
  });
}
