# E06-S01 Tasks

## Task 1: Initialize UI Package

**Estimate**: 1 hour

```bash
mkdir -p packages/ui/src/{tokens,theme,components,layouts,hooks,utils}
cd packages/ui
pnpm init
```

**Files to create**:

- [x] `packages/ui/package.json`
- [x] `packages/ui/tsconfig.json`
- [x] `packages/ui/tsup.config.ts` (build config)

**package.json requirements**:

```json
{
  "name": "@baazarify/ui",
  "version": "0.1.0",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./tailwind.config": "./tailwind.config.ts"
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch"
  }
}
```

---

## Task 2: Implement Token Schema

**Estimate**: 2 hours

**Files**:

- [x] `src/tokens/types.ts` - TypeScript types
- [x] `src/tokens/schema.ts` - Token definitions with constraints
- [x] `src/tokens/defaults.ts` - Default token values
- [x] `src/tokens/presets.ts` - Theme presets (default, ocean, sunset, forest, minimal, playful)
- [x] `src/tokens/index.ts` - Exports

**Token categories**:

1. Colors (primary, secondary, accent, background, surface, text, border, semantic)
2. Radius (none, sm, md, lg, xl, full)
3. Spacing (xs, sm, md, lg, xl, 2xl)
4. Typography (fontFamily, fontSize, fontWeight, lineHeight)
5. Shadows (none, sm, md, lg, xl)
6. Transitions (fast, normal, slow)

**Constraint format**:

```typescript
interface TokenConstraint<T> {
  type: 'color' | 'number' | 'string' | 'select';
  default: T;
  label: string;
  description?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: T[];
}
```

---

## Task 3: Implement CSS Variable Generator

**Estimate**: 1 hour

**Files**:

- [x] `src/theme/css-generator.ts`

**Functions**:

- `generateCSSVariables(tokens: ThemeTokens): string` - Returns CSS string
- `generateCSSObject(tokens: ThemeTokens): Record<string, string>` - Returns object for inline styles

**Output format**:

```css
:root {
  --color-primary: #00a76f;
  --color-secondary: #8e33ff;
  --radius-sm: 4px;
  --radius-md: 8px;
  /* ... */
}
```

---

## Task 4: Implement ThemeProvider

**Estimate**: 2 hours

**Files**:

- [x] `src/theme/context.ts` - Theme context definition
- [x] `src/theme/provider.tsx` - ThemeProvider component
- [x] `src/theme/use-theme.ts` - useTheme hook
- [x] `src/theme/index.ts` - Exports

**ThemeProvider props**:

```typescript
interface ThemeProviderProps {
  children: React.ReactNode;
  initialTokens?: DeepPartial<ThemeTokens>;
  onTokensChange?: (tokens: ThemeTokens) => void;
}
```

**useTheme return**:

```typescript
interface ThemeContextValue {
  tokens: ThemeTokens;
  setTokens: (tokens: DeepPartial<ThemeTokens>) => void;
  resetTokens: () => void;
}
```

---

## Task 5: Create Shared Tailwind Config

**Estimate**: 1 hour

**Files**:

- [x] `packages/ui/tailwind.config.ts`

**Requirements**:

- Map all CSS variables to Tailwind utilities
- Colors: `bg-primary`, `text-primary`, `border-primary`, etc.
- Radius: `rounded-sm`, `rounded-md`, etc. using `var(--radius-*)`
- Spacing: Use CSS variable-based spacing scale
- Typography: Map font families and sizes

**Example**:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        // ...
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        // ...
      },
    },
  },
};
```

---

## Task 6: Implement Utility Functions

**Estimate**: 1 hour

**Files**:

- [x] `src/utils/cn.ts` - clsx + tailwind-merge
- [x] `src/utils/deep-merge.ts` - Deep object merge for token updates
- [ ] `src/utils/color.ts` - Color utilities (optional: lighten, darken, contrast)
- [x] `src/utils/index.ts` - Exports

**cn utility**:

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## Task 7: Create Package Entry Point

**Estimate**: 30 minutes

**Files**:

- [x] `src/index.ts`

**Exports**:

```typescript
// Tokens
export * from './tokens';

// Theme
export * from './theme';

// Utils
export { cn } from './utils';
```

---

## Task 8: Build and Test Package

**Estimate**: 30 minutes

- [x] Run `pnpm build` in packages/ui
- [x] Verify dist output
- [ ] Test import in a consuming app
- [ ] Verify CSS variables are injected correctly

---

## Total Estimate: 9 hours (1-2 days)
