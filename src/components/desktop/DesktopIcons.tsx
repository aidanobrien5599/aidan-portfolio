"use client";

import type { DesktopIconConfig } from "@/constants/portfolio";

interface DesktopIconsProps {
  icons: DesktopIconConfig[];
  onBrowserOpen: () => void;
  onSettingsOpen?: () => void;
  onDoomOpen?: () => void;
}

export function DesktopIcons({ icons, onBrowserOpen, onSettingsOpen, onDoomOpen }: DesktopIconsProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 28,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        zIndex: 1,
      }}
    >
      {icons.map((icon) => {
        const inner = (
          <>
            <div
              style={{
                width: 52,
                height: 52,
                background: "var(--desktop-icon-bg, rgba(255,255,255,0.06))",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
              }}
            >
              {icon.icon
                ? <img src={icon.icon} alt={icon.label} className={icon.icon.includes("github") ? "icon-invert-dark" : ""} style={{ width: 28, height: 28, objectFit: "contain" }} />
                : icon.emoji}
            </div>
            <span
              style={{
                fontSize: 10,
                color: "var(--color-body)",
                textShadow: "0 1px 3px rgba(0,0,0,0.3)",
              }}
            >
              {icon.label}
            </span>
          </>
        );
        const sharedStyle: React.CSSProperties = {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          textDecoration: "none",
          opacity: 0.7,
          transition: "opacity 0.15s",
          cursor: "pointer",
        };
        if (icon.actionType === "browser" || icon.actionType === "settings" || icon.actionType === "doom") {
          return (
            <div
              key={icon.label}
              onClick={icon.actionType === "doom" ? onDoomOpen : icon.actionType === "settings" ? onSettingsOpen : onBrowserOpen}
              style={sharedStyle}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
            >
              {inner}
            </div>
          );
        }
        return (
          <a
            key={icon.label}
            href={icon.href}
            target="_blank"
            rel="noopener noreferrer"
            style={sharedStyle}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
          >
            {inner}
          </a>
        );
      })}
    </div>
  );
}
