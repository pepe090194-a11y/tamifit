import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    return NextResponse.json({
      valid: true,
      role: payload.role,
      clientId: payload.clientId,
      username: payload.username
    });
  } catch (error) {
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
