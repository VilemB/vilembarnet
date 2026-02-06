# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Vilém Barnet, built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS 4. Features Three.js-powered interactive effects and CSS-based animations.

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## Architecture and Key Patterns

### Interactive Effects System

The site uses Three.js WebGL shaders for interactive distortion effects on text and images:

**PixelatedText Component** (`src/components/PixelatedText.tsx`)
- Renders text to canvas, converts to Three.js texture
- WebGL shader creates interactive distortion effect on mouse movement
- Uses data texture to store displacement values in grid (default 40x40)
- Mobile fallback: displays plain text without WebGL (< 1000px)
- Cleanup: properly disposes Three.js resources on unmount

**PixelatedPhoto Component** (`src/components/PixelatedPhoto.tsx`)
- Similar architecture to PixelatedText but for images
- Handles image aspect ratio with object-fit cover behavior
- Loads image via THREE.TextureLoader
- Same mouse-based distortion and mobile fallback pattern

**Shared Effect Parameters:**
- `grid`: Resolution of distortion grid (default 40)
- `mouse`: Radius of mouse influence (default 0.25)
- `strength`: Intensity of distortion (default 0.05)
- `relaxation`: Speed of effect decay (default 0.9)
- Both components use identical shader logic and data texture update patterns

### Styling Architecture

- **Tailwind CSS 4** with `@theme` directive
- Custom CSS variables in `:root` and `@theme`:
  - `--color-light`: #EEEEEE
  - `--color-dark`: #201E43
  - `--color-accent`: #508C9B
- Font: Bricolage Grotesque (weights 200-800) loaded in layout
- Responsive breakpoints: 720px (mobile), 480px (small mobile)
- Section-level styles in `globals.css` (`.home`, `.hero-*`, `.cta-*`)
- Additional CSS modules: `navbar.css`, `pixelated-text.css`

### Layout Structure

**Root Layout** (`src/app/layout.tsx`)
- Server component with comprehensive SEO metadata
- Vercel Analytics integration
- JSON-LD structured data for Person schema
- Font configuration with CSS variables
- Layout uses `.main-layout` wrapper (flexbox, 100svh height)

**Homepage** (`src/app/page.tsx`)
- Single-page layout with multiple sections
- Navbar component at top
- Hero section with PixelatedText and PixelatedPhoto
- CTA section with animated links (justify-center on hover)
- All sections use `.padding-section` class for consistent spacing

### File Organization

```
src/
├── app/
│   ├── layout.tsx         # Root layout, metadata, fonts
│   ├── page.tsx           # Homepage composition
│   ├── work/page.tsx      # Work page
│   └── robots.ts          # SEO robots
│   └── sitemap.ts         # SEO sitemap
├── components/
│   ├── Navbar.tsx         # Static navigation
│   ├── PixelatedText.tsx  # WebGL text distortion
│   ├── PixelatedPhoto.tsx # WebGL image distortion
│   └── sections/          # Page sections
│       ├── Hero.tsx
│       ├── About.tsx
│       └── CTA.tsx
├── styles/
│   ├── globals.css        # Global styles, Tailwind config
│   ├── navbar.css         # Navbar-specific styles
│   └── pixelated-text.css # Pixelated effect styles
```

### Path Aliases

TypeScript (`tsconfig.json`):
- `@/*` → `src/*`

Shadcn/ui (`components.json`):
- `@/components` → components
- `@/lib/utils` → utilities
- `@/ui` → components/ui
- `@/hooks` → hooks

## Important Technical Notes

### Three.js Effects
- Effects are client components (`"use client"`) - cannot be server-rendered
- Both PixelatedText and PixelatedPhoto disable effects on mobile (< 1000px)
- requestAnimationFrame loop must be cancelled in cleanup
- All Three.js resources (renderer, material, geometry, textures) must be disposed
- Canvas elements are dynamically appended/removed from container

### SSR and Client-Side Code
- **CRITICAL**: Never initialize browser-only libraries (Three.js, GSAP, Lenis) at module top-level
- These must be initialized inside `useEffect` or client component lifecycle
- Root layout is a server component - cannot use hooks or browser APIs
- Use `"use client"` directive for any component using Three.js, GSAP, or browser events

### Styling Conventions
- Responsive: mobile-first with max-width media queries
- Layout: flexbox-based with `.main-layout`, `.padding-section` utilities
- Typography: clamp() for fluid font sizing
- Spacing: 4rem desktop, 2rem tablet, 1-2rem mobile
- Colors: CSS variables for consistency

### Performance
- Three.js renderer uses `Math.min(window.devicePixelRatio, 2)` to cap pixel ratio
- Resize handlers are debounced (100ms)
- Mobile devices skip WebGL effects entirely
- Images use next/image with priority flag where appropriate
