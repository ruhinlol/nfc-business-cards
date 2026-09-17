'use client';

import { useState } from 'react';
import { Business } from '@/types/business';
import { Star, CheckCircle2, Sparkles, ExternalLink, ThumbsUp, Heart } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import confetti from 'canvas-confetti';

interface ReviewCTAProps {
  business: Business;
}

export default function ReviewCTA({ business }: ReviewCTAProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  if (!business.googleReviewUrl) return null;

  const handleFiveStarReview = () => {
    setIsRedirecting(true);

    // 1. Mobile haptic vibration
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([40, 60, 40]);
      } catch {}
    }

    // 2. Confetti explosion celebration
    try {
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 },
        colors: [business.brandColor || '#3b82f6', '#f59e0b', '#fbbf24', '#10b981', '#ec4899'],
      });
    } catch {}

    // 3. Track event
    trackEvent(business.id, 'review_click');

    // 4. Smooth direct navigation (no popup blocker)
    setTimeout(() => {
      window.location.href = business.googleReviewUrl;
    }, 450);
  };

  return (
    <section id="review-card" className="px-4 sm:px-5 animate-fade-in-up delay-200 scroll-mt-6">
      <div
        className="rounded-3xl p-5 text-center card-shadow-xl border-2 border-amber-300/90 relative overflow-hidden bg-white"
        style={{
          boxShadow: `0 10px 30px -8px ${business.brandColor || '#3b82f6'}25`,
        }}
      >
        {/* Top Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100/90 text-amber-900 text-[11px] font-bold mb-2 shadow-2xs">
          <Sparkles className="h-3.5 w-3.5 text-amber-600 fill-amber-500 animate-spin-slow" />
          <span>Google Rəy Qutusu</span>
        </div>

        {/* Dynamic Title */}
        <h2 className="text-gray-900 text-lg sm:text-xl font-black tracking-tight leading-snug">
          {isRedirecting ? (
            <span className="text-emerald-600 flex items-center justify-center gap-2 animate-bounce">
              <Heart className="h-5 w-5 fill-emerald-500 text-emerald-500" /> Təşəkkür edirik!
            </span>
          ) : (
            'Bizi 5 ulduzla qiymətləndirin ⭐'
          )}
        </h2>

        {/* Subtitle / Prompt */}
        <p className="text-gray-500 text-xs mt-1 mb-4 font-medium">
          {isRedirecting ? (
            'Google Maps açılır, zəhmət olmasa gözləyin...'
          ) : (
            'Xidmətimizdən razı qaldınızsa, 5 ulduz verərək dəstək olun!'
          )}
        </p>

        {/* Big Action Button (Direct Link fallback + Click Action) */}
        <a
          href={business.googleReviewUrl}
          onClick={(e) => {
            e.preventDefault();
            handleFiveStarReview();
          }}
          className="relative block w-full rounded-2xl py-3.5 px-5 text-white font-extrabold text-sm sm:text-base
                     transition-all duration-200 active:scale-[0.98]
                     hover:shadow-xl hover:-translate-y-0.5 cursor-pointer select-none text-center"
          style={{
            backgroundColor: business.brandColor || '#3b82f6',
            boxShadow: `0 6px 20px -4px ${business.brandColor || '#3b82f6'}60`,
          }}
          id="review-cta-button"
        >
          <span className="relative z-10 flex items-center justify-center gap-2 tracking-wide font-black">
            {isRedirecting ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-white animate-spin" />
                GOOGLE XƏRİTƏ AÇILIR...
              </>
            ) : (
              <>
                <ThumbsUp className="h-4 w-4 fill-white text-white" />
                5 ULDUZLU RƏY YAZ
                <ExternalLink className="h-3.5 w-3.5 ml-1 opacity-90" />
              </>
            )}
          </span>
          <div className="absolute inset-0 rounded-2xl cta-shimmer pointer-events-none" />
        </a>

        {/* Guarantee text */}
        <p className="text-[10px] text-gray-400 mt-2 flex items-center justify-center gap-1 font-medium">
          <span>⚡ Rəyiniz birbaşa Google profilində qeydə alınır</span>
        </p>
      </div>
    </section>
  );
}
