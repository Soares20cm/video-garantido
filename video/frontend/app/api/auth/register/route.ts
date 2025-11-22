import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('[Proxy Register] Calling backend:', `${BACKEND_URL}/api/auth/register`);
    console.log('[Proxy Register] Body:', body);

    const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    console.log('[Proxy Register] Response status:', response.status);
    console.log('[Proxy Register] Response data:', data);

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('[Proxy Register] Error:', error);
    return NextResponse.json(
      { message: 'Erro ao conectar com o servidor', error: error.message },
      { status: 500 }
    );
  }
}
