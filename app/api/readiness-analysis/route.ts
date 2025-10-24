import { NextResponse } from 'next/server';
import { openaiService } from '@/lib/services/openaiService';
import { UserProfile } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { userProfile, readinessScore, matches } = await request.json();

    if (!userProfile || readinessScore === undefined || !matches) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const analysis = await openaiService.generateReadinessAnalysis(
      userProfile as UserProfile,
      readinessScore,
      matches
    );

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Readiness Analysis API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate analysis' },
      { status: 500 }
    );
  }
}