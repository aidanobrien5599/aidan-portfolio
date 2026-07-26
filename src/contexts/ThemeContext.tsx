"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

export type ThemeMode = "light" | "dark" | "system";

export type DesktopBackground = {
  id: string;
  label: string;
  value: string;
};

export const backgrounds: DesktopBackground[] = [
  { id: "default", label: "Default", value: "" },
  { id: "shamrock", label: "Shamrock", value: "linear-gradient(135deg, #0a3d0a 0%, #1a8a3a 50%, #28c840 100%)" },
  { id: "ocean", label: "Ocean", value: "linear-gradient(135deg, #0c2d48 0%, #145da0 50%, #2e8bc0 100%)" },
  { id: "sunset", label: "Sunset", value: "linear-gradient(135deg, #2d1b69 0%, #c84b31 50%, #f4a261 100%)" },
  { id: "midnight", label: "Midnight", value: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" },
  { id: "rose", label: "Rose", value: "linear-gradient(135deg, #3d0c11 0%, #8e2244 50%, #c45c8a 100%)" },
  { id: "arctic", label: "Arctic", value: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 50%, #a8c0ff 100%)" },
];

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  resolvedTheme: "light" | "dark";
  backgroundId: string;
  setBackgroundId: (id: string) => void;
  backgroundValue: string;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [backgroundId, setBgId] = useState("default");
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme-mode") as ThemeMode | null;
    if (saved && ["light", "dark", "system"].includes(saved)) setModeState(saved);

    const savedBg = localStorage.getItem("desktop-bg");
    if (savedBg) setBgId(savedBg);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemPrefersDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
    mq.addEventListener("change", handler);
    setHydrated(true);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const resolvedTheme: "light" | "dark" =
    mode === "system" ? (systemPrefersDark ? "dark" : "light") : mode;

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, [resolvedTheme, hydrated]);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    localStorage.setItem("theme-mode", m);
  }, []);

  const setBackgroundId = useCallback((id: string) => {
    setBgId(id);
    localStorage.setItem("desktop-bg", id);
  }, []);

  const backgroundValue = backgrounds.find((b) => b.id === backgroundId)?.value ?? "";

  return (
    <ThemeContext.Provider value={{ mode, setMode, resolvedTheme, backgroundId, setBackgroundId, backgroundValue }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
