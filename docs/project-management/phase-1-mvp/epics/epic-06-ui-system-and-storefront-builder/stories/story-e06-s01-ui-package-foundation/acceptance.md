# E06-S01 Acceptance Criteria

## AC1: Package Structure

- [ ] `packages/ui/` exists with proper monorepo setup
- [ ] Package builds successfully with `pnpm build`
- [ ] Package exports are correctly configured in package.json
- [ ] TypeScript types are generated in dist/

## AC2: Token Schema

- [ ] All token categories defined (colors, radius, spacing, typography, shadows, transitions)
- [ ] Each token has constraint metadata (type, default, label, min/max where applicable)
- [ ] Default tokens produce a visually coherent theme
- [ ] At least 3 presets defined (default, minimal, playful)

## AC3: ThemeProvider

- [ ] ThemeProvider injects CSS variables into DOM
- [ ] `useTheme()` hook returns current tokens
- [ ] `setTokens()` updates CSS variables in real-time (no page reload)
- [ ] `resetTokens()` restores defaults
- [ ] Initial tokens can be passed as prop

## AC4: Tailwind Config

- [ ] Shared config maps CSS variables to Tailwind utilities
- [ ] `bg-primary`, `text-secondary`, etc. work correctly
- [ ] `rounded-md`, `rounded-lg`, etc. use CSS variable values
- [ ] Config can be imported and extended by apps

## AC5: Utilities

- [ ] `cn()` function correctly merges Tailwind classes
- [ ] Deep merge utility handles nested token objects

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
