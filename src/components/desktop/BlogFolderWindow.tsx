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
