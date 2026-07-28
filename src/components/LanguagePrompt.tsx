'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

export default function LanguagePrompt() {
  const t = useTranslations('Prompt');
  const router = useRouter();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show on client side to avoid hydration mismatch
    setIsVisible(true);
  }, []);

  const handleSelection = (locale: 'en' | 'es-419') => {
    // Set persistent cookies (1 year)
    document.cookie = 'lang-prompt-seen=true; path=/; max-age=31536000'; 
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
    
    // Redirect if they chose Spanish, otherwise just close it
    if (locale === 'es-419' && !pathname.startsWith('/es-419')) {
      const newPath = pathname.replace(/^\/en/, '/es-419');
      router.push(newPath || '/es-419');
    } else {
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-12 w-full max-w-lg flex flex-col gap-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        <h2 className="text-2xl font-bold text-center tracking-tight text-black">{t('title')}</h2>
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => handleSelection('en')}
            className="w-full bg-black text-white py-4 px-6 font-semibold tracking-wide hover:bg-black/90 transition-colors"
          >
            {t('en')}
          </button>
          <button 
            onClick={() => handleSelection('es-419')}
            className="w-full bg-[#00E573] text-black py-4 px-6 font-semibold tracking-wide hover:bg-[#00E573]/90 transition-colors"
          >
            {t('es')}
          </button>
        </div>
      </div>
    </div>
  );
}
