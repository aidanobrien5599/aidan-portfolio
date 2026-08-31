# Blog: per-article windows, real SEO routes, foldery icon

## Problem

The Blog feature is a single desktop window (`BlogWindow.tsx`) that lists posts
and swaps the active post's content in place via `useState`. This has three
problems:

1. Every article funnels through one shared window — you can't have two
   articles open side by side, and there's no sense of each article being its
   own "thing."
2. There is no `src/app/blog/` route at all. Article content only exists
   inside a `"use client"` component's in-memory state, so there is zero
   server-rendered HTML for any post — nothing for a search engine to index,
   and no URL you can share or click into directly.
3. The folder icon (desktop icon + window title bar) is a flat 📁 emoji; it
   doesn't read as an actual folder.

## Goals

- Each article opens as its own independent window (drag, maximize, close —
  not minimize, see below) so multiple can be open at once.
- Every article has a real, statically-generated, indexable URL at
  `/blog/[slug]`, plus an index at `/blog`, plus a sitemap entry.
- A direct visit to `/blog/[slug]` (from Google, a shared link, a cold
  reload) renders real article text in the initial server HTML — not just
  the desktop shell with client-side content.
- The folder icon looks like an actual two-tone folder, not an emoji.

## Non-goals

- No minimize/taskbar support for article windows. Skipped deliberately —
  it would require new dock/taskbar UI to track and restore multiple
  minimized articles, which wasn't asked for. Article windows support open,
  drag, maximize, and close only.
- No folder-open animation (lid-flip, file-spill, etc.) — icon redesign only,
  per the visual comparison the user picked (Option A).
- No rewrite of the app-wide window-focus/z-index model. Terminal, browser,
  settings, and doom windows keep their existing two-tier z-index logic
  untouched. Only the blog-related windows get a proper focus stack (see
  below) — that's the minimum needed for correctness once N article windows
  can be open simultaneously; generalizing further isn't needed by anything
  this change touches.
- No content-authoring changes (e.g. MDX). `constants/blog.tsx` stays the
  content source of truth, still JSX embedded in a `.tsx` module.

## Architecture

### Routing / SEO: one component, two containers

`ArticleWindow` (new) is the single component that renders a post's window
chrome (title bar, traffic-light buttons, the new folder icon, article body)
and is interactive (draggable, maximizable, closable) via its own
`useWindowManager()` instance.

It is mounted in two places:

- **`src/app/blog/[slug]/page.tsx`** (new, server component) — renders
  `<ArticleWindow slug={slug} standalone />` centered on a plain backdrop, no
  desktop chrome around it (dock/menu bar/desktop icons/terminal are not
  mounted). `generateStaticParams` covers every slug in `constants/blog.tsx`;
  `generateMetadata` sets title/description/OG tags per post. Because the
  component's content isn't gated behind a post-mount effect, the article
  body is present in the server-rendered HTML — real text, indexable,
  crawlable, and gives a real link-preview card when shared. Once hydrated,
  the same window becomes interactive (drag, maximize); its close button
  navigates to `/` (the desktop, nothing open).
- **Desktop app (`/`)** — `page.tsx` renders one `<ArticleWindow slug={s} />`
  per entry in `openArticles` (see below), inside the full desktop shell.

Opening/closing an article from inside the desktop app updates the address
bar via `window.history.pushState`/`popstate` — not a real Next.js
navigation, so the SPA tree doesn't remount. This makes whatever's open
shareable via URL. Critically, a *fresh* request to that same URL (reload,
shared link, crawler) always resolves independently and correctly, because
it hits the real `/blog/[slug]` route on the server rather than depending on
any client-side state.

**`src/app/blog/page.tsx`** (new) is a static index page listing every post
with a real `<a href="/blog/slug">` per post — this is also what makes
`/blog/[slug]` discoverable by crawlers without needing the desktop app at
all.

