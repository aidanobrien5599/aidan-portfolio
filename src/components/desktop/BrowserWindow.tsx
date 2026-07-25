"use client";

import { useRef } from "react";
import { WindowChrome } from "./WindowChrome";
import { START_PAGE } from "@/constants/portfolio";
import type { useWindowManager } from "@/hooks/useWindowManager";

interface BrowserWindowProps {
  wm: ReturnType<typeof useWindowManager>;
  navigateBrowser: (input: string) => void;
  browserUrl: string;
  browserInputUrl: string;
  setBrowserInputUrl: (url: string) => void;
  setBrowserUrl: (url: string) => void;
  onFocus: () => void;
  onBounce: (id: string) => void;
  activeZIndex: number;
}

export function BrowserWindow({
  wm,
  navigateBrowser,
  browserUrl,
  browserInputUrl,
  setBrowserInputUrl,
  setBrowserUrl,
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
    setBrowserUrl("");
    setBrowserInputUrl("");
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
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, marginLeft: 4 }}>
          <button
            onClick={(e) => { e.stopPropagation(); setBrowserUrl(""); setBrowserInputUrl(""); }}
            style={{
              background: "transparent", border: "none", color: "var(--color-muted)",
              fontSize: 14, cursor: "pointer", padding: "2px 4px", fontFamily: "inherit",
            }}
            title="Home"
          >
            🏠
          </button>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigateBrowser(browserInputUrl);
            }}
            style={{ flex: 1 }}
          >
            <input
              type="text"
              value={browserInputUrl}
              onChange={(e) => setBrowserInputUrl(e.target.value)}
              placeholder="Search or enter URL…"
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                padding: "5px 10px",
                borderRadius: 6,
                border: "1px solid var(--color-border)",
                background: "var(--color-bg)",
                color: "var(--color-body)",
                fontSize: 12,
                fontFamily: "inherit",
                outline: "none",
              }}
            />
          </form>
        </div>
      </div>

      <div style={{ flex: 1, background: "var(--color-bg)", overflow: "hidden" }}>
        <iframe
          ref={iframeRef}
          {...(browserUrl ? { src: browserUrl } : { srcDoc: START_PAGE })}
          style={{ width: "100%", height: "100%", border: "none" }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
          title="Browser"
        />
      </div>
    </div>
  );
}
