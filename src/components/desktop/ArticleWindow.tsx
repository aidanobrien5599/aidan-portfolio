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
    initialState: standalone ? "maximized" : "open",
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

  // Standalone pages start maximized and have no desktop underneath them, so
  // there's no floating-card state to toggle into locally — un-maximizing
  // instead navigates into the real desktop app with this article already
  // open (normal, floating, not maximized), the same as opening it from the
  // folder. Home reads the ?article= param on mount and opens it.
  const handleMaximizeToggle = () => {
    if (standalone) {
      router.push(`/?article=${slug}`);
    } else {
      wm.maximize();
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
        onDoubleClick={handleMaximizeToggle}
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
          onClick={(e) => { e.stopPropagation(); handleMaximizeToggle(); }}
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
