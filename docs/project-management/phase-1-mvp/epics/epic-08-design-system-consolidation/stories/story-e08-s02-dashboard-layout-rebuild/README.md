# E08-S02: Dashboard Layout Rebuild

Rebuild dashboard shell using Minima-inspired layout architecture with unified tokens.

## Status: Done

## Changes

- Sidebar uses NAV.W_VERTICAL (280px) / NAV.W_MINI (88px) constants
- Header uses HEADER.H_DESKTOP (72px) with backdrop blur
- Main content padding uses MAIN constants
- Created centralized `nav-config.tsx` with lucide-react icons
- Dashboard layout uses nav-config instead of inline SVGs
