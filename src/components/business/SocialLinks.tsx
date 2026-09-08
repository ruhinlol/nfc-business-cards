'use client';

import { Business } from '@/types/business';
import { Instagram, Globe, Facebook } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface SocialLinksProps {
  business: Business;
}

// TikTok icon (not in lucide-react)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.56a8.32 8.32 0 0 0 4.76 1.5v-3.4a4.83 4.83 0 0 1-1-.03z"/>
    </svg>
  );
}

interface SocialLink {
  type: string;
  icon: React.ReactNode;
  label: string;
  handle: string;
  url: string;
  eventType: 'instagram_click' | 'tiktok_click' | 'facebook_click' | 'website_click';
  bgColor: string;
  iconColor: string;
}

export default function SocialLinks({ business }: SocialLinksProps) {
  const links: SocialLink[] = [];

  if (business.instagram) {
    links.push({
      type: 'instagram',
      icon: <Instagram className="h-5 w-5" />,
      label: 'Instagram',
      handle: `@${business.instagram}`,
      url: `https://instagram.com/${business.instagram}`,
      eventType: 'instagram_click',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
      iconColor: 'text-pink-600',
    });
  }

  if (business.tiktok) {
    links.push({
      type: 'tiktok',
      icon: <TikTokIcon className="h-5 w-5" />,
      label: 'TikTok',
      handle: `@${business.tiktok}`,
      url: `https://tiktok.com/@${business.tiktok}`,
      eventType: 'tiktok_click',
      bgColor: 'bg-gray-50',
      iconColor: 'text-gray-900',
    });
  }

  if (business.facebook) {
    links.push({
      type: 'facebook',
      icon: <Facebook className="h-5 w-5" />,
      label: 'Facebook',
      handle: business.facebook,
      url: `https://facebook.com/${business.facebook}`,
      eventType: 'facebook_click',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    });
  }

  if (business.website) {
    links.push({
      type: 'website',
      icon: <Globe className="h-5 w-5" />,
      label: 'Vebsayt',
      handle: business.website.replace(/^https?:\/\//, ''),
      url: business.website,
      eventType: 'website_click',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    });
  }

  if (links.length === 0) return null;

  return (
    <section className="px-5 animate-fade-in-up delay-300" style={{ opacity: 0 }}>
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Bizi izləyin
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {links.map((link) => (
          <a
            key={link.type}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent(business.id, link.eventType)}
            className={`${link.bgColor} rounded-xl p-4 flex flex-col items-center gap-2
                       transition-all duration-200 active:scale-[0.97] hover:shadow-md
                       border border-gray-100/50`}
            id={`social-${link.type}`}
          >
            <div className={link.iconColor}>{link.icon}</div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-800">{link.label}</p>
              <p className="text-xs text-gray-500 truncate max-w-full">{link.handle}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
