'use client';

import { Business } from '@/types/business';
import { Star, MapPin } from 'lucide-react';
import Image from 'next/image';

interface BusinessHeroProps {
  business: Business;
}

export default function BusinessHero({ business }: BusinessHeroProps) {
  return (
    <section className="relative">
      {/* Cover Image */}
      <div className="relative h-52 sm:h-64 w-full overflow-hidden">
        {business.coverImage ? (
          <Image
            src={business.coverImage}
            alt={`${business.name} cover`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              if (target.parentElement) {
                target.parentElement.style.background = `linear-gradient(135deg, ${business.brandColor}22, ${business.brandColor}44)`;
              }
            }}
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background: `linear-gradient(135deg, ${business.brandColor}33, ${business.brandColor}66)`,
            }}
          />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
      </div>

      {/* Logo & Info */}
      <div className="relative -mt-16 px-5">
        {/* Logo */}
        <div className="flex justify-center">
          <div
            className="relative h-28 w-28 rounded-2xl border-4 border-white card-shadow-xl overflow-hidden bg-white"
          >
            {business.logo ? (
              <Image
                src={business.logo}
                alt={`${business.name} logo`}
                fill
                className="object-cover"
                sizes="112px"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : null}
            {/* Fallback: First letter */}
            <div
              className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white"
              style={{ backgroundColor: business.brandColor }}
            >
              {business.name.charAt(0)}
            </div>
          </div>
        </div>

        {/* Business Name */}
        <div className="mt-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {business.name}
          </h1>
          {business.description && (
            <p className="mt-1.5 text-sm text-gray-500 font-medium">
              {business.description}
            </p>
          )}
        </div>

        {/* Rating & Location badges */}
        <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
          {business.googleRating > 0 && (
            <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3.5 py-1.5 text-sm font-semibold text-amber-700 border border-amber-100">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span>{business.googleRating.toFixed(1)}</span>
            </div>
          )}
          {business.address && (
            <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3.5 py-1.5 text-sm font-medium text-gray-600 border border-gray-200/50">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate max-w-[180px]">
                {business.address.split(',').pop()?.trim() || business.address}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
