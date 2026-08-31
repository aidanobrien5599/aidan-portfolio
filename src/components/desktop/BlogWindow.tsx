"use client";

import { useState } from "react";
import { WindowChrome } from "./WindowChrome";
import type { useWindowManager } from "@/hooks/useWindowManager";
import { posts } from "@/constants/blog";

interface BlogWindowProps {
  wm: ReturnType<typeof useWindowManager>;
  onFocus: () => void;
  onBounce: (id: string) => void;
  activeZIndex: number;
  initialSlug?: string | null;
}

export function BlogWindow({ wm, onFocus, onBounce, activeZIndex, initialSlug }: BlogWindowProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(initialSlug ?? null);
  const activePost = posts.find((p) => p.slug === activeSlug);

  const handleMinimize = () => {
    wm.minimize();
    onBounce("blog");
  };

  const handleBack = () => setActiveSlug(null);

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
        onClose={() => { wm.setState("closed"); setActiveSlug(null); }}
        onMinimize={handleMinimize}
        onMaximize={wm.maximize}
        onDragStart={wm.handleDragStart}
        onDoubleClick={wm.maximize}
        isMaximized={wm.state === "maximized"}
        isMobile={false}
        title={
          <>
            <span style={{ color: "var(--color-accent)" }}>📁</span>{" "}
            {activePost ? activePost.title : "Blog"}
          </>
        }
      />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          background: "var(--color-bg)",
          overscrollBehavior: "contain",
        }}
      >
        {activePost ? (
          <div style={{ padding: "32px 36px", fontSize: 14, lineHeight: 1.8, color: "var(--color-body)" }}>
            <button
              onClick={handleBack}
              style={{
                background: "none",
                border: "none",
                color: "var(--color-accent)",
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "var(--font-mono)",
                padding: 0,
                marginBottom: 24,
              }}
            >
              &larr; all posts
            </button>

            <header style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--color-heading)", lineHeight: 1.4, marginBottom: 6 }}>
                {activePost.title}
              </h1>
              <time style={{ fontSize: 12, color: "var(--color-muted)" }}>
                {new Date(activePost.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </time>
            </header>

            <div className="blog-content">{activePost.content}</div>
          </div>
        ) : (
          <div style={{ padding: "24px 28px" }}>
            {posts.map((post) => (
              <div
                key={post.slug}
                onClick={() => setActiveSlug(post.slug)}
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
        )}
      </div>
    </div>
  );
}
