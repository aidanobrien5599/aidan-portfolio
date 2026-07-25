"use client";

import { WindowChrome } from "./WindowChrome";
import { useTheme, backgrounds, type ThemeMode } from "@/contexts/ThemeContext";
import type { useWindowManager } from "@/hooks/useWindowManager";

interface SettingsWindowProps {
  wm: ReturnType<typeof useWindowManager>;
  onFocus: () => void;
  onBounce: (id: string) => void;
  activeZIndex: number;
}

const themeModes: { value: ThemeMode; label: string; icon: string }[] = [
  { value: "light", label: "Light", icon: "☀️" },
  { value: "dark", label: "Dark", icon: "🌙" },
  { value: "system", label: "System", icon: "💻" },
];

export function SettingsWindow({ wm, onFocus, onBounce, activeZIndex }: SettingsWindowProps) {
  const { mode, setMode, resolvedTheme, backgroundId, setBackgroundId } = useTheme();

  const handleMinimize = () => {
    wm.minimize();
    onBounce("settings");
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
      }}
    >
      <WindowChrome
        onClose={() => wm.setState("closed")}
        onMinimize={handleMinimize}
        onMaximize={wm.maximize}
        onDragStart={wm.handleDragStart}
        onDoubleClick={wm.maximize}
        isMaximized={wm.state === "maximized"}
        title={
          <>
            <span style={{ color: "var(--color-accent)" }}>☘</span>{" "}
            Settings
          </>
        }
      />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          background: "var(--color-bg)",
          padding: "24px 28px",
          fontSize: 13,
          lineHeight: 1.7,
          color: "var(--color-body)",
          overscrollBehavior: "contain",
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--color-heading)", marginBottom: 20 }}>
          Appearance
        </h2>

        <div style={{ marginBottom: 28 }}>
          <label style={{ fontSize: 12, color: "var(--color-muted)", marginBottom: 10, display: "block" }}>
            Theme
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            {themeModes.map((t) => (
              <button
                key={t.value}
                onClick={() => setMode(t.value)}
                style={{
                  flex: 1,
                  padding: "10px 8px",
                  borderRadius: 8,
                  border: `2px solid ${mode === t.value ? "var(--color-accent)" : "var(--color-border)"}`,
                  background: mode === t.value
                    ? (resolvedTheme === "dark" ? "rgba(40, 200, 64, 0.1)" : "rgba(26, 138, 58, 0.08)")
                    : "transparent",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: mode === t.value ? "var(--color-accent)" : "var(--color-body)",
                  transition: "border-color 0.15s, background 0.15s",
                }}
              >
                <span style={{ fontSize: 20 }}>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ fontSize: 12, color: "var(--color-muted)", marginBottom: 10, display: "block" }}>
            Background
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: 10 }}>
            {backgrounds.map((bg) => (
              <button
                key={bg.id}
                onClick={() => setBackgroundId(bg.id)}
                style={{
                  aspectRatio: "16/10",
                  borderRadius: 8,
                  border: `2px solid ${backgroundId === bg.id ? "var(--color-accent)" : "var(--color-border)"}`,
                  background: bg.value || (resolvedTheme === "dark" ? "#111" : "#C2C2C2"),
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  transition: "border-color 0.15s",
                }}
                title={bg.label}
              >
                {backgroundId === bg.id && (
                  <span style={{
                    position: "absolute",
                    bottom: 3,
                    right: 5,
                    fontSize: 10,
                    color: "#fff",
                    textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                  }}>
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 6, fontSize: 11, color: "var(--color-muted)" }}>
            {backgrounds.find((b) => b.id === backgroundId)?.label ?? "Default"}
          </div>
        </div>
      </div>
    </div>
  );
}
