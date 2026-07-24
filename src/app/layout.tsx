import "./globals.css";
import type { Metadata } from "next";
import { PostHogProvider } from "@/components/PostHogProvider";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Aidan O'Brien",
  description: "Software engineer. Computer science at UW–Madison.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>☘️</text></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="antialiased"
        style={{
          fontFamily: "var(--font-mono)",
          backgroundColor: "var(--color-bg)",
          color: "var(--color-body)",
        }}
      >
        <PostHogProvider>
          {children}
          <Analytics />
        </PostHogProvider>
      </body>
    </html>
  );
}
