'use client';

import { useState, useEffect } from 'react';
import { Business } from '@/types/business';
import BusinessHero from '@/components/business/BusinessHero';
import ReviewCTA from '@/components/business/ReviewCTA';
import SocialLinks from '@/components/business/SocialLinks';
import ContactActions from '@/components/business/ContactActions';
import OpeningHours from '@/components/business/OpeningHours';
import BusinessFooter from '@/components/business/BusinessFooter';
import PageViewTracker from '@/components/business/PageViewTracker';
import { Store, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface BusinessProfileViewProps {
  initialBusiness?: Business | null;
  slug: string;
}

export default function BusinessProfileView({ initialBusiness, slug }: BusinessProfileViewProps) {
  const [business, setBusiness] = useState<Business | null>(initialBusiness || null);
  const [loading, setLoading] = useState(!initialBusiness);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    if (business) {
      setLoading(false);
      return;
    }

    // Client-side fallback fetch to the live API
    const fetchLiveBusiness = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/businesses', { cache: 'no-store' });
        if (res.ok) {
          const list: Business[] = await res.json();
          const match = list.find((b) => b.slug.toLowerCase() === slug.toLowerCase());
          if (match) {
            setBusiness(match);
            return;
          }
        }
        setNotFoundState(true);
      } catch (err) {
        console.error('Client fetch business error:', err);
        setNotFoundState(true);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveBusiness();
  }, [business, slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 border-3 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-gray-500">Biznes profili yüklənir...</p>
        </div>
      </div>
    );
  }

  if (notFoundState || !business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 card-shadow text-center max-w-sm w-full space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
            <Store className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Biznes Tapılmadı</h1>
            <p className="text-xs text-gray-500 mt-1">
              &quot;{slug}&quot; adlı biznes profili sistemdə mövcud deyil və ya silinib.
            </p>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Admin Panelə Keç
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-md">
        <PageViewTracker businessId={business.id} />
        <BusinessHero business={business} />

        <div className="mt-6 space-y-6">
          <ReviewCTA business={business} />
          <SocialLinks business={business} />
          <ContactActions business={business} />
          <OpeningHours hours={business.openingHours} />
          <BusinessFooter business={business} />
        </div>
      </div>
    </div>
  );
}
