'use client';

import { Business } from '@/types/business';
import { Instagram } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface SocialLinksProps {
  business: Business;
}

// TikTok SVG icon
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.56a8.32 8.32 0 0 0 4.76 1.5v-3.4a4.83 4.83 0 0 1-1-.03z" />
    </svg>
  );
}

export default function SocialLinks({ business }: SocialLinksProps) {
  const hasInstagram = Boolean(business.instagram || business.instagramUrl);
  const hasTiktok = Boolean(business.tiktok || business.tiktokUrl);

  if (!hasInstagram && !hasTiktok) return null;

  // Instagram target URL (prefer custom redirect URL if provided)
  const instagramHref = business.instagramUrl?.trim() || 
    (business.instagram 
      ? (business.instagram.startsWith('http') 
          ? business.instagram 
          : `https://instagram.com/${business.instagram.replace(/^@/, '')}`) 
      : '#');

  // Instagram displayed clean handle
  const instagramDisplay = business.instagram 
    ? `@${business.instagram.replace(/^@/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/\/$/, '')}`
    : 'Instagram';

  // TikTok target URL (prefer custom redirect URL if provided)
  const tiktokHref = business.tiktokUrl?.trim() || 
    (business.tiktok 
      ? (business.tiktok.startsWith('http') 
          ? business.tiktok 
          : `https://tiktok.com/@${business.tiktok.replace(/^@/, '')}`) 
      : '#');

  // TikTok displayed clean handle
  const tiktokDisplay = business.tiktok 
    ? `@${business.tiktok.replace(/^@/, '').replace(/^https?:\/\/(www\.)?tiktok\.com\/@?/i, '').replace(/\/$/, '')}`
    : 'TikTok';

  return (
    <section className="px-5 animate-fade-in-up delay-300">
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          Bizi İzləyin
        </h3>
        <span className="text-[10px] text-gray-400 font-medium">Sosial Media</span>
      </div>

      <div className={`grid gap-2.5 ${hasInstagram && hasTiktok ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {/* Instagram Link */}
        {hasInstagram && (
          <a
            href={instagramHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent(business.id, 'instagram_click')}
            id="social-instagram"
            className="flex items-center gap-2.5 p-2.5 rounded-2xl border border-pink-100/80 bg-gradient-to-r from-pink-50/70 via-purple-50/50 to-orange-50/40 hover:from-pink-100/80 hover:to-purple-100/60 active:scale-[0.97] transition-all shadow-xs"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <Instagram className="h-5 w-5" />
            </div>
            <div className="min-w-0 text-left">
              <p className="text-xs font-black text-gray-900 leading-tight">Instagram</p>
              <p className="text-[10px] font-semibold text-pink-700 truncate max-w-[120px]">
                {instagramDisplay}
              </p>
            </div>
          </a>
        )}

        {/* TikTok Link */}
        {hasTiktok && (
          <a
            href={tiktokHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent(business.id, 'tiktok_click')}
            id="social-tiktok"
            className="flex items-center gap-2.5 p-2.5 rounded-2xl border border-gray-200 bg-gray-50/90 hover:bg-gray-100 active:scale-[0.97] transition-all shadow-xs"
          >
            <div className="h-9 w-9 rounded-xl bg-black flex items-center justify-center text-white shrink-0 shadow-xs">
              <TikTokIcon className="h-4 w-4" />
            </div>
            <div className="min-w-0 text-left">
              <p className="text-xs font-black text-gray-900 leading-tight">TikTok</p>
              <p className="text-[10px] font-semibold text-gray-600 truncate max-w-[120px]">
                {tiktokDisplay}
              </p>
            </div>
          </a>
        )}
      </div>
    </section>
  );
}
