import { NextResponse } from 'next/server';
import { openaiService } from '@/lib/services/openaiService';
import { UserProfile } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { message, userContext, conversationHistory } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Limit conversation history to last 10 messages to avoid token limits
    const limitedHistory = conversationHistory 
      ? conversationHistory.slice(-10)
      : [];

    const response = await openaiService.generateChatResponse(
      message,
      userContext as UserProfile,
      limitedHistory
    );

    return NextResponse.json({ message: response });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}