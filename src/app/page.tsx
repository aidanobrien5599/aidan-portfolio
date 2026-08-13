"use client";

import { useState, useEffect } from "react";
import { useWindowManager } from "@/hooks/useWindowManager";
import { useClock } from "@/hooks/useClock";
import { menuItemsConfig, desktopIconsConfig, dockItemsConfig } from "@/constants/portfolio";
import { MenuBar } from "@/components/desktop/MenuBar";
import { Dock } from "@/components/desktop/Dock";
import type { DockItem } from "@/components/desktop/Dock";
import { DesktopIcons } from "@/components/desktop/DesktopIcons";
import { TerminalWindow } from "@/components/desktop/TerminalWindow";
import { BrowserWindow } from "@/components/desktop/BrowserWindow";
import { SettingsWindow } from "@/components/desktop/SettingsWindow";
import { DoomWindow } from "@/components/desktop/DoomWindow";
import { useTheme } from "@/contexts/ThemeContext";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeWindow, setActiveWindow] = useState<"terminal" | "browser" | "settings" | "doom">("terminal");
  const [bouncingIcon, setBouncingIcon] = useState<string | null>(null);

  const clock = useClock();
  const { backgroundValue } = useTheme();

  const terminal = useWindowManager({ defaultWidth: 720, isMobile, mounted, initialState: "open" });
  const browser = useWindowManager({ defaultWidth: 820, isMobile, mounted, initialState: "closed" });
  const settings = useWindowManager({ defaultWidth: 480, isMobile, mounted, initialState: "closed" });
  const doom = useWindowManager({ defaultWidth: 640, isMobile, mounted, initialState: "closed" });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    setMounted(true);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const closeMenu = () => setActiveMenu(null);

  useEffect(() => {
    if (!activeMenu) return;
    const handler = () => closeMenu();
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [activeMenu]);

  const handleBounce = (id: string) => {
    setBouncingIcon(id);
    setTimeout(() => setBouncingIcon(null), 500);
  };

  const openBrowser = () => {
    browser.open();
    setActiveWindow("browser");
  };

  const openSettings = () => {
    settings.open();
    setActiveWindow("settings");
  };

  const openDoom = () => {
    doom.open();
    setActiveWindow("doom");
  };

  const menuActions: Record<string, () => void> = {
    restore: terminal.restore,
    maximize: terminal.maximize,
    minimize: () => { terminal.minimize(); handleBounce("terminal"); },
    restoreDefault: () => { terminal.restore(); terminal.resetPosition(); },
  };

  const anyMaximized = terminal.state === "maximized" || browser.state === "maximized" || settings.state === "maximized" || doom.state === "maximized";

  const dockItems: DockItem[] = dockItemsConfig.map((cfg) => {
    if (cfg.id === "sep") return { id: "sep" };
    if (cfg.id === "terminal") {
      return {
        id: "terminal",
        label: "Terminal",
        icon: (
          <span style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
            <span style={{ fontSize: 14, color: "var(--color-accent)", fontWeight: 700, fontFamily: "var(--font-mono)" }}>&gt;_</span>
          </span>
        ),
        bg: cfg.bg,
        border: cfg.border,
        active: terminal.state === "open" || terminal.state === "maximized",
        action: () => {
          if (terminal.state === "minimized" || terminal.state === "closed") terminal.restore();
          else { terminal.minimize(); handleBounce("terminal"); }
        },
      };
    }
    if (cfg.id === "browser") {
      return {
        id: "browser",
        label: "Browser",
        icon: <span style={{ fontSize: 20 }}>🌐</span>,
        bg: cfg.bg,
        border: cfg.border,
        active: browser.state === "open" || browser.state === "maximized",
        action: () => {
          if (browser.state === "minimized" || browser.state === "closed") {
            browser.open();
            setActiveWindow("browser");
          } else {
            browser.minimize();
            handleBounce("browser");
          }
        },
      };
    }
    if (cfg.id === "settings") {
      return {
        id: "settings",
        label: "Settings",
        icon: <span style={{ fontSize: 20 }}>⚙️</span>,
        bg: cfg.bg,
        border: cfg.border,
        active: settings.state === "open" || settings.state === "maximized",
        action: () => {
          if (settings.state === "minimized" || settings.state === "closed") {
            settings.open();
            setActiveWindow("settings");
          } else {
            settings.minimize();
            handleBounce("settings");
          }
        },
      };
    }
    if (cfg.id === "doom") {
      return {
        id: "doom",
        label: "DOOM",
        icon: <span style={{ fontSize: 20 }}>💀</span>,
        bg: cfg.bg,
        border: cfg.border,
        active: doom.state === "open" || doom.state === "maximized",
        action: () => {
          if (doom.state === "minimized" || doom.state === "closed") {
            doom.open();
            setActiveWindow("doom");
          } else {
            doom.minimize();
            handleBounce("doom");
          }
        },
      };
    }
    return {
      id: cfg.id,
      label: cfg.label,
      icon: cfg.icon
        ? <img src={cfg.icon} alt={cfg.label} className={cfg.icon.includes("github") ? "icon-invert-dark" : ""} style={{ width: 22, height: 22, objectFit: "contain" }} />
        : <span style={{ fontSize: 20 }}>{cfg.emoji}</span>,
      bg: cfg.bg,
      border: cfg.border,
      href: cfg.href,
    };
  });

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: backgroundValue || "var(--desktop-bg)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-mono)",
        overflow: "hidden",
        opacity: mounted ? 1 : 0,
        transition: mounted ? "none" : "opacity 0s",
      }}
      onClick={() => activeMenu && closeMenu()}
    >
      {!isMobile && !anyMaximized && (
        <MenuBar
          menuItems={menuItemsConfig}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          clock={clock}
          closeMenu={closeMenu}
          actions={menuActions}
        />
      )}

      <div style={{ flex: 1, position: "relative" }}>
        {!isMobile && (
          <DesktopIcons icons={desktopIconsConfig} onBrowserOpen={openBrowser} onSettingsOpen={openSettings} onDoomOpen={openDoom} />
        )}

        <TerminalWindow
          wm={terminal}
          isMobile={isMobile}
          onFocus={() => setActiveWindow("terminal")}
          onBounce={handleBounce}
          activeZIndex={activeWindow === "terminal" ? 20 : 10}
        />

        {(terminal.state === "minimized" || terminal.state === "closed") &&
          browser.state !== "open" && browser.state !== "maximized" &&
          settings.state !== "open" && settings.state !== "maximized" && !isMobile && (
          <div
            style={{
              position: "absolute",
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              color: "var(--color-muted)",
              fontSize: 13,
              fontFamily: "var(--font-mono)",
              opacity: 0.6,
              pointerEvents: "none",
            }}
          >
            <div style={{ marginBottom: 4 }}>
              <span style={{ color: "var(--color-accent)", opacity: 0.5 }}>☘ ~ $ </span>
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 15,
                  background: "var(--color-accent)",
                  animation: "blink 1s step-end infinite",
                  verticalAlign: "middle",
                }}
              />
            </div>
            <div style={{ fontSize: 11, marginTop: 8, opacity: 0.5 }}>
              click the terminal in the dock ↓
            </div>
          </div>
        )}

        {browser.state !== "closed" && (
          <BrowserWindow
            wm={browser}
            onFocus={() => setActiveWindow("browser")}
            onBounce={handleBounce}
            activeZIndex={activeWindow === "browser" ? 20 : 10}
          />
        )}

        {settings.state !== "closed" && (
          <SettingsWindow
            wm={settings}
            onFocus={() => setActiveWindow("settings")}
            onBounce={handleBounce}
            activeZIndex={activeWindow === "settings" ? 20 : 10}
          />
        )}

        {doom.state !== "closed" && (
          <DoomWindow
            wm={doom}
            onFocus={() => setActiveWindow("doom")}
            onBounce={handleBounce}
            activeZIndex={activeWindow === "doom" ? 20 : 10}
          />
        )}
      </div>

      {!isMobile && !anyMaximized && (
        <Dock items={dockItems} bouncingIcon={bouncingIcon} />
      )}
    </div>
  );
}
