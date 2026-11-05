import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Credenciales solicitadas por el administrador:
    // Usuario: pepe
    // Contraseña: alm2026
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();
    const host = (request.headers.get('host') || '').toLowerCase();
    const isTamifitDomain = host.includes('tamifit.com');

    if (cleanUser === 'pepe' && cleanPass === 'alm2026') {
      const response = NextResponse.json({ success: true });
      
      // Cookie de acceso para 30 días compartida en tamifit.com y todos sus subdominios
      const cookieOptions: Record<string, unknown> = {
        path: '/',
        httpOnly: true,
        secure: false, // Compatible con HTTP y HTTPS durante la propagación de DNS
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 días
      };

      if (isTamifitDomain) {
        cookieOptions.domain = '.tamifit.com';
      }

      response.cookies.set('tamifit_admin_access', 'alm2026_granted', cookieOptions);

      return response;
    }

    return NextResponse.json(
      { error: 'Usuario o contraseña incorrectos' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const host = (request.headers.get('host') || '').toLowerCase();
  const response = NextResponse.json({ success: true });
  response.cookies.delete('tamifit_admin_access');
  if (host.includes('tamifit.com')) {
    response.cookies.delete({ name: 'tamifit_admin_access', domain: '.tamifit.com', path: '/' });
  }
  return response;
}