**`src/app/sitemap.ts`** (new) lists `/blog` and every `/blog/[slug]`.

### Multi-window: per-article instances + a scoped focus stack

`BlogWindow.tsx` splits into:

- **`BlogFolderWindow.tsx`** (renamed/trimmed from `BlogWindow.tsx`) — the
  existing singleton folder-browser window, listing all posts. Still opened
  from the single "Blog" desktop icon, still a singleton (only one folder
  browser can be open). The only behavior change: clicking a post no longer
  swaps in-place content — it calls `onOpenArticle(slug)`.
- **`ArticleWindow.tsx`** (new) — one instance per open article, described
  above.

`page.tsx` replaces the singleton `blog` window-manager instance with:

```ts
const [openArticles, setOpenArticles] = useState<string[]>([]);
```

Opening a post appends its slug if not already present (dedup — clicking an
already-open article just refocuses it, doesn't duplicate the window).
Closing removes it from the array. Each rendered `<ArticleWindow key={slug}>`
owns its own `useWindowManager()` call internally — this is safe under the
Rules of Hooks because the hook call lives inside a component instance keyed
by slug, not inside a loop in the parent.

**Cascading position:** `useWindowManager` gains an optional
`initialOffset: { x: number; y: number }` config field (default `{0,0}`,
unused by existing callers). Each new `ArticleWindow` computes its offset as
`{ x: index * 28, y: index * 28 }` based on its position in `openArticles`,
so stacked-open windows don't sit exactly on top of each other.

**Scoped focus stack:** today's z-index model is a hardcoded two-tier
comparison (`activeWindow === "blog" ? 20 : 10`), which breaks once 3+ article
windows need correct relative stacking among themselves. This change
introduces a small ordered array — `blogZOrder: string[]` (ids are
`"folder"` or `` `article:${slug}` ``) — updated whenever any blog-related
window is focused or opened. Each blog-related window computes its z-index
as `10 + blogZOrder.indexOf(id)`, keeping the whole blog cluster above/below
the other four fixed windows exactly as today, while giving correct ordering
within the cluster. Terminal/browser/settings/doom's existing z-index logic
is untouched.

### Folder icon

**`src/components/icons/FolderIcon.tsx`** (new) — a small inline-SVG,
two-tone folder (back panel + front flap, subtle shadow), no animation, per
the approved mockup. Replaces the 📁 emoji everywhere it currently appears:
the desktop icon (`desktopIconsConfig`) and the `BlogFolderWindow` /
`ArticleWindow` title-bar icon.

## File changes

New:
- `src/app/blog/page.tsx`
- `src/app/blog/[slug]/page.tsx`
- `src/app/sitemap.ts`
- `src/components/desktop/ArticleWindow.tsx`
- `src/components/icons/FolderIcon.tsx`

Modified:
- `src/components/desktop/BlogWindow.tsx` → renamed `BlogFolderWindow.tsx`,
  trimmed to listing-only, calls `onOpenArticle(slug)` instead of local state
- `src/app/page.tsx` — `openArticles` state replaces singleton `blog` window
  manager; renders one `ArticleWindow` per open slug; `blogZOrder` stack
- `src/hooks/useWindowManager.ts` — add optional `initialOffset` config field
- `src/constants/portfolio.ts` — desktop icon config swaps emoji for
  `FolderIcon`

Unchanged:
- `src/constants/blog.tsx` — still the content source of truth

## Testing

- Existing `page.test.tsx` coverage for window open/close/minimize/maximize
  needs equivalent coverage for `openArticles` add/dedup/remove and the
  `blogZOrder` stack.
- New tests: `/blog` and `/blog/[slug]` render real article text
  server-side (no client-only gating); `generateMetadata` produces correct
  title/description per slug; `sitemap.ts` includes every post.
- Manual check: open 2+ articles from the folder, confirm independent drag/
  maximize/close and cascading position; confirm closing one doesn't affect
  the others' z-order.
