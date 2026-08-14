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

declare const Dos: (element: HTMLDivElement, options: { url: string; autoStart?: boolean }) => { stop: () => void };

let jsDosLoadPromise: Promise<void> | null = null;

function loadJsDos(): Promise<void> {
  if (jsDosLoadPromise) return jsDosLoadPromise;

  jsDosLoadPromise = new Promise((resolve, reject) => {
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
    script.onerror = () => {
      jsDosLoadPromise = null;
      reject(new Error("Failed to load js-dos"));
    };
    document.head.appendChild(script);
  });

  return jsDosLoadPromise;
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
        instanceRef.current = Dos(containerRef.current, { url: "/doom.jsdos", autoStart: true });
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
        borderRadius: 10,
        boxShadow: "var(--window-shadow)",
        overflow: "hidden",
        zIndex: activeZIndex,
        height: 500,
      }}
    >
      <WindowChrome
        onClose={() => wm.setState("closed")}
        onMinimize={handleMinimize}
        onMaximize={() => {}}
        onDragStart={wm.handleDragStart}
        onDoubleClick={() => {}}
        isMaximized={false}
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
