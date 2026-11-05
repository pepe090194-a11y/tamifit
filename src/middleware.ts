import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = (request.headers.get('host') || '').toLowerCase();

  // 1. Bypass static files, internal Next.js requests, manifest and service worker
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/icons') ||
    url.pathname === '/manifest.json' ||
    url.pathname === '/sw.js' ||
    url.pathname === '/tamifit-logo.png' ||
    url.pathname === '/favicon.ico' ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Permitir siempre la ruta API de autenticación provisional
  if (url.pathname === '/api/provisional-auth') {
    return NextResponse.next();
  }

  // 3. Comprobar si el usuario tiene la cookie de acceso provisional de administrador (pepe / alm2026)
  const hasAdminAccess = request.cookies.get('tamifit_admin_access')?.value === 'alm2026_granted';

  if (!hasAdminAccess) {
    // Si no está autenticado, reescribir a la pantalla de candado /gate con encabezados para evitar caché
    if (url.pathname !== '/gate') {
      url.pathname = '/gate';
      const res = NextResponse.rewrite(url);
      res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
      res.headers.set('CDN-Cache-Control', 'no-store');
      res.headers.set('Netlify-CDN-Cache-Control', 'no-store');
      return res;
    }
    const res = NextResponse.next();
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    return res;
  }

  // Si ya está autenticado e intenta ir a /gate directamente, enviarlo a la portada
  if (url.pathname === '/gate') {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // 4. Detect subdomains:
  const isAppSubdomain = hostname.startsWith('app.') || hostname.startsWith('app-');
  const isAdminSubdomain = hostname.startsWith('admin.') || hostname.startsWith('admin-') || hostname.startsWith('panel.');

  // Handle /login redirection everywhere cleanly
  if (url.pathname === '/login') {
    url.pathname = isAdminSubdomain ? '/admin' : '/app';
    return NextResponse.redirect(url);
  }

  // 5. Routing for Student Mobile App Subdomain (app.tamifit.com / app.tamifit.es)
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

  // 6. Routing for Admin Panel Subdomain (admin.tamifit.com / admin.tamifit.es)
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

  // 7. Default domain (tamifit.com or localhost:3000):
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
