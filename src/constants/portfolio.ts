export type WindowState = "open" | "minimized" | "maximized" | "closed";

export const work = [
  { year: "2026", company: "Netflix", title: "Software Engineer Intern", note: "Incoming in May" },
  { year: "2025-2026", company: "Intelligible", title: "Founding Engineer", note: null },
  { year: "2025", company: "CargoLabs", title: "Software Engineer Intern", note: null },
  { year: "2024", company: "Collectwise", title: "Software Engineer Intern", note: "YC F'24" },
];

export const links = {
  github: "https://github.com/aidanobrien5599",
  linkedin: "https://www.linkedin.com/in/aidan-o-brien-393486274/",
  chess: "https://chess.com/member/aidanob917",
  email: "mailto:aob55992@gmail.com",
  resume: "/OBRIEN_AIDAN_RESUME.pdf",
  badgerbase: "https://badgerbase.app",
  marchmadness: "https://github.com/aidanobrien5599/MarchMadnessPredictor",
};

export const START_PAGE = `<!DOCTYPE html><html><head><style>
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

export type MenuItem = {
  label: string;
  action?: string;
  href?: string;
  divider?: boolean;
};

export const menuItemsConfig: Record<string, MenuItem[]> = {
  File: [
    { label: "About Aidan", action: "restore" },
    { label: "divider", divider: true },
    { label: "Open Resume", href: links.resume },
  ],
  View: [
    { label: "Maximize", action: "maximize" },
    { label: "Minimize", action: "minimize" },
    { label: "divider", divider: true },
    { label: "Restore Default", action: "restoreDefault" },
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

export type DockItemConfig = {
  id: string;
  label?: string;
  emoji?: string;
  bg?: string;
  border?: string;
  href?: string;
  actionType?: "terminal" | "browser";
};

export const dockItemsConfig: DockItemConfig[] = [
  { id: "terminal", label: "Terminal", actionType: "terminal", bg: "#1A1A1A", border: "#333" },
  { id: "browser", label: "Browser", emoji: "🌐", actionType: "browser", bg: "#3B82F6", border: "#2563EB" },
  { id: "resume", label: "Resume", emoji: "📄", bg: "#E8E8E8", border: "#CCC", href: links.resume },
  { id: "sep" },
  { id: "github", label: "GitHub", emoji: "🐙", bg: "#222", border: "#333", href: links.github },
  { id: "linkedin", label: "LinkedIn", bg: "#0A66C2", border: "#0858A8", href: links.linkedin },
  { id: "chess", label: "Chess", emoji: "♟️", bg: "#769656", border: "#5A7A40", href: links.chess },
];

export type DesktopIconConfig = {
  emoji: string;
  label: string;
  href?: string;
  actionType?: "browser";
};

export const desktopIconsConfig: DesktopIconConfig[] = [
  { emoji: "📄", label: "resume.pdf", href: links.resume },
  { emoji: "🐙", label: "GitHub", href: links.github },
  { emoji: "🔗", label: "LinkedIn", href: links.linkedin },
  { emoji: "♟️", label: "Chess.com", href: links.chess },
  { emoji: "🌐", label: "Browser", actionType: "browser" },
];
