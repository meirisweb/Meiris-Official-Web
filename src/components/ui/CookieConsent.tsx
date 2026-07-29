"use client";

import { useEffect, useState } from "react";

/**
 * CookieConsent banner implementing Google Consent Mode v2
 * Saves user preference in localStorage and updates GA4 consent state.
 */
export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if consent has already been given or denied
    const consent = localStorage.getItem("meiris_cookie_consent");
    if (!consent) {
      setShowBanner(true);
    } else if (consent === "granted") {
      updateConsentMode("granted");
    } else {
      updateConsentMode("denied");
    }
  }, []);

  const updateConsentMode = (status: "granted" | "denied") => {
    try {
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("consent", "update", {
          analytics_storage: status,
          ad_storage: status,
        });
      }
    } catch (e) {
      console.warn("Failed to update Google Consent Mode:", e);
    }
  };

  const handleAccept = () => {
    localStorage.setItem("meiris_cookie_consent", "granted");
    updateConsentMode("granted");
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("meiris_cookie_consent", "denied");
    updateConsentMode("denied");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-[420px] bg-[#111111]/95 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-2xl z-[99999] text-white flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-6 duration-300">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-[14px] font-bold tracking-tight text-white flex items-center gap-2">
          <span>Cookie Preferences</span>
        </h3>
        <p className="text-[12px] text-white/70 leading-relaxed font-normal">
          We use Google Analytics 4 (GA4) with anonymized measurement to analyze website traffic and improve your user experience.
        </p>
      </div>
      <div className="flex items-center gap-2.5 justify-end pt-1">
        <button
          onClick={handleDecline}
          className="px-4 py-2 rounded-full text-[12px] font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          Decline
        </button>
        <button
          onClick={handleAccept}
          className="px-5 py-2 rounded-full text-[12px] font-bold bg-[#00E573] text-black hover:bg-[#00c965] transition-all shadow-sm"
        >
          Accept Cookies
        </button>
      </div>
    </div>
  );
}
