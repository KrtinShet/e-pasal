# E08-S05: Storefront Styling Alignment

Align storefront to unified tokens while preserving per-store theming.

## Status: Done

## Changes

- Storefront globals.css imports `@baazarify/ui/styles`
- Removed duplicate CSS variables
- Store theme defaults map to token system (--store-primary → var(--color-primary))
- ThemeProvider runtime overrides preserved
- Accessibility utilities kept
