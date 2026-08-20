import type { Metadata } from "next";
import "../../globals.css";

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import ClientLayout from "@/components/ClientLayout";
import { LenisProvider } from "../../LenisProvider";
import LanguagePrompt from "@/components/LanguagePrompt";
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: "MEIRIS — The power conversion platform for global electrification",
    description: "From fleet depots to residential grids, our vertically integrated architecture delivers precision control and unmatched efficiency across every electrification touchpoint.",
  };
}

import { sanityFetch } from "@/sanity/lib/sanityFetch";



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
  
  const mappedLocale = locale === 'en' ? 'en' : locale;

  // Fetch navbar and footer configuration based on current locale
  const navbarQuery = `*[_type == "navbar" && language == $locale][0]`;
  const navbarData = await sanityFetch<any>({ query: navbarQuery, params: { locale: mappedLocale } });

  const footerQuery = `*[_type == "footer" && (language == $locale || ($locale == "en" && !defined(language)))][0]`;
  const footerData = await sanityFetch<any>({ query: footerQuery, params: { locale: mappedLocale } });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LenisProvider>
        <ClientLayout navbarData={navbarData} footerData={footerData}>{children}</ClientLayout>
        <LanguagePrompt />
      </LenisProvider>
    </NextIntlClientProvider>
  );
}
