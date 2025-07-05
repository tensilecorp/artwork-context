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
  title: "Artwork Context - AI-Powered Art Placement Visualization",
  description: "Transform your artwork with AI. Upload photos of paintings or sculptures and see them perfectly placed in beautiful contexts - galleries, homes, and custom environments.",
  keywords: "AI art placement, artwork visualization, art context, painting placement, sculpture display, art gallery, interior design",
  authors: [{ name: "Artwork Context" }],
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
    title: "Artwork Context - AI-Powered Art Placement",
    description: "Transform your artwork with AI. See your paintings and sculptures in beautiful contexts.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Artwork Context - AI-Powered Art Placement",
    description: "Transform your artwork with AI. See your paintings and sculptures in beautiful contexts.",
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
