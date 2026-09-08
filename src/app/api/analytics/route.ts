import { NextRequest, NextResponse } from 'next/server';
import { trackEvent } from '@/lib/data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, eventType, userAgent, referrer } = body;

    if (!businessId || !eventType) {
      return NextResponse.json(
        { error: 'businessId and eventType are required' },
        { status: 400 }
      );
    }

    const event = trackEvent({
      businessId,
      eventType,
      userAgent,
      referrer,
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}
