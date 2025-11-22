import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function POST(request: NextRequest) {
  try {
    // Get the form data (for file uploads)
    const formData = await request.formData();
    const authHeader = request.headers.get('authorization');
    
    console.log('[Proxy Videos POST] Uploading video to backend');

    // Forward the form data to backend
    const response = await fetch(`${BACKEND_URL}/api/videos`, {
      method: 'POST',
      headers: {
        ...(authHeader && { 'Authorization': authHeader }),
        // Don't set Content-Type, let fetch set it with boundary
      },
      body: formData,
    });

    const data = await response.json();
    console.log('[Proxy Videos POST] Response:', response.status);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('[Proxy Videos POST] Error:', error);
    return NextResponse.json(
      { message: 'Erro ao fazer upload do vídeo', error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const url = new URL(request.url);
    const searchParams = url.searchParams.toString();
    
    const response = await fetch(`${BACKEND_URL}/api/videos${searchParams ? '?' + searchParams : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('[Proxy Videos GET] Error:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar vídeos' },
      { status: 500 }
    );
  }
}
