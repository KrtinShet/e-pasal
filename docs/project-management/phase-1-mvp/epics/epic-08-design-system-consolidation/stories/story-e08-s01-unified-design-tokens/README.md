# E08-S01: Unified Design Tokens & CSS Foundation

Create a single source of truth for design tokens in `packages/ui/src/styles/`.

## Status: Done

## Files Created

- `config-layout.ts` — HEADER, NAV, MAIN layout constants
- `palette.ts` — Grey scale, primary/secondary/info/success/warning/error palettes
- `typography.ts` — Type scale (h1-h6, body, subtitle, caption, overline)
- `shadows.ts` — Shadow scale + semantic shadows
- `css-utils.ts` — bgBlur, bgGradient, textGradient, hideScroll
- `global-tokens.css` — All CSS variables with legacy aliases
- `index.ts` — Barrel exports

## Package Updates

- `packages/ui/src/index.ts` — exports `./styles`
- `packages/ui/package.json` — `"./styles": "./src/styles/global-tokens.css"`
