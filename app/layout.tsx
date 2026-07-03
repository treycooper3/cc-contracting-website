import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "./lib/site";
import TopStrip from "./components/TopStrip";
import StickyCallBar from "./components/StickyCallBar";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "C&C Contracting | General Contractor — Residential & Commercial",
  description:
    "C&C Contracting LLC — Licensed general contractor serving Florida. Residential remodels, commercial buildouts, and specialty construction. Free estimates.",
  keywords: [
    "general contractor",
    "general contractor Melbourne FL",
    "commercial renovation",
    "residential remodeling",
    "kitchen remodel",
    "bathroom remodel",
    "tenant buildout",
    "Brevard County contractor",
    "Space Coast construction",
    "licensed contractor Florida",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "C&C Contracting | General Contractor — Residential & Commercial",
    description:
      "Licensed general contractor serving Florida. Residential remodels, commercial buildouts, and specialty construction. Free estimates.",
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "C&C Contracting",
    images: [
      {
        url: `${SITE_URL}/og.png`,
        width: 1200,
        height: 630,
        alt: "C&C Contracting — Built Right. Built to Last.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "C&C Contracting | General Contractor — Residential & Commercial",
    description:
      "Licensed general contractor serving Florida. Residential remodels, commercial buildouts, and specialty construction. Free estimates.",
    images: [`${SITE_URL}/og.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="alternate" type="text/markdown" href="/index.md" />
        <link rel="help" type="text/plain" href="/llms.txt" />
      </head>
      <body
        className={`${montserrat.variable} ${inter.variable} antialiased pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0`}
        suppressHydrationWarning
      >
        <TopStrip />
        {children}
        <StickyCallBar />
      </body>
    </html>
  );
}
