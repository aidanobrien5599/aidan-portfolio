"use client";

import { useRef } from "react";
import type { useWindowManager } from "@/hooks/useWindowManager";

const SCRAMJET_URL = "https://scramjet-app-production-1e06.up.railway.app";

interface BrowserWindowProps {
  wm: ReturnType<typeof useWindowManager>;
  onFocus: () => void;
  onBounce: (id: string) => void;
  activeZIndex: number;
}

export function BrowserWindow({
  wm,
  onFocus,
  onBounce,
  activeZIndex,
}: BrowserWindowProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleMinimize = () => {
    wm.minimize();
    onBounce("browser");
  };

  const handleClose = () => {
    wm.setState("closed");
  };

  const handleHome = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (iframeRef.current) {
      iframeRef.current.src = SCRAMJET_URL;
    }
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
        height: wm.state === "maximized" ? "100%" : 560,
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
          onClick={(e) => { e.stopPropagation(); handleMinimize(); }}
          style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--color-dot-y)", cursor: "pointer", flexShrink: 0 }}
        />
        <span
          onClick={(e) => { e.stopPropagation(); wm.maximize(); }}
          style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--color-dot-g)", cursor: "pointer", flexShrink: 0 }}
        />
        <button
          onClick={handleHome}
          style={{
            background: "transparent", border: "none", color: "var(--color-muted)",
            fontSize: 14, cursor: "pointer", padding: "2px 4px", fontFamily: "inherit",
            marginLeft: 4,
          }}
          title="Home"
        >
          🏠
        </button>
      </div>

      <div style={{ flex: 1, background: "var(--color-bg)", overflow: "hidden" }}>
        <iframe
          ref={iframeRef}
          src={SCRAMJET_URL}
          style={{ width: "100%", height: "100%", border: "none" }}
          title="Browser"
        />
      </div>
    </div>
  );
}
