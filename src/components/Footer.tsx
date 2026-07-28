import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import styles from './Footer.module.css';

const getIcon = (platform: string) => {
  if (!platform || typeof platform !== 'string') return platform;
  const p = platform.trim().toLowerCase();
  const normalized = p.replace(/[^a-z0-9]/gi, '');
  
  if (p.includes('linkedin')) {
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>;
  }
  if (normalized === 'x' || p.includes('twitter') || p === 'x') {
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
  }
  if (p.includes('instagram')) {
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
  }
  if (p.includes('facebook')) {
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>;
  }
  if (p.includes('youtube')) {
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
  }
  
  return <span style={{color: 'red'}}>TXT: {platform}</span>;
};

export default function Footer({ data }: { data?: any }) {
  const currentLocale = useLocale();
  const localePath = (rawPath?: string) => {
    if (!rawPath || rawPath === '#') return '#';
    let path = rawPath.trim();
    // Strip out any domain (e.g. http://localhost:3000 or https://meiris.com)
    path = path.replace(/^(?:https?:\/\/[^\/]+)/i, '');
    // Strip existing locale prefixes (/en, /es-419, /es) at the start of the path
    path = path.replace(/^\/(?:en|es-419|es)(?=\/|$)/i, '');
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    if (path === '/') {
      return `/${currentLocale}`;
    }
    return `/${currentLocale}${path}`.replace(/\/\/+/g, '/');
  };

  const socialLinks = data?.socialLinks || [
    { _key: 'linkedin', platform: 'LinkedIn', url: 'https://www.linkedin.com/company/siriem/?originalSubdomain=in' },
    { _key: 'x', platform: 'X', url: 'https://x.com/SIRIEMPL' }
  ];
  const contactDetails = data?.contactDetails || {
    email: 'info@siriem.com',
    phone: '',
    address: ''
  };
  const copyright = data?.copyright || `© 2026 MEIRIS. All rights reserved.`;

  // Default link groups if data not available
  const linkGroups = data?.linkGroups || [
    {
      _key: 'home', title: 'Home', links: [
        { _key: 'h1', label: 'Home', href: '/' }
      ]
    },
    {
      _key: 'platform', title: 'Platform', links: [
        { _key: 'p1', label: 'Platform', href: '/platform' }
      ]
    },
    {
      _key: 'products', title: 'Products', links: [
        { _key: 'pr1', label: 'MEIRIS Charge', href: '/products/meiris-charge' }
      ]
    },
    {
      _key: 'solutions', title: 'Solutions', links: [
        { _key: 's1', label: 'Automotive', href: '/solutions/automotive' },
        { _key: 's2', label: 'Industrial', href: '/solutions/industrial' },
        { _key: 's3', label: 'Commercial', href: '/solutions/commercial' },
        { _key: 's4', label: 'Residential', href: '/solutions/residential' },
        { _key: 's5', label: 'Marine', href: '/solutions/marine' },
      ]
    },
    {
      _key: 'insights', title: 'Insights', links: [
        { _key: 'i1', label: 'News', href: '/insights/news' },
        { _key: 'i2', label: 'Events', href: '/insights/events' },
      ]
    },
    {
      _key: 'about', title: 'About', links: [
        { _key: 'a1', label: 'Company', href: '/about/company' },
        { _key: 'a2', label: 'Leadership', href: '/about/leadership' },
        { _key: 'a3', label: 'Careers', href: '/careers' },
        { _key: 'a4', label: 'Contact', href: '/contact' },
      ]
    }
  ];

  const legalLinks = data?.legalLinks || [
    { _key: '10', label: 'Privacy Policy', href: '#' },
    { _key: '11', label: 'Terms of Use', href: '#' },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.brandInfo}>
            <Image
              src="/logos/Meiris-Logo.png"
              alt="MEIRIS - Intelligent Power Conversion"
              width={260}
              height={92}
              className={styles.logo}
            />
            <div className={styles.socialLinks}>
              {socialLinks.map((social: any) => (
                <a key={social._key} href={social.url} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label={social.platform}>
                  {getIcon(social.platform)}
                </a>
              ))}
            </div>
            {(contactDetails.email || contactDetails.phone || contactDetails.address) && (
              <div className={styles.contactDetails}>
                {contactDetails.email && <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a>}
                {contactDetails.phone && <a href={`tel:${contactDetails.phone}`}>{contactDetails.phone}</a>}
                {contactDetails.address && <p style={{ whiteSpace: 'pre-line' }}>{contactDetails.address}</p>}
              </div>
            )}
          </div>
          <div className={styles.linksGrid}>
            {linkGroups.map((group: any) => (
              <div key={group._key} className={styles.linkGroup}>
                <h4>{group.title}</h4>
                {group.links?.map((link: any) => (
                  <Link key={link._key} href={localePath(link.href)}>{link.label}</Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>{copyright}</p>
          <div className={styles.legal}>
            {legalLinks.map((link: any) => (
              <Link key={link._key} href={localePath(link.href)}>{link.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
