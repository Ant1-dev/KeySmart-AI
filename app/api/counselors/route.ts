import { NextResponse } from 'next/server';
import { hudService } from '@/lib/services/hudService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const state = searchParams.get('state');

    if (!city || !state) {
      return NextResponse.json(
        { error: 'City and state required' },
        { status: 400 }
      );
    }

    const counselors = await hudService.searchCounselors(city, state);

    return NextResponse.json({ counselors, count: counselors.length });
  } catch (error) {
    console.error('Counselors API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch counselors' },
      { status: 500 }
    );
  }
}