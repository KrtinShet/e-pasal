# E06-S01 Acceptance Criteria

## AC1: Package Structure

- [x] `packages/ui/` exists with proper monorepo setup
- [x] Package builds successfully with `pnpm build`
- [x] Package exports are correctly configured in package.json
- [x] TypeScript types are generated in dist/

## AC2: Token Schema

- [x] All token categories defined (colors, radius, spacing, typography, shadows, transitions)
- [x] Each token has constraint metadata (type, default, label, min/max where applicable)
- [x] Default tokens produce a visually coherent theme
- [x] At least 3 presets defined (default, minimal, playful) - 6 presets: default, ocean, sunset, forest, minimal, playful

## AC3: ThemeProvider

- [x] ThemeProvider injects CSS variables into DOM
- [x] `useTheme()` hook returns current tokens
- [x] `setTokens()` updates CSS variables in real-time (no page reload)
- [x] `resetTokens()` restores defaults
- [x] Initial tokens can be passed as prop

## AC4: Tailwind Config

- [x] Shared config maps CSS variables to Tailwind utilities
- [x] `bg-primary`, `text-secondary`, etc. work correctly
- [x] `rounded-md`, `rounded-lg`, etc. use CSS variable values
- [x] Config can be imported and extended by apps

## AC5: Utilities

- [x] `cn()` function correctly merges Tailwind classes
- [x] Deep merge utility handles nested token objects

## Verification

```tsx
// Should work in any app after integration
import { ThemeProvider, useTheme } from '@baazarify/ui';

function App() {
  return (
    <ThemeProvider initialTokens={{ colors: { primary: '#FF0000' } }}>
      <Child />
    </ThemeProvider>
  );
}

function Child() {
  const { tokens, setTokens } = useTheme();
  return (
    <button
      className="bg-primary text-white rounded-md"
      onClick={() => setTokens({ colors: { primary: '#00FF00' } })}
    >
      Change Theme
    </button>
  );
}
```
