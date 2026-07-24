"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const work = [
  { year: "2026", company: "Netflix", title: "Software Engineer Intern", note: "Incoming in May" },
  { year: "2025-2026", company: "Intelligible", title: "Founding Engineer", note: null },
  { year: "2025", company: "CargoLabs", title: "Software Engineer Intern", note: null },
  { year: "2024", company: "Collectwise", title: "Software Engineer Intern", note: "YC F'24" },
];

const links = {
  github: "https://github.com/aidanobrien5599",
  linkedin: "https://www.linkedin.com/in/aidan-o-brien-393486274/",
  chess: "https://chess.com/member/aidanob917",
  email: "mailto:aob55992@gmail.com",
  resume: "/OBRIEN_AIDAN_RESUME.pdf",
  badgerbase: "https://badgerbase.app",
  marchmadness: "https://github.com/aidanobrien5599/MarchMadnessPredictor",
};

type WindowState = "open" | "minimized" | "maximized" | "closed";

const START_PAGE = `<!DOCTYPE html><html><head><style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#1C1C1C;color:#BABABA;font-family:ui-monospace,'SF Mono','Cascadia Code',monospace;display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;gap:24px}
@media(prefers-color-scheme:light){body{background:#FAFAFA;color:#444}input{background:#F0F0F0!important;border-color:#DDD!important;color:#333!important}input::placeholder{color:#999!important}.links a{color:#1A8A3A!important;border-color:#DDD!important}.links a:hover{background:#F0F0F0!important}h1{color:#333!important}}
h1{font-size:32px;font-weight:700;color:#F0F0F0;letter-spacing:-0.5px}
form{width:100%;max-width:480px}
input{width:100%;padding:12px 16px;border-radius:8px;border:1px solid #333;background:#252525;color:#F0F0F0;font-size:14px;font-family:inherit;outline:none;transition:border-color 0.2s}
input:focus{border-color:#28C840}
input::placeholder{color:#555}
.links{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
.links a{color:#28C840;text-decoration:none;font-size:12px;padding:6px 12px;border:1px solid #2E2E2E;border-radius:6px;transition:background 0.15s}
.links a:hover{background:#252525}
</style></head><body>
<h1>☘ Search</h1>
<form onsubmit="window.top.postMessage({type:'browser-navigate',url:this.q.value},'*');return false">
<input name="q" placeholder="Search DuckDuckGo or enter URL…" autofocus autocomplete="off"/>
</form>
<div class="links">
<a href="#" onclick="window.top.postMessage({type:'browser-navigate',url:'https://www.coolmathgames.com'},'*');return false">Cool Math Games</a>
<a href="#" onclick="window.top.postMessage({type:'browser-navigate',url:'https://aidanpobrien.com'},'*');return false">aidanpobrien.com</a>
<a href="#" onclick="window.top.postMessage({type:'browser-navigate',url:'https://en.wikipedia.org'},'*');return false">Wikipedia</a>
<a href="#" onclick="window.top.postMessage({type:'browser-navigate',url:'https://badgerbase.app'},'*');return false">BadgerBase</a>
</div>
</body></html>`;

