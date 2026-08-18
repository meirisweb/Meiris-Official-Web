import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const hostname = req.headers.get('host') || '';
  
  // Temporarily block the official domain while keeping the vercel preview active
  if (hostname === 'siriem.com' || hostname === 'www.siriem.com') {
    return new NextResponse(
      '<html><body style="display:flex;justify-content:center;align-items:center;height:100vh;background-color:#000;color:#fff;font-family:sans-serif;text-align:center;"><div><h1>Coming Soon</h1><p>We are upgrading our site it will be launched shortly</p></div></body></html>', 
      { status: 503, headers: { 'content-type': 'text/html' } }
    );
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next`, `/_vercel`, `/studio`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|studio|.*\\..*).*)' 
  ]
};
