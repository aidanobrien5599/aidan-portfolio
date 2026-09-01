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
import { BlogFolderWindow } from "@/components/desktop/BlogFolderWindow";
import { ArticleWindow } from "@/components/desktop/ArticleWindow";
import { useTheme } from "@/contexts/ThemeContext";

type BlogWindowId = "blogFolder" | `article:${string}`;
type WindowId = "terminal" | "browser" | "settings" | "doom" | BlogWindowId;

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeWindow, setActiveWindow] = useState<WindowId>("terminal");
  const [openArticles, setOpenArticles] = useState<string[]>([]);
  const [blogZOrder, setBlogZOrder] = useState<BlogWindowId[]>([]);
  const [maximizedArticles, setMaximizedArticles] = useState<Set<string>>(new Set());
  const [articlesOpenedMaximized, setArticlesOpenedMaximized] = useState<Set<string>>(new Set());
  const [bouncingIcon, setBouncingIcon] = useState<string | null>(null);

  const clock = useClock();
  const { backgroundValue } = useTheme();

  const terminal = useWindowManager({ defaultWidth: 720, isMobile, mounted, initialState: "open" });
  const browser = useWindowManager({ defaultWidth: 820, isMobile, mounted, initialState: "closed" });
  const settings = useWindowManager({ defaultWidth: 480, isMobile, mounted, initialState: "closed" });
  const doom = useWindowManager({ defaultWidth: 640, isMobile, mounted, initialState: "closed" });
  const blogFolder = useWindowManager({ defaultWidth: 680, isMobile, mounted, initialState: "closed" });

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

  const focusBlogWindow = (id: BlogWindowId) => {
    setBlogZOrder((prev) => [...prev.filter((x) => x !== id), id]);
    setActiveWindow(id);
  };

  const openBlogFolder = () => {
    blogFolder.open();
    setBlogZOrder((prev) => (prev.includes("blogFolder") ? prev : [...prev, "blogFolder"]));
    focusBlogWindow("blogFolder");
  };

  // Opening an article while the folder is maximized (full-screen) would
  // otherwise be invisible — a floating window rendered behind an
  // equally-topmost maximized folder — so it starts maximized instead in
  // that case, taking over the screen (and, via the maximized-article URL
  // sync above, pushing /blog/<slug> the same as any other maximize).
  const openArticle = (slug: string) => {
    const isNewlyOpened = !openArticles.includes(slug);
    if (isNewlyOpened && blogFolder.state === "maximized") {
      setArticlesOpenedMaximized((prev) => (prev.has(slug) ? prev : new Set(prev).add(slug)));
    }
    setOpenArticles((prev) => (prev.includes(slug) ? prev : [...prev, slug]));
    focusBlogWindow(`article:${slug}`);
  };

  // Shared fallback: when the window named by `activeWindow` closes, activeWindow
  // must be reassigned to something still mounted — otherwise z-index tiering
  // keeps referencing a window that no longer exists. Falls back to the new
  // topmost entry in blogZOrder (the blog window now "on top"), or to "terminal"
  // if the blog cluster is now completely empty. URL cleanup is handled
  // separately by the showingMaximizedArticle-driven effect below.
  const reassignActiveWindowIfClosed = (closedId: BlogWindowId, nextZOrder: BlogWindowId[]) => {
    if (activeWindow !== closedId) return;
    setActiveWindow(nextZOrder.length > 0 ? nextZOrder[nextZOrder.length - 1] : "terminal");
  };

  const closeArticle = (slug: string) => {
    const id: BlogWindowId = `article:${slug}`;
    const nextZOrder = blogZOrder.filter((x) => x !== id);
    setOpenArticles((prev) => prev.filter((s) => s !== slug));
    setBlogZOrder(nextZOrder);
    setMaximizedArticles((prev) => {
      if (!prev.has(slug)) return prev;
      const next = new Set(prev);
      next.delete(slug);
      return next;
    });
    setArticlesOpenedMaximized((prev) => {
      if (!prev.has(slug)) return prev;
      const next = new Set(prev);
      next.delete(slug);
      return next;
    });
    reassignActiveWindowIfClosed(id, nextZOrder);
  };

  const closeBlogFolder = () => {
    blogFolder.setState("closed");
    const nextZOrder = blogZOrder.filter((x) => x !== "blogFolder");
    setBlogZOrder(nextZOrder);
    reassignActiveWindowIfClosed("blogFolder", nextZOrder);
  };

  const setArticleMaximized = (slug: string, isMaximized: boolean) => {
    setMaximizedArticles((prev) => {
      const has = prev.has(slug);
      if (isMaximized === has) return prev;
      const next = new Set(prev);
      if (isMaximized) next.add(slug); else next.delete(slug);
      return next;
    });
  };

  const isBlogClusterActive = activeWindow === "blogFolder" || activeWindow.startsWith("article:");
  const blogTierBase = isBlogClusterActive ? 20 : 10;
  const blogZIndex = (id: BlogWindowId) => blogTierBase + blogZOrder.indexOf(id);

  // The address bar only ever reflects a maximized article — a floating article
  // window (the normal, desktop-only browsing experience) doesn't touch the URL,
  // and the folder listing never does either, in any state. A maximized article
  // is effectively a full-page view, which is the only time the "/blog/<slug>"
  // URL genuinely matches what's on screen.
  const activeArticleSlug = activeWindow.startsWith("article:") ? activeWindow.slice("article:".length) : null;
  const showingMaximizedArticle = activeArticleSlug && maximizedArticles.has(activeArticleSlug) ? activeArticleSlug : null;

  useEffect(() => {
    if (showingMaximizedArticle) {
      const path = `/blog/${showingMaximizedArticle}`;
      if (window.location.pathname !== path) window.history.pushState(null, "", path);
    } else if (window.location.pathname.startsWith("/blog")) {
      window.history.pushState(null, "", "/");
    }
  }, [showingMaximizedArticle]);

  useEffect(() => {
    const onPopState = () => {
      const match = window.location.pathname.match(/^\/blog\/(.+)$/);
      if (match) {
        openArticle(match[1]);
      } else if (window.location.pathname === "/blog") {
        openBlogFolder();
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Un-maximizing a standalone article (src/components/desktop/ArticleWindow.tsx)
  // navigates here with ?article=<slug> to reveal the real desktop with that
  // article already open, floating, same as opening it from the folder. Runs
  // once on mount, then strips the query string so it doesn't linger.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const articleSlug = params.get("article");
    if (articleSlug) {
      openArticle(articleSlug);
      window.history.replaceState(null, "", "/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const menuActions: Record<string, () => void> = {
    restore: terminal.restore,
    maximize: terminal.maximize,
    minimize: () => { terminal.minimize(); handleBounce("terminal"); },
    restoreDefault: () => { terminal.restore(); terminal.resetPosition(); },
  };

  const anyMaximized =
    terminal.state === "maximized" ||
    browser.state === "maximized" ||
    settings.state === "maximized" ||
    doom.state === "maximized" ||
    blogFolder.state === "maximized" ||
    maximizedArticles.size > 0;

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
          <DesktopIcons icons={desktopIconsConfig} onBrowserOpen={openBrowser} onSettingsOpen={openSettings} onDoomOpen={openDoom} onBlogOpen={openBlogFolder} />
        )}

        <TerminalWindow
          wm={terminal}
          isMobile={isMobile}
          onFocus={() => setActiveWindow("terminal")}
          onBounce={handleBounce}
          activeZIndex={activeWindow === "terminal" ? 20 : 10}
          onOpenArticle={openArticle}
        />

        {(terminal.state === "minimized" || terminal.state === "closed") &&
          browser.state !== "open" && browser.state !== "maximized" &&
          settings.state !== "open" && settings.state !== "maximized" &&
          doom.state !== "open" && doom.state !== "maximized" &&
          blogFolder.state !== "open" && blogFolder.state !== "maximized" &&
          openArticles.length === 0 && !isMobile && (
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

        {blogFolder.state !== "closed" && (
          <BlogFolderWindow
            wm={blogFolder}
            onFocus={() => focusBlogWindow("blogFolder")}
            onClose={closeBlogFolder}
            onBounce={handleBounce}
            activeZIndex={blogZIndex("blogFolder")}
            onOpenArticle={openArticle}
          />
        )}

        {openArticles.map((slug, index) => (
          <ArticleWindow
            key={slug}
            slug={slug}
            isMobile={isMobile}
            mounted={mounted}
            initialOffset={{ x: index * 28, y: index * 28 }}
            startMaximized={articlesOpenedMaximized.has(slug)}
            onFocus={() => focusBlogWindow(`article:${slug}`)}
            onClose={() => closeArticle(slug)}
            onMaximizedChange={(isMax) => setArticleMaximized(slug, isMax)}
            activeZIndex={blogZIndex(`article:${slug}`)}
          />
        ))}
      </div>

      {!isMobile && !anyMaximized && (
        <Dock items={dockItems} bouncingIcon={bouncingIcon} />
      )}
    </div>
  );
}
