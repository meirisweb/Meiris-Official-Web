import { Metadata } from 'next';
import { ReactNode } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';
import { getLocale } from 'next-intl/server';
import { draftMode } from 'next/headers';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.siriem.com'),
  title: {
    default: "MEIRIS | Innovative Electrification Solutions",
    template: "%s | MEIRIS"
  },
  description: "Meiris, previously known as SIRIEM, provides cutting-edge electrification solutions, power infrastructure, and technological innovation.",
  keywords: ["Meiris", "SIRIEM", "SIRI", "Electrification", "Power Solutions", "Infrastructure", "Technology"],
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "YOUR_GOOGLE_VERIFICATION_CODE",
  },
  other: {
    google: 'notranslate',
  },
};
import { DM_Sans, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  weight: ["400"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["700"],
});

import VisualEditingWrapper from '@/components/VisualEditingWrapper';
import { Toaster } from '@/components/ui/sonner';
import CookieConsent from '@/components/ui/CookieConsent';

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default async function RootLayout({ children }: { children: ReactNode }) {
  let locale = 'en';
  try {
    locale = await getLocale();
  } catch (e) {
    // Fallback for non-i18n routes like /studio
  }

  const isDraft = draftMode().isEnabled;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://www.siriem.com/#organization',
        name: 'Meiris',
        url: 'https://www.siriem.com',
        logo: 'https://www.siriem.com/favicon.ico',
        description:
          'Meiris, previously known as SIRIEM, provides cutting-edge electrification solutions, power infrastructure, and technological innovation.',
      },
      {
        '@type': 'WebSite',
        '@id': 'https://www.siriem.com/#website',
        url: 'https://www.siriem.com',
        name: 'Meiris',
        publisher: {
          '@id': 'https://www.siriem.com/#organization',
        },
      },
    ],
  };

  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-XXXXXXXXXX";

  return (
    <html lang={locale} translate="no" className={`${dmSans.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        {isDraft && <VisualEditingWrapper />}
        <Toaster />
        <CookieConsent />
        {gaId && <GoogleAnalytics gaId={gaId} />}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
