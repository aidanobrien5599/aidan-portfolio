"use client";

import { useState, useRef, useCallback } from "react";
import type { WindowState } from "@/constants/portfolio";

type DragState = { startX: number; startY: number; origX: number; origY: number } | null;

interface UseWindowManagerConfig {
  defaultWidth: number;
  defaultHeight?: number;
  isMobile: boolean;
  mounted: boolean;
  initialState?: WindowState;
  initialOffset?: { x: number; y: number };
}

interface UseWindowManagerReturn {
  state: WindowState;
  setState: React.Dispatch<React.SetStateAction<WindowState>>;
  offset: { x: number; y: number };
  ref: React.RefObject<HTMLDivElement>;
  minimize: () => string;
  maximize: () => void;
  restore: () => void;
  close: () => void;
  open: () => void;
  resetPosition: () => void;
  handleDragStart: (e: React.MouseEvent) => void;
  getWindowStyle: () => React.CSSProperties;
}

export function useWindowManager(config: UseWindowManagerConfig): UseWindowManagerReturn {
  const { defaultWidth, isMobile, mounted, initialState = "closed", initialOffset } = config;

  const [state, setState] = useState<WindowState>(initialState);
  const [offset, setOffset] = useState(initialOffset ?? { x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState>(null);

  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      if (state === "maximized") return;
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        origX: offset.x,
        origY: offset.y,
      };
      const onMove = (ev: MouseEvent) => {
        if (!dragRef.current) return;
        const dx = ev.clientX - dragRef.current.startX;
        const dy = ev.clientY - dragRef.current.startY;
        setOffset({
          x: dragRef.current.origX + dx,
          y: dragRef.current.origY + dy,
        });
      };
      const onUp = () => {
        dragRef.current = null;
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    },
    [state, offset]
  );

  const minimize = useCallback(() => {
    setState("minimized");
    return "minimized";
  }, []);

  const maximize = useCallback(() => {
    setState((prev) => (prev === "maximized" ? "open" : "maximized"));
  }, []);

  const restore = useCallback(() => {
    setState("open");
  }, []);

  const close = useCallback(() => {
    setState("closed");
  }, []);

  const open = useCallback(() => {
    setState("open");
  }, []);

  const resetPosition = useCallback(() => {
    setOffset({ x: 0, y: 0 });
  }, []);

  const getWindowStyle = useCallback((): React.CSSProperties => {
    if (isMobile || state === "maximized") {
      return {
        position: "fixed",
        inset: 0,
        zIndex: 200,
        width: "100%",
        height: "100%",
        borderRadius: 0,
        animation: mounted ? "windowOpen 0.25s ease" : "none",
        transition: "none",
      };
    }
    if (state === "minimized" || state === "closed") {
      return {
        position: "absolute",
        left: "50%",
        bottom: "60px",
        transform: "translateX(-50%) scale(0.1)",
        opacity: 0,
        pointerEvents: "none",
        transition: "all 0.35s cubic-bezier(0.2, 0, 0, 1)",
      };
    }
    return {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
      width: `min(${defaultWidth}px, calc(100vw - 48px))`,
      maxHeight: "calc(100vh - 120px)",
      transition: "none",
    };
  }, [isMobile, state, mounted, defaultWidth, offset]);

  return {
    state,
    setState,
    offset,
    ref,
    minimize,
    maximize,
    restore,
    close,
    open,
    resetPosition,
    handleDragStart,
    getWindowStyle,
  };
}
