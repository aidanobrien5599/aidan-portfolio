"use client";

import { WindowChrome } from "./WindowChrome";
import type { useWindowManager } from "@/hooks/useWindowManager";
import type { BlogPost } from "@/constants/blog";

interface BlogWindowProps {
  wm: ReturnType<typeof useWindowManager>;
  post: BlogPost;
  onFocus: () => void;
  onBounce: (id: string) => void;
  activeZIndex: number;
}

export function BlogWindow({ wm, post, onFocus, onBounce, activeZIndex }: BlogWindowProps) {
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
            <span style={{ color: "var(--color-accent)" }}>✎</span>{" "}
            {post.title}
          </>
        }
      />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          background: "var(--color-bg)",
          padding: "32px 36px",
          fontSize: 14,
          lineHeight: 1.8,
          color: "var(--color-body)",
          overscrollBehavior: "contain",
        }}
      >
        <header style={{ marginBottom: 28 }}>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "var(--color-heading)",
              lineHeight: 1.4,
              marginBottom: 6,
            }}
          >
            {post.title}
          </h1>
          <time style={{ fontSize: 12, color: "var(--color-muted)" }}>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </header>

        <div className="blog-content">{post.content}</div>

        <footer
          style={{
            paddingTop: 16,
            marginTop: 32,
            borderTop: "1px solid var(--color-border)",
            fontSize: 11,
            color: "var(--color-muted)",
          }}
        >
          {new Date().getFullYear()} — Aidan O&apos;Brien
        </footer>
      </div>
    </div>
  );
}
