import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function middleware(request: NextRequest) {
  // Only proxy API routes that don't have specific handlers
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Ignore requests with undefined in the path
    if (request.nextUrl.pathname.includes('/undefined')) {
      return NextResponse.json(
        { message: 'Invalid request: undefined parameter' },
        { status: 400 }
      );
    }
    // Check if it's one of our specific API routes that have handlers
    const exactRoutes = [
      '/api/auth/login', 
      '/api/auth/register', 
      '/api/channels',
      '/api/channels/me',
      '/api/videos',
      '/api/videos/recent'
    ];
    
    // Check for exact matches or specific sub-routes
    const isExactRoute = exactRoutes.includes(request.nextUrl.pathname);
    
    // Check for video/channel ID routes (let Next.js handle if handler exists)
    const hasSpecificHandler = false; // Disabled - let middleware handle all dynamic routes
    
    // If it's an exact route or has a specific handler, let Next.js handle it
    if (isExactRoute || hasSpecificHandler) {
      console.log(`[Middleware] Letting Next.js handle: ${request.nextUrl.pathname}`);
      return NextResponse.next();
    }
    
    // Otherwise, proxy to backend
    try {
      const path = request.nextUrl.pathname.replace('/api/', '');
      const url = `${BACKEND_URL}/api/${path}${request.nextUrl.search}`;
      
      console.log(`[Middleware Proxy] ${request.method} ${url}`);
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      const authHeader = request.headers.get('authorization');
      if (authHeader) {
        headers['Authorization'] = authHeader;
      }
      
      let body = undefined;
      if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
        try {
          body = await request.text();
        } catch (e) {
          // No body
        }
      }
      
      const response = await fetch(url, {
        method: request.method,
        headers,
        body,
      });
      
      const data = await response.text();
      
      return new NextResponse(data, {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error: any) {
      console.error('[Middleware Proxy] Error:', error.message);
      return NextResponse.json(
        { message: 'Erro ao conectar com o servidor' },
        { status: 500 }
      );
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
