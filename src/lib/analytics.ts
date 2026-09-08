'use client';

import { AnalyticsEvent } from '@/types/business';

type EventType = AnalyticsEvent['eventType'];

export async function trackEvent(businessId: string, eventType: EventType): Promise<void> {
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessId,
        eventType,
        userAgent: navigator.userAgent,
        referrer: document.referrer || undefined,
      }),
    });
  } catch (error) {
    console.error('Analytics tracking failed:', error);
  }
}
