import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { DM_Mono } from "next/font/google";
import "./globals.css";

const clashDisplay = localFont({
  src: [
    { path: "../fonts/ClashDisplay-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/ClashDisplay-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

const generalSans = localFont({
  src: [
    { path: "../fonts/GeneralSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/GeneralSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/GeneralSans-Semibold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://joinverbatim.com",
  ),
  title: {
    default:
      "Verbatim AI Agency — AI receptionist & review automation for HVAC and trades shops",
    template: "%s · Verbatim",
  },
  description:
    "Done-for-you AI systems for owner-operator trades shops in Kitchener-Waterloo. Answer every call, grow Google reviews, fill the pipeline — while you're on the job.",
  keywords: [
    "AI receptionist HVAC",
    "Google review automation",
    "trades lead generation",
    "AI for plumbers",
    "Kitchener AI agency",
    "Verbatim AI Agency",
  ],
  authors: [{ name: "Verbatim AI Agency" }],
  openGraph: {
    title:
      "Verbatim AI Agency — AI receptionist & review automation for HVAC and trades shops",
    description:
      "Done-for-you AI systems for owner-operator trades shops. Answer every call, grow Google reviews, fill the pipeline.",
    url: "https://joinverbatim.com",
    siteName: "Verbatim AI Agency",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Verbatim AI Agency — AI for HVAC and trades shops",
    description:
      "Answer every call, grow Google reviews, fill the pipeline — while you're on the job.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0E0F11",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${clashDisplay.variable} ${generalSans.variable} ${dmMono.variable}`}
    >
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='14' fill='%230E0F11'/><text x='32' y='46' font-size='38' font-family='Georgia,serif' font-style='italic' font-weight='500' fill='%23FAFAFA' text-anchor='middle'>V</text></svg>"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
