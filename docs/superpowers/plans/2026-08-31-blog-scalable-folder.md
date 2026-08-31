# Blog: Per-Article Windows + SEO Routes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Each blog article opens as its own independent desktop window, every article gets a real statically-generated `/blog/[slug]` URL with server-rendered content for SEO, and the folder icon becomes a proper two-tone SVG instead of an emoji.

**Architecture:** A new `ArticleWindow` component (calls `useWindowManager()` internally, one instance per open article) is mounted in two places: standalone on `src/app/blog/[slug]/page.tsx` (server-rendered, real content, minimal chrome, no desktop shell) and inside the existing desktop app on `/` (one instance per entry in a new `openArticles: string[]` array, tracked alongside a small `blogZOrder` focus stack scoped only to blog-related windows). `BlogWindow.tsx` is trimmed to a listing-only `BlogFolderWindow`. Opening/closing an article inside the desktop syncs the address bar via `history.pushState`/`popstate` without a real navigation.

**Tech Stack:** Next.js 13.4.19 (App Router, **synchronous** `params` — not the Promise-based Next 15 convention), React 18.2, TypeScript, Vitest 1.6 + `@testing-library/react` 14 (jsdom environment, `renderHook` available from `@testing-library/react` directly).

**Spec:** `docs/superpowers/specs/2026-08-31-blog-scalable-folder-design.md`

## Global Constraints

- `params` in route handlers/pages is a plain synchronous object (`{ slug: string }`), NOT a Promise — this is Next 13.4.19, not Next 15.
- No minimize support on `ArticleWindow` — open, drag, maximize, close only (no yellow dot in its title bar).
- No changes to terminal/browser/settings/doom's existing z-index logic — only blog-related windows (`BlogFolderWindow` + `ArticleWindow` instances) get the new focus-stack treatment.
- `constants/blog.tsx` is unchanged — still the content source of truth, still plain JSX in a `.tsx` module (no MDX migration).
- Folder icon: static two-tone SVG (back `#d9a441`, front flap `#f2c14e`), no open animation — this is the user-approved mockup, don't add motion.
- Test runner is `npm test` (`vitest run`). Run the specific new/changed test file after each task, then the full suite before committing.

---

### Task 1: FolderIcon component + desktop icon swap

**Files:**
- Create: `src/components/icons/FolderIcon.tsx`
- Create: `src/components/icons/FolderIcon.test.tsx`
- Modify: `src/components/desktop/DesktopIcons.tsx`

**Interfaces:**
- Produces: `FolderIcon({ size?: number; style?: React.CSSProperties }): JSX.Element` — default export is a named export `FolderIcon`, exported from `src/components/icons/FolderIcon.tsx`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/icons/FolderIcon.test.tsx
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FolderIcon } from "./FolderIcon";

