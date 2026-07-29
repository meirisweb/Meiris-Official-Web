import { sendGAEvent } from '@next/third-parties/google';

/**
 * Core GA4 custom event wrapper using @next/third-parties/google
 */
export function trackEvent(eventName: string, params?: Record<string, any>): void {
  try {
    if (typeof window !== 'undefined') {
      sendGAEvent({ event: eventName, value: params || {} });
    }
  } catch (e) {
    console.warn('Failed to send GA4 event:', eventName, e);
  }
}

/**
 * Track successful contact / inquiry form submissions (Conversion Event)
 */
export function trackContactSubmit(params: {
  source?: string;
  industry?: string;
  formType?: string;
}): void {
  trackEvent('contact_submit_success', {
    event_category: 'conversion',
    event_label: params.source || 'contact_page',
    industry: params.industry || 'general',
    form_type: params.formType || 'inquiry',
  });
}

/**
 * Track primary CTA button clicks across hero and navigation sections
 */
export function trackCtaClick(params: {
  location: string;
  label: string;
  targetUrl?: string;
}): void {
  trackEvent('cta_click', {
    event_category: 'engagement',
    event_label: params.label,
    cta_location: params.location,
    target_url: params.targetUrl || '',
  });
}

/**
 * Track resource PDF downloads / datasheets opened
 */
export function trackResourceDownload(params: {
  resourceTitle: string;
  fileType?: string;
  fileUrl?: string;
}): void {
  trackEvent('resource_download', {
    event_category: 'downloads',
    event_label: params.resourceTitle,
    file_type: params.fileType || 'pdf',
    file_url: params.fileUrl || '',
  });
}

/**
 * Track specific solution electrification page views
 */
export function trackSolutionView(params: {
  solutionSlug: string;
  solutionTitle?: string;
}): void {
  trackEvent('solution_view', {
    event_category: 'solutions',
    event_label: params.solutionTitle || params.solutionSlug,
    solution_slug: params.solutionSlug,
  });
}

/**
 * Track multilingual locale switcher interactions
 */
export function trackLanguageChange(params: {
  fromLocale?: string;
  toLocale: string;
}): void {
  trackEvent('language_change', {
    event_category: 'localization',
    event_label: params.toLocale,
    from_locale: params.fromLocale || '',
    to_locale: params.toLocale,
  });
}

/**
 * Track email or phone contact link clicks
 */
export function trackContactClick(params: {
  type: 'email' | 'phone' | 'external';
  label: string;
}): void {
  trackEvent('contact_link_click', {
    event_category: 'contact',
    event_label: params.label,
    contact_type: params.type,
  });
}
