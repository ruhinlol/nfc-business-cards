'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

interface PageViewTrackerProps {
  businessId: string;
}

export default function PageViewTracker({ businessId }: PageViewTrackerProps) {
  useEffect(() => {
    trackEvent(businessId, 'page_view');
  }, [businessId]);

  return null;
}
