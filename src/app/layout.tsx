import "./globals.css";
import type { Metadata } from "next";
import { PostHogProvider } from "@/components/PostHogProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Aidan O'Brien",
  description: "Software engineer. Computer science at UW-Madison.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>☘️</text></svg>",
  },
};

const THEME_INIT_SCRIPT = `
(function () {
  try {
    var mode = localStorage.getItem("theme-mode");
    var theme =
      mode === "light" || mode === "dark"
        ? mode
        : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body
        className="antialiased"
        style={{
          fontFamily: "var(--font-mono)",
          backgroundColor: "var(--color-bg)",
          color: "var(--color-body)",
        }}
      >
        <ThemeProvider>
          <PostHogProvider>
            {children}
            <Analytics />
          </PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
