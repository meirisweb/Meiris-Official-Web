import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "react/compiler-runtime": "react-compiler-runtime",
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ]
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // { key: "X-Frame-Options", value: "DENY" }, // Commented out to allow Sanity Visual Editing iframe
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
        ],
      },
    ];
  },
  async redirects() {
    const redirectsList = [
      { source: '/page/about-us', destination: '/about' },
      { source: '/page/solutions', destination: '/platform' },
      { source: '/our_approach', destination: '/platform' },
      { source: '/verticals/residential', destination: '/solutions/residential' },
      { source: '/innovation/tech-speak', destination: '/insights' },
      { source: '/page/cms-services', destination: '/products/meiris-charge' },
      { source: '/page/team', destination: '/team' },
      { source: '/page/careers', destination: '/careers' },
      { source: '/page/privacy-policy', destination: '/resources' }, // Mapped to resources, adjust if you make a dedicated privacy page
      { source: '/page/dc-chargers', destination: '/platform' },
      { source: '/verticals/fleets', destination: '/solutions/depot-infrastructure' },
      { source: '/verticals/retail-and-hospitality', destination: '/solutions/hospitality-workplace' },
      { source: '/innovation/upcoming-releases', destination: '/insights' },
      { source: '/page/charging-management-system', destination: '/products/meiris-charge' },
      { source: '/page/contact-us', destination: '/contact' },
      { source: '/page/ac-chargers', destination: '/platform' },
      { source: '/verticals/workplace', destination: '/solutions/hospitality-workplace' },
      { source: '/page/consulting', destination: '/contact' },
      { source: '/verticals/oems', destination: '/solutions/depot-infrastructure' },
      { source: '/page/charger-services', destination: '/platform' },
      { source: '/verticals/energy-storage', destination: '/platform' },
      { source: '/verticals/cpos', destination: '/solutions/charge-point-operators' },
      { source: '/page/evseoems', destination: '/solutions/charge-point-operators' },
      { source: '/page/cookie-policy', destination: '/resources' },
    ];

    // Create redirects for both the raw path and the '/es-419' prefixed path just to be 100% bulletproof
    const finalRedirects = [];
    for (const r of redirectsList) {
      finalRedirects.push({ source: r.source, destination: r.destination, permanent: true });
      finalRedirects.push({ source: `/es-419${r.source}`, destination: r.destination, permanent: true });
    }
    return finalRedirects;
  },
};

export default withNextIntl(nextConfig);
