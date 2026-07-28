import type { Metadata } from "next";
import "../../globals.css";

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import ClientLayout from "@/components/ClientLayout";
import { LenisProvider } from "../../LenisProvider";
import { headers, cookies } from 'next/headers';
import LanguagePrompt from "@/components/LanguagePrompt";
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: "Meiris — The power conversion platform for global electrification",
    description: "From fleet depots to residential grids, our vertically integrated architecture delivers precision control and unmatched efficiency across every electrification touchpoint.",
  };
}

import { client } from "@/sanity/lib/client";

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  // Providing all messages to the client
  const messages = await getMessages();
  
  // Detect GeoIP Country for Spanish Prompt
  const country = headers().get('x-vercel-ip-country') || '';
  const WHITELIST = ['AR', 'BO', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'SV', 'GT', 'HN', 'MX', 'NI', 'PA', 'PY', 'PE', 'PR', 'UY', 'VE'];
  const hasSeenPrompt = cookies().get('lang-prompt-seen')?.value === 'true';
  const showPrompt = !hasSeenPrompt && WHITELIST.includes(country);

  const mappedLocale = locale === 'en' ? 'en' : locale;

  // Fetch navbar and footer configuration based on current locale
  const navbarQuery = `*[_type == "navbar" && language == $locale][0]`;
  const navbarData = await client.fetch(navbarQuery, { locale: mappedLocale });

  const footerQuery = `*[_type == "footer" && (language == $locale || ($locale == "en" && !defined(language)))][0]`;
  const footerData = await client.fetch(footerQuery, { locale: mappedLocale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LenisProvider>
        <ClientLayout navbarData={navbarData} footerData={footerData}>{children}</ClientLayout>
        {showPrompt && <LanguagePrompt />}
      </LenisProvider>
    </NextIntlClientProvider>
  );
}
