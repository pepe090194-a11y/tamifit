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

    if (cleanUser === 'pepe' && cleanPass === 'alm2026') {
      const response = NextResponse.json({ success: true });
      
      // Cookie de acceso para 30 días
      response.cookies.set('tamifit_admin_access', 'alm2026_granted', {
        path: '/',
        httpOnly: true,
        secure: false, // Compatible con HTTP y HTTPS durante la propagación de DNS
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 días
      });

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

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('tamifit_admin_access');
  return response;
}
