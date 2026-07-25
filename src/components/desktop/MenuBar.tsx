"use client";

import type { MenuItem } from "@/constants/portfolio";

interface MenuBarProps {
  menuItems: Record<string, MenuItem[]>;
  activeMenu: string | null;
  setActiveMenu: (menu: string | null) => void;
  clock: string;
  closeMenu: () => void;
  actions: Record<string, () => void>;
}

export function MenuBar({ menuItems, activeMenu, setActiveMenu, clock, closeMenu, actions }: MenuBarProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        height: 28,
        padding: "0 12px",
        background: "var(--menubar-bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--menubar-border)",
        fontSize: 13,
        color: "var(--menubar-text)",
        flexShrink: 0,
        zIndex: 100,
        position: "relative",
        userSelect: "none",
      }}
    >
      <span
        style={{ fontWeight: 700, marginRight: 16, cursor: "default" }}
        onClick={(e) => e.stopPropagation()}
      >
        ☘
      </span>
      {Object.keys(menuItems).map((menu) => (
        <div key={menu} style={{ position: "relative" }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === menu ? null : menu);
            }}
            onMouseEnter={() => activeMenu && setActiveMenu(menu)}
            style={{
              background: activeMenu === menu ? "var(--dropdown-hover)" : "transparent",
              border: "none",
              color: "inherit",
              font: "inherit",
              fontSize: 13,
              padding: "2px 10px",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            {menu}
          </button>
          {activeMenu === menu && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                marginTop: 2,
                minWidth: 180,
                background: "var(--dropdown-bg)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderRadius: 6,
                border: "1px solid var(--dropdown-border)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                padding: "4px 0",
                zIndex: 200,
                fontSize: 13,
              }}
            >
              {menuItems[menu].map((item, i) =>
                item.divider ? (
                  <div
                    key={i}
                    style={{
                      height: 1,
                      background: "var(--dropdown-border)",
                      margin: "4px 8px",
                    }}
                  />
                ) : item.href ? (
                  <a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMenu}
                    style={{
                      display: "block",
                      padding: "4px 16px",
                      color: "var(--menubar-text)",
                      textDecoration: "none",
                      borderRadius: 3,
                      margin: "0 4px",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-accent)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    key={i}
                    onClick={() => { if (item.action) actions[item.action]?.(); closeMenu(); }}
                    style={{
                      display: "block",
                      width: "calc(100% - 8px)",
                      textAlign: "left",
                      padding: "4px 16px",
                      background: "transparent",
                      border: "none",
                      color: "var(--menubar-text)",
                      font: "inherit",
                      fontSize: 13,
                      cursor: "default",
                      borderRadius: 3,
                      margin: "0 4px",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-accent)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {item.label}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      ))}
      <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--color-muted)" }}>
        {clock}
      </span>
    </div>
  );
}
