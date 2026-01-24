# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Vilém Barnet, built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS 4. The site features advanced GSAP-based animations and smooth scrolling interactions.

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

### Animation System

The site uses a sophisticated GSAP-based animation system with three main animation contexts:

1. **Loader Animation** (`src/components/Loader.tsx`)
   - Runs once on initial page load
   - Animates custom SVG logo (VB monogram) with staggered reveals
   - Blocks body scroll during animation using `document.body.style.overflow`
   - Self-removes from DOM when complete

2. **Navbar Scroll Animation** (`src/components/ScrollNavbar.tsx`)
   - Integrates Lenis for smooth scrolling
   - Uses GSAP ScrollTrigger and Flip plugins for morphing navbar
   - Desktop: navbar expands from centered box to full viewport on scroll
   - Mobile (< 720px): static grid layout without scroll animations
   - Responsive behavior handled via resize listener that kills/recreates ScrollTriggers

3. **Section Animations** (e.g., `src/components/sections/About.tsx`)
   - Uses `useGSAP` hook for section-specific scroll animations
   - ScrollTrigger with pin and scrub for synchronized scroll effects
   - Timeline-based sequential animations with staggered transitions

### Styling Architecture

- **Tailwind CSS 4** with new `@theme` directive in `globals.css`
- Custom CSS variables defined in `:root` and `@theme`:
  - `--color-light`: #F3F0F0
  - `--color-dark`: #001F3D
  - `--color-accent`: #ED985F
- Font: Bricolage Grotesque (Google Fonts) loaded in layout
- Mobile-first responsive design with breakpoints at 720px and 480px
- Section-level styles defined globally in `globals.css` (`.hero`, `.about`, `.navbar-*`)

### File Organization

```
src/
├── app/
│   ├── layout.tsx         # Root layout with metadata, fonts, Analytics
│   ├── page.tsx           # Homepage composition
│   ├── globals.css        # Global styles, Tailwind config, section styles
│   ├── robots.ts          # SEO robots configuration
│   └── sitemap.ts         # SEO sitemap generation
├── components/
│   ├── Loader.tsx         # Initial page load animation
│   ├── ScrollNavbar.tsx   # Animated navigation with Lenis
│   └── sections/          # Page section components
│       ├── Hero.tsx
│       └── About.tsx
```

### Path Aliases

TypeScript path mapping configured in `tsconfig.json`:
- `@/*` maps to `src/*`

Shadcn/ui component aliases (defined in `components.json`):
- `@/components` → components
- `@/lib/utils` → utilities
- `@/ui` → UI components
- `@/hooks` → React hooks

### SEO Configuration

Comprehensive metadata configured in `src/app/layout.tsx`:
- OpenGraph and Twitter cards
- Structured data (JSON-LD) for Person schema
- Multiple favicon formats and PWA manifest
- Google verification and canonical URLs

## Important Notes

- **GSAP Plugins**: DrawSVGPlugin, ScrollTrigger, and Flip must be registered before use
- **Lenis Integration**: Lenis is integrated with GSAP ticker in `ScrollNavbar.tsx` - don't create multiple Lenis instances
- **Scroll Animations**: Desktop scroll animations use `100svh` for proper viewport height calculation
- **Cleanup**: All GSAP animations and event listeners must be cleaned up in useEffect/useGSAP return functions
- **Responsive**: Navbar has completely different rendering logic for mobile vs desktop - changes occur at 720px breakpoint
