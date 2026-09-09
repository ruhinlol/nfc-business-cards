'use client';

import { useState } from 'react';
import { Business } from '@/types/business';
import { Star, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import confetti from 'canvas-confetti';

interface ReviewCTAProps {
  business: Business;
}

export default function ReviewCTA({ business }: ReviewCTAProps) {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  if (!business.googleReviewUrl) return null;

  const triggerCelebration = (rating: number) => {
    setSelectedRating(rating);
    setIsRedirecting(true);

    // Haptic feedback for mobile devices (vibration)
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([40, 60, 40]);
      } catch {}
    }

    // Confetti burst animation
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.65 },
        colors: [business.brandColor || '#3b82f6', '#f59e0b', '#fbbf24', '#10b981', '#ec4899', '#6366f1'],
        disableForReducedMotion: true,
      });

      // Second burst for extra joy
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
        });
      }, 250);
    } catch (e) {
      console.error('Confetti error:', e);
    }

    // Track review click
    trackEvent(business.id, 'review_click');

    // Smoothly redirect to Google Review page after celebration
    setTimeout(() => {
      window.open(business.googleReviewUrl, '_blank', 'noopener,noreferrer');
      setTimeout(() => setIsRedirecting(false), 2000);
    }, 900);
  };

  return (
    <section className="px-5 animate-fade-in-up delay-200">
      <div
        className="rounded-3xl p-6 sm:p-7 text-center card-shadow-lg border border-gray-100/90 relative overflow-hidden transition-all"
        style={{
          background: `linear-gradient(180deg, ${business.brandColor || '#3b82f6'}0c 0%, #ffffff 100%)`,
        }}
      >
        {/* Subtle decorative badge */}
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-amber-700 text-xs font-semibold mb-3">
          <Sparkles className="h-3.5 w-3.5 text-amber-500 fill-amber-400" />
          <span>Google Rəy Yazın</span>
        </div>

        {/* Dynamic Titles */}
        <h2 className="text-gray-900 text-lg sm:text-xl font-bold tracking-tight">
          {isRedirecting ? 'Çox sağ olun! ❤️' : 'Bizi qiymətləndirin'}
        </h2>
        <p className="text-gray-500 text-xs sm:text-sm mt-1 mb-5">
          {isRedirecting
            ? 'Rəyinizi tamamlamaq üçün Google xəritə açılır...'
            : 'Xidmətimizi bəyəndinizsə, 5 ulduz verərək bizə dəstək olun!'}
        </p>

        {/* Interactive 5 Stars */}
        <div className="flex justify-center items-center gap-2 mb-6 select-none">
          {[1, 2, 3, 4, 5].map((starIndex) => {
            const isFilled = hoveredStar !== null 
              ? starIndex <= hoveredStar 
              : selectedRating !== null 
                ? starIndex <= selectedRating 
                : true;

            const isHovered = hoveredStar === starIndex;

            return (
              <button
                key={starIndex}
                type="button"
                onMouseEnter={() => setHoveredStar(starIndex)}
                onMouseLeave={() => setHoveredStar(null)}
                onClick={() => triggerCelebration(starIndex)}
                disabled={isRedirecting}
                className={`p-1.5 rounded-xl transition-all duration-200 transform cursor-pointer
                  hover:scale-125 active:scale-95 focus:outline-none
                  ${isHovered ? 'rotate-6' : ''}
                `}
                aria-label={`${starIndex} ulduz ver`}
              >
                <Star
                  className={`h-8 w-8 sm:h-9 sm:w-9 transition-colors duration-200 ${
                    isFilled
                      ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                      : 'fill-gray-100 text-gray-300'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Primary CTA Button */}
        <button
          onClick={() => triggerCelebration(5)}
          disabled={isRedirecting}
          className="relative w-full rounded-2xl py-4 px-6 text-white font-bold text-base
                     transition-all duration-300 active:scale-[0.98]
                     hover:shadow-xl hover:-translate-y-0.5 cursor-pointer disabled:opacity-90"
          style={{
            backgroundColor: business.brandColor || '#3b82f6',
            boxShadow: `0 8px 20px -4px ${business.brandColor || '#3b82f6'}50`,
          }}
          id="review-cta-button"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isRedirecting ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-white animate-bounce" />
                GOOGLE-A YÖNLƏNDİRİLİR...
              </>
            ) : (
              <>
                <Star className="h-5 w-5 fill-white text-white" />
                5 ULDUZLU RƏY YAZ
                <ExternalLink className="h-4 w-4 ml-1 opacity-80" />
              </>
            )}
          </span>
          <div className="absolute inset-0 rounded-2xl cta-shimmer pointer-events-none" />
        </button>

        {/* Helper text */}
        <p className="text-[11px] text-gray-400 mt-3 flex items-center justify-center gap-1 font-medium">
          <span>⚡ 10 saniyə çəkir və birbaşa Google-da qeydə alınır</span>
        </p>
      </div>
    </section>
  );
}
