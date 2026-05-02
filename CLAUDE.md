# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint (next/core-web-vitals)
```

No test suite is configured.

## Architecture

Next.js 13 App Router portfolio site. All visible content is data-driven through constants — to add or update a project or work history entry, edit `/src/constants/` files, not components.

**Content lives in `/src/constants/`:**
- `projects.tsx` — project cards and detail page data (slug, title, description, HTML content, images, links)
- `timeline.tsx` — work history entries
- `navlinks.tsx`, `socials.tsx` — navigation and social links

**Routing:**
- `/` — single-page scrollable layout rendering all section components in sequence (Intro → About → WorkHistory → Projects → TechStack → Contact)
- `/projects/[slug]` — dynamic detail page; finds project by slug from `projects.tsx` constant

**API:**
- `/api/send/route.ts` — single endpoint; uses [Resend](https://resend.com) to email contact form submissions

**Styling:** Tailwind CSS with `cn()` (tailwind-merge + clsx) for conditional classes. Custom CSS variables for theme colors defined in `tailwind.config.ts`. Animations via Framer Motion — scroll-triggered with `useInView`.

**Analytics:** PostHog wrapped in a provider in `app/layout.tsx`; URL rewrites in `next.config.mjs` proxy analytics requests for privacy.

**Path alias:** `@/*` → `./src/*`
