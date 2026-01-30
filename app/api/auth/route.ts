import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const username = process.env.BASIC_AUTH_USERNAME;
  const password = process.env.BASIC_AUTH_PASSWORD;

  // Auth not configured
  if (!username || !password) {
    return NextResponse.json({ error: 'Auth not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { username: providedUsername, password: providedPassword } = body;

    if (providedUsername !== username || providedPassword !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create session token (simple hash of credentials + timestamp)
    const sessionToken = Buffer.from(`${username}:${Date.now()}`).toString('base64');

    const response = NextResponse.json({ success: true });

    response.cookies.set('auth_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });

  response.cookies.set('auth_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  return response;
}
