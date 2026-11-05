import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = (request.headers.get('host') || '').toLowerCase();

  // 1. Bypass static files, internal Next.js requests, API routes, manifest and service worker
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/icons') ||
    url.pathname === '/manifest.json' ||
    url.pathname === '/sw.js' ||
    url.pathname === '/tamifit-logo.png' ||
    url.pathname === '/favicon.ico' ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Detect subdomains:
  const isAppSubdomain = hostname.startsWith('app.') || hostname.startsWith('app-');
  const isAdminSubdomain = hostname.startsWith('admin.') || hostname.startsWith('admin-') || hostname.startsWith('panel.');

  // Handle /login redirection everywhere cleanly
  if (url.pathname === '/login') {
    url.pathname = isAdminSubdomain ? '/admin' : '/app';
    return NextResponse.redirect(url);
  }

  // 3. Routing for Student Mobile App Subdomain (app.tamifit.es)
  if (isAppSubdomain) {
    if (url.pathname === '/') {
      url.pathname = '/app';
      return NextResponse.rewrite(url);
    }
    if (url.pathname.startsWith('/admin')) {
      url.pathname = '/app';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 4. Routing for Admin Panel Subdomain (admin.tamifit.es)
  if (isAdminSubdomain) {
    if (url.pathname === '/') {
      url.pathname = '/admin';
      return NextResponse.rewrite(url);
    }
    if (url.pathname.startsWith('/app')) {
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 5. Default domain (tamifit.es or localhost:3000):
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
