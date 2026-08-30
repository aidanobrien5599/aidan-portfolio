export type WindowState = "open" | "minimized" | "maximized" | "closed";

export const work = [
  { year: "2026", company: "Netflix", title: "Software Engineer Intern", note: null },
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
  icon?: string;
  bg?: string;
  border?: string;
  href?: string;
  actionType?: "terminal" | "browser" | "settings" | "doom";
};

export const dockItemsConfig: DockItemConfig[] = [
  { id: "terminal", label: "Terminal", actionType: "terminal", bg: "#1A1A1A", border: "#333" },
  { id: "browser", label: "Browser", emoji: "🌐", actionType: "browser", bg: "#3B82F6", border: "#2563EB" },
  { id: "settings", label: "Settings", emoji: "⚙️", actionType: "settings", bg: "#6B7280", border: "#4B5563" },
  { id: "doom", label: "DOOM", emoji: "💀", actionType: "doom", bg: "#8B0000", border: "#5C0000" },
  { id: "resume", label: "Resume", emoji: "📄", bg: "#E8E8E8", border: "#CCC", href: links.resume },
  { id: "sep" },
  { id: "github", label: "GitHub", icon: "/images/github.svg", bg: "var(--github-icon-bg)", border: "var(--github-icon-border)", href: links.github },
  { id: "linkedin", label: "LinkedIn", icon: "/images/icons8-linkedin-144.png", bg: "#0A66C2", border: "#0858A8", href: links.linkedin },
  { id: "chess", label: "Chess", icon: "/images/chess.png", bg: "#769656", border: "#5A7A40", href: links.chess },
];

export type DesktopIconConfig = {
  emoji?: string;
  icon?: string;
  label: string;
  href?: string;
  actionType?: "browser" | "settings" | "doom";
};

export const desktopIconsConfig: DesktopIconConfig[] = [
  { emoji: "📄", label: "resume.pdf", href: links.resume },
  { icon: "/images/github.svg", label: "GitHub", href: links.github },
  { icon: "/images/icons8-linkedin-144.png", label: "LinkedIn", href: links.linkedin },
  { icon: "/images/chess.png", label: "Chess.com", href: links.chess },
  { emoji: "🌐", label: "Browser", actionType: "browser" },
  { emoji: "⚙️", label: "Settings", actionType: "settings" },
  { emoji: "💀", label: "DOOM", actionType: "doom" },
];
