import { Metadata } from 'next';
import { routing } from '@/i18n/routing';

interface LocalizedMetadataOptions {
  locale: string;
  path: string;
  title: string;
  description?: string;
}

export function getLocalizedMetadata({
  locale,
  path,
  title,
  description,
}: LocalizedMetadataOptions): Metadata {
  const cleanPath = path === '/' ? '' : path;
  const canonicalPath = `/${locale}${cleanPath}`;

  const languages: Record<string, string> = {};
  routing.locales.forEach((l) => {
    languages[l] = `/${l}${cleanPath}`;
  });

  // x-default should point to the absolute root `/` which triggers the redirect,
  // or the default language variant. Usually pointing to the default language variant is safer if prefix is always.
  languages['x-default'] = `/${routing.defaultLocale}${cleanPath}`;

  return {
    title,
    ...(description && { description }),
    alternates: {
      canonical: canonicalPath,
      languages,
    },
  };
}
