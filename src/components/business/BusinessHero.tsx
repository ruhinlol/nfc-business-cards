'use client';

import { useState } from 'react';
import { Business } from '@/types/business';
import { Star, MapPin } from 'lucide-react';

interface BusinessHeroProps {
  business: Business;
}

export default function BusinessHero({ business }: BusinessHeroProps) {
  const [logoError, setLogoError] = useState(false);
  const [coverError, setCoverError] = useState(false);

  const hasLogo = Boolean(business.logo && !logoError);
  const hasCover = Boolean(business.coverImage && !coverError);

  return (
    <section className="relative">
      {/* Sleek Cover Banner */}
      <div className="relative h-28 sm:h-36 w-full overflow-hidden bg-gray-100">
        {hasCover ? (
          <img
            src={business.coverImage}
            alt={`${business.name} cover`}
            className="h-full w-full object-cover"
            onError={() => setCoverError(true)}
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background: `linear-gradient(135deg, ${business.brandColor || '#3b82f6'}25, ${business.brandColor || '#3b82f6'}55)`,
            }}
          />
        )}
        {/* Subtle bottom gradient to blend into white */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
      </div>

      {/* Logo & Info */}
      <div className="relative -mt-10 px-5 text-center">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="relative h-20 w-20 rounded-2xl border-3 border-white shadow-lg overflow-hidden bg-white flex items-center justify-center">
            {hasLogo ? (
              <img
                src={business.logo}
                alt={`${business.name} logo`}
                className="h-full w-full object-cover"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div
                className="h-full w-full flex items-center justify-center text-3xl font-black text-white"
                style={{ backgroundColor: business.brandColor || '#3b82f6' }}
              >
                {business.name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* Business Name */}
        <div className="mt-2">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-snug">
            {business.name}
          </h1>
          {business.description && (
            <p className="mt-0.5 text-xs text-gray-500 font-medium line-clamp-1">
              {business.description}
            </p>
          )}
        </div>

        {/* Compact Badges */}
        <div className="mt-2 flex items-center justify-center gap-2 flex-wrap">
          {business.googleRating > 0 && (
            <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200/60 shadow-2xs">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>{business.googleRating.toFixed(1)}</span>
            </div>
          )}
          {business.address && (
            <div className="flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600 border border-gray-200 shadow-2xs">
              <MapPin className="h-3 w-3 text-gray-400" />
              <span className="truncate max-w-[170px]">
                {business.address.split(',').pop()?.trim() || business.address}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
