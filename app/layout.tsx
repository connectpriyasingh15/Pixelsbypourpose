import type { Metadata } from "next";
import {
  Fraunces,
  Inter,
  JetBrains_Mono,
  Archivo_Black,
  Bricolage_Grotesque,
  Newsreader,
} from "next/font/google";
import "./globals.css";
import { meta } from "@/lib/content";
import SiteFrame from "@/components/SiteFrame";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

// Art direction "Measured": Bricolage Grotesque (display), Newsreader (serif).
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-brico",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-read",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pixelsbypurpose.com"),
  title: {
    default: `${meta.title} — ${meta.name}`,
    template: `%s — ${meta.name}`,
  },
  description: meta.hero,
  keywords: [
    "Priya Singh",
    "Product Designer",
    "Enterprise UX",
    "AI Experience Design",
    "Design Systems",
    "Honeywell",
  ],
  authors: [{ name: meta.name }],
  alternates: { canonical: "/" },
  openGraph: {
    title: `${meta.title} — ${meta.name}`,
    description: meta.hero,
    type: "website",
    url: "https://pixelsbypurpose.com",
    siteName: "Pixels by Purpose",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} ${archivoBlack.variable} ${bricolage.variable} ${newsreader.variable}`}
    >
      <body className="min-h-screen bg-night font-sans text-mist antialiased">
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
