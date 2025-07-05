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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]);var n=t;if("undefined"!=typeof e)try{n=t[e]}catch(t){return}var p=n;if("function"==typeof p)return function(){p.apply(this,arguments)}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
              posthog.init('${process.env.NEXT_PUBLIC_POSTHOG_KEY || 'phc_placeholder'}',{api_host:'${process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'}'})
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
