"use client";

import type { ReactNode } from "react";

export interface DockItem {
  id: string;
  label?: string;
  icon?: ReactNode;
  bg?: string;
  border?: string;
  active?: boolean;
  action?: () => void;
  href?: string;
}

interface DockProps {
  items: DockItem[];
  bouncingIcon: string | null;
}

export function Dock({ items, bouncingIcon }: DockProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "6px 0 8px",
        flexShrink: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 4,
          padding: "4px 8px",
          background: "var(--dock-bg)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: 16,
          border: "1px solid var(--dock-border)",
          userSelect: "none",
        }}
      >
        {items.map((item) => {
          if (item.id === "sep") {
            return (
              <div
                key="sep"
                style={{
                  width: 1,
                  height: 32,
                  background: "var(--dock-border)",
                  margin: "0 4px",
                  alignSelf: "center",
                }}
              />
            );
          }
          return (
            <div
              key={item.id}
              title={item.label}
              onClick={(e) => {
                e.stopPropagation();
                if (item.action) item.action();
                else if (item.href) window.open(item.href, "_blank");
              }}
              style={{
                width: 46,
                height: 46,
                borderRadius: 11,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                background: item.bg,
                border: `1px solid ${item.border}`,
                position: "relative",
                transition: "transform 0.2s ease",
                animation: bouncingIcon === item.id ? "bounce 0.5s ease" : "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.2) translateY(-6px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1) translateY(0)";
              }}
            >
              {item.icon}
              {item.active && (
                <span
                  style={{
                    position: "absolute",
                    bottom: -6,
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "var(--color-accent)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
