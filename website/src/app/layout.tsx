import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { repoUrl, siteUrl, assetPath } from "@/lib/site";

import "./globals.css";

const title = "Curated Python Resources";
const description =
  "A maintained, editor-curated directory of the best Python courses, documentation, tools, and reads.";
const socialImage = "og-image.png";
const socialImageAlt =
  "Python resources for everyone: a curated directory of official docs, books, videos, and tools.";

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title: {
    default: title,
    template: "%s · learn-python",
  },
  description,
  applicationName: "learn-python / curated-resources",
  authors: [{ name: "learn-python contributors", url: repoUrl }],
  creator: "learn-python",
  keywords: [
    "Python",
    "learn Python",
    "Python resources",
    "Python courses",
    "Python documentation",
    "Python tools",
    "curated directory",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: "learn-python / curated-resources",
    title,
    description,
    url: `${siteUrl}/`,
    locale: "en_US",
    images: [
      {
        url: socialImage,
        width: 1200,
        height: 630,
        alt: socialImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [socialImage],
  },
  icons: {
    icon: assetPath("/icon.svg"),
    shortcut: assetPath("/icon.svg"),
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
  themeColor: "#F4F5F7",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      style={{ colorScheme: "light" }}
    >
      <body>
        <a
          href="#main"
          className="sr-only z-50 rounded-lg bg-surface px-3 py-2 text-sm font-medium text-ink shadow-pop focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
