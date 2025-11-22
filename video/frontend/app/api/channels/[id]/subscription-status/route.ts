import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { isSubscribed: false },
        { status: 200 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/channels/${params.id}/subscription-status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('[Proxy Subscription Status] Error:', error);
    return NextResponse.json(
      { isSubscribed: false },
      { status: 200 }
    );
  }
}
