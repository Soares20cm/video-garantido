import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('[Proxy Login] Calling backend:', `${BACKEND_URL}/api/auth/login`);

    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    console.log('[Proxy Login] Response status:', response.status);

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('[Proxy Login] Error:', error);
    return NextResponse.json(
      { message: 'Erro ao conectar com o servidor', error: error.message },
      { status: 500 }
    );
  }
}
