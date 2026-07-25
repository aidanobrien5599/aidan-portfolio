"use client";

import type { ReactNode } from "react";

interface WindowChromeProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onDragStart: (e: React.MouseEvent) => void;
  onDoubleClick: () => void;
  isMaximized: boolean;
  isMobile?: boolean;
  title: ReactNode;
}

export function WindowChrome({
  onClose,
  onMinimize,
  onMaximize,
  onDragStart,
  onDoubleClick,
  isMaximized,
  isMobile,
  title,
}: WindowChromeProps) {
  return (
    <div
      onMouseDown={onDragStart}
      onDoubleClick={onDoubleClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: isMobile ? "12px 14px" : "10px 16px",
        background: "var(--titlebar-bg)",
        borderBottom: "1px solid var(--color-border)",
        flexShrink: 0,
        cursor: isMaximized ? "default" : "grab",
        userSelect: "none",
      }}
    >
      <span
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        style={{
          width: 12, height: 12, borderRadius: "50%",
          background: "var(--color-dot-r)", cursor: "pointer",
          flexShrink: 0,
        }}
      />
      <span
        onClick={(e) => { e.stopPropagation(); onMinimize(); }}
        style={{
          width: 12, height: 12, borderRadius: "50%",
          background: "var(--color-dot-y)", cursor: "pointer",
          flexShrink: 0,
        }}
      />
      <span
        onClick={(e) => { e.stopPropagation(); onMaximize(); }}
        style={{
          width: 12, height: 12, borderRadius: "50%",
          background: "var(--color-dot-g)", cursor: "pointer",
          flexShrink: 0,
        }}
      />
      <span style={{ marginLeft: 8, fontSize: 12, color: "var(--color-muted)" }}>
        {title}
      </span>
    </div>
  );
}
