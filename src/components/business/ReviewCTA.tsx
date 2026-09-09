'use client';

import { useState } from 'react';
import { Business } from '@/types/business';
import { Star, CheckCircle2, Sparkles, ExternalLink, ThumbsUp, Heart } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import confetti from 'canvas-confetti';

interface ReviewCTAProps {
  business: Business;
}

const RATING_FEEDBACK: Record<number, { text: string; emoji: string; sub: string }> = {
  1: { text: 'Təcrübənizi yaxşılaşdıracağıq', emoji: '😕', sub: 'Rəyiniz bizə çox vacibdir' },
  2: { text: 'Qənaətbəxş', emoji: '😐', sub: 'Daha yaxşı xidmət üçün çalışırıq' },
  3: { text: 'Yaxşı', emoji: '🙂', sub: 'Təşəkkür edirik!' },
  4: { text: 'Çox yaxşı!', emoji: '😊', sub: 'Bəyənməyinizə çox şadıq!' },
  5: { text: 'Mükəmməl! 5 Ulduz', emoji: '🤩', sub: 'Siz möhtəşəmsiniz! ❤️' },
};

export default function ReviewCTA({ business }: ReviewCTAProps) {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  if (!business.googleReviewUrl) return null;

  // Active star calculation: default highlight 5 on hover preview, or user's pick
  const currentDisplayRating = hoveredStar !== null ? hoveredStar : (selectedRating !== null ? selectedRating : 0);
  const currentFeedback = currentDisplayRating > 0 ? RATING_FEEDBACK[currentDisplayRating] : null;

  const handleStarSelect = (rating: number) => {
    setSelectedRating(rating);
    setIsRedirecting(true);

    // 1. Mobile haptic vibration
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([40, 60, 40]);
      } catch {}
    }

    // 2. Confetti explosion
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: [business.brandColor || '#3b82f6', '#f59e0b', '#fbbf24', '#10b981', '#ec4899'],
      });
    } catch {}

    // 3. Analytics
    trackEvent(business.id, 'review_click');

    // 4. Reliable direct redirect (NO POPUP BLOCKER on iOS Safari / Android Chrome)
    setTimeout(() => {
      window.location.href = business.googleReviewUrl;
    }, 450);
  };

  return (
    <section id="review-card" className="px-5 animate-fade-in-up delay-200 scroll-mt-6">
      <div
        className="rounded-3xl p-6 sm:p-7 text-center card-shadow-xl border-2 border-amber-300/80 relative overflow-hidden bg-white"
        style={{
          boxShadow: `0 14px 36px -8px ${business.brandColor || '#3b82f6'}30`,
        }}
      >
        {/* Top Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100/90 text-amber-900 text-xs font-bold mb-3 shadow-xs">
          <Sparkles className="h-3.5 w-3.5 text-amber-600 fill-amber-500 animate-spin-slow" />
          <span>Google Rəy Qutusu</span>
        </div>

        {/* Dynamic Title */}
        <h2 className="text-gray-900 text-xl sm:text-2xl font-black tracking-tight">
          {isRedirecting ? (
            <span className="text-emerald-600 flex items-center justify-center gap-2 animate-bounce">
              <span>{currentFeedback?.emoji || '❤️'}</span> Təşəkkür edirik!
            </span>
          ) : (
            'Bizi neçə ulduzla qiymətləndirirsiniz?'
          )}
        </h2>

        {/* Subtitle / instruction */}
        <p className="text-gray-500 text-xs sm:text-sm mt-1.5 mb-6 font-medium">
          {isRedirecting ? (
            'Google Maps xəritəsi açılır, zəhmət olmasa gözləyin...'
          ) : (
            <span className="inline-flex items-center gap-1 text-amber-800 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
              👇 Ulduzların üzərinə toxunaraq seçin:
            </span>
          )}
        </p>

        {/* TACTILE 5 STARS BUTTONS */}
        <div className="flex justify-center items-center gap-2.5 sm:gap-3.5 mb-5 touch-manipulation">
          {[1, 2, 3, 4, 5].map((starIndex) => {
            const isActive = currentDisplayRating > 0 ? starIndex <= currentDisplayRating : false;
            const isJustClicked = selectedRating === starIndex;

            return (
              <button
                key={starIndex}
                type="button"
                onMouseEnter={() => setHoveredStar(starIndex)}
                onMouseLeave={() => setHoveredStar(null)}
                onClick={() => handleStarSelect(starIndex)}
                disabled={isRedirecting}
                className={`flex flex-col items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-2xl transition-all duration-200 cursor-pointer select-none touch-manipulation
                  ${
                    isJustClicked
                      ? 'scale-110 bg-amber-400 text-white shadow-xl ring-4 ring-amber-300'
                      : isActive
                      ? 'bg-amber-50 border-2 border-amber-400 shadow-md scale-105'
                      : 'bg-gray-50 border-2 border-gray-200 hover:border-amber-300 hover:bg-amber-50/50 active:scale-90'
                  }
                `}
                aria-label={`${starIndex} ulduz ver`}
              >
                <Star
                  className={`h-7 w-7 sm:h-8 sm:w-8 transition-all duration-200 ${
                    isActive
                      ? 'fill-amber-400 text-amber-500 scale-110 drop-shadow-sm'
                      : 'fill-transparent text-gray-300 hover:text-amber-300'
                  }`}
                />
                <span
                  className={`text-[11px] font-extrabold mt-0.5 ${
                    isJustClicked
                      ? 'text-white'
                      : isActive
                      ? 'text-amber-700'
                      : 'text-gray-400'
                  }`}
                >
                  {starIndex} ★
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic emotion pill */}
        <div className="min-h-7 flex items-center justify-center text-xs font-bold text-gray-700 mb-5">
          {currentFeedback ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 animate-fade-in">
              <span className="text-base">{currentFeedback.emoji}</span>
              <span>{currentFeedback.text}</span>
            </span>
          ) : (
            <span className="text-gray-400 text-[11px] font-medium">
              (İstənilən ulduzun üzərinə toxunun)
            </span>
          )}
        </div>

        {/* Big Action Button (Direct Link fallback + Click Action) */}
        <a
          href={business.googleReviewUrl}
          onClick={(e) => {
            e.preventDefault();
            handleStarSelect(5);
          }}
          className="relative block w-full rounded-2xl py-4 px-6 text-white font-extrabold text-base
                     transition-all duration-200 active:scale-[0.98]
                     hover:shadow-2xl hover:-translate-y-0.5 cursor-pointer select-none text-center"
          style={{
            backgroundColor: business.brandColor || '#3b82f6',
            boxShadow: `0 8px 24px -4px ${business.brandColor || '#3b82f6'}70`,
          }}
          id="review-cta-button"
        >
          <span className="relative z-10 flex items-center justify-center gap-2 tracking-wide font-black">
            {isRedirecting ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-white animate-spin" />
                GOOGLE XƏRİTƏ AÇILIR...
              </>
            ) : (
              <>
                <ThumbsUp className="h-5 w-5 fill-white text-white" />
                MÜKƏMMƏL (5 ULDUZ VER)
                <ExternalLink className="h-4 w-4 ml-1 opacity-90" />
              </>
            )}
          </span>
          <div className="absolute inset-0 rounded-2xl cta-shimmer pointer-events-none" />
        </a>

        {/* Guarantee text */}
        <p className="text-[11px] text-gray-400 mt-3 flex items-center justify-center gap-1 font-medium">
          <span>⚡ Rəyiniz birbaşa Google profilində qeydə alınır</span>
        </p>
      </div>
    </section>
  );
}