export default function Home() {
  const [termState, setTermState] = useState<WindowState>("open");
  const [termPos, setTermPos] = useState({ x: 0, y: 0 });
  const [termSize, setTermSize] = useState({ w: 720, h: 520 });
  const [centered, setCentered] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [clock, setClock] = useState("");
  const [bouncingIcon, setBouncingIcon] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeWindow, setActiveWindow] = useState<"terminal" | "browser">("terminal");

  const [browserState, setBrowserState] = useState<WindowState>("closed");
  const [browserPos, setBrowserPos] = useState({ x: 0, y: 0 });
  const [browserCentered, setBrowserCentered] = useState(true);
  const [browserUrl, setBrowserUrl] = useState("");
  const [browserInputUrl, setBrowserInputUrl] = useState("");

  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const browserDragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const browserRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    setMounted(true);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const h = now.getHours() % 12 || 12;
      const m = String(now.getMinutes()).padStart(2, "0");
      const ampm = now.getHours() >= 12 ? "PM" : "AM";
      setClock(`${days[now.getDay()]} ${months[now.getMonth()]} ${now.getDate()}  ${h}:${m} ${ampm}`);
    };
    update();
    const id = setInterval(update, 15000);
    return () => clearInterval(id);
  }, []);

  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      if (termState === "maximized") return;
      const rect = windowRef.current?.getBoundingClientRect();
      if (!rect) return;
      if (centered) {
        setTermPos({ x: rect.left, y: rect.top });
        setCentered(false);
      }
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        origX: centered ? rect.left : termPos.x,
        origY: centered ? rect.top : termPos.y,
      };
      const onMove = (ev: MouseEvent) => {
        if (!dragRef.current) return;
        const dx = ev.clientX - dragRef.current.startX;
        const dy = ev.clientY - dragRef.current.startY;
        setTermPos({
          x: dragRef.current.origX + dx,
          y: Math.max(28, dragRef.current.origY + dy),
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
    [termState, termPos, centered]
  );

  const navigateBrowser = useCallback((input: string) => {
    let url = input.trim();
    if (!url) return;
    if (url.includes(".") && !url.includes(" ") && !url.startsWith("http")) {
      url = "https://" + url;
    } else if (!url.startsWith("http")) {
      url = "https://duckduckgo.com/?q=" + encodeURIComponent(url);
    }
    setBrowserUrl(url);
    setBrowserInputUrl(url);
  }, []);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "browser-navigate") {
        navigateBrowser(e.data.url);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [navigateBrowser]);

  const handleBrowserDragStart = useCallback(
    (e: React.MouseEvent) => {
      if (browserState === "maximized") return;
      const rect = browserRef.current?.getBoundingClientRect();
      if (!rect) return;
      if (browserCentered) {
        setBrowserPos({ x: rect.left, y: rect.top });
        setBrowserCentered(false);
      }
      browserDragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        origX: browserCentered ? rect.left : browserPos.x,
        origY: browserCentered ? rect.top : browserPos.y,
      };
      const onMove = (ev: MouseEvent) => {
        if (!browserDragRef.current) return;
        const dx = ev.clientX - browserDragRef.current.startX;
        const dy = ev.clientY - browserDragRef.current.startY;
        setBrowserPos({
          x: browserDragRef.current.origX + dx,
          y: Math.max(28, browserDragRef.current.origY + dy),
        });
      };
      const onUp = () => {
        browserDragRef.current = null;
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    },
    [browserState, browserPos, browserCentered]
  );

  const openBrowser = () => {
    setBrowserState("open");
    setBrowserUrl("");
    setBrowserInputUrl("");
    setActiveWindow("browser");
  };

  const minimizeBrowser = () => {
    setBrowserState("minimized");
    setBouncingIcon("browser");
    setTimeout(() => setBouncingIcon(null), 500);
  };

  const maximizeBrowser = () => {
    if (browserState === "maximized") {
      setBrowserState("open");
    } else {
      setBrowserState("maximized");
    }
  };

  const getBrowserWindowStyle = (): React.CSSProperties => {
    if (isMobile || browserState === "maximized") {
      return {
        position: "fixed",
        inset: 0,
        zIndex: 200,
        width: "100%",
        height: "100%",
        borderRadius: 0,
        animation: mounted ? "windowOpen 0.25s ease" : "none",
      };
    }
    if (browserState === "minimized" || browserState === "closed") {
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
    if (browserCentered) {
      return {
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: "min(820px, calc(100vw - 48px))",
        maxHeight: "calc(100vh - 140px)",
      };
    }
    return {
      position: "absolute",
      left: browserPos.x,
      top: browserPos.y,
      width: 820,
      maxHeight: "calc(100vh - 100px)",
    };
  };

  const minimize = () => {
    setTermState("minimized");
    setBouncingIcon("terminal");
    setTimeout(() => setBouncingIcon(null), 500);
  };

  const maximize = () => {
    if (termState === "maximized") {
      setTermState("open");
    } else {
      setTermState("maximized");
    }
  };

  const restore = () => {
    setTermState("open");
  };

  const closeMenu = () => setActiveMenu(null);

  useEffect(() => {
    const handler = () => closeMenu();
    if (activeMenu) {
      document.addEventListener("click", handler);
      return () => document.removeEventListener("click", handler);
    }
  }, [activeMenu]);

  const menuItems: Record<string, { label: string; action?: () => void; href?: string; divider?: boolean }[]> = {
    File: [
      { label: "About Aidan", action: () => { restore(); } },
      { label: "divider", divider: true },
      { label: "Open Resume", href: links.resume },
    ],
    View: [
      { label: "Maximize", action: maximize },
      { label: "Minimize", action: minimize },
      { label: "divider", divider: true },
      { label: "Restore Default", action: () => { setTermState("open"); setCentered(true); } },
    ],
    Go: [
      { label: "GitHub", href: links.github },
      { label: "LinkedIn", href: links.linkedin },
      { label: "Chess.com", href: links.chess },
      { label: "divider", divider: true },
      { label: "BadgerBase", href: links.badgerbase },
    ],
    Help: [
      { label: "Email Aidan", href: links.email },
    ],
  };

  const getWindowStyle = (): React.CSSProperties => {
    if (isMobile || termState === "maximized") {
      return {
        position: "fixed",
        inset: 0,
        zIndex: 200,
        width: "100%",
        height: "100%",
        borderRadius: 0,
        animation: mounted ? "windowOpen 0.25s ease" : "none",
      };
    }
    if (termState === "minimized" || termState === "closed") {
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
    if (centered) {
      return {
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: `min(${termSize.w}px, calc(100vw - 48px))`,
        maxHeight: "calc(100vh - 140px)",
      };
    }
    return {
      position: "absolute",
      left: termPos.x,
      top: termPos.y,
      width: termSize.w,
      maxHeight: "calc(100vh - 100px)",
    };
  };

  const desktopIcons = [
    { emoji: "📄", label: "resume.pdf", href: links.resume },
    { emoji: "🐙", label: "GitHub", href: links.github },
    { emoji: "🔗", label: "LinkedIn", href: links.linkedin },
    { emoji: "♟️", label: "Chess.com", href: links.chess },
    { emoji: "🌐", label: "Browser", action: openBrowser },
  ];

  const dockItems = [
    {
      id: "terminal",
      label: "Terminal",
      icon: (
        <span style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
          <span style={{ fontSize: 14, color: "var(--color-accent)", fontWeight: 700, fontFamily: "var(--font-mono)" }}>&gt;_</span>
        </span>
      ),
      bg: "#1A1A1A",
      border: "#333",
      active: termState === "open" || termState === "maximized",
      action: () => {
        if (termState === "minimized" || termState === "closed") restore();
        else minimize();
      },
    },
    {
      id: "browser",
      label: "Browser",
      icon: <span style={{ fontSize: 20 }}>🌐</span>,
      bg: "#3B82F6",
      border: "#2563EB",
      active: browserState === "open" || browserState === "maximized",
      action: () => {
        if (browserState === "minimized" || browserState === "closed") {
          setBrowserState("open");
          setActiveWindow("browser");
        } else {
          minimizeBrowser();
        }
      },
    },
    { id: "resume", label: "Resume", icon: <span style={{ fontSize: 20 }}>📄</span>, bg: "#E8E8E8", border: "#CCC", href: links.resume },
    { id: "sep" },
    { id: "github", label: "GitHub", icon: <span style={{ fontSize: 20 }}>🐙</span>, bg: "#222", border: "#333", href: links.github },
    { id: "linkedin", label: "LinkedIn", icon: <span style={{ color: "white", fontSize: 14, fontWeight: 700 }}>in</span>, bg: "#0A66C2", border: "#0858A8", href: links.linkedin },
    { id: "chess", label: "Chess", icon: <span style={{ fontSize: 20 }}>♟️</span>, bg: "#769656", border: "#5A7A40", href: links.chess },
  ];

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "var(--desktop-bg)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-mono)",
        overflow: "hidden",
        opacity: mounted ? 1 : 0,
        transition: mounted ? "none" : "opacity 0s",
      }}
      onClick={() => activeMenu && closeMenu()}
    >
      {/* ── Menu bar ── */}
      {!isMobile && termState !== "maximized" && browserState !== "maximized" && (
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
                        onClick={() => { item.action?.(); closeMenu(); }}
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
      )}

      {/* ── Desktop area ── */}
      <div style={{ flex: 1, position: "relative" }}>
        {/* Desktop icons */}
        {!isMobile && (
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
            {desktopIcons.map((icon) => {
              const inner = (
                <>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 26,
                    }}
                  >
                    {icon.emoji}
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
              if (icon.action) {
                return (
                  <div
                    key={icon.label}
                    onClick={icon.action}
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
        )}

        {/* Terminal window */}
        <div
          ref={windowRef}
          onMouseDown={() => setActiveWindow("terminal")}
          style={{
            ...getWindowStyle(),
            display: "flex",
            flexDirection: "column",
            borderRadius: termState === "maximized" || isMobile ? 0 : 10,
            boxShadow: termState === "maximized" || isMobile ? "none" : "var(--window-shadow)",
            overflow: "hidden",
            zIndex: termState === "maximized" ? 200 : activeWindow === "terminal" ? 20 : 10,
          }}
        >
          {/* Window titlebar */}
          <div
            onMouseDown={handleDragStart}
            onDoubleClick={maximize}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: isMobile ? "12px 14px" : "10px 16px",
              background: "var(--titlebar-bg)",
              borderBottom: "1px solid var(--color-border)",
              flexShrink: 0,
              cursor: termState === "maximized" ? "default" : "grab",
              userSelect: "none",
            }}
          >
            <span
              onClick={(e) => { e.stopPropagation(); setTermState("closed"); }}
              style={{
                width: 12, height: 12, borderRadius: "50%",
                background: "var(--color-dot-r)", cursor: "pointer",
                flexShrink: 0,
              }}
            />
            <span
              onClick={(e) => { e.stopPropagation(); minimize(); }}
              style={{
                width: 12, height: 12, borderRadius: "50%",
                background: "var(--color-dot-y)", cursor: "pointer",
                flexShrink: 0,
              }}
            />
            <span
              onClick={(e) => { e.stopPropagation(); maximize(); }}
              style={{
                width: 12, height: 12, borderRadius: "50%",
                background: "var(--color-dot-g)", cursor: "pointer",
                flexShrink: 0,
              }}
            />
            <span style={{ marginLeft: 8, fontSize: 12, color: "var(--color-muted)" }}>
              <span style={{ color: "var(--color-accent)" }}>☘</span>{" "}
              aidan-obrien{" "}
              <span style={{ opacity: 0.3 }}>/</span>{" "}
              <span style={{ color: "var(--color-accent)" }}>portfolio</span>
            </span>
          </div>

          {/* Window body */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              background: "var(--color-bg)",
              padding: isMobile ? "24px 20px" : "32px 36px",
              fontSize: 14,
              lineHeight: 1.7,
              color: "var(--color-body)",
              cursor: "text",
              overscrollBehavior: "contain",
            }}
          >
            <header style={{ marginBottom: 28 }}>
              <h1
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "var(--color-heading)",
                  marginBottom: 4,
                }}
              >
                Aidan O&apos;Brien{" "}
                <span style={{ color: "var(--color-accent)", fontSize: 20 }}>☘</span>
              </h1>
              <p style={{ color: "var(--color-muted)", fontSize: 13 }}>
                <span style={{ color: "var(--color-accent)", opacity: 0.5 }}>~ $ </span>
                Software engineer. CS @ UW–Madison.
              </p>
            </header>

            <section style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 14, lineHeight: 1.8 }}>
                <img
                  src="/images/headshot.jpeg"
                  alt="Aidan O'Brien"
                  style={{
                    width: isMobile ? 140 : 160,
                    height: isMobile ? 140 : 160,
                    borderRadius: "50%",
                    objectFit: "cover",
                    float: isMobile ? "none" : "right",
                    margin: isMobile ? "0 auto 16px" : "0 0 8px 20px",
                    display: isMobile ? "block" : "inline",
                  }}
                />
                <p>
                  I&apos;m an incoming software engineer intern at{" "}
                  <span style={{ color: "var(--color-heading)", fontWeight: 700 }}>Netflix</span>,
                  joining the Retention team this summer. Before that I was a founding
                  engineer at{" "}
                  <span style={{ color: "var(--color-heading)", fontWeight: 700 }}>Intelligible</span>,
                  building data connectors for an early-stage AI company.
                </p>
                <p style={{ marginTop: 10 }}>
                  I&apos;ve also interned at{" "}
                  <span style={{ color: "var(--color-heading)", fontWeight: 700 }}>CargoLabs</span> and{" "}
                  <span style={{ color: "var(--color-heading)", fontWeight: 700 }}>Collectwise</span>{" "}
                  (YC F&apos;24), a YC agentic debt collection startup backed by 1984 Ventures.
                </p>
                <p style={{ marginTop: 10 }}>
                  When I&apos;m not coding I&apos;m on the mat training BJJ or losing
                  rating on chess.com.
                </p>
              </div>
            </section>

            <Section title="Work">
              {work.map((job, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 16,
                    fontSize: 13,
                    lineHeight: 1.7,
                    marginTop: i > 0 ? 4 : 0,
                  }}
                >
                  <span
                    style={{
                      color: "var(--color-heading)",
                      fontWeight: 600,
                      width: 80,
                      flexShrink: 0,
                      whiteSpace: "nowrap",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {job.year}
                  </span>
                  <span>
                    {job.company} · {job.title}
                    {job.note && (
                      <span style={{ fontSize: 11, color: "var(--color-accent)", marginLeft: 6 }}>
                        {job.note}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </Section>

            <Section title="Projects">
              <div style={{ marginBottom: 14 }}>
                <a
                  href={links.badgerbase}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--color-accent)", textDecoration: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                >
                  BadgerBase
                </a>
                <p style={{ marginTop: 4, fontSize: 13 }}>
                  A course discovery tool for UW–Madison students. 2,000+ users use it
                  to find, compare, and plan courses. Built with Next.js on top of a
                  custom data pipeline scraping Madgrades, RateMyProfessor, and the
                  university&apos;s course catalog.
                </p>
              </div>
              <div>
                <a
                  href={links.marchmadness}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--color-accent)", textDecoration: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                >
                  March Madness Predictor
                </a>
                <p style={{ marginTop: 4, fontSize: 13 }}>
                  My annual attempt to crack March Madness with historical data. Proud
                  winner of the $100 grand prize in my Jersey Shore friends&apos; 2026 pool.
                </p>
              </div>
            </Section>

            <Section title="Writing">
              <p style={{ color: "var(--color-muted)" }}>Nothing here yet.</p>
            </Section>

            <Section title="Contact">
              <a
                href={links.email}
                style={{ color: "var(--color-accent)", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
              >
                aob55992@gmail.com
              </a>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  fontSize: 12,
                  color: "var(--color-muted)",
                  marginTop: 8,
                }}
              >
                {[
                  { label: "GitHub", href: links.github },
                  { label: "LinkedIn", href: links.linkedin },
                  { label: "Chess.com", href: links.chess },
                  { label: "Resume", href: links.resume },
                ].map((l, i) => (
                  <span key={l.label}>
                    {i > 0 && <span style={{ opacity: 0.3, marginRight: 12 }}>·</span>}
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--color-muted)", textDecoration: "none", transition: "color 0.15s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-muted)")}
                    >
                      {l.label}
                    </a>
                  </span>
                ))}
              </div>
            </Section>

            <footer
              style={{
                paddingTop: 16,
                marginTop: 8,
                borderTop: "1px solid var(--color-border)",
                fontSize: 11,
                color: "var(--color-muted)",
              }}
            >
              {new Date().getFullYear()} — Aidan O&apos;Brien v3
            </footer>
          </div>
        </div>

        {/* Minimized hint */}
        {(termState === "minimized" || termState === "closed") && browserState !== "open" && browserState !== "maximized" && !isMobile && (
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

        {/* Browser window */}
        {browserState !== "closed" && (
          <div
            ref={browserRef}
            onMouseDown={() => setActiveWindow("browser")}
            style={{
              ...getBrowserWindowStyle(),
              display: "flex",
              flexDirection: "column",
              borderRadius: browserState === "maximized" ? 0 : 10,
              boxShadow: browserState === "maximized" ? "none" : "var(--window-shadow)",
              overflow: "hidden",
              zIndex: browserState === "maximized" ? 200 : activeWindow === "browser" ? 20 : 10,
              height: browserState === "maximized" ? "100%" : 560,
            }}
          >
            {/* Browser titlebar */}
            <div
              onMouseDown={handleBrowserDragStart}
              onDoubleClick={maximizeBrowser}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 16px",
                background: "var(--titlebar-bg)",
                borderBottom: "1px solid var(--color-border)",
                flexShrink: 0,
                cursor: browserState === "maximized" ? "default" : "grab",
                userSelect: "none",
              }}
            >
              <span
                onClick={(e) => { e.stopPropagation(); setBrowserState("closed"); setBrowserUrl(""); setBrowserInputUrl(""); }}
                style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--color-dot-r)", cursor: "pointer", flexShrink: 0 }}
              />
              <span
                onClick={(e) => { e.stopPropagation(); minimizeBrowser(); }}
                style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--color-dot-y)", cursor: "pointer", flexShrink: 0 }}
              />
              <span
                onClick={(e) => { e.stopPropagation(); maximizeBrowser(); }}
                style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--color-dot-g)", cursor: "pointer", flexShrink: 0 }}
              />
              {/* URL bar */}
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, marginLeft: 4 }}>
                <button
                  onClick={(e) => { e.stopPropagation(); setBrowserUrl(""); setBrowserInputUrl(""); }}
                  style={{
                    background: "transparent", border: "none", color: "var(--color-muted)",
                    fontSize: 14, cursor: "pointer", padding: "2px 4px", fontFamily: "inherit",
                  }}
                  title="Home"
                >
                  🏠
                </button>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    navigateBrowser(browserInputUrl);
                  }}
                  style={{ flex: 1 }}
                >
                  <input
                    type="text"
                    value={browserInputUrl}
                    onChange={(e) => setBrowserInputUrl(e.target.value)}
                    placeholder="Search or enter URL…"
                    onMouseDown={(e) => e.stopPropagation()}
                    style={{
                      width: "100%",
                      padding: "5px 10px",
                      borderRadius: 6,
                      border: "1px solid var(--color-border)",
                      background: "var(--color-bg)",
                      color: "var(--color-body)",
                      fontSize: 12,
                      fontFamily: "inherit",
                      outline: "none",
                    }}
                  />
                </form>
              </div>
            </div>

            {/* Browser body */}
            <div style={{ flex: 1, background: "var(--color-bg)", overflow: "hidden" }}>
              <iframe
                ref={iframeRef}
                {...(browserUrl ? { src: browserUrl } : { srcDoc: START_PAGE })}
                style={{ width: "100%", height: "100%", border: "none" }}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
                title="Browser"
                onLoad={() => {
                  if (!browserUrl || !iframeRef.current) return;
                  try {
                    const doc = iframeRef.current.contentDocument;
                    if (doc && doc.title === "" && doc.body && doc.body.children.length === 0) {
                      window.open(browserUrl, "_blank");
                      setBrowserUrl("");
                      setBrowserInputUrl("");
                    }
                  } catch {
                    window.open(browserUrl, "_blank");
                    setBrowserUrl("");
                    setBrowserInputUrl("");
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Dock ── */}
      {!isMobile && termState !== "maximized" && browserState !== "maximized" && (
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
            {dockItems.map((item) => {
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
              const el = (
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
              return el;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 24 }}>
      <h2
        style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase" as const,
          color: "var(--color-accent)",
          marginBottom: 14,
        }}
      >
        <span style={{ color: "var(--color-muted)", fontWeight: 400 }}>$ </span>
        {title}
      </h2>
      {children}
    </section>
  );
}
