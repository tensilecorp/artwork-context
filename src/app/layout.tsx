import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArtView Pro – Instantly Visualize Your Artwork in Real Spaces",
  description: "Professional artwork mockups in 30 seconds. Upload your art and see it perfectly placed in living rooms, galleries, offices, and more. No studio required.",
  keywords: "AI art placement, artwork visualization, art mockups, painting placement, sculpture display, art gallery, interior design, professional art photography",
  authors: [{ name: "ArtView Pro" }],
  icons: {
    icon: [
      { url: '/favicon_32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon_64x64.png', sizes: '64x64', type: 'image/png' },
      { url: '/favicon_128x128.png', sizes: '128x128', type: 'image/png' },
      { url: '/favicon_256x256.png', sizes: '256x256', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon_128x128.png', sizes: '128x128', type: 'image/png' },
    ],
  },
  openGraph: {
    title: "ArtView Pro – Instantly Visualize Your Artwork in Real Spaces",
    description: "Professional artwork mockups in 30 seconds. Upload your art and see it perfectly placed in living rooms, galleries, offices, and more. No studio required.",
    type: "website",
    locale: "en_US",
    siteName: "ArtView Pro",
  },
  twitter: {
    card: "summary_large_image",
    title: "ArtView Pro – Instantly Visualize Your Artwork in Real Spaces",
    description: "Professional artwork mockups in 30 seconds. Upload your art and see it perfectly placed in living rooms, galleries, offices, and more. No studio required.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
