"use client";
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { trackLanguageChange, trackCtaClick } from '@/lib/analytics';

export default function Navbar({ data }: { data?: any }) {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('Navbar');
  const currentLocale = useLocale();
  let rafId: number | null = null;

  const navLinks = data?.navLinks || [];
  const ctaBtn = data?.ctaBtn || t('contact');

  const switchLanguage = (newLocale: string) => {
    trackLanguageChange({ fromLocale: currentLocale, toLocale: newLocale });
    // Save preference in cookie for next-intl middleware (1 year expiry)
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    
    // Strip current locale prefix and replace with new one
    const currentPath = pathname?.replace(/^\/(en|es-419)/, '') || '/';
    router.push(`/${newLocale}${currentPath || '/'}`);
  };

  // Build locale-aware href
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

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  useEffect(() => {
    const bar = progressBarRef.current;
    if (!bar) return;

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = `${pct}%`;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>

        {/* Logo */}
        <div className={styles.logo}>
          <Link href={localePath('/')}>
            <Image
              src="/logos/Meiris-Logo.png"
              alt="MEIRIS — Intelligent Power Conversion"
              width={200}
              height={70}
              priority
              className={styles.logoImage}
            />
          </Link>
        </div>

        {/* Nav links */}
        <ul className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>
          {navLinks.map((link: any, index: number) => {
            const hasDropdown = link.dropdownItems && link.dropdownItems.length > 0;
            if (hasDropdown) {
              return (
                <li key={index} className={`${styles.dropdown} ${activeDropdown === link.label ? styles.dropdownActive : ''}`} onClick={() => toggleDropdown(link.label)}>
                  <span className={styles.dropdownTrigger}>
                    {link.label}
                    <svg className={styles.chevronIcon} viewBox="0 0 10 6" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <div className={styles.dropdownPanel}>
                    {link.dropdownItems.map((item: any, i: number) => (
                      <Link key={i} href={localePath(item.path)} className={styles.dropdownItem}>{item.label}</Link>
                    ))}
                  </div>
                </li>
              );
            }
            return (
              <li key={index}><Link href={localePath(link.path)}>{link.label}</Link></li>
            );
          })}
          
          <li className={styles.mobileCta}>
            <Link href={localePath('/contact')} className={styles.contactBtn}>
              {ctaBtn}
            </Link>
          </li>
        </ul>

        {/* CTA and Lang */}
        <div className={styles.actions}>
          <div className="flex bg-white/10 rounded-full p-1 border border-white/20">
            <button 
              onClick={() => switchLanguage('en')}
              className={`px-3 py-1 text-xs font-bold uppercase rounded-full transition-all duration-200 ${currentLocale === 'en' ? 'bg-white text-black shadow-sm' : 'text-white/60 hover:text-white'}`}
            >
              EN
            </button>
            <button 
              onClick={() => switchLanguage('es-419')}
              className={`px-3 py-1 text-xs font-bold uppercase rounded-full transition-all duration-200 ${currentLocale === 'es-419' ? 'bg-[#00E573] text-black shadow-sm' : 'text-white/60 hover:text-white'}`}
            >
              ES
            </button>
          </div>
          <Link 
            href={localePath('/contact')} 
            className={`${styles.contactBtnWrapper} ${styles.contactBtn}`}
            onClick={() => trackCtaClick({ location: 'navbar', label: ctaBtn, targetUrl: '/contact' })}
          >
            {ctaBtn}
          </Link>
          <button className={styles.hamburger} onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.hamburgerIcon}>
              {isMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Smooth left-to-right scroll progress bar */}
      <div className={styles.progressTrack} aria-hidden="true">
        <div ref={progressBarRef} className={styles.progressBar} style={{ width: '0%' }} />
      </div>
    </nav>
  );
}
