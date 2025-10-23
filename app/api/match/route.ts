import { NextResponse } from 'next/server';
import { matchingService } from '@/lib/services/matchingService';
import { UserProfile } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const profile: UserProfile = await request.json();

    // Validate input
    if (!profile.annualIncome || !profile.creditScore) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await matchingService.generateMatchResult(profile);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Match API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}