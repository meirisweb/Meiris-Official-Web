import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.siriem.com';

  const staticRoutes = [
    '',
    '/platform',
    '/products/meiris-charge',
    '/insights',
    '/about',
    '/team',
    '/careers',
    '/contact',
    '/resources',
    '/solutions/depot-infrastructure',
    '/solutions/charge-point-operators',
    '/solutions/hospitality-workplace',
    '/solutions/residential',
    '/solutions/custom-solutions',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => {
    // Generate alternate languages map for this specific route
    const languages: Record<string, string> = {};
    
    routing.locales.forEach((locale) => {
      languages[locale] = `${baseUrl}/${locale}${route}`;
    });
    
    // Add default
    languages['x-default'] = `${baseUrl}/${routing.defaultLocale}${route}`;

    // For the <loc> tag itself, we typically list the default language URL
    const locUrl = `${baseUrl}/${routing.defaultLocale}${route}`;

    return {
      url: locUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: route === '' ? 1 : 0.8,
      alternates: {
        languages,
      },
    };
  });

  return sitemapEntries;
}
