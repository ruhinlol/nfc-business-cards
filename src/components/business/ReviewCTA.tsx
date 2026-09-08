'use client';

import { Business } from '@/types/business';
import { Star } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface ReviewCTAProps {
  business: Business;
}

export default function ReviewCTA({ business }: ReviewCTAProps) {
  if (!business.googleReviewUrl) return null;

  const handleClick = () => {
    trackEvent(business.id, 'review_click');
    window.open(business.googleReviewUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="px-5 animate-fade-in-up delay-200" style={{ opacity: 0 }}>
      <div
        className="rounded-2xl p-6 text-center card-shadow-lg border border-gray-100/80 relative overflow-hidden"
        style={{ backgroundColor: `${business.brandColor}08` }}
      >
        {/* Stars */}
        <div className="flex justify-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="h-7 w-7 fill-amber-400 text-amber-400 star-glow"
            />
          ))}
        </div>

        {/* Text */}
        <p className="text-gray-500 text-sm font-medium mb-1">
          Təcrübənizi bizimlə paylaşın
        </p>
        <p className="text-gray-700 text-base font-semibold mb-5">
          Google-da bizə rəy yazın
        </p>

        {/* CTA Button */}
        <button
          onClick={handleClick}
          className="relative w-full rounded-xl py-4 px-6 text-white font-semibold text-base
                     transition-all duration-300 active:scale-[0.98]
                     hover:shadow-lg hover:-translate-y-0.5"
          style={{
            backgroundColor: business.brandColor,
            boxShadow: `0 4px 14px 0 ${business.brandColor}40`,
          }}
          id="review-cta-button"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Star className="h-5 w-5 fill-white" />
            RƏY YAZ
          </span>
          <div className="absolute inset-0 rounded-xl cta-shimmer" />
        </button>
      </div>
    </section>
  );
}
