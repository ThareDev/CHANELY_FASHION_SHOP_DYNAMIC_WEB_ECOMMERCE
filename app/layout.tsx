// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/app/providers";

export const metadata: Metadata = {
  title: "Chanely — Wear Your Grace",
  description: "Chanely — Sophisticated office and everyday wear designed to make you feel confident and empowered. Explore our curated collections of tops, trousers, dresses, and accessories.",
  keywords: "Chanely, women's fashion, office wear, workwear, dresses, blouses, trousers, accessories, sophisticated style",
  openGraph: {
    title: "Chanely — Wear Your Grace",
    description: "Elevate your everyday with sophisticated styles designed to make you feel confident. Shop tops, trousers, dresses, and accessories.",
    url: "https://chanely.com",
    siteName: "Chanely",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chanely — Wear Your Grace",
    description: "Sophisticated office and everyday wear. Tops · Trousers · Dresses · Accessories.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAF7F4",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link rel="canonical" href="https://chanely.com" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}