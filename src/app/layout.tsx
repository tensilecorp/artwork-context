import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArtView Pro – AI Art Gallery Mockup & Visualization Tool",
  description: "AI-powered artwork visualization in 30 seconds. Create professional art gallery mockups and see your paintings perfectly placed in real spaces. No studio required.",
  keywords: "AI art gallery mockup, AI art visualization, artwork placement, art mockups, painting placement, sculpture display, gallery visualization, interior design",
  authors: [{ name: "ArtView Pro" }],
  creator: "ArtView Pro",
  publisher: "ArtView Pro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://artviewpro.com'),
  alternates: {
    canonical: '/',
  },
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
    title: "ArtView Pro – AI Art Gallery Mockup & Visualization Tool",
    description: "AI-powered artwork visualization in 30 seconds. Create professional art gallery mockups and see your paintings perfectly placed in real spaces. No studio required.",
    url: 'https://artviewpro.com',
    type: "website",
    locale: "en_US",
    siteName: "ArtView Pro",
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'ArtView Pro - AI Art Gallery Mockup Tool',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ArtView Pro – AI Art Gallery Mockup & Visualization Tool",
    description: "AI-powered artwork visualization in 30 seconds. Create professional art gallery mockups and see your paintings perfectly placed in real spaces. No studio required.",
    creator: "@artviewpro",
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code-here',
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
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "ArtView Pro",
              "description": "AI-powered artwork visualization tool that creates professional art gallery mockups in 30 seconds. Transform your paintings and sculptures into realistic room placements.",
              "url": "https://artviewpro.com",
              "applicationCategory": "DesignApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "5.00",
                "priceCurrency": "USD",
                "description": "Launch Special: 10 AI artwork visualizations"
              },
              "creator": {
                "@type": "Organization",
                "name": "ArtView Pro",
                "url": "https://artviewpro.com"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "127"
              },
              "featureList": [
                "AI-powered artwork placement",
                "30-second processing time",
                "High-resolution downloads",
                "Multiple environment options",
                "Commercial usage rights"
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              "name": "AI Artwork Visualization",
              "description": "Professional artwork mockup and visualization service using artificial intelligence",
              "provider": {
                "@type": "Organization",
                "name": "ArtView Pro",
                "url": "https://artviewpro.com"
              },
              "areaServed": "Worldwide",
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Artwork Visualization Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "AI Artwork Placement",
                      "description": "Transform artwork photos into professional gallery mockups"
                    }
                  }
                ]
              }
            })
          }}
        />
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
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
