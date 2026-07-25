"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { START_PAGE } from "@/constants/portfolio";
import type { useWindowManager } from "@/hooks/useWindowManager";

const SCRAMJET_URL = "https://scramjet-app-production-1e06.up.railway.app";

interface BrowserWindowProps {
  wm: ReturnType<typeof useWindowManager>;
  browserInputUrl: string;
  setBrowserInputUrl: (url: string) => void;
  onFocus: () => void;
  onBounce: (id: string) => void;
  activeZIndex: number;
}

export function BrowserWindow({
  wm,
  browserInputUrl,
  setBrowserInputUrl,
  onFocus,
  onBounce,
  activeZIndex,
}: BrowserWindowProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [showStartPage, setShowStartPage] = useState(true);

  const handleMinimize = () => {
    wm.minimize();
    onBounce("browser");
  };

  const handleClose = () => {
    wm.setState("closed");
    setBrowserInputUrl("");
    setShowStartPage(true);
  };

  const handleHome = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBrowserInputUrl("");
    setShowStartPage(true);
  };

  const handleNavigate = useCallback((input: string) => {
    let url = input.trim();
    if (!url) return;
    if (url.includes(".") && !url.includes(" ") && !url.startsWith("http")) {
      url = "https://" + url;
    } else if (!url.startsWith("http")) {
      url = "https://duckduckgo.com/?q=" + encodeURIComponent(url);
    }
    setBrowserInputUrl(url);
    setShowStartPage(false);
  }, [setBrowserInputUrl]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "browser-navigate") handleNavigate(e.data.url);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [handleNavigate]);

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
            onClick={handleHome}
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
              handleNavigate(browserInputUrl);
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

      <div style={{ flex: 1, background: "var(--color-bg)", overflow: "hidden", position: "relative" }}>
        {showStartPage && (
          <iframe
            srcDoc={START_PAGE}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              width: "100%",
              height: "100%",
              border: "none",
            }}
            title="Start Page"
          />
        )}
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
