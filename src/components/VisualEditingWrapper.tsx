"use client";
import { VisualEditing } from '@sanity/visual-editing/react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * A custom VisualEditing wrapper that works with Next.js 14.
 * 
 * The built-in next-sanity VisualEditing component uses `await draftMode()`
 * which is Next.js 15 syntax. On Next.js 14, draftMode() is synchronous,
 * so the built-in revalidation silently fails. This wrapper bypasses that
 * by using router.refresh() directly for all refresh scenarios.
 */
export default function VisualEditingWrapper() {
  const router = useRouter();
  const routerRef = useRef(router);
  const [navigate, setNavigate] = useState<((update: any) => void) | undefined>();

  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  // History adapter so the Studio can navigate the iframe
  const history = useMemo(() => ({
    subscribe: (_navigate: any) => {
      setNavigate(() => _navigate);
      return () => setNavigate(undefined);
    },
    update: (update: any) => {
      switch (update.type) {
        case 'push': return routerRef.current.push(update.url);
        case 'pop': return routerRef.current.back();
        case 'replace': return routerRef.current.replace(update.url);
        default: throw new Error(`Unknown update type: ${update.type}`);
      }
    }
  }), []);

  // Report navigation changes back to the Studio
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    if (navigate) {
      navigate({
        type: 'push',
        url: `${pathname}${searchParams?.size ? `?${searchParams}` : ''}`,
      });
    }
  }, [navigate, pathname, searchParams]);

  // The key refresh handler: always use router.refresh() to re-fetch server components
  const handleRefresh = useCallback((payload: any) => {
    routerRef.current.refresh();
    return Promise.resolve();
  }, []);

  return (
    <VisualEditing
      history={history}
      refresh={handleRefresh}
      zIndex={999999}
      portal={false}
    />
  );
}
