import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'es-419'],
  defaultLocale: 'en',
  localePrefix: 'always'
});
