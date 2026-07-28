"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

function ScrollRestoration() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, lenis]);

  return null;
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Disable smooth scrolling in Sanity Studio, as it breaks its internal scrolling containers
  if (pathname?.startsWith("/studio")) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothWheel: true }}>
      <ScrollRestoration />
      {children}
    </ReactLenis>
  );
}
