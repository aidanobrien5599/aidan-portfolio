import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PostHogProvider } from "@/components/PostHogProvider";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

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
        className={`${inter.className} antialiased`}
        style={{
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
