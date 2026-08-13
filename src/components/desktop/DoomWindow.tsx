"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { WindowChrome } from "./WindowChrome";
import type { useWindowManager } from "@/hooks/useWindowManager";

interface DoomWindowProps {
  wm: ReturnType<typeof useWindowManager>;
  onFocus: () => void;
  onBounce: (id: string) => void;
  activeZIndex: number;
}

declare const Dos: (element: HTMLDivElement, options: { url: string }) => { stop: () => void };

function loadJsDos(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof Dos !== "undefined") {
      resolve();
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://v8.js-dos.com/latest/js-dos.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://v8.js-dos.com/latest/js-dos.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load js-dos"));
    document.head.appendChild(script);
  });
}

export function DoomWindow({ wm, onFocus, onBounce, activeZIndex }: DoomWindowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<{ stop: () => void } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        await loadJsDos();
        if (cancelled || !containerRef.current) return;
        instanceRef.current = Dos(containerRef.current, { url: "/doom.jsdos" });
        setLoading(false);
      } catch {
        if (!cancelled) setError("Failed to load DOOM");
      }
    }

    init();

    return () => {
      cancelled = true;
      if (instanceRef.current) {
        instanceRef.current.stop();
        instanceRef.current = null;
      }
    };
  }, []);

  const handleMinimize = useCallback(() => {
    wm.minimize();
    onBounce("doom");
  }, [wm, onBounce]);

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
        height: wm.state === "maximized" ? "100%" : 500,
      }}
    >
      <WindowChrome
        onClose={() => wm.setState("closed")}
        onMinimize={handleMinimize}
        onMaximize={wm.maximize}
        onDragStart={wm.handleDragStart}
        onDoubleClick={wm.maximize}
        isMaximized={wm.state === "maximized"}
        title="DOOM"
      />

      <div
        ref={containerRef}
        style={{
          flex: 1,
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {loading && !error && (
          <span style={{
            color: "#666",
            fontSize: 13,
            fontFamily: "var(--font-mono)",
          }}>
            Loading DOOM...
          </span>
        )}
        {error && (
          <span style={{
            color: "#ff4444",
            fontSize: 13,
            fontFamily: "var(--font-mono)",
          }}>
            {error}
          </span>
        )}
      </div>
    </div>
  );
}
