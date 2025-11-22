import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const url = new URL(request.url);
    const searchParams = url.searchParams.toString();
    
    const response = await fetch(`${BACKEND_URL}/api/videos/recent${searchParams ? '?' + searchParams : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('[Proxy Videos Recent] Error:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar vídeos recentes' },
      { status: 500 }
    );
  }
}
