import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "Verbatim.ai — Customer interviews, synthesized.",
    template: "%s · Verbatim",
  },
  description:
    "Upload customer interview recordings. In under 5 minutes, get a citation-perfect synthesis report where every theme is backed by playable audio from the customers who said it.",
  keywords: [
    "customer interviews",
    "product management",
    "user research",
    "interview synthesis",
    "dovetail alternative",
  ],
  authors: [{ name: "Verbatim.ai" }],
  openGraph: {
    title: "Verbatim.ai — Customer interviews, synthesized.",
    description:
      "Turn customer interview recordings into citation-perfect insight reports. Every theme plays the actual audio.",
    url: "https://joinverbatim.com",
    siteName: "Verbatim",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Verbatim.ai — Customer interviews, synthesized.",
    description:
      "Turn customer interview recordings into citation-perfect insight reports. Every theme plays the actual audio.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/* SVG favicon, same one the landing page uses */}
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='14' fill='%230E0F11'/><text x='32' y='46' font-size='38' font-family='Georgia,serif' font-style='italic' font-weight='500' fill='%23FAFAFA' text-anchor='middle'>V</text></svg>"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