describe("FolderIcon", () => {
  it("renders an svg with the two-tone folder fills", () => {
    const { container } = render(<FolderIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(container.querySelectorAll('[fill="#d9a441"]').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('[fill="#f2c14e"]').length).toBeGreaterThan(0);
  });

  it("respects a custom size", () => {
    const { container } = render(<FolderIcon size={40} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "40");
    expect(svg).toHaveAttribute("height", "40");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/icons/FolderIcon.test.tsx`
Expected: FAIL — `Failed to resolve import "./FolderIcon"`

- [ ] **Step 3: Write the component**

```tsx
// src/components/icons/FolderIcon.tsx
interface FolderIconProps {
  size?: number;
  style?: React.CSSProperties;
}

export function FolderIcon({ size = 24, style }: FolderIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 56"
      style={style}
      aria-hidden="true"
    >
      <path d="M2 10 h22 l6 8 h40 v4 H2 z" fill="#d9a441" />
      <rect x="2" y="18" width="68" height="34" rx="3" fill="#d9a441" />
      <path d="M2 26 h68 l-6 26 H8 z" fill="#f2c14e" />
    </svg>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/icons/FolderIcon.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Swap the desktop "Blog" icon to use FolderIcon**

In `src/components/desktop/DesktopIcons.tsx`, add the import at the top:

```tsx
import { FolderIcon } from "@/components/icons/FolderIcon";
```

Then replace the icon-rendering ternary inside the `inner` JSX (the block that currently reads `{icon.icon ? <img ... /> : icon.emoji}`) with:

```tsx
{icon.actionType === "blog"
  ? <FolderIcon size={30} />
  : icon.icon
    ? <img src={icon.icon} alt={icon.label} className={icon.icon.includes("github") ? "icon-invert-dark" : ""} style={{ width: 28, height: 28, objectFit: "contain" }} />
    : icon.emoji}
```

Do not change `src/constants/portfolio.ts` — it's a `.ts` file (no JSX allowed), so `desktopIconsConfig`'s `emoji: "📁"` field for the Blog entry stays as inert unused data; `DesktopIcons.tsx` bypasses it for `actionType === "blog"`.

- [ ] **Step 6: Add a regression test for the desktop icon swap**

Append to `src/app/page.test.tsx` inside a new describe block (add near the other `describe` blocks, after imports already present — no new imports needed, `screen` and `renderAndMount` are already in scope):

```tsx
describe("Blog folder icon", () => {
  it("renders the FolderIcon svg instead of the folder emoji on the desktop", () => {
    const { container } = renderAndMount();
    expect(container.querySelector('svg[aria-hidden="true"]')).toBeInTheDocument();
    expect(screen.queryByText("📁")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 7: Run both test files to verify they pass**

Run: `npx vitest run src/components/icons/FolderIcon.test.tsx src/app/page.test.tsx`
Expected: PASS (note: `page.test.tsx` will still show its usual pre-existing unrelated failures if any were present before this task — only confirm no *new* failures related to this change)

- [ ] **Step 8: Commit**

```bash
git add src/components/icons/FolderIcon.tsx src/components/icons/FolderIcon.test.tsx src/components/desktop/DesktopIcons.tsx src/app/page.test.tsx
git commit -m "feat: add FolderIcon and swap it in for the desktop Blog icon"
```

---

### Task 2: useWindowManager initialOffset support

**Files:**
- Modify: `src/hooks/useWindowManager.ts`
- Create: `src/hooks/useWindowManager.test.ts`

**Interfaces:**
- Consumes: nothing new from other tasks.
- Produces: `useWindowManager(config)` now accepts an optional `initialOffset?: { x: number; y: number }` field on `UseWindowManagerConfig`, used as the hook's starting `offset` state (defaults to `{ x: 0, y: 0 }` when omitted, matching current behavior exactly). Task 3 (`ArticleWindow`) depends on this field existing.

- [ ] **Step 1: Write the failing test**

```ts
// src/hooks/useWindowManager.test.ts
import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useWindowManager } from "./useWindowManager";

describe("useWindowManager", () => {
  it("defaults offset to {0,0} when initialOffset is not provided", () => {
    const { result } = renderHook(() =>
      useWindowManager({ defaultWidth: 680, isMobile: false, mounted: true })
    );
    expect(result.current.offset).toEqual({ x: 0, y: 0 });
  });

  it("uses initialOffset as the starting offset when provided", () => {
    const { result } = renderHook(() =>
      useWindowManager({
        defaultWidth: 680,
        isMobile: false,
        mounted: true,
        initialOffset: { x: 28, y: 56 },
      })
    );
    expect(result.current.offset).toEqual({ x: 28, y: 56 });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/hooks/useWindowManager.test.ts`
Expected: FAIL on the second test — offset is `{ x: 0, y: 0 }` instead of `{ x: 28, y: 56 }`

- [ ] **Step 3: Add initialOffset to the hook**

In `src/hooks/useWindowManager.ts`, add the field to the config interface:

```ts
interface UseWindowManagerConfig {
  defaultWidth: number;
  defaultHeight?: number;
  isMobile: boolean;
  mounted: boolean;
  initialState?: WindowState;
  initialOffset?: { x: number; y: number };
}
```

Then update the destructuring and initial state (replace the existing `const { defaultWidth, isMobile, mounted, initialState = "closed" } = config;` line and the `offset` useState line):

```ts
const { defaultWidth, isMobile, mounted, initialState = "closed", initialOffset } = config;

const [state, setState] = useState<WindowState>(initialState);
const [offset, setOffset] = useState(initialOffset ?? { x: 0, y: 0 });
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/hooks/useWindowManager.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 5: Run the full suite to confirm no regressions**

Run: `npm test`
Expected: no new failures beyond whatever pre-existing failures were present before this task

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useWindowManager.ts src/hooks/useWindowManager.test.ts
git commit -m "feat: add initialOffset config to useWindowManager"
```

---

### Task 3: ArticleWindow component

**Files:**
- Create: `src/components/desktop/ArticleWindow.tsx`
- Create: `src/components/desktop/ArticleWindow.test.tsx`

**Interfaces:**
- Consumes: `FolderIcon` from `@/components/icons/FolderIcon` (Task 1); `useWindowManager` with `initialOffset` support from `@/hooks/useWindowManager` (Task 2); `posts` from `@/constants/blog` (existing, unchanged).
- Produces:
  ```ts
  interface ArticleWindowProps {
    slug: string;
    standalone?: boolean;       // default false
    isMobile?: boolean;         // default false
    mounted?: boolean;          // default true
    initialOffset?: { x: number; y: number };
    onFocus?: () => void;
    onClose?: () => void;       // called when closed in embedded (non-standalone) mode
    onMaximizedChange?: (isMaximized: boolean) => void;
    activeZIndex?: number;      // default 10
  }
  export function ArticleWindow(props: ArticleWindowProps): JSX.Element | null;
  ```
  Task 5 (`page.tsx`) renders one `<ArticleWindow>` per open slug using `onFocus`/`onClose`/`onMaximizedChange`/`activeZIndex`/`initialOffset`. Task 7 (`/blog/[slug]/page.tsx`) renders `<ArticleWindow slug={slug} standalone />` with no other props.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/components/desktop/ArticleWindow.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ArticleWindow } from "./ArticleWindow";

// ArticleWindow calls useRouter() from next/navigation (for the standalone
// close-button case). That hook throws "invariant expected app router to be
// mounted" when rendered outside a real Next app-router context, which plain
// @testing-library/react render() doesn't provide — so it must be mocked.
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const REAL_SLUG = "self-hosted-email";

describe("ArticleWindow", () => {
  it("renders the post title and content", () => {
    render(<ArticleWindow slug={REAL_SLUG} />);
    expect(screen.getAllByText(/SaaS is Dead to Me/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Mox/)).toBeInTheDocument();
  });

  it("returns null for an unknown slug", () => {
    const { container } = render(<ArticleWindow slug="does-not-exist" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders only two traffic-light dots (no minimize)", () => {
    const { container } = render(<ArticleWindow slug={REAL_SLUG} />);
    const dots = container.querySelectorAll('span[style*="border-radius: 50%"]');
    expect(dots.length).toBe(2);
  });

  it("calls onClose when the close dot is clicked in embedded mode", () => {
    const onClose = vi.fn();
    const { container } = render(<ArticleWindow slug={REAL_SLUG} onClose={onClose} />);
    const closeDot = container.querySelector('span[style*="border-radius: 50%"]');
    fireEvent.click(closeDot!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onFocus when clicked", () => {
    const onFocus = vi.fn();
    const { container } = render(<ArticleWindow slug={REAL_SLUG} onFocus={onFocus} />);
    fireEvent.mouseDown(container.firstChild!);
    expect(onFocus).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/desktop/ArticleWindow.test.tsx`
Expected: FAIL — `Failed to resolve import "./ArticleWindow"`

- [ ] **Step 3: Write the component**

```tsx
// src/components/desktop/ArticleWindow.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWindowManager } from "@/hooks/useWindowManager";
import { FolderIcon } from "@/components/icons/FolderIcon";
import { posts } from "@/constants/blog";

interface ArticleWindowProps {
  slug: string;
  standalone?: boolean;
  isMobile?: boolean;
  mounted?: boolean;
  initialOffset?: { x: number; y: number };
  onFocus?: () => void;
  onClose?: () => void;
  onMaximizedChange?: (isMaximized: boolean) => void;
  activeZIndex?: number;
}

export function ArticleWindow({
  slug,
  standalone = false,
  isMobile = false,
  mounted = true,
  initialOffset,
  onFocus,
  onClose,
  onMaximizedChange,
  activeZIndex = 10,
}: ArticleWindowProps) {
  const router = useRouter();
  const post = posts.find((p) => p.slug === slug);

  const wm = useWindowManager({
    defaultWidth: 680,
    isMobile,
    mounted,
    initialState: "open",
    initialOffset,
  });

  useEffect(() => {
    onMaximizedChange?.(wm.state === "maximized");
  }, [wm.state, onMaximizedChange]);

  const handleClose = () => {
    if (standalone) {
      router.push("/");
    } else {
      wm.setState("closed");
      onClose?.();
    }
  };

  if (!post) return null;

  return (
    <div
      ref={wm.ref}
      onMouseDown={onFocus}
      style={{
        ...wm.getWindowStyle(),
        display: "flex",
        flexDirection: "column",
        borderRadius: wm.state === "maximized" ? 0 : 10,
        boxShadow: wm.state === "maximized" ? "none" : "var(--window-shadow)",
        overflow: "hidden",
        zIndex: wm.state === "maximized" ? 200 : activeZIndex,
        background: "var(--color-bg)",
      }}
    >
      <div
        onMouseDown={wm.handleDragStart}
        onDoubleClick={wm.maximize}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 16px",
          background: "var(--titlebar-bg)",
          borderBottom: "1px solid var(--color-border)",
          flexShrink: 0,
          cursor: wm.state === "maximized" ? "default" : "grab",
          userSelect: "none",
        }}
      >
        <span
          onClick={(e) => { e.stopPropagation(); handleClose(); }}
          style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--color-dot-r)", cursor: "pointer", flexShrink: 0 }}
        />
        <span
          onClick={(e) => { e.stopPropagation(); wm.maximize(); }}
          style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--color-dot-g)", cursor: "pointer", flexShrink: 0 }}
        />
        <FolderIcon size={13} style={{ marginLeft: 6, flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: "var(--color-muted)" }}>{post.title}</span>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "32px 36px",
          fontSize: 14,
          lineHeight: 1.8,
          color: "var(--color-body)",
          overscrollBehavior: "contain",
        }}
      >
        <header style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--color-heading)", lineHeight: 1.4, marginBottom: 6 }}>
            {post.title}
          </h1>
          <time style={{ fontSize: 12, color: "var(--color-muted)" }}>
            {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </time>
        </header>
        <div className="blog-content">{post.content}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/desktop/ArticleWindow.test.tsx`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/desktop/ArticleWindow.tsx src/components/desktop/ArticleWindow.test.tsx
git commit -m "feat: add ArticleWindow component"
```

---

### Task 4: BlogFolderWindow (trim BlogWindow.tsx to listing-only)

**Files:**
- Create: `src/components/desktop/BlogFolderWindow.tsx`
- Delete: `src/components/desktop/BlogWindow.tsx`
- Create: `src/components/desktop/BlogFolderWindow.test.tsx`

**Interfaces:**
- Consumes: `FolderIcon` (Task 1); `WindowChrome` from `./WindowChrome` (existing, unchanged); `posts` from `@/constants/blog` (existing).
- Produces:
  ```ts
  interface BlogFolderWindowProps {
    wm: ReturnType<typeof useWindowManager>;
    onFocus: () => void;
    onBounce: (id: string) => void;
    activeZIndex: number;
    onOpenArticle: (slug: string) => void;
  }
  export function BlogFolderWindow(props: BlogFolderWindowProps): JSX.Element;
  ```
  Task 5 (`page.tsx`) renders this in place of the old `BlogWindow`, passing `openArticle` as `onOpenArticle`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/desktop/BlogFolderWindow.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BlogFolderWindow } from "./BlogFolderWindow";

function makeWm() {
  return {
    state: "open" as const,
    setState: vi.fn(),
    offset: { x: 0, y: 0 },
    ref: { current: null },
    minimize: vi.fn(() => "minimized"),
    maximize: vi.fn(),
    restore: vi.fn(),
    close: vi.fn(),
    open: vi.fn(),
    resetPosition: vi.fn(),
    handleDragStart: vi.fn(),
    getWindowStyle: vi.fn(() => ({})),
  };
}

describe("BlogFolderWindow", () => {
  it("lists posts by title, not their content", () => {
    render(
      <BlogFolderWindow wm={makeWm()} onFocus={vi.fn()} onBounce={vi.fn()} activeZIndex={10} onOpenArticle={vi.fn()} />
    );
    expect(screen.getByText(/SaaS is Dead to Me/)).toBeInTheDocument();
    expect(screen.queryByText(/Mox/)).not.toBeInTheDocument();
  });

  it("calls onOpenArticle with the slug when a post row is clicked, without changing local content", () => {
    const onOpenArticle = vi.fn();
    render(
      <BlogFolderWindow wm={makeWm()} onFocus={vi.fn()} onBounce={vi.fn()} activeZIndex={10} onOpenArticle={onOpenArticle} />
    );
    // Same reasoning as above: once the article window is open, its title also
    // matches /SaaS is Dead to Me/ (rendered again in the ArticleWindow's <h1>),
    // so index 0 (the folder's row, which is what's wired to onOpenArticle) is
    // the one to click.
    fireEvent.click(screen.getAllByText(/SaaS is Dead to Me/)[0]);
    expect(onOpenArticle).toHaveBeenCalledWith("self-hosted-email");
    expect(screen.getByText(/SaaS is Dead to Me/)).toBeInTheDocument();
  });

  it("has no back button (no inline article view)", () => {
    render(
      <BlogFolderWindow wm={makeWm()} onFocus={vi.fn()} onBounce={vi.fn()} activeZIndex={10} onOpenArticle={vi.fn()} />
    );
    expect(screen.queryByText(/all posts/)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/desktop/BlogFolderWindow.test.tsx`
Expected: FAIL — `Failed to resolve import "./BlogFolderWindow"`

- [ ] **Step 3: Write the component**

```tsx
// src/components/desktop/BlogFolderWindow.tsx
"use client";

import { WindowChrome } from "./WindowChrome";
import type { useWindowManager } from "@/hooks/useWindowManager";
import { posts } from "@/constants/blog";
import { FolderIcon } from "@/components/icons/FolderIcon";

interface BlogFolderWindowProps {
  wm: ReturnType<typeof useWindowManager>;
  onFocus: () => void;
  onBounce: (id: string) => void;
  activeZIndex: number;
  onOpenArticle: (slug: string) => void;
}

export function BlogFolderWindow({ wm, onFocus, onBounce, activeZIndex, onOpenArticle }: BlogFolderWindowProps) {
  const handleMinimize = () => {
    wm.minimize();
    onBounce("blog");
  };

  return (
    <div
      ref={wm.ref}
      onMouseDown={onFocus}
      style={{
        ...wm.getWindowStyle(),
        display: "flex",
        flexDirection: "column",
        borderRadius: wm.state === "maximized" ? 0 : 10,
        boxShadow: wm.state === "maximized" ? "none" : "var(--window-shadow)",
        overflow: "hidden",
        zIndex: wm.state === "maximized" ? 200 : activeZIndex,
      }}
    >
      <WindowChrome
        onClose={() => wm.setState("closed")}
        onMinimize={handleMinimize}
        onMaximize={wm.maximize}
        onDragStart={wm.handleDragStart}
        onDoubleClick={wm.maximize}
        isMaximized={wm.state === "maximized"}
        isMobile={false}
        title={
          <>
            <FolderIcon size={13} style={{ verticalAlign: "middle", marginRight: 4 }} /> Blog
          </>
        }
      />

      <div style={{ flex: 1, overflowY: "auto", background: "var(--color-bg)", overscrollBehavior: "contain" }}>
        <div style={{ padding: "24px 28px" }}>
          {posts.map((post) => (
            <div
              key={post.slug}
              onClick={() => onOpenArticle(post.slug)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 12px",
                borderRadius: 6,
                cursor: "pointer",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--dropdown-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontSize: 28, flexShrink: 0 }}>📄</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-heading)" }}>
                  {post.title}
                </div>
                <div style={{ fontSize: 11, color: "var(--color-muted)", marginTop: 2 }}>
                  {post.description} &middot;{" "}
                  {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <p style={{ color: "var(--color-muted)", fontSize: 13, padding: 12 }}>
              Nothing here yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Delete the old BlogWindow.tsx**

```bash
git rm src/components/desktop/BlogWindow.tsx
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/desktop/BlogFolderWindow.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 6: Commit**

```bash
git add src/components/desktop/BlogFolderWindow.tsx src/components/desktop/BlogFolderWindow.test.tsx
git commit -m "feat: replace BlogWindow with listing-only BlogFolderWindow"
```

---

### Task 5: Wire multi-window state + URL sync into page.tsx

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/page.test.tsx`

**Interfaces:**
- Consumes: `ArticleWindow` (Task 3), `BlogFolderWindow` (Task 4), `useWindowManager` with `initialOffset` (Task 2).
- Produces: no new exports — this task is the integration point, nothing downstream depends on it.

- [ ] **Step 1: Write the failing tests**

First, add this mock near the top of `src/app/page.test.tsx`, right after the existing `import Home from "./page";` line (vitest hoists `vi.mock` calls, so exact placement within the file doesn't matter, but keep it visible next to the other imports). Opening an article now mounts `ArticleWindow`, which calls `useRouter()` from `next/navigation` — that hook throws outside a real Next app-router context, which plain `render(<Home />)` doesn't provide:

```tsx
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));
```

Then add this new describe block (`renderAndMount`, `screen`, `fireEvent`, `waitFor` are already imported at the top of the file — `fireEvent` and `waitFor` are already in the existing import line, no new imports needed):

```tsx
describe("Blog multi-window", () => {
  it("opens an article as its own window when clicked from the folder", () => {
    renderAndMount();
    // "Blog" appears twice once the folder window is open (desktop icon label +
    // window title bar) — the desktop icon is always index 0, since DesktopIcons
    // renders before any window in page.tsx's JSX tree.
    fireEvent.click(screen.getAllByText("Blog")[0]);
    // Same reasoning as above: once the article window is open, its title also
    // matches /SaaS is Dead to Me/ (rendered again in the ArticleWindow's <h1>),
    // so index 0 (the folder's row, which is what's wired to onOpenArticle) is
    // the one to click.
    fireEvent.click(screen.getAllByText(/SaaS is Dead to Me/)[0]);
    expect(screen.getByText(/Mox/)).toBeInTheDocument();
  });

  it("dedups: clicking the same post twice keeps only one article window open, just refocused", () => {
    renderAndMount();
    // "Blog" appears twice once the folder window is open (desktop icon label +
    // window title bar) — the desktop icon is always index 0, since DesktopIcons
    // renders before any window in page.tsx's JSX tree.
    fireEvent.click(screen.getAllByText("Blog")[0]);
    // Same reasoning as above: once the article window is open, its title also
    // matches /SaaS is Dead to Me/ (rendered again in the ArticleWindow's <h1>),
    // so index 0 (the folder's row, which is what's wired to onOpenArticle) is
    // the one to click.
    fireEvent.click(screen.getAllByText(/SaaS is Dead to Me/)[0]);
    // "Blog" appears twice once the folder window is open (desktop icon label +
    // window title bar) — the desktop icon is always index 0, since DesktopIcons
    // renders before any window in page.tsx's JSX tree.
    fireEvent.click(screen.getAllByText("Blog")[0]);
    // Same reasoning as above: once the article window is open, its title also
    // matches /SaaS is Dead to Me/ (rendered again in the ArticleWindow's <h1>),
    // so index 0 (the folder's row, which is what's wired to onOpenArticle) is
    // the one to click.
    fireEvent.click(screen.getAllByText(/SaaS is Dead to Me/)[0]);
    // Article body text should appear exactly once (one window), not duplicated
    expect(screen.getAllByText(/Mox/).length).toBe(1);
  });

  it("closing an article does not close the folder window (article dots render after the folder's 3 dots)", () => {
    renderAndMount();
    // "Blog" appears twice once the folder window is open (desktop icon label +
    // window title bar) — the desktop icon is always index 0, since DesktopIcons
    // renders before any window in page.tsx's JSX tree.
    fireEvent.click(screen.getAllByText("Blog")[0]);
    // Same reasoning as above: once the article window is open, its title also
    // matches /SaaS is Dead to Me/ (rendered again in the ArticleWindow's <h1>),
    // so index 0 (the folder's row, which is what's wired to onOpenArticle) is
    // the one to click.
    fireEvent.click(screen.getAllByText(/SaaS is Dead to Me/)[0]);
    // DOM order: BlogFolderWindow renders first (3 dots: red, yellow, green),
    // then the ArticleWindow (2 dots: red, green) — index 3 is the article's close (red) dot.
    const dots = document.querySelectorAll('span[style*="border-radius: 50%"]');
    expect(dots.length).toBe(5);
    fireEvent.click(dots[3]);
    expect(screen.queryByText(/Mox/)).not.toBeInTheDocument();
    // "Blog" still appears twice: desktop icon label + the still-open folder window's title
    expect(screen.getAllByText("Blog").length).toBe(2);
  });

  it("updates the URL to /blog/<slug> when an article is opened", () => {
    renderAndMount();
    // "Blog" appears twice once the folder window is open (desktop icon label +
    // window title bar) — the desktop icon is always index 0, since DesktopIcons
    // renders before any window in page.tsx's JSX tree.
    fireEvent.click(screen.getAllByText("Blog")[0]);
    // Same reasoning as above: once the article window is open, its title also
    // matches /SaaS is Dead to Me/ (rendered again in the ArticleWindow's <h1>),
    // so index 0 (the folder's row, which is what's wired to onOpenArticle) is
    // the one to click.
    fireEvent.click(screen.getAllByText(/SaaS is Dead to Me/)[0]);
    expect(window.location.pathname).toBe("/blog/self-hosted-email");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/page.test.tsx -t "Blog multi-window"`
Expected: FAIL — clicking "Blog" still opens the old singleton `BlogWindow` with inline content-swap, not a separate article window; `window.location.pathname` stays `/`

- [ ] **Step 3: Rewrite the blog-related state and wiring in page.tsx**

Replace the imports block (lines 1–16) — swap the `BlogWindow` import for the two new components:

```tsx
"use client";

import { useState, useEffect } from "react";
import { useWindowManager } from "@/hooks/useWindowManager";
import { useClock } from "@/hooks/useClock";
import { menuItemsConfig, desktopIconsConfig, dockItemsConfig } from "@/constants/portfolio";
import { MenuBar } from "@/components/desktop/MenuBar";
import { Dock } from "@/components/desktop/Dock";
import type { DockItem } from "@/components/desktop/Dock";
import { DesktopIcons } from "@/components/desktop/DesktopIcons";
import { TerminalWindow } from "@/components/desktop/TerminalWindow";
import { BrowserWindow } from "@/components/desktop/BrowserWindow";
import { SettingsWindow } from "@/components/desktop/SettingsWindow";
import { DoomWindow } from "@/components/desktop/DoomWindow";
import { BlogFolderWindow } from "@/components/desktop/BlogFolderWindow";
import { ArticleWindow } from "@/components/desktop/ArticleWindow";
import { useTheme } from "@/contexts/ThemeContext";

type BlogWindowId = "blogFolder" | `article:${string}`;
type WindowId = "terminal" | "browser" | "settings" | "doom" | BlogWindowId;
```

Replace this exact original block (from the `activeWindow` state line through the `blog` window-manager line — `isMobile`, `mounted`, and `activeMenu` above it are untouched):

```tsx
  const [activeWindow, setActiveWindow] = useState<"terminal" | "browser" | "settings" | "doom" | "blog">("terminal");
  const [bouncingIcon, setBouncingIcon] = useState<string | null>(null);

  const clock = useClock();
  const { backgroundValue } = useTheme();

  const terminal = useWindowManager({ defaultWidth: 720, isMobile, mounted, initialState: "open" });
  const browser = useWindowManager({ defaultWidth: 820, isMobile, mounted, initialState: "closed" });
  const settings = useWindowManager({ defaultWidth: 480, isMobile, mounted, initialState: "closed" });
  const doom = useWindowManager({ defaultWidth: 640, isMobile, mounted, initialState: "closed" });
  const blog = useWindowManager({ defaultWidth: 680, isMobile, mounted, initialState: "closed" });
```

with:

```tsx
  const [activeWindow, setActiveWindow] = useState<WindowId>("terminal");
  const [openArticles, setOpenArticles] = useState<string[]>([]);
  const [blogZOrder, setBlogZOrder] = useState<BlogWindowId[]>([]);
  const [maximizedArticles, setMaximizedArticles] = useState<Set<string>>(new Set());
  const [bouncingIcon, setBouncingIcon] = useState<string | null>(null);

  const clock = useClock();
  const { backgroundValue } = useTheme();

  const terminal = useWindowManager({ defaultWidth: 720, isMobile, mounted, initialState: "open" });
  const browser = useWindowManager({ defaultWidth: 820, isMobile, mounted, initialState: "closed" });
  const settings = useWindowManager({ defaultWidth: 480, isMobile, mounted, initialState: "closed" });
  const doom = useWindowManager({ defaultWidth: 640, isMobile, mounted, initialState: "closed" });
  const blogFolder = useWindowManager({ defaultWidth: 680, isMobile, mounted, initialState: "closed" });
```

(Note: `isMobile` and `mounted` are declared earlier in the component and already exist — this block only replaces the five `useWindowManager` calls and the state declarations above them, not the whole function.)

Delete the old `openBlog` function entirely (it references `blog`, which no longer exists after the rename to `blogFolder` above):

```tsx
  const openBlog = () => {
    blog.open();
    setActiveWindow("blog");
  };
```

In its place (same location, right after `handleBounce` and before `menuActions`), add the new focus-stack helpers:

```tsx
  const focusBlogWindow = (id: BlogWindowId) => {
    setBlogZOrder((prev) => [...prev.filter((x) => x !== id), id]);
    setActiveWindow(id);
  };

  const openBlogFolder = () => {
    blogFolder.open();
    setBlogZOrder((prev) => (prev.includes("blogFolder") ? prev : [...prev, "blogFolder"]));
    focusBlogWindow("blogFolder");
  };

  const openArticle = (slug: string) => {
    setOpenArticles((prev) => (prev.includes(slug) ? prev : [...prev, slug]));
    focusBlogWindow(`article:${slug}`);
  };

  const closeArticle = (slug: string) => {
    setOpenArticles((prev) => prev.filter((s) => s !== slug));
    setBlogZOrder((prev) => prev.filter((id) => id !== `article:${slug}`));
    setMaximizedArticles((prev) => {
      if (!prev.has(slug)) return prev;
      const next = new Set(prev);
      next.delete(slug);
      return next;
    });
  };

  const setArticleMaximized = (slug: string, isMaximized: boolean) => {
    setMaximizedArticles((prev) => {
      const has = prev.has(slug);
      if (isMaximized === has) return prev;
      const next = new Set(prev);
      if (isMaximized) next.add(slug); else next.delete(slug);
      return next;
    });
  };

  const isBlogClusterActive = activeWindow === "blogFolder" || activeWindow.startsWith("article:");
  const blogTierBase = isBlogClusterActive ? 20 : 10;
  const blogZIndex = (id: BlogWindowId) => blogTierBase + blogZOrder.indexOf(id);

  useEffect(() => {
    if (activeWindow === "blogFolder") {
      if (window.location.pathname !== "/blog") window.history.pushState(null, "", "/blog");
    } else if (activeWindow.startsWith("article:")) {
      const slug = activeWindow.slice("article:".length);
      const path = `/blog/${slug}`;
      if (window.location.pathname !== path) window.history.pushState(null, "", path);
    }
  }, [activeWindow]);

  useEffect(() => {
    const onPopState = () => {
      const match = window.location.pathname.match(/^\/blog\/(.+)$/);
      if (match) {
        openArticle(match[1]);
      } else if (window.location.pathname === "/blog") {
        openBlogFolder();
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
```

Update `anyMaximized` (replace the existing line):

```tsx
  const anyMaximized =
    terminal.state === "maximized" ||
    browser.state === "maximized" ||
    settings.state === "maximized" ||
    doom.state === "maximized" ||
    blogFolder.state === "maximized" ||
    maximizedArticles.size > 0;
```

Update the "empty desktop hint" condition (replace the five-line `&&` chain that currently ends with `blog.state !== "open" && blog.state !== "maximized" && !isMobile`) to:

```tsx
        {(terminal.state === "minimized" || terminal.state === "closed") &&
          browser.state !== "open" && browser.state !== "maximized" &&
          settings.state !== "open" && settings.state !== "maximized" &&
          doom.state !== "open" && doom.state !== "maximized" &&
          blogFolder.state !== "open" && blogFolder.state !== "maximized" &&
          openArticles.length === 0 && !isMobile && (
```

Update `DesktopIcons` and `TerminalWindow` calls to use `openBlogFolder` instead of `openBlog`:

```tsx
        <DesktopIcons icons={desktopIconsConfig} onBrowserOpen={openBrowser} onSettingsOpen={openSettings} onDoomOpen={openDoom} onBlogOpen={openBlogFolder} />

        <TerminalWindow
          wm={terminal}
          isMobile={isMobile}
          onFocus={() => setActiveWindow("terminal")}
          onBounce={handleBounce}
          activeZIndex={activeWindow === "terminal" ? 20 : 10}
          onBlogOpen={openBlogFolder}
        />
```

Replace the final `{blog.state !== "closed" && (<BlogWindow ... />)}` block with:

```tsx
        {blogFolder.state !== "closed" && (
          <BlogFolderWindow
            wm={blogFolder}
            onFocus={() => focusBlogWindow("blogFolder")}
            onBounce={handleBounce}
            activeZIndex={blogZIndex("blogFolder")}
            onOpenArticle={openArticle}
          />
        )}

        {openArticles.map((slug, index) => (
          <ArticleWindow
            key={slug}
            slug={slug}
            isMobile={isMobile}
            mounted={mounted}
            initialOffset={{ x: index * 28, y: index * 28 }}
            onFocus={() => focusBlogWindow(`article:${slug}`)}
            onClose={() => closeArticle(slug)}
            onMaximizedChange={(isMax) => setArticleMaximized(slug, isMax)}
            activeZIndex={blogZIndex(`article:${slug}`)}
          />
        ))}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/app/page.test.tsx -t "Blog multi-window"`
Expected: PASS (4 tests)

- [ ] **Step 5: Run the full test suite**

Run: `npm test`
Expected: no new failures beyond whatever pre-existing failures were present before this task (the whole `page.test.tsx` file was already failing entirely before this plan due to an unrelated missing `ThemeProvider` wrapper issue noted in a prior session — confirm the failure count/pattern hasn't gotten worse, not that it's zero)

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx src/app/page.test.tsx
git commit -m "feat: multi-window article state, focus stack, and URL sync in page.tsx"
```

---

### Task 6: /blog index route

**Files:**
- Create: `src/app/blog/page.tsx`
- Create: `src/app/blog/page.test.tsx`

**Interfaces:**
- Consumes: `posts` from `@/constants/blog` (existing).
- Produces: nothing downstream depends on this file's exports (it's a route entry point).

- [ ] **Step 1: Write the failing test**

```tsx
// src/app/blog/page.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BlogIndexPage from "./page";

describe("BlogIndexPage", () => {
  it("lists every post with a link to its slug", () => {
    render(<BlogIndexPage />);
    const link = screen.getByRole("link", { name: /SaaS is Dead to Me/ });
    expect(link).toHaveAttribute("href", "/blog/self-hosted-email");
  });

  it("shows the post description", () => {
    render(<BlogIndexPage />);
    expect(screen.getByText(/Replacing \$300\/year in SaaS email/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/blog/page.test.tsx`
Expected: FAIL — `Failed to resolve import "./page"`

- [ ] **Step 3: Write the page**

```tsx
// src/app/blog/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/constants/blog";

export const metadata: Metadata = {
  title: "Blog — Aidan O'Brien",
  description: "Writing from Aidan O'Brien.",
};

export default function BlogIndexPage() {
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "64px 24px", fontFamily: "var(--font-mono)" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--color-heading)", marginBottom: 24 }}>
        Blog
      </h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-heading)" }}>
              {post.title}
            </div>
            <div style={{ fontSize: 12, color: "var(--color-muted)", marginTop: 4 }}>
              {post.description} &middot;{" "}
              {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
          </Link>
        ))}
        {posts.length === 0 && (
          <p style={{ color: "var(--color-muted)", fontSize: 13 }}>Nothing here yet.</p>
        )}
      </div>
      <Link href="/" style={{ display: "inline-block", marginTop: 40, fontSize: 12, color: "var(--color-accent)" }}>
        &larr; Back home
      </Link>
    </main>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/app/blog/page.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/app/blog/page.tsx src/app/blog/page.test.tsx
git commit -m "feat: add static /blog index route"
```

---

### Task 7: /blog/[slug] route (SEO article page)

**Files:**
- Create: `src/app/blog/[slug]/page.tsx`
- Create: `src/app/blog/[slug]/page.test.tsx`

**Interfaces:**
- Consumes: `ArticleWindow` (Task 3) in `standalone` mode; `posts` from `@/constants/blog` (existing).
- Produces: nothing downstream depends on this file's exports.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/app/blog/[slug]/page.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ArticlePage, { generateStaticParams, generateMetadata } from "./page";

// ArticlePage renders ArticleWindow standalone, which calls useRouter() from
// next/navigation — mocked for the same reason as in ArticleWindow.test.tsx.
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  notFound: () => { throw new Error("notFound() called"); },
}));

describe("generateStaticParams", () => {
  it("returns one entry per post slug", () => {
    expect(generateStaticParams()).toEqual([{ slug: "self-hosted-email" }]);
  });
});

describe("generateMetadata", () => {
  it("returns the post's title and description for a known slug", async () => {
    const meta = await generateMetadata({ params: { slug: "self-hosted-email" } });
    expect(meta.title).toContain("SaaS is Dead to Me");
    expect(meta.description).toBe(
      "Replacing $300/year in SaaS email with a self-hosted Mox server on a cheap VPS."
    );
  });
});

describe("ArticlePage", () => {
  it("renders the real article content server-side (crawlable, not gated behind client state)", () => {
    render(<ArticlePage params={{ slug: "self-hosted-email" }} />);
    expect(screen.getAllByText(/SaaS is Dead to Me/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Mox/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run "src/app/blog/[slug]/page.test.tsx"`
Expected: FAIL — `Failed to resolve import "./page"`

- [ ] **Step 3: Write the page**

```tsx
// src/app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { posts } from "@/constants/blog";
import { ArticleWindow } from "@/components/desktop/ArticleWindow";

interface PageParams {
  params: { slug: string };
}

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: PageParams): Metadata {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return {};
  return {
    title: `${post.title} — Aidan O'Brien`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default function ArticlePage({ params }: PageParams) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        background: "var(--color-bg)",
        overflow: "hidden",
      }}
    >
      <ArticleWindow slug={params.slug} standalone />
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run "src/app/blog/[slug]/page.test.tsx"`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add "src/app/blog/[slug]/page.tsx" "src/app/blog/[slug]/page.test.tsx"
git commit -m "feat: add static /blog/[slug] SEO article route"
```

---

### Task 8: sitemap.ts

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/sitemap.test.ts`

**Interfaces:**
- Consumes: `posts` from `@/constants/blog` (existing).
- Produces: nothing downstream depends on this file's exports.

- [ ] **Step 1: Write the failing test**

```ts
// src/app/sitemap.test.ts
import { describe, it, expect } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("includes the homepage, the blog index, and every post", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://aidanpobrien.com/");
    expect(urls).toContain("https://aidanpobrien.com/blog");
    expect(urls).toContain("https://aidanpobrien.com/blog/self-hosted-email");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/sitemap.test.ts`
Expected: FAIL — `Failed to resolve import "./sitemap"`

- [ ] **Step 3: Write the sitemap**

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { posts } from "@/constants/blog";

const BASE_URL = "https://aidanpobrien.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE_URL}/`, lastModified: new Date() },
    { url: `${BASE_URL}/blog`, lastModified: new Date() },
    ...posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
    })),
  ];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/app/sitemap.test.ts`
Expected: PASS (1 test)

- [ ] **Step 5: Run the full suite one last time**

Run: `npm test && npm run lint`
Expected: no new failures/warnings beyond whatever pre-existing ones were present at the start of this plan

- [ ] **Step 6: Commit**

```bash
git add src/app/sitemap.ts src/app/sitemap.test.ts
git commit -m "feat: add sitemap.ts covering blog index and article routes"
```
