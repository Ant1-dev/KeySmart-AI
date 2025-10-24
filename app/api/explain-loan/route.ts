import { NextResponse } from 'next/server';
import { openaiService } from '@/lib/services/openaiService';
import { UserProfile } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { loanType, userProfile, matchedProgram } = await request.json();

    if (!loanType || !userProfile || !matchedProgram) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const explanation = await openaiService.explainLoanMatch(
      loanType,
      userProfile as UserProfile,
      matchedProgram
    );

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error('Explain Loan API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate explanation' },
      { status: 500 }
    );
  }
}